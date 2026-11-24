<?php

use App\Http\Controllers\Auth\AdminAuthenticatedSessionController;
use App\Http\Controllers\Auth\StudentPasswordController;
use App\Http\Controllers\Auth\StudentAuthController;
use App\Http\Controllers\Auth\StudentCourseController;
use App\Http\Controllers\Auth\StudentContentController;
use App\Http\Controllers\Auth\StudentExamController;
use App\Http\Controllers\Auth\StudentGradeController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminStudentController;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\AdminGradeController;
use App\Http\Controllers\Auth\ForgotPasswordCodeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Recuperación de contraseña con código de 6 dígitos
Route::post('/forgot-password/send-code', [ForgotPasswordCodeController::class, 'sendCode'])->name('password.code.send');
Route::post('/forgot-password/reset', [ForgotPasswordCodeController::class, 'resetPassword'])->name('password.code.reset');
Route::post('/forgot-password/verify-code', [ForgotPasswordCodeController::class, 'verifyCode'])->name('password.code.verify');

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Rutas de autenticación para el Administrador
Route::get('/admin/login', [AdminAuthenticatedSessionController::class, 'create'])->name('admin.login');
Route::post('/admin/register', [AdminAuthenticatedSessionController::class, 'storeRegister'])->name('admin.register');
Route::post('/admin/login', [AdminAuthenticatedSessionController::class, 'store'])->name('admin.store');

// Grupo protegido estrictamente para el panel de administración con el guardia 'admin'
Route::middleware(['auth:admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');

    // Rutas de Cursos del Administrador
    Route::get('/admin/courses/create', function () {
        return Inertia::render('Admin/CreateCourse');
    })->name('admin.courses.create');

    // RUTA POST PARA GUARDAR EL CURSO
    Route::post('/admin/courses', [CourseController::class, 'store'])->name('admin.courses.store');

    // ==========================================
    // RUTAS NUEVAS PARA EDITAR CURSOS
    // ==========================================
    Route::get('/admin/courses/edit-list', [CourseController::class, 'editList'])->name('admin.courses.edit.list');
    Route::get('/admin/courses/{id}/edit', [CourseController::class, 'edit'])->name('admin.courses.edit');
    Route::post('/admin/courses/{id}/update', [CourseController::class, 'update'])->name('admin.courses.update');

    Route::get('/admin/courses/manage', [CourseController::class, 'manage'])->name('admin.courses.manage');
    Route::delete('/admin/courses/{id}', [CourseController::class, 'destroy'])->name('admin.courses.destroy');

    Route::get('/admin/students', [AdminStudentController::class, 'index'])->name('admin.students.index');

    // RUTA NUEVA PARA ASIGNAR CURSOS A ESTUDIANTES
    Route::post('/admin/students/{id}/assign-courses', [AdminStudentController::class, 'assignCourses'])->name('admin.students.assign-courses');

    Route::get('/admin/students/pending', [AdminStudentController::class, 'pending'])->name('admin.students.pending');
    Route::post('/admin/students/{id}/approve', [AdminStudentController::class, 'approve'])->name('admin.students.approve');
    Route::delete('/admin/students/{id}/reject', [AdminStudentController::class, 'reject'])->name('admin.students.reject');

    // Calificaciones de estudiantes por curso asignado
    Route::get('/admin/grades', [AdminGradeController::class, 'index'])->name('admin.grades');

    // Ruta de cierre de sesión independiente para el Admin
    Route::post('/admin/logout', [AdminAuthenticatedSessionController::class, 'destroy'])->name('admin.logout');
});

// Rutas para el registro y validación por código de 6 dígitos de estudiantes
Route::post('/register/send-code', [StudentAuthController::class, 'sendCode'])->name('register.send-code');
Route::post('/register/verify-code', [StudentAuthController::class, 'verifyCode'])->name('register.verify-code');

// Rutas de Login y Logout para Estudiantes
Route::get('/login', [StudentAuthController::class, 'create'])->name('login');
Route::post('/login', [StudentAuthController::class, 'store'])->name('student.login');
Route::post('/logout', [StudentAuthController::class, 'destroy'])->name('logout');
Route::post('/student/logout', [StudentAuthController::class, 'destroy'])->name('student.logout');

// Dashboard general de estudiantes y gestión de contenidos (Protegido por el guardia 'web')
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [StudentCourseController::class, 'dashboard'])->name('dashboard');

    // ==========================================
    // RUTAS PARA CURSOS Y MÓDULOS DEL ESTUDIANTE
    // ==========================================
    Route::get('/student/courses/completed', [StudentCourseController::class, 'completedCourses'])->name('student.courses.completed');
    Route::get('/student/courses/{id}', [StudentCourseController::class, 'showCourse'])->name('student.courses.show');

    Route::get('/student/courses/{course}/modules/{module}', [StudentCourseController::class, 'showModule'])->name('student.courses.modules.show');

    // ==========================================
    // NUEVAS RUTAS PARA EXÁMENES Y EVALUACIONES
    // ==========================================
    Route::get('/student/courses/{course}/modules/{module}/exam', [StudentExamController::class, 'showExam'])->name('student.courses.modules.exam');
    Route::post('/student/courses/{course}/modules/{module}/exam/submit', [StudentExamController::class, 'submitExam'])->name('student.exams.submit');

    // ==========================================
    // CALIFICACIONES DEL ESTUDIANTE
    // ==========================================
    Route::get('/student/grades', [StudentGradeController::class, 'index'])->name('student.grades');

    // ==========================================
    // NUEVA RUTA PARA VISUALIZACIÓN SEGURA DE PDFs
    // ==========================================
    Route::get('/student/contents/{content}/view-pdf', [StudentContentController::class, 'viewPdf'])->name('student.contents.view-pdf');
    Route::get('/student/contents/{content}/page/{page}', [StudentContentController::class, 'renderPage'])
        ->whereNumber('page')
        ->name('student.contents.page');

    // Gestión de contraseña del estudiante
    Route::get('/student/password', [StudentPasswordController::class, 'edit'])->name('student.password.edit');
    Route::put('/student/password', [StudentPasswordController::class, 'update'])->name('student.password.update');
});

// Breeze activo al final
require __DIR__ . '/auth.php';