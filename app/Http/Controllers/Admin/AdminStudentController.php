<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class AdminStudentController extends Controller
{
    public function index(): Response
    {
        // Filtramos para traer a los usuarios que no sean el administrador oculto
        $students = User::where('email', '!=', 'admin_oculto')->get();

        return Inertia::render('Admin/Students', [
            'students' => $students,
        ]);
    }
}