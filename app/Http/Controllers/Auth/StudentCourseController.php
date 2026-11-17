<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Module;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

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
        
        // Búsqueda segura para verificar que el curso pertenece al estudiante
        $course = $student->courses()
            ->with(['modules.contents', 'modules.exams'])
            ->where('courses.id', $id)
            ->first();

        if (!$course) {
            return redirect()->route('dashboard')
                ->withErrors(['error' => 'No tienes acceso a este curso o no existe.']);
        }
        
        // Validamos fechas del curso
        $today = Carbon::today();

        if ($course->start_date && $today->lt(Carbon::parse($course->start_date)->startOfDay())) {
            return redirect()->route('dashboard')
                ->withErrors(['error' => 'Este curso aún no ha comenzado.']);
        }

        if ($course->end_date && $today->gt(Carbon::parse($course->end_date)->endOfDay())) {
            return redirect()->route('dashboard')
                ->withErrors(['error' => 'Este curso ya ha finalizado.']);
        }

        return Inertia::render('Student/CourseShow', [
            'course' => $course,
        ]);
    }

    // CORREGIDO: Se reciben directamente los modelos Course y Module gracias a Route Model Binding
    public function showModule(Course $course, Module $module)
    {
        $student = auth()->user();
        
        // Validar que el estudiante esté inscrito en el curso
        $isEnrolled = $student->courses()->where('courses.id', $course->id)->exists();

        if (!$isEnrolled) {
            return redirect()->route('dashboard')
                ->withErrors(['error' => 'No tienes acceso a este curso.']);
        }

        // Asegurar que el módulo pertenezca al curso actual
        if ($module->course_id !== $course->id) {
            return redirect()->route('student.courses.show', $course->id)
                ->withErrors(['error' => 'El módulo solicitado no pertenece a este curso.']);
        }

        // Cargar relaciones necesarias del módulo
        $module->load(['contents', 'exams']);

        // Opcional: cargar también los módulos del curso si los necesita la vista o el layout
        $course->load('modules');
        
        // Validar fechas del módulo
        $today = Carbon::today();

        if ($module->start_date && $today->lt(Carbon::parse($module->start_date)->startOfDay())) {
            return redirect()->route('student.courses.show', $course->id)
                ->withErrors(['error' => 'Este módulo aún no está disponible temporalmente.']);
        }

        if ($module->end_date && $today->gt(Carbon::parse($module->end_date)->endOfDay())) {
            return redirect()->route('student.courses.show', $course->id)
                ->withErrors(['error' => 'El periodo de este módulo ya ha finalizado.']);
        }

        return Inertia::render('Student/ModuleView', [
            'course' => $course,
            'module' => $module,
        ]);
    }
}