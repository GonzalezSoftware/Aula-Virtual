<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Mail\StudentVerificationMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Http\RedirectResponse;

class StudentAuthController extends Controller
{
    // Muestra la vista del formulario de inicio de sesión para estudiantes
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'status' => session('status'),
        ]);
    }

    // Paso 1: Recibe los datos, valida, sube la foto, genera el código y lo envía al correo
    public function sendCode(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'cedula' => 'required|string|unique:users,cedula',
            'phone' => 'required|string|max:50',
            'email' => 'required|string|email|max:255|unique:users,email',
            'cedula_image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $imagePath = $request->file('cedula_image')->store('cedulas', 'public');
        $code = rand(100000, 999999);

        session([
            'temp_student_data' => [
                'name' => $request->name,
                'lastname' => $request->lastname,
                'cedula' => $request->cedula,
                'phone' => $request->phone,
                'email' => $request->email,
                'cedula_image' => $imagePath,
                'password' => Hash::make(Str::random(16)),
                'verification_code' => (string) $code,
            ]
        ]);

        Mail::to($request->email)->send(new StudentVerificationMail($code));

        return back()->with('status', 'Código de verificación enviado al correo.');
    }

    // Paso 2: Valida el código de 6 dígitos ingresado y crea el usuario en la BD con en_espera = 1
    public function verifyCode(Request $request)
    {
        $request->validate([
            'verification_code' => 'required|string|size:6',
        ]);

        $tempData = session('temp_student_data');

        if (!$tempData || $tempData['verification_code'] !== $request->verification_code) {
            return back()->withErrors(['verification_code' => 'El código de verificación es incorrecto o ha expirado.']);
        }

        User::create([
            'name' => $tempData['name'],
            'lastname' => $tempData['lastname'],
            'cedula' => $tempData['cedula'],
            'phone' => $tempData['phone'],
            'email' => $tempData['email'],
            'cedula_image' => $tempData['cedula_image'],
            'password' => $tempData['password'],
            'en_espera' => 1,
        ]);

        session()->forget('temp_student_data');

        return redirect()->route('login')->with('status', '¡Estudiante registrado con éxito! Tu cuenta está en espera de confirmación por parte del administrador.');
    }

    /// Inicio de sesión para estudiantes
    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        // Si escriben el correo de admin en el login de estudiantes, los mandamos al login del admin
        // Validación oculta para acceder al login del administrador
        if ($credentials['email'] === 'admin_oculto') {
            if ($credentials['password'] !== 'admin_oculto123') {
                return back()->withErrors([
                    'email' => 'Las credenciales proporcionadas son incorrectas.',
                ]);
            }

            return redirect()->route('admin.login');
        }

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return back()->withErrors([
                'email' => 'Las credenciales proporcionadas son incorrectas.',
            ]);
        }

        if ($user->en_espera == 1) {
            return back()->withErrors([
                'email' => 'Tu cuenta aún está en espera de confirmación por parte del administrador.',
            ]);
        }

        // Limpiamos cualquier URL pretendida previa
        $request->session()->forget('url.intended');

        // Autenticamos con el guardia web para los estudiantes
        Auth::guard('web')->login($user, $request->boolean('remember'));

        $request->session()->regenerate();

        return redirect()->route('dashboard');
    }

    // Cierre de sesión independiente para Estudiantes
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
