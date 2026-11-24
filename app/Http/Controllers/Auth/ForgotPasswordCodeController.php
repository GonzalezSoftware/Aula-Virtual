<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class ForgotPasswordCodeController extends Controller
{
    private function cacheKey(string $email): string
    {
        return 'password_reset_code_' . sha1(strtolower(trim($email)));
    }

    public function sendCode(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ], [
            'email.required' => 'Debes ingresar tu correo electrónico.',
            'email.email' => 'Ingresa un correo electrónico válido.',
        ]);

        $email = strtolower(trim($request->email));

        $user = User::where('email', $email)->first();
        if (! $user) {
            return response()->json([
                'message' => 'No se encontró una cuenta registrada con ese correo electrónico.',
            ], 404);
        }

        $code = (string) random_int(100000, 999999);

        Cache::put($this->cacheKey($email), [
            'code' => $code,
            'expires_at' => now()->addMinutes(15)->timestamp,
        ], now()->addMinutes(15));

        Mail::raw(
            "Hola {$user->name},\n\nTu código de 6 dígitos para restablecer tu contraseña en el Aula Virtual Académica es: {$code}\n\nEste código vence en 15 minutos. Si no solicitaste este cambio, ignora este mensaje.",
            function ($message) use ($email) {
                $message->to($email)
                    ->subject('Código de recuperación de contraseña - Aula Virtual Académica');
            }
        );

        return response()->json([
            'message' => 'Hemos enviado un código de 6 dígitos a tu correo electrónico.',
        ]);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'code' => ['required', 'digits:6'],
            'password' => [
                'required',
                'string',
                'size:8',
                'regex:/[a-z]/',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'regex:/[^A-Za-z0-9]/',
            ],
        ], [
            'email.required' => 'El correo electrónico es obligatorio.',
            'code.required' => 'Ingresa el código de 6 dígitos.',
            'code.digits' => 'El código debe tener exactamente 6 dígitos.',
            'password.required' => 'Debes ingresar una nueva contraseña.',
            'password.size' => 'La contraseña debe tener exactamente 8 caracteres.',
            'password.regex' => 'La contraseña debe incluir al menos una minúscula, una mayúscula, un número y un carácter especial.',
        ]);

        $email = strtolower(trim($request->email));
        $cached = Cache::get($this->cacheKey($email));

        if (! $cached || now()->timestamp > ($cached['expires_at'] ?? 0)) {
            return response()->json([
                'message' => 'El código ha expirado o no es válido. Solicita uno nuevo.',
            ], 422);
        }

        if ((string) $cached['code'] !== (string) $request->code) {
            return response()->json([
                'message' => 'El código de 6 dígitos ingresado es incorrecto.',
            ], 422);
        }

        $user = User::where('email', $email)->first();
        if (! $user) {
            return response()->json([
                'message' => 'Usuario no encontrado.',
            ], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        Cache::forget($this->cacheKey($email));

        return response()->json([
            'message' => 'Tu contraseña ha sido actualizada correctamente. Ya puedes iniciar sesión.',
        ]);
    }
}