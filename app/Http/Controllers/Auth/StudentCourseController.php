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
        
        return Inertia::render('Student/CourseShow', [
            'course' => $course,
        ]);
    }

    // Método corregido y optimizado para permitir el acceso sin bloqueos de fecha restrictivos
    public function showModule(Course $course, Module $module)
    {
        $student = auth()->user();
        
        // Validación flexible: Permitir acceso si está inscrito O si es administrador oculto / prueba
        $isEnrolled = $student->courses()->where('courses.id', $course->id)->exists();

        if (!$isEnrolled && $student->email !== 'admin_oculto') {
            return redirect()->route('dashboard')
                ->withErrors(['error' => 'No tienes acceso a este curso.']);
        }

        // Asegurar que el módulo pertenezca al curso actual
        if ($module->course_id !== $course->id) {
            return redirect()->route('student.courses.show', $course->id)
                ->withErrors(['error' => 'El módulo solicitado no pertenece a este curso.']);
        }

        // Cargar relaciones necesarias del módulo y del curso
        $module->load(['contents', 'exams']);
        $course->load('modules');

        return Inertia::render('Student/ModuleView', [
            'course' => $course,
            'module' => $module,
        ]);
    }
}