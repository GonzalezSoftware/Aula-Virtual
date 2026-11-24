<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        $pricePerAssignedCourse = 10;

        // Estudiantes en espera (excluyendo admin_oculto)
        $pendingStudentsCount = User::where('en_espera', 1)
            ->where('email', '!=', 'admin_oculto')
            ->count();

        // Estudiantes aceptados (excluyendo admin_oculto) con sus cursos asignados
        $acceptedStudents = User::with('courses')
            ->where('en_espera', 0)
            ->where('email', '!=', 'admin_oculto')
            ->get();

        $acceptedStudentsCount = $acceptedStudents->count();

        // Estudiantes aceptados que tienen al menos un curso asignado
        $studentsWithCourses = $acceptedStudents->filter(function ($student) {
            return $student->courses && $student->courses->count() > 0;
        });

        // Total de cursos asignados a estudiantes aceptados
        $totalAssignedCourseSlots = $studentsWithCourses->sum(function ($student) {
            return $student->courses->count();
        });

        // Cantidad de dinero: $10 por cada estudiante asignado a curso (de resto $0)
        $totalMoney = $totalAssignedCourseSlots * $pricePerAssignedCourse;

        $courses = Course::withCount('students')->get();
        $coursesCount = $courses->count();

        $courseChartData = $courses->map(function ($course) use ($pricePerAssignedCourse) {
            $studentsCount = (int) ($course->students_count ?? 0);

            return [
                'id' => $course->id,
                'title' => $course->title,
                'students_count' => $studentsCount,
                'revenue' => $studentsCount * $pricePerAssignedCourse,
            ];
        })->values();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'pending_students' => $pendingStudentsCount,
                'accepted_students' => $acceptedStudentsCount,
                'courses_count' => $coursesCount,
                'students_with_courses' => $studentsWithCourses->count(),
                'assigned_course_slots' => $totalAssignedCourseSlots,
                'total_money' => $totalMoney,
            ],
            'courseChartData' => $courseChartData,
        ]);
    }
}