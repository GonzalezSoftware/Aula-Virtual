<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class AdminAuthenticatedSessionController extends Controller
{
    // Verifica si el admin ya está registrado en la base de datos
    public function create(): Response
    {
        $adminExists = User::where('email', 'admin_oculto')->exists();

        return Inertia::render('Auth/AdminLogin', [
            'adminExists' => $adminExists,
        ]);
    }

    // Registro inicial completo con Nombre, Apellido, Correo y Contraseña
    public function storeRegister(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'lastname' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        User::create([
            'name' => $request->name . ' ' . $request->lastname,
            'email' => 'admin_oculto', // Identificador fijo y oculto para el sistema
            'password' => Hash::make($request->password),
            'email_verified_at' => now(),
        ]);

        return redirect()->route('admin.login')->with('status', '¡Administrador registrado con éxito! Ya puedes iniciar sesión.');
    }

    // Login del administrador ya registrado usando el guardia 'admin'
    public function store(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        if ($credentials['email'] === 'admin_oculto' && Auth::guard('admin')->attempt(['email' => 'admin_oculto', 'password' => $credentials['password']], $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->route('admin.dashboard');
        }

        return back()->withErrors([
            'email' => 'Las credenciales de administrador son incorrectas.',
        ]);
    }

    // Cierre de sesión independiente para el Administrador
    public function destroy(Request $request): RedirectResponse
    {
        // Cierra estrictamente el guardia admin
        Auth::guard('admin')->logout();

        // NO usamos invalidate() para no botar al estudiante de la otra pestaña.
        // Solo rotamos el token CSRF por seguridad.
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}