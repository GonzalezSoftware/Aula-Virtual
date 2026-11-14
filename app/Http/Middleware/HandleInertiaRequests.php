<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Auth;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        // Determinamos el usuario correcto según el panel o guardia activo
        $user = null;

        if ($request->is('admin*')) {
            // Si estamos en rutas de admin, priorizamos el guardia admin
            $user = Auth::guard('admin')->user() ?: Auth::guard('web')->user();
        } else {
            // Si estamos en el portal de estudiantes, priorizamos el guardia web
            $user = Auth::guard('web')->user() ?: Auth::guard('admin')->user();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
        ];
    }
}