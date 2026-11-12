import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function AdminLogin({ adminExists, status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        lastname: '',
        email: adminExists ? 'admin_oculto' : '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    // Mostrar alerta con SweetAlert2 si hay errores de validación
    useEffect(() => {
        const errorMsg = errors.name || errors.lastname || errors.email || errors.password;
        if (errorMsg) {
            Swal.fire({
                icon: 'error',
                title: 'Atención',
                text: errorMsg || 'Por favor verifica los datos.',
                confirmButtonColor: '#0066FF',
                background: '#ffffff',
                customClass: {
                    popup: 'rounded-2xl font-[\'Poppins\']',
                }
            });
        }
    }, [errors]);

    // Mostrar alerta de estado si la hay
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
        
        const endpoint = adminExists ? route('admin.login') : route('admin.register');

        post(endpoint, {
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: adminExists ? '¡Bienvenido Administrador!' : '¡Registrado con éxito!',
                    text: adminExists ? 'Acceso concedido al panel maestro.' : 'Cuenta creada correctamente. Por favor inicia sesión.',
                    timer: 1500,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'rounded-2xl font-[\'Poppins\']',
                    }
                });
            }
        });
    };

    return (
        <>
            <Head title={adminExists ? "Acceso Administrativo - Aula Virtual" : "Registro de Administrador - Aula Virtual"} />

            <div className="min-h-screen bg-[#F0F6FF] text-[#0A2540] flex flex-col justify-between font-['Poppins']">
                
                {/* BARRA DE NAVEGACIÓN SUPERIOR */}
                <header className="w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-blue-100">
                    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#0066FF] to-[#3385FF] flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-500/25 group-hover:scale-105 transition">
                                AD
                            </div>
                            <span className="text-xl font-bold tracking-tight text-[#0A2540]">
                                Panel <span className="text-[#0066FF]">Administrativo</span>
                            </span>
                        </Link>

                        <nav className="flex items-center gap-4">
                            <Link
                                href={route('login')}
                                className="text-sm font-medium text-[#4A607A] hover:text-[#0066FF] transition flex items-center gap-1.5"
                            >
                                <span>← Volver al login de estudiantes</span>
                            </Link>
                        </nav>
                    </div>
                </header>

                {/* CONTENIDO PRINCIPAL */}
                <main className="flex-grow flex items-center justify-center px-6 py-12">
                    <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-blue-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
                        
                        {/* PANEL IZQUIERDO: BANNER INSTITUCIONAL ADMIN */}
                        <div className="hidden lg:flex lg:col-span-5 relative bg-[#051C33] text-white p-10 flex-col justify-between overflow-hidden">
                            <div className="absolute inset-0 z-0 opacity-25 mix-blend-overlay">
                                <img 
                                    src="https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?w=1200&auto=format&fit=crop&q=80" 
                                    alt="Banner Admin Aula Virtual" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#051C33] via-[#0A3266]/90 to-transparent z-0"></div>

                            <div className="relative z-10 space-y-4">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-[#1e88e5]/20 text-[#90caf9] border border-[#1e88e5]/40 text-xs font-semibold tracking-wider uppercase">
                                    {adminExists ? 'Zona Restringida / Control Maestro' : 'Configuración Inicial del Sistema'}
                                </span>
                                <h2 className="text-3xl font-extrabold tracking-tight leading-snug">
                                    {adminExists ? 'Gestión total del ' : 'Configura la cuenta del '}<span className="text-[#3385FF]">{adminExists ? 'Sistema Académico' : 'Administrador General'}</span>
                                </h2>
                                <p className="text-sm text-[#E3F2FD] font-light leading-relaxed">
                                    {adminExists 
                                        ? 'Acceso exclusivo para supervisar usuarios, gestionar asignaturas y controlar la configuración global de la plataforma.' 
                                        : 'Establece por primera vez las credenciales maestras que controlarán la plataforma educativa.'}
                                </p>
                            </div>

                            <div className="relative z-10 pt-8 border-t border-white/10 flex items-center gap-3 text-xs text-[#90caf9]">
                                <svg className="w-5 h-5 text-[#3385FF] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span>Credenciales maestras cifradas y protegidas.</span>
                            </div>
                        </div>

                        {/* PANEL DERECHO: FORMULARIO ADMIN CON ESPACIADO PERFECTO */}
                        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
                            <div className="mb-6">
                                <h1 className="text-2xl sm:text-3xl font-bold text-[#051C33]">
                                    {adminExists ? 'Acceso de Administrador' : 'Registro de Administrador'}
                                </h1>
                                <p className="text-sm text-[#4A607A] mt-2">
                                    {adminExists 
                                        ? 'Introduce tus credenciales maestras para continuar al panel.' 
                                        : 'Ingresa los datos solicitados para dar de alta al administrador.'}
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-4">
                                
                                {/* CAMPOS DE NOMBRE Y APELLIDO (CON ESPACIADO IDÉNTICO AL LOGIN) */}
                                {!adminExists && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-[#0A2540] mb-2">Nombre</label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Ej. Carlos"
                                                className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-blue-200/80 text-[#051C33] text-sm focus:bg-white focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition outline-none"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-[#0A2540] mb-2">Apellido</label>
                                            <input
                                                type="text"
                                                value={data.lastname}
                                                onChange={(e) => setData('lastname', e.target.value)}
                                                placeholder="Ej. Mendoza"
                                                className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-blue-200/80 text-[#051C33] text-sm focus:bg-white focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition outline-none"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* CAMPO IDENTIFICADOR / CORREO */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-[#0A2540] mb-2">
                                        {adminExists ? 'Identificador de Administrador' : 'Correo Electrónico Institucional'}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#4A607A]">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="email"
                                            type="text" 
                                            name="email"
                                            value={adminExists ? 'admin_oculto' : data.email}
                                            disabled={adminExists}
                                            autoComplete="username"
                                            autoFocus={!adminExists}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder={adminExists ? "admin_oculto" : "ejemplo@correo.com"}
                                            className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition ${
                                                adminExists 
                                                    ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed' 
                                                    : 'bg-[#F8FAFC] border-blue-200/80 text-[#051C33] focus:bg-white focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20'
                                            }`}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* CAMPO CONTRASEÑA CON OJITO */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label htmlFor="password" className="block text-sm font-semibold text-[#0A2540]">
                                            Contraseña Maestra
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
                                            className="w-full pl-11 pr-12 py-3 rounded-xl bg-[#F8FAFC] border border-blue-200/80 text-[#051C33] text-sm focus:bg-white focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition outline-none"
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

                                {/* RECORDAR SESIÓN (SOLO SI YA EXISTE) */}
                                {adminExists && (
                                    <div className="flex items-center justify-between pt-1">
                                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                name="remember"
                                                checked={data.remember}
                                                onChange={(e) => setData('remember', e.target.checked)}
                                                className="w-4 h-4 rounded border-blue-300 text-[#0066FF] focus:ring-[#0066FF]/30 transition"
                                            />
                                            <span className="text-sm text-[#4A607A]">Mantener sesión iniciada</span>
                                        </label>
                                    </div>
                                )}

                                {/* BOTÓN ENVIAR */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3.5 px-6 rounded-xl bg-[#0066FF] text-white font-semibold text-sm hover:bg-[#0052CC] focus:ring-4 focus:ring-[#0066FF]/30 transition shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-3"
                                >
                                    <span>{processing ? 'Procesando...' : (adminExists ? 'Acceder al Panel Maestro' : 'Registrar Administrador')}</span>
                                    {!processing && (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </main>

                {/* PIE DE PÁGINA */}
                <footer className="bg-[#051C33] text-[#90caf9] py-6 border-t border-blue-900">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
                        <p>© 2026 Aula Virtual Académica. Todos los derechos reservados.</p>
                        <p className="font-medium text-[#E3F2FD]">Panel de Administración Privado</p>
                    </div>
                </footer>
            </div>
        </>
    );
}