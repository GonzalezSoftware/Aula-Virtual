<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Module;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentCourseController extends Controller
{
    private function isCourseExpiredForStudent($course, Carbon $today): bool
    {
        $pivotStatus = $course->pivot?->status;
        if ($pivotStatus === 'completed') {
            return true;
        }

        $effectiveEndDate = $course->pivot?->enrolled_end_date ?? $course->end_date;
        if ($effectiveEndDate && $today->gt(Carbon::parse($effectiveEndDate)->endOfDay())) {
            return true;
        }

        return false;
    }

    private function markEnrollmentCompletedIfExpired($student, $course, Carbon $today): void
    {
        if (!$course->pivot || $course->pivot->status === 'completed') {
            return;
        }

        $effectiveEndDate = $course->pivot->enrolled_end_date ?? $course->end_date;
        if ($effectiveEndDate && $today->gt(Carbon::parse($effectiveEndDate)->endOfDay())) {
            $student->courses()->updateExistingPivot($course->id, [
                'status' => 'completed',
                'completed_at' => $course->pivot->completed_at ?? Carbon::now(),
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

        $today = Carbon::today();
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

        $today = Carbon::today();
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

        $today = Carbon::today();
        $this->markEnrollmentCompletedIfExpired($student, $course, $today);

        $effectiveStartDate = $course->pivot?->enrolled_start_date ?? $course->start_date;
        $effectiveEndDate = $course->pivot?->enrolled_end_date ?? $course->end_date;

        if ($effectiveStartDate && $today->lt(Carbon::parse($effectiveStartDate)->startOfDay())) {
            $formattedStart = Carbon::parse($effectiveStartDate)->format('d/m/Y');
            return redirect()->route('dashboard')
                ->with('error', "El curso \"{$course->title}\" aún no ha iniciado. Fecha de inicio: {$formattedStart}.");
        }

        if ($course->pivot?->status === 'completed' || ($effectiveEndDate && $today->gt(Carbon::parse($effectiveEndDate)->endOfDay()))) {
            $formattedEnd = $effectiveEndDate ? Carbon::parse($effectiveEndDate)->format('d/m/Y') : 'finalizado';
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

        $today = Carbon::today();
        if ($enrolledCourse) {
            $this->markEnrollmentCompletedIfExpired($student, $enrolledCourse, $today);
        }

        $effectiveStartDate = $enrolledCourse?->pivot?->enrolled_start_date ?? $course->start_date;
        $effectiveEndDate = $enrolledCourse?->pivot?->enrolled_end_date ?? $course->end_date;

        if ($effectiveStartDate && $today->lt(Carbon::parse($effectiveStartDate)->startOfDay())) {
            $formattedStart = Carbon::parse($effectiveStartDate)->format('d/m/Y');
            return redirect()->route('dashboard')
                ->with('error', "El curso \"{$course->title}\" aún no ha iniciado. Fecha de inicio: {$formattedStart}.");
        }

        if (($enrolledCourse?->pivot?->status === 'completed') || ($effectiveEndDate && $today->gt(Carbon::parse($effectiveEndDate)->endOfDay()))) {
            $formattedEnd = $effectiveEndDate ? Carbon::parse($effectiveEndDate)->format('d/m/Y') : 'finalizado';
            return redirect()->route('student.courses.completed')
                ->with('error', "El curso \"{$course->title}\" ya finalizó ({$formattedEnd}).");
        }

        if ($module->start_date && $today->lt(Carbon::parse($module->start_date)->startOfDay())) {
            $formattedModStart = Carbon::parse($module->start_date)->format('d/m/Y');
            return redirect()->route('student.courses.show', $course->id)
                ->with('error', "El módulo \"{$module->title}\" aún no está disponible. Fecha de inicio: {$formattedModStart}.");
        }

        if ($module->end_date && $today->gt(Carbon::parse($module->end_date)->endOfDay())) {
            $formattedModEnd = Carbon::parse($module->end_date)->format('d/m/Y');
            return redirect()->route('student.courses.show', $course->id)
                ->with('error', "El módulo \"{$module->title}\" ya cerró. Fecha de cierre: {$formattedModEnd}.");
        }

        $module->load(['contents', 'exams.options']);
        $course->load('modules');

        return Inertia::render('Student/ModuleView', [
            'course' => $course,
            'module' => $module,
        ]);
    }
}