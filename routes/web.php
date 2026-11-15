<?php

use App\Http\Controllers\Auth\AdminAuthenticatedSessionController;
use App\Http\Controllers\Auth\StudentAuthController;
use App\Http\Controllers\Admin\AdminStudentController;
use App\Http\Controllers\Admin\CourseController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
    Route::get('/admin/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');

    // Rutas de Cursos del Administrador
    Route::get('/admin/courses/create', function () {
        return Inertia::render('Admin/CreateCourse');
    })->name('admin.courses.create');

    // RUTA POST PARA GUARDAR EL CURSO (CORREGIDO EL 404)
    Route::post('/admin/courses', [CourseController::class, 'store'])->name('admin.courses.store');

    Route::get('/admin/students', [AdminStudentController::class, 'index'])->name('admin.students.index');
    Route::get('/admin/students/pending', [AdminStudentController::class, 'pending'])->name('admin.students.pending');
    Route::post('/admin/students/{id}/approve', [AdminStudentController::class, 'approve'])->name('admin.students.approve');
    Route::delete('/admin/students/{id}/reject', [AdminStudentController::class, 'reject'])->name('admin.students.reject');
    
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

// Dashboard general de estudiantes (Protegido por el guardia 'web')
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        $user = Auth::guard('web')->user();
        if ($user && $user->email === 'admin_oculto') {
            return redirect()->route('admin.dashboard');
        }
        return Inertia::render('Student/Dashboard');
    })->name('dashboard');
});

// Breeze activo al final
require __DIR__.'/auth.php';