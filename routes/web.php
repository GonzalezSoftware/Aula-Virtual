<?php
use App\Http\Controllers\Auth\AdminAuthenticatedSessionController;
use App\Http\Controllers\Admin\AdminStudentController;
use App\Http\Controllers\ProfileController;
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

Route::get('/admin/login', [AdminAuthenticatedSessionController::class, 'create'])->name('admin.login');
Route::post('/admin/register', [AdminAuthenticatedSessionController::class, 'storeRegister'])->name('admin.register');
Route::post('/admin/login', [AdminAuthenticatedSessionController::class, 'store'])->name('admin.store');
Route::get('/admin/students', [AdminStudentController::class, 'index'])->name('admin.students.index');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth'])->group(function () {
    Route::get('/admin/dashboard', function () {
        // Aseguramos que solo el admin oculto pueda entrar aquí por seguridad
        if (Auth::user()->email !== 'admin_oculto') {
            abort(403, 'Acceso no autorizado.');
        }
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');
});

require __DIR__.'/auth.php';
