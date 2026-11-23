import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    useEffect(() => {
        if (errors.email || errors.password) {
            Swal.fire({
                icon: 'error',
                title: 'Credenciales Incorrectas',
                text: errors.email || errors.password || 'Por favor verifica tus datos e intenta nuevamente.',
                confirmButtonColor: '#0066FF',
                background: '#ffffff',
                customClass: {
                    popup: 'rounded-2xl font-[\'Poppins\']',
                }
            });
        }
    }, [errors]);

    useEffect(() => {
        if (status) {
            Swal.fire({
                icon: 'success',
                title: 'Aviso',
                text: status,
                confirmButtonColor: '#0066FF',
                customClass: {
                    popup: 'rounded-2xl font-[\'Poppins\']',
                }
            });
        }
    }, [status]);

    const submit = (e) => {
        e.preventDefault();
        
        post(route('login'), {
            onError: () => {},
        });
    };

    return (
        <>
            <Head title="Iniciar Sesión - Estudiantes" />

            <div className="min-h-screen overflow-x-hidden bg-[#F0F6FF] text-[#0A2540] flex flex-col justify-between font-['Poppins']">
                
                {/* BARRA DE NAVEGACIÓN SUPERIOR */}
                <header className="w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-blue-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
                        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#0066FF] to-[#3385FF] flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-md shadow-blue-500/25 group-hover:scale-105 transition shrink-0">
                                AV
                            </div>
                            <span className="text-base sm:text-xl font-bold tracking-tight text-[#0A2540] truncate">
                                Aula Virtual <span className="text-[#0066FF]">Académica</span>
                            </span>
                        </Link>

                        <nav className="flex items-center gap-2 sm:gap-4 shrink-0">
                            <Link
                                href="/"
                                className="hidden sm:inline text-sm font-medium text-[#4A607A] hover:text-[#0066FF] transition"
                            >
                                Volver al inicio
                            </Link>
                            <Link
                                href={route('register')}
                                className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#E3F2FD] text-[#0066FF] text-xs sm:text-sm font-semibold hover:bg-[#0066FF] hover:text-white transition whitespace-nowrap"
                            >
                                Registrarse
                            </Link>
                        </nav>
                    </div>
                </header>

                {/* CONTENIDO PRINCIPAL */}
                <main className="flex-grow flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
                    <div className="w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-blue-900/5 border border-blue-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
                        
                        {/* PANEL IZQUIERDO: BANNER INSTITUCIONAL */}
                        <div className="hidden lg:flex lg:col-span-5 relative bg-[#051C33] text-white p-10 flex-col justify-between overflow-hidden">
                            <div className="absolute inset-0 z-0 opacity-25 mix-blend-overlay">
                                <img 
                                    src="https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?w=1200&auto=format&fit=crop&q=80" 
                                    alt="Banner Cursos Aula Virtual" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#051C33] via-[#0A3266]/90 to-transparent z-0"></div>

                            <div className="relative z-10 space-y-4">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-[#1e88e5]/20 text-[#90caf9] border border-[#1e88e5]/40 text-xs font-semibold tracking-wider uppercase">
                                    Plataforma Educativa Oficial
                                </span>
                                <h2 className="text-3xl font-extrabold tracking-tight leading-snug">
                                    Impulsa tu aprendizaje con <span className="text-[#3385FF]">cursos en línea</span>
                                </h2>
                                <p className="text-sm text-[#E3F2FD] font-light leading-relaxed">
                                    Accede a tu cuenta para gestionar asignaturas, materiales académicos y un seguimiento detallado de tu progreso.
                                </p>
                            </div>

                            <div className="relative z-10 pt-8 border-t border-white/10 flex items-center gap-3 text-xs text-[#90caf9]">
                                <svg className="w-5 h-5 text-[#3385FF] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span>Ambiente seguro y encriptado para la comunidad académica.</span>
                            </div>
                        </div>

                        {/* PANEL DERECHO: FORMULARIO */}
                        <div className="lg:col-span-7 p-5 sm:p-12 flex flex-col justify-center min-w-0">
                            <div className="mb-6 sm:mb-8">
                                <h1 className="text-xl sm:text-3xl font-bold text-[#051C33]">Iniciar Sesión</h1>
                                <p className="text-xs sm:text-sm text-[#4A607A] mt-2">
                                    Introduce tu correo y tu clave temporal de 8 dígitos para acceder.
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-5 sm:space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-[#0A2540] mb-1.5 sm:mb-2">
                                        Correo Electrónico
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#4A607A]">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="email"
                                            type="text" 
                                            name="email"
                                            value={data.email}
                                            autoComplete="username"
                                            autoFocus
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="ejemplo@correo.com"
                                            className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-xl bg-[#F8FAFC] border border-blue-200/80 text-[#051C33] text-xs sm:text-sm focus:bg-white focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                                        <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-[#0A2540]">
                                            Contraseña
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#4A607A]">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={data.password}
                                            autoComplete="current-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-11 pr-12 py-2.5 sm:py-3 rounded-xl bg-[#F8FAFC] border border-blue-200/80 text-[#051C33] text-xs sm:text-sm focus:bg-white focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition outline-none"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#4A607A] hover:text-[#0066FF] transition focus:outline-none"
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3 sm:py-3.5 px-6 rounded-xl bg-[#0066FF] text-white font-semibold text-xs sm:text-sm hover:bg-[#0052CC] focus:ring-4 focus:ring-[#0066FF]/30 transition shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <span>{processing ? 'Ingresando...' : 'Acceder al Aula Virtual'}</span>
                                    {!processing && (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    )}
                                </button>
                            </form>

                            <div className="mt-6 sm:mt-8 pt-6 border-t border-slate-100 text-center space-y-2">
                                <p className="text-xs sm:text-sm text-[#4A607A]">
                                    ¿Aún no tienes una cuenta?{' '}
                                    <Link
                                        href={route('register')}
                                        className="font-semibold text-[#0066FF] hover:text-[#0052CC] transition"
                                    >
                                        Regístrate aquí
                                    </Link>
                                </p>
                                <div className="sm:hidden">
                                    <Link
                                        href="/"
                                        className="text-xs font-medium text-[#4A607A] hover:text-[#0066FF] transition"
                                    >
                                        ← Volver al inicio
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* PIE DE PÁGINA */}
                <footer className="bg-[#051C33] text-[#90caf9] py-6 border-t border-blue-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-center sm:text-left">
                        <p>© 2026 Grupo Académico LEIL. Todos los derechos reservados.</p>
                        <p className="font-medium text-[#E3F2FD]">Plataforma Educativa Oficial</p>
                    </div>
                </footer>
            </div>
        </>
    );
}