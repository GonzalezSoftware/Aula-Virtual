import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function ChangePassword({ auth, status }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Estados para alternar la visibilidad (mostrar/ocultar contraseña)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Validaciones en tiempo real de la nueva contraseña
    const passwordRequirements = {
        minLength: data.password.length >= 8,
        hasLowercase: /[a-z]/.test(data.password),
        hasUppercase: /[A-Z]/.test(data.password),
        hasNumber: /[0-9]/.test(data.password),
        hasSpecial: /[^A-Za-z0-9]/.test(data.password),
    };

    const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);
    const passwordsMatch = data.password === data.password_confirmation && data.password_confirmation !== '';
    const isFormValid = allRequirementsMet && passwordsMatch && data.current_password !== '';

    const submit = (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        put(route('student.password.update'), {
            onSuccess: () => {
                reset();
                Swal.fire({
                    icon: 'success',
                    title: '¡Contraseña Actualizada!',
                    text: 'Tu contraseña ha sido cambiada exitosamente.',
                    confirmButtonColor: '#0066FF',
                    timer: 3000,
                    timerProgressBar: true,
                });
            },
            onError: (errs) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: errs.current_password || 'Hubo un error al actualizar la contraseña. Verifica tus datos.',
                    confirmButtonColor: '#0066FF',
                });
            },
        });
    };

    return (
        <>
            <Head title="Cambiar Contraseña - Portal Estudiante" />

            <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] font-['Poppins'] flex">

                {/* SIDEBAR */}
                <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#051C33] text-white border-r border-slate-800 transition-all duration-300 flex flex-col justify-between z-20 shadow-xl`}>
                    <div>
                        <div className="h-20 px-6 flex items-center gap-3 border-b border-white/10">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0066FF] to-[#3385FF] flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/25 shrink-0">
                                E
                            </div>
                            {sidebarOpen && (
                                <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                                    Portal <span className="text-[#3385FF]">Estudiante</span>
                                </span>
                            )}
                        </div>

                        <nav className="p-4 space-y-2">
                            <Link
                                href={route('dashboard')}
                                className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 font-medium text-sm transition"
                            >
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                {sidebarOpen && <span>Inicio / Cursos</span>}
                            </Link>

                            <Link
                                href={route('student.password.edit')}
                                className="flex items-center gap-3.5 px-4 py-3 rounded-xl bg-[#0066FF] text-white font-medium text-sm transition shadow-md shadow-blue-600/20"
                            >
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                                {sidebarOpen && <span>Cambiar Contraseña</span>}
                            </Link>
                        </nav>
                    </div>

                    <div className="p-4 border-t border-white/10">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold flex items-center justify-center gap-2 transition"
                        >
                            <span>{sidebarOpen ? '◀ Ocultar' : '▶'}</span>
                        </button>
                    </div>
                </aside>

                {/* CONTENEDOR PRINCIPAL */}
                <div className="flex-1 flex flex-col justify-between min-h-screen overflow-x-hidden">

                    {/* BARRA SUPERIOR */}
                    <header className="w-full bg-white/95 backdrop-blur-md border-b border-blue-100 px-8 h-20 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                        <h2 className="text-lg font-extrabold text-[#051C33] tracking-tight">Seguridad de la Cuenta</h2>

                        <div className="flex items-center gap-5">
                            <div className="text-right hidden sm:block">
                                <span className="text-xs text-[#4A607A] block">Estudiante Activo</span>
                                <span className="text-sm font-bold text-[#051C33]">{auth?.user?.name || 'Estudiante'}</span>
                            </div>

                            <Link
                                href={route('student.logout')}
                                method="post"
                                as="button"
                                className="px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-600 hover:text-white transition flex items-center gap-2 shadow-sm"
                            >
                                <span>Cerrar Sesión</span>
                            </Link>
                        </div>
                    </header>

                    {/* CONTENIDO */}
                    <main className="max-w-4xl mx-auto px-8 py-10 w-full flex-grow">
                        <div className="mb-8">
                            <h1 className="text-2xl font-extrabold text-[#051C33]">Cambiar Contraseña</h1>
                            <p className="text-sm text-[#4A607A] mt-1">Asegura tu cuenta actualizando tu clave temporal por una contraseña segura y personal.</p>
                        </div>

                        <div className="bg-white rounded-3xl border border-blue-100 shadow-xl shadow-blue-900/5 p-8">
                            <form onSubmit={submit} className="space-y-6">
                                
                                {/* CONTRASEÑA ACTUAL */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4A607A] mb-2">
                                        Contraseña Actual (o Temporal)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            value={data.current_password}
                                            onChange={(e) => setData('current_password', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0066FF] focus:ring-2 focus:ring-blue-500/20 text-sm outline-none transition pr-12"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#051C33] focus:outline-none"
                                        >
                                            {showCurrentPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.current_password && (
                                        <span className="text-xs text-red-600 mt-1.5 block font-medium">{errors.current_password}</span>
                                    )}
                                </div>

                                {/* NUEVA CONTRASEÑA */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4A607A] mb-2">
                                        Nueva Contraseña
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0066FF] focus:ring-2 focus:ring-blue-500/20 text-sm outline-none transition pr-12"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#051C33] focus:outline-none"
                                        >
                                            {showNewPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            )}
                                        </button>
                                    </div>

                                    {/* LISTA DE REQUISITOS EN TIEMPO REAL */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                                        <div className={`flex items-center gap-2 ${passwordRequirements.minLength ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                                            <span>{passwordRequirements.minLength ? '✓' : '•'}</span> Mínimo 8 caracteres
                                        </div>
                                        <div className={`flex items-center gap-2 ${passwordRequirements.hasUppercase ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                                            <span>{passwordRequirements.hasUppercase ? '✓' : '•'}</span> Una letra mayúscula
                                        </div>
                                        <div className={`flex items-center gap-2 ${passwordRequirements.hasLowercase ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                                            <span>{passwordRequirements.hasLowercase ? '✓' : '•'}</span> Una letra minúscula
                                        </div>
                                        <div className={`flex items-center gap-2 ${passwordRequirements.hasNumber ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                                            <span>{passwordRequirements.hasNumber ? '✓' : '•'}</span> Un número
                                        </div>
                                        <div className={`flex items-center gap-2 sm:col-span-2 ${passwordRequirements.hasSpecial ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                                            <span>{passwordRequirements.hasSpecial ? '✓' : '•'}</span> Un carácter especial (ej. @$!%*?&)
                                        </div>
                                    </div>

                                    {errors.password && (
                                        <span className="text-xs text-red-600 mt-1.5 block font-medium">{errors.password}</span>
                                    )}
                                </div>

                                {/* CONFIRMAR NUEVA CONTRASEÑA */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4A607A] mb-2">
                                        Confirmar Nueva Contraseña
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0066FF] focus:ring-2 focus:ring-blue-500/20 text-sm outline-none transition pr-12"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#051C33] focus:outline-none"
                                        >
                                            {showConfirmPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            )}
                                        </button>
                                    </div>
                                    {data.password_confirmation && !passwordsMatch && (
                                        <span className="text-xs text-red-600 mt-1.5 block font-medium">Las contraseñas no coinciden.</span>
                                    )}
                                    {errors.password_confirmation && (
                                        <span className="text-xs text-red-600 mt-1.5 block font-medium">{errors.password_confirmation}</span>
                                    )}
                                </div>

                                {/* BOTÓN DE GUARDAR (Bloqueado si no se cumple todo) */}
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={processing || !isFormValid}
                                        className="px-6 py-3 rounded-xl bg-[#0066FF] text-white font-semibold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Guardar Nueva Contraseña
                                    </button>
                                </div>
                            </form>
                        </div>
                    </main>

                    <footer className="h-12 bg-white border-t border-slate-100"></footer>
                </div>
            </div>
        </>
    );
}