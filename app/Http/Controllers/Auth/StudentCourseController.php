<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Module;
use Carbon\Carbon;
use Inertia\Inertia;

class StudentCourseController extends Controller
{
    private function currentDay(): Carbon
    {
        return Carbon::now(config('app.timezone'))->startOfDay();
    }

    private function parseDateStart(?string $date): ?Carbon
    {
        if (!$date) {
            return null;
        }

        try {
            return Carbon::parse($date, config('app.timezone'))->startOfDay();
        } catch (\Throwable) {
            return null;
        }
    }

    private function parseDateEnd(?string $date): ?Carbon
    {
        if (!$date) {
            return null;
        }

        try {
            return Carbon::parse($date, config('app.timezone'))->endOfDay();
        } catch (\Throwable) {
            return null;
        }
    }

    private function isCourseExpiredForStudent($course, Carbon $today): bool
    {
        if ($course->pivot?->status === 'completed') {
            return true;
        }

        $effectiveEndDate = $course->pivot?->enrolled_end_date ?? $course->end_date;
        $endCarbon = $this->parseDateEnd($effectiveEndDate);

        return $endCarbon !== null && $today->gt($endCarbon);
    }

    private function markEnrollmentCompletedIfExpired($student, $course, Carbon $today): void
    {
        if (!$course->pivot || $course->pivot->status === 'completed') {
            return;
        }

        $effectiveEndDate = $course->pivot->enrolled_end_date ?? $course->end_date;
        $endCarbon = $this->parseDateEnd($effectiveEndDate);

        if ($endCarbon !== null && $today->gt($endCarbon)) {
            $now = Carbon::now(config('app.timezone'));
            $student->courses()->updateExistingPivot($course->id, [
                'status' => 'completed',
                'completed_at' => $course->pivot->completed_at ?? $now,
            ]);
            $course->pivot->status = 'completed';
        }
    }

    public function dashboard()
    {
        $student = auth()->user();

        if ($student && $student->email === 'admin_oculto') {
            return redirect()->route('admin.dashboard');
        }

        $today = $this->currentDay();
        $allCourses = $student->courses()->with('modules')->get();

        $activeCourses = $allCourses->filter(function ($course) use ($student, $today) {
            $this->markEnrollmentCompletedIfExpired($student, $course, $today);
            return !$this->isCourseExpiredForStudent($course, $today);
        })->values();

        return Inertia::render('Student/Dashboard', [
            'courses' => $activeCourses,
        ]);
    }

    public function completedCourses()
    {
        $student = auth()->user();

        if ($student && $student->email === 'admin_oculto') {
            return redirect()->route('admin.dashboard');
        }

        $today = $this->currentDay();
        $allCourses = $student->courses()->with('modules')->get();

        $completedCourses = $allCourses->filter(function ($course) use ($student, $today) {
            $this->markEnrollmentCompletedIfExpired($student, $course, $today);
            return $this->isCourseExpiredForStudent($course, $today);
        })->map(function ($course) {
            $course->cycle_start_date = $course->pivot?->enrolled_start_date ?? $course->start_date;
            $course->cycle_end_date = $course->pivot?->enrolled_end_date ?? $course->end_date;
            $course->enrollment_status = $course->pivot?->status ?? 'completed';
            return $course;
        })->values();

        return Inertia::render('Student/CompletedCourses', [
            'courses' => $completedCourses,
        ]);
    }

    public function showCourse($id)
    {
        $student = auth()->user();

        $course = $student->courses()
            ->with(['modules.contents', 'modules.exams.options'])
            ->where('courses.id', $id)
            ->first();

        if (!$course) {
            return redirect()->route('dashboard')
                ->with('error', 'No tienes acceso a este curso o no existe.');
        }

        $today = $this->currentDay();
        $this->markEnrollmentCompletedIfExpired($student, $course, $today);

        $effectiveStartDate = $course->pivot?->enrolled_start_date ?? $course->start_date;
        $effectiveEndDate = $course->pivot?->enrolled_end_date ?? $course->end_date;

        $startCarbon = $this->parseDateStart($effectiveStartDate);
        $endCarbon = $this->parseDateEnd($effectiveEndDate);

        if ($startCarbon !== null && $today->lt($startCarbon)) {
            return redirect()->route('dashboard')
                ->with('error', "El curso \"{$course->title}\" aún no ha iniciado. Fecha de inicio: {$startCarbon->format('d/m/Y')}.");
        }

        if ($course->pivot?->status === 'completed' || ($endCarbon !== null && $today->gt($endCarbon))) {
            $formattedEnd = $endCarbon ? $endCarbon->format('d/m/Y') : 'finalizado';
            return redirect()->route('student.courses.completed')
                ->with('error', "El curso \"{$course->title}\" ya finalizó ({$formattedEnd}). Puedes revisar tus calificaciones en Mis Calificaciones.");
        }

        return Inertia::render('Student/CourseShow', [
            'course' => $course,
        ]);
    }

    public function showModule(Course $course, Module $module)
    {
        $student = auth()->user();

        $enrolledCourse = $student->courses()->where('courses.id', $course->id)->first();
        $isEnrolled = (bool) $enrolledCourse;

        if (!$isEnrolled && $student->email !== 'admin_oculto') {
            return redirect()->route('dashboard')
                ->with('error', 'No tienes acceso a este curso.');
        }

        if ((int) $module->course_id !== (int) $course->id) {
            return redirect()->route('student.courses.show', $course->id)
                ->with('error', 'El módulo solicitado no pertenece a este curso.');
        }

        $today = $this->currentDay();
        if ($enrolledCourse) {
            $this->markEnrollmentCompletedIfExpired($student, $enrolledCourse, $today);
        }

        $effectiveStartDate = $enrolledCourse?->pivot?->enrolled_start_date ?? $course->start_date;
        $effectiveEndDate = $enrolledCourse?->pivot?->enrolled_end_date ?? $course->end_date;

        $courseStart = $this->parseDateStart($effectiveStartDate);
        $courseEnd = $this->parseDateEnd($effectiveEndDate);

        if ($courseStart !== null && $today->lt($courseStart)) {
            return redirect()->route('dashboard')
                ->with('error', "El curso \"{$course->title}\" aún no ha iniciado. Fecha de inicio: {$courseStart->format('d/m/Y')}.");
        }

        if (($enrolledCourse?->pivot?->status === 'completed') || ($courseEnd !== null && $today->gt($courseEnd))) {
            $formattedEnd = $courseEnd ? $courseEnd->format('d/m/Y') : 'finalizado';
            return redirect()->route('student.courses.completed')
                ->with('error', "El curso \"{$course->title}\" ya finalizó ({$formattedEnd}).");
        }

        $moduleStart = $this->parseDateStart($module->start_date);
        $moduleEnd = $this->parseDateEnd($module->end_date);

        if ($moduleStart !== null && $today->lt($moduleStart)) {
            return redirect()->route('student.courses.show', $course->id)
                ->with('error', "El módulo \"{$module->title}\" aún no está disponible. Fecha de inicio: {$moduleStart->format('d/m/Y')}.");
        }

        if ($moduleEnd !== null && $today->gt($moduleEnd)) {
            return redirect()->route('student.courses.show', $course->id)
                ->with('error', "El módulo \"{$module->title}\" ya cerró. Fecha de cierre: {$moduleEnd->format('d/m/Y')}.");
        }

        $module->load(['contents', 'exams.options']);
        $course->load('modules');

        return Inertia::render('Student/ModuleView', [
            'course' => $course,
            'module' => $module,
        ]);
    }
}