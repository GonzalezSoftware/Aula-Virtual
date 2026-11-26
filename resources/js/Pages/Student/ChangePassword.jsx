import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import StudentSidebar from '@/Components/StudentSidebar';

export default function ChangePassword({ auth, status }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

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
                <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeMenu="password" />

                <div className="flex-1 flex flex-col justify-between min-h-screen overflow-x-hidden min-w-0">
                    <header className="w-full bg-white/95 backdrop-blur-md border-b border-blue-100 px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sticky top-0 z-10 shadow-sm">
                        <h2 className="text-base sm:text-lg font-extrabold text-[#051C33] tracking-tight truncate">Seguridad de la Cuenta</h2>
                        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                            <div className="text-right hidden sm:block">
                                <span className="text-xs text-[#4A607A] block">Estudiante Activo</span>
                                <span className="text-sm font-bold text-[#051C33]">{auth?.user?.name || 'Estudiante'}</span>
                            </div>
                            <Link
                                href={route('student.logout')}
                                method="post"
                                as="button"
                                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm font-semibold hover:bg-red-600 hover:text-white transition flex items-center gap-2 shadow-sm whitespace-nowrap"
                            >
                                <span>Cerrar Sesión</span>
                            </Link>
                        </div>
                    </header>

                    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full flex-grow">
                        <div className="mb-6 sm:mb-8">
                            <h1 className="text-xl sm:text-2xl font-extrabold text-[#051C33]">Cambiar Contraseña</h1>
                            <p className="text-xs sm:text-sm text-[#4A607A] mt-1">Asegura tu cuenta actualizando tu clave temporal por una contraseña segura y personal.</p>
                        </div>

                        <div className="bg-white rounded-2xl sm:rounded-3xl border border-blue-100 shadow-xl shadow-blue-900/5 p-5 sm:p-8">
                            <form onSubmit={submit} className="space-y-5 sm:space-y-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4A607A] mb-2">Contraseña Actual (o Temporal)</label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            value={data.current_password}
                                            onChange={(e) => setData('current_password', e.target.value)}
                                            className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 focus:border-[#0066FF] focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm outline-none transition pr-16"
                                            placeholder="••••••••"
                                        />
                                        <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-[#051C33]">
                                            {showCurrentPassword ? 'Ocultar' : 'Ver'}
                                        </button>
                                    </div>
                                    {errors.current_password && <span className="text-xs text-red-600 mt-1.5 block font-medium">{errors.current_password}</span>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4A607A] mb-1">
                                        Nueva Contraseña
                                    </label>
                                    <p className="text-[11px] sm:text-xs text-[#4A607A] leading-relaxed mb-2">
                                        Mínimo 8 caracteres, entre ellos 1 letra mayúscula, 1 letra minúscula, 1 número y 1 carácter especial.
                                    </p>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 focus:border-[#0066FF] focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm outline-none transition pr-16"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-[#051C33]"
                                        >
                                            {showNewPassword ? 'Ocultar' : 'Ver'}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4A607A] mb-2">Confirmar Nueva Contraseña</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 focus:border-[#0066FF] focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm outline-none transition pr-16"
                                            placeholder="••••••••"
                                        />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-[#051C33]">
                                            {showConfirmPassword ? 'Ocultar' : 'Ver'}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={processing || !isFormValid}
                                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0066FF] text-white font-semibold text-xs sm:text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
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