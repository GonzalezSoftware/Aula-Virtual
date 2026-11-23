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
        $request->merge([
            'name' => trim((string) $request->name),
            'lastname' => trim((string) $request->lastname),
            'cedula' => trim((string) $request->cedula),
            'phone' => trim((string) $request->phone),
            'email' => strtolower(trim((string) $request->email)),
        ]);

        // Solo letras (incluyendo tildes, diéresis y ñ) y espacios simples entre palabras
        $lettersOnlyRegex = '/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+(?: [a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)*$/';

        // Correo válido con formato estándar y dominio exacto gmail.com
        $gmailRegex = '/^[a-z0-9]+([._+-]?[a-z0-9]+)*@gmail\.com$/';

        $validated =$request->validate([
            'name' => ['required', 'string', 'max:30', "regex:{$lettersOnlyRegex}"],
            'lastname' => ['required', 'string', 'max:30', "regex:{$lettersOnlyRegex}"],
            'cedula' => ['required', 'string', 'regex:/^[0-9]{6,8}$/', 'unique:users,cedula'],
            'phone' => ['required', 'string', 'regex:/^[0-9]{11}$/'],
            'email' => [
                'required',
                'string',
                'max:255',
                'email:rfc',
                "regex:{$gmailRegex}",
                'unique:users,email',
            ],
            'cedula_image' => ['required', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
        ], [
            'name.required' => 'El campo nombres es obligatorio.',
            'name.max' => 'Los nombres no pueden tener más de 30 caracteres.',
            'name.regex' => 'Los nombres solo pueden contener letras y espacios (sin números, comas ni caracteres especiales).',

            'lastname.required' => 'El campo apellidos es obligatorio.',
            'lastname.max' => 'Los apellidos no pueden tener más de 30 caracteres.',
            'lastname.regex' => 'Los apellidos solo pueden contener letras y espacios (sin números, comas ni caracteres especiales).',

            'cedula.required' => 'La cédula es obligatoria.',
            'cedula.regex' => 'La cédula debe contener solo números, entre 6 y 8 dígitos.',
            'cedula.unique' => 'Esta cédula ya está registrada en el sistema.',

            'phone.required' => 'El teléfono es obligatorio.',
            'phone.regex' => 'El teléfono debe contener exactamente 11 dígitos numéricos (sin letras ni caracteres especiales).',

            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'Ingresa una dirección de correo electrónico válida.',
            'email.regex' => 'El correo debe ser válido y terminar en @gmail.com.',
            'email.unique' => 'Este correo electrónico ya está registrado en el sistema.',

            'cedula_image.required' => 'Debes subir la foto de la cédula.',
            'cedula_image.image' => 'El archivo de la cédula debe ser una imagen.',
            'cedula_image.mimes' => 'La foto de la cédula debe ser de tipo JPG, JPEG o PNG.',
            'cedula_image.max' => 'La foto de la cédula no debe superar los 2 MB.',
        ]);

        $imagePath = $request->file('cedula_image')->store('cedulas', 'public');$code = rand(100000, 999999);

        session([
            'temp_student_data' => [
                'name' => $validated['name'],
                'lastname' => $validated['lastname'],
                'cedula' => $validated['cedula'],
                'phone' => $validated['phone'],
                'email' => $validated['email'],
                'cedula_image' => $imagePath,
                'password' => Hash::make(Str::random(16)),
                'verification_code' => (string) $code,
            ]
        ]);

        Mail::to($validated['email'])->send(new StudentVerificationMail($code));

        return back()->with('status', 'Código de verificación enviado al correo.');
    }

    // Paso 2: Valida el código de 6 dígitos ingresado y crea el usuario en la BD con en_espera = 1
    public function verifyCode(Request $request)
    {
        $request->validate([
            'verification_code' => 'required|string|size:6',
        ]);

        $tempData = session('temp_student_data');

        if (!$tempData || $tempData['verification_code'] !==$request->verification_code) {
            return back()->withErrors(['verification_code' => 'El código de verificación es incorrecto o ha expirado.']);
        }

        // Doble verificación por si la cédula o correo se registraron mientras se verificaba el código
        if (User::where('cedula', $tempData['cedula'])->exists()) {
            return back()->withErrors(['cedula' => 'Esta cédula ya está registrada en el sistema.']);
        }

        if (User::where('email', $tempData['email'])->exists()) {
            return back()->withErrors(['email' => 'Este correo electrónico ya está registrado en el sistema.']);
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
        $credentials =$request->validate([
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

        $user = User::where('email',$credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'],$user->password)) {
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
        Auth::guard('web')->login($user,$request->boolean('remember'));

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