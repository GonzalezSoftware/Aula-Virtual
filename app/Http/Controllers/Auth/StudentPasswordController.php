<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class StudentPasswordController extends Controller
{
    // Muestra la vista para cambiar la contraseña
    public function edit(): Response
    {
        return Inertia::render('Student/ChangePassword', [
            'status' => session('status'),
        ]);
    }

    // Actualiza la contraseña en la base de datos
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('status', '¡Contraseña actualizada con éxito!');
    }
}