import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8}$/;

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // 'login' | 'forgot-email' | 'forgot-code'
    const [mode, setMode] = useState('login');
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [sendingCode, setSendingCode] = useState(false);
    const [verifyingCode, setVerifyingCode] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    useEffect(() => {
        if (mode === 'forgot-code') {
            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 80);
        }
    }, [mode]);

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        post(route('student.login'), {
            onFinish: () => reset('password'),
        });
    };

    const handleSendRecoveryCode = async (e) => {
        e.preventDefault();
        const trimmedEmail = recoveryEmail.trim();
        if (!trimmedEmail) {
            Swal.fire({
                icon: 'warning',
                title: 'Correo requerido',
                text: 'Ingresa el correo electrónico asociado a tu cuenta.',
                confirmButtonColor: '#0066FF',
            });
            return;
        }

        setSendingCode(true);
        try {
            const res = await axios.post(route('password.code.send'), { email: trimmedEmail });
            setCode(['', '', '', '', '', '']);
            setMode('forgot-code');
            Swal.fire({
                icon: 'success',
                title: 'Código enviado',
                text: res.data?.message || 'Revisa tu bandeja de entrada para ver el código de 6 dígitos.',
                confirmButtonColor: '#0066FF',
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'No se pudo enviar el código',
                text: err.response?.data?.message || 'Verifica el correo electrónico ingresado.',
                confirmButtonColor: '#0066FF',
            });
        } finally {
            setSendingCode(false);
        }
    };

    const handleCodeChange = (index, value) => {
        const cleaned = value.replace(/[^0-9]/g, '');
        if (!cleaned && value !== '') return;

        const nextCode = [...code];
        nextCode[index] = cleaned.slice(-1);
        setCode(nextCode);

        if (cleaned && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const openNewPasswordSweetAlert = async (fullCode) => {
        const { value: formValues, isConfirmed } = await Swal.fire({
            title: 'Crea tu nueva contraseña',
            html: `
                <div class="text-left space-y-3 pt-1 font-['Poppins']">
                    <p class="text-xs text-[#4A607A] leading-relaxed">
                        Debe tener <strong>exactamente 8 caracteres</strong>, incluyendo al menos <strong>una letra minúscula</strong>, <strong>una mayúscula</strong>, <strong>un número</strong> y <strong>un carácter especial</strong>.
                    </p>
                    <div>
                        <label class="block text-xs font-semibold text-[#051C33] mb-1">Nueva contraseña (8 caracteres)</label>
                        <input
                            id="swal-new-password"
                            type="password"
                            maxlength="8"
                            placeholder="Ej: Abc123!@"
                            class="w-full px-3.5 py-2.5 rounded-xl border border-blue-200 text-sm text-[#051C33] focus:border-[#0066FF] outline-none"
                        />
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-[#051C33] mb-1">Confirmar contraseña</label>
                        <input
                            id="swal-confirm-password"
                            type="password"
                            maxlength="8"
                            placeholder="Repite la contraseña"
                            class="w-full px-3.5 py-2.5 rounded-xl border border-blue-200 text-sm text-[#051C33] focus:border-[#0066FF] outline-none"
                        />
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Guardar contraseña',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#0066FF',
            cancelButtonColor: '#64748B',
            focusConfirm: false,
            preConfirm: () => {
                const newPassword = document.getElementById('swal-new-password')?.value || '';
                const confirmPassword = document.getElementById('swal-confirm-password')?.value || '';

                if (newPassword.length !== 8) {
                    Swal.showValidationMessage('La contraseña debe tener exactamente 8 caracteres.');
                    return false;
                }
                if (!/[a-z]/.test(newPassword)) {
                    Swal.showValidationMessage('Debe incluir al menos una letra minúscula.');
                    return false;
                }
                if (!/[A-Z]/.test(newPassword)) {
                    Swal.showValidationMessage('Debe incluir al menos una letra mayúscula.');
                    return false;
                }
                if (!/[0-9]/.test(newPassword)) {
                    Swal.showValidationMessage('Debe incluir al menos un número.');
                    return false;
                }
                if (!/[^A-Za-z0-9]/.test(newPassword)) {
                    Swal.showValidationMessage('Debe incluir al menos un carácter especial.');
                    return false;
                }
                if (!PASSWORD_REGEX.test(newPassword)) {
                    Swal.showValidationMessage('La contraseña no cumple con todos los requisitos.');
                    return false;
                }
                if (newPassword !== confirmPassword) {
                    Swal.showValidationMessage('Las contraseñas no coinciden.');
                    return false;
                }

                return { newPassword };
            },
        });

        if (!isConfirmed || !formValues?.newPassword) return;

        setVerifyingCode(true);
        try {
            const res = await axios.post(route('password.code.reset'), {
                email: recoveryEmail.trim(),
                code: fullCode,
                password: formValues.newPassword,
            });

            await Swal.fire({
                icon: 'success',
                title: '¡Contraseña actualizada!',
                text: res.data?.message || 'Tu contraseña se cambió correctamente. Ya puedes iniciar sesión.',
                confirmButtonColor: '#0066FF',
            });

            setData('email', recoveryEmail.trim());
            setData('password', '');
            setCode(['', '', '', '', '', '']);
            setMode('login');
        } catch (err) {
            const apiMessage =
                err.response?.data?.message ||
                Object.values(err.response?.data?.errors || {})?.flat()?.[0] ||
                'No se pudo actualizar la contraseña.';

            Swal.fire({
                icon: 'error',
                title: 'Error en la validación',
                text: apiMessage,
                confirmButtonColor: '#0066FF',
            });
        } finally {
            setVerifyingCode(false);
        }
    };

    const handleVerifyCodeSubmit = async (e) => {
        e.preventDefault();
        const fullCode = code.join('');

        if (fullCode.length !== 6) {
            Swal.fire({
                icon: 'warning',
                title: 'Código incompleto',
                text: 'Por favor introduce los 6 dígitos enviados a tu correo.',
                confirmButtonColor: '#0066FF',
            });
            return;
        }

        await openNewPasswordSweetAlert(fullCode);
    };

    return (
        <>
            <Head title="Iniciar Sesión - Aula Virtual Académica" />

            <div className="min-h-screen bg-[#F0F6FF] text-[#0A2540] font-['Poppins'] flex flex-col justify-center items-center p-4 sm:p-6">
                <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl border border-blue-100 shadow-xl shadow-blue-900/5 p-6 sm:p-8">
                    {/* ENCABEZADO */}
                    <div className="text-center mb-6">
                        <Link href="/" className="inline-flex items-center gap-2.5 mb-3">
                            <img
                                src="/images/icono_1.png"
                                alt="Logo Aula Virtual Académica"
                                className="w-10 h-10 rounded-xl object-contain bg-white p-1 shadow-md shadow-blue-500/20"
                            />
                            <span className="text-lg font-extrabold text-[#051C33]">
                                Aula Virtual <span className="text-[#0066FF]">Académica</span>
                            </span>
                        </Link>
                    </div>

                    {status && (
                        <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs sm:text-sm font-medium text-emerald-700">
                            {status}
                        </div>
                    )}

                    {/* MODO 1: INICIO DE SESIÓN NORMAL */}
                    {mode === 'login' && (
                        <>
                            <h1 className="text-xl sm:text-2xl font-extrabold text-[#051C33] text-center mb-1">
                                Iniciar Sesión
                            </h1>
                            <p className="text-xs sm:text-sm text-[#4A607A] text-center mb-6">
                                Ingresa con tu correo y contraseña o clave temporal.
                            </p>

                            <form onSubmit={handleLoginSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-[#051C33] mb-1.5">
                                        Correo electrónico
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="correo@gmail.com"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-blue-200 text-xs sm:text-sm text-[#051C33] focus:bg-white focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/15 outline-none transition"
                                        required
                                    />
                                    {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-xs font-semibold text-[#051C33]">
                                            Contraseña
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setRecoveryEmail(data.email || '');
                                                setMode('forgot-email');
                                            }}
                                            className="text-xs font-semibold text-[#0066FF] hover:underline"
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </button>
                                    </div>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-blue-200 text-xs sm:text-sm text-[#051C33] focus:bg-white focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/15 outline-none transition"
                                        required
                                    />
                                    {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
                                </div>

                                <div className="flex items-center justify-between text-xs text-[#4A607A]">
                                    <label className="inline-flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="rounded border-blue-300 text-[#0066FF] focus:ring-[#0066FF]"
                                        />
                                        <span>Recordar sesión</span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3 px-6 rounded-xl bg-[#0066FF] text-white font-semibold text-xs sm:text-sm hover:bg-[#0052CC] focus:ring-4 focus:ring-[#0066FF]/30 transition shadow-lg shadow-blue-600/25 disabled:opacity-60"
                                >
                                    {processing ? 'Ingresando...' : 'Iniciar Sesión'}
                                </button>
                            </form>

                            <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-[#4A607A]">
                                ¿Aún no tienes cuenta?{' '}
                                <Link href={route('register')} className="font-bold text-[#0066FF] hover:underline">
                                    Regístrate aquí
                                </Link>
                            </div>
                        </>
                    )}

                    {/* MODO 2: SOLICITAR CÓDIGO POR CORREO */}
                    {mode === 'forgot-email' && (
                        <div className="py-2">
                            <h2 className="text-xl sm:text-2xl font-extrabold text-[#051C33] text-center mb-1.5">
                                Recuperar contraseña
                            </h2>
                            <p className="text-xs sm:text-sm text-[#4A607A] text-center mb-6 leading-relaxed">
                                Ingresa tu correo electrónico y te enviaremos un código de 6 dígitos para restablecerla.
                            </p>

                            <form onSubmit={handleSendRecoveryCode} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-[#051C33] mb-1.5">
                                        Correo electrónico registrado
                                    </label>
                                    <input
                                        type="email"
                                        value={recoveryEmail}
                                        onChange={(e) => setRecoveryEmail(e.target.value)}
                                        placeholder="correo@gmail.com"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-blue-200 text-xs sm:text-sm text-[#051C33] focus:bg-white focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/15 outline-none transition"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={sendingCode}
                                    className="w-full py-3 px-6 rounded-xl bg-[#0066FF] text-white font-semibold text-xs sm:text-sm hover:bg-[#0052CC] focus:ring-4 focus:ring-[#0066FF]/30 transition shadow-lg shadow-blue-600/25 disabled:opacity-60"
                                >
                                    {sendingCode ? 'Enviando código...' : 'Enviar código de 6 dígitos'}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <button
                                    type="button"
                                    onClick={() => setMode('login')}
                                    className="text-xs font-semibold text-[#4A607A] hover:text-[#0066FF] transition"
                                >
                                    ← Volver a Iniciar Sesión
                                </button>
                            </div>
                        </div>
                    )}

                    {/* MODO 3: PANTALLA DE LOS 6 RECUADROS DE CÓDIGO */}
                    {mode === 'forgot-code' && (
                        <div className="text-center py-3 sm:py-4 flex flex-col items-center">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#E3F2FD] text-[#0066FF] flex items-center justify-center mb-5 shadow-md shadow-blue-500/10">
                                <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>

                            <h2 className="text-xl sm:text-2xl font-extrabold text-[#051C33] tracking-tight mb-2">
                                Revisa tu bandeja de entrada
                            </h2>
                            <p className="text-xs sm:text-sm text-[#4A607A] max-w-sm mb-6 leading-relaxed break-all sm:break-normal">
                                Introduce el código de 6 dígitos enviado a{' '}
                                <span className="font-semibold text-[#051C33]">{recoveryEmail}</span> para cambiar tu contraseña.
                            </p>

                            <form onSubmit={handleVerifyCodeSubmit} className="w-full space-y-6">
                                <div className="flex justify-center gap-1.5 sm:gap-2.5">
                                    {code.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleCodeChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-2xl font-bold text-[#051C33] bg-[#F8FAFC] border-2 border-blue-200 rounded-xl sm:rounded-2xl focus:bg-white focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/20 outline-none transition shadow-sm"
                                        />
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    disabled={verifyingCode}
                                    className="w-full py-3 sm:py-3.5 px-6 rounded-xl bg-[#0066FF] text-white font-semibold text-xs sm:text-sm hover:bg-[#0052CC] focus:ring-4 focus:ring-[#0066FF]/30 transition shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <span>{verifyingCode ? 'Actualizando...' : 'Validar código y cambiar clave'}</span>
                                </button>
                            </form>

                            <div className="mt-6 flex flex-col items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setMode('forgot-email')}
                                    className="text-xs font-semibold text-[#4A607A] hover:text-[#0066FF] transition"
                                >
                                    ← Cambiar correo o reenviar código
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode('login')}
                                    className="text-xs font-semibold text-[#4A607A] hover:text-[#0066FF] transition"
                                >
                                    Volver a Iniciar Sesión
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}