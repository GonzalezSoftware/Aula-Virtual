<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            // Si ya está autenticado como administrador
            if ($guard === 'admin' && Auth::guard('admin')->check()) {
                return redirect()->route('admin.dashboard');
            }

            // Si ya está autenticado como estudiante (guardia web)
            if ($guard === 'web' && Auth::guard('web')->check()) {
                return redirect()->route('dashboard');
            }
        }

        // Si hay una sesión activa general pero sin guardia específico declarado
        if (Auth::guard('admin')->check()) {
            return redirect()->route('admin.dashboard');
        }

        if (Auth::guard('web')->check()) {
            // Verificamos que el admin oculto no caiga aquí por error
            if (Auth::guard('web')->user()->email === 'admin_oculto') {
                return redirect()->route('admin.dashboard');
            }
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}