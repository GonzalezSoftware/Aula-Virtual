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
    public function dashboard()
    {
        $student = auth()->user();
        $courses = $student->courses()->get();

        return Inertia::render('Student/Dashboard', [
            'courses' => $courses,
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

        if ($course->start_date && $today->lt(Carbon::parse($course->start_date)->startOfDay())) {
            $formattedStart = Carbon::parse($course->start_date)->format('d/m/Y');
            return redirect()->route('dashboard')
                ->with('error', "El curso \"{$course->title}\" aún no ha iniciado. Fecha de inicio: {$formattedStart}.");
        }

        if ($course->end_date && $today->gt(Carbon::parse($course->end_date)->endOfDay())) {
            $formattedEnd = Carbon::parse($course->end_date)->format('d/m/Y');
            return redirect()->route('dashboard')
                ->with('error', "El curso \"{$course->title}\" ya finalizó. Fecha de cierre: {$formattedEnd}.");
        }

        return Inertia::render('Student/CourseShow', [
            'course' => $course,
        ]);
    }

    public function showModule(Course $course, Module $module)
    {
        $student = auth()->user();

        $isEnrolled = $student->courses()->where('courses.id', $course->id)->exists();

        if (!$isEnrolled && $student->email !== 'admin_oculto') {
            return redirect()->route('dashboard')
                ->with('error', 'No tienes acceso a este curso.');
        }

        if ((int) $module->course_id !== (int) $course->id) {
            return redirect()->route('student.courses.show', $course->id)
                ->with('error', 'El módulo solicitado no pertenece a este curso.');
        }

        $today = Carbon::today();

        // Validar fechas del curso
        if ($course->start_date && $today->lt(Carbon::parse($course->start_date)->startOfDay())) {
            $formattedStart = Carbon::parse($course->start_date)->format('d/m/Y');
            return redirect()->route('dashboard')
                ->with('error', "El curso \"{$course->title}\" aún no ha iniciado. Fecha de inicio: {$formattedStart}.");
        }

        if ($course->end_date && $today->gt(Carbon::parse($course->end_date)->endOfDay())) {
            $formattedEnd = Carbon::parse($course->end_date)->format('d/m/Y');
            return redirect()->route('dashboard')
                ->with('error', "El curso \"{$course->title}\" ya finalizó. Fecha de cierre: {$formattedEnd}.");
        }

        // Validar fechas del módulo
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