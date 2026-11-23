import { useEffect, useState, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Register({ status }) {
    const [step, setStep] = useState('form');

    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        lastname: '',
        cedula: '',
        phone: '',
        email: '',
        cedula_image: null,
        verification_code: '',
    });

    const lettersOnlyRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+(?: [a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)*$/;
    const gmailRegex = /^[a-z0-9]+([._+-]?[a-z0-9]+)*@gmail\.com$/;

    const sanitizeLetters = (value) => {
        return value
            .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/^\s+/, '')
            .slice(0, 30);
    };

    const sanitizeDigits = (value, maxLength) => {
        return value.replace(/\D/g, '').slice(0, maxLength);
    };

    const showAlertError = (message) => {
        Swal.fire({
            icon: 'error',
            title: 'Atención',
            text: message,
            confirmButtonColor: '#0066FF',
            background: '#ffffff',
            customClass: { popup: 'rounded-2xl font-[\'Poppins\']' }
        });
    };

    useEffect(() => {
        const errorMsg = errors.name || errors.lastname || errors.cedula || errors.phone || errors.email || errors.cedula_image || errors.verification_code;
        if (errorMsg) {
            Swal.fire({
                icon: 'error',
                title: 'Atención',
                text: errorMsg || 'Por favor verifica los datos ingresados.',
                confirmButtonColor: '#0066FF',
                background: '#ffffff',
                customClass: { popup: 'rounded-2xl font-[\'Poppins\']' }
            });
        }
    }, [errors]);

    const handleRegisterSubmit = (e) => {
        e.preventDefault();

        const cleanName = data.name.trim();
        const cleanLastname = data.lastname.trim();
        const cleanCedula = data.cedula.trim();
        const cleanPhone = data.phone.trim();
        const cleanEmail = data.email.trim().toLowerCase();

        if (!cleanName || cleanName.length > 30 || !lettersOnlyRegex.test(cleanName)) {
            showAlertError('Los nombres solo pueden contener letras y espacios (sin números, comas ni caracteres especiales), máximo 30 caracteres.');
            return;
        }

        if (!cleanLastname || cleanLastname.length > 30 || !lettersOnlyRegex.test(cleanLastname)) {
            showAlertError('Los apellidos solo pueden contener letras y espacios (sin números, comas ni caracteres especiales), máximo 30 caracteres.');
            return;
        }

        if (!/^[0-9]{6,8}$/.test(cleanCedula)) {
            showAlertError('La cédula debe contener solo números, entre 6 y 8 dígitos.');
            return;
        }

        if (!/^[0-9]{11}$/.test(cleanPhone)) {
            showAlertError('El teléfono debe contener exactamente 11 dígitos numéricos, sin letras ni caracteres especiales.');
            return;
        }

        if (!cleanEmail || !gmailRegex.test(cleanEmail)) {
            showAlertError('El correo electrónico debe ser válido y terminar en @gmail.com.');
            return;
        }

        if (!data.cedula_image) {
            showAlertError('Debes seleccionar una foto de tu cédula.');
            return;
        }

        post(route('register.send-code'), {
            onSuccess: () => {
                setStep('verify');
                Swal.fire({
                    icon: 'success',
                    title: '¡Código enviado!',
                    text: `Hemos enviado un código de 6 dígitos a ${cleanEmail}. Revisa tu correo.`,
                    confirmButtonColor: '#0066FF',
                    customClass: { popup: 'rounded-2xl font-[\'Poppins\']' }
                });
            }
        });
    };

    const handleCodeChange = (index, value) => {
        if (isNaN(value)) return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        setData('verification_code', newCode.join(''));

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerifySubmit = (e) => {
        e.preventDefault();

        if (code.join('').length < 6) {
            Swal.fire({
                icon: 'warning',
                title: 'Código incompleto',
                text: 'Por favor ingresa los 6 dígitos del código enviado.',
                confirmButtonColor: '#0066FF',
            });
            return;
        }

        post(route('register.verify-code'), {
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: '¡Estudiante registrado con éxito!',
                    text: 'Tu cuenta ha sido creada correctamente y está en espera de confirmación por parte del administrador.',
                    confirmButtonColor: '#0066FF',
                    customClass: { popup: 'rounded-2xl font-[\'Poppins\']' }
                });
            }
        });
    };

    return (
        <>
            <Head title={step === 'form' ? "Registro de Estudiante - Aula Virtual" : "Verificación de Correo - Aula Virtual"} />

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
                            <Link href="/" className="hidden sm:inline text-sm font-medium text-[#4A607A] hover:text-[#0066FF] transition">
                                Volver al inicio
                            </Link>
                            <Link
                                href={route('login')}
                                className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#E3F2FD] text-[#0066FF] text-xs sm:text-sm font-semibold hover:bg-[#0066FF] hover:text-white transition whitespace-nowrap"
                            >
                                Iniciar Sesión
                            </Link>
                        </nav>
                    </div>
                </header>

                {/* CONTENIDO PRINCIPAL */}
                <main className="flex-grow flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
                    <div className="w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-blue-900/5 border border-blue-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
                        
                        {/* BANNER IZQUIERDO */}
                        <div className="hidden lg:flex lg:col-span-5 relative bg-[#051C33] text-white p-10 flex-col justify-between overflow-hidden">
                            <div className="absolute inset-0 z-0 opacity-25 mix-blend-overlay">
                                <img 
                                    src="https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?w=1200&auto=format&fit=crop&q=80" 
                                    alt="Banner Registro" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#051C33] via-[#0A3266]/90 to-transparent z-0"></div>

                            <div className="relative z-10 space-y-4">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-[#1e88e5]/20 text-[#90caf9] border border-[#1e88e5]/40 text-xs font-semibold tracking-wider uppercase">
                                    Registro de Estudiantes
                                </span>
                                <h2 className="text-3xl font-extrabold tracking-tight leading-snug">
                                    Únete a nuestra <span className="text-[#3385FF]">comunidad académica</span>
                                </h2>
                                <p className="text-sm text-[#E3F2FD] font-light leading-relaxed">
                                    Completa tus datos institucionales para solicitar tu acceso al sistema de gestión y control de asignaturas.
                                </p>
                            </div>

                            <div className="relative z-10 pt-8 border-t border-white/10 flex items-center gap-3 text-xs text-[#90caf9]">
                                <svg className="w-5 h-5 text-[#3385FF] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span>Verificación estricta por correo y validación de administrador (`en_espera`).</span>
                            </div>
                        </div>

                        {/* PANEL DERECHO (FORMULARIO / VERIFICACIÓN) */}
                        <div className="lg:col-span-7 p-5 sm:p-12 flex flex-col justify-center min-w-0">
                            
                            {step === 'form' ? (
                                <>
                                    <div className="mb-6">
                                        <h1 className="text-xl sm:text-3xl font-bold text-[#051C33]">Registro de Estudiante</h1>
                                        <p className="text-xs sm:text-sm text-[#4A607A] mt-1">
                                            Ingresa tus datos personales para solicitar el registro.
                                        </p>
                                    </div>

                                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs sm:text-sm font-semibold text-[#0A2540] mb-1.5">Nombres</label>
                                                <input
                                                    type="text"
                                                    maxLength={30}
                                                    value={data.name}
                                                    onChange={(e) => setData('name', sanitizeLetters(e.target.value))}
                                                    placeholder="Ej. Juan Carlos"
                                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-blue-200/80 text-[#051C33] text-xs sm:text-sm focus:bg-white focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition outline-none"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs sm:text-sm font-semibold text-[#0A2540] mb-1.5">Apellidos</label>
                                                <input
                                                    type="text"
                                                    maxLength={30}
                                                    value={data.lastname}
                                                    onChange={(e) => setData('lastname', sanitizeLetters(e.target.value))}
                                                    placeholder="Ej. Pérez Gómez"
                                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-blue-200/80 text-[#051C33] text-xs sm:text-sm focus:bg-white focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition outline-none"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs sm:text-sm font-semibold text-[#0A2540] mb-1.5">Cédula de Identidad</label>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={8}
                                                    value={data.cedula}
                                                    onChange={(e) => setData('cedula', sanitizeDigits(e.target.value, 8))}
                                                    placeholder="Ej. 28123456 (6 a 8 dígitos)"
                                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-blue-200/80 text-[#051C33] text-xs sm:text-sm focus:bg-white focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition outline-none"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs sm:text-sm font-semibold text-[#0A2540] mb-1.5">Teléfono</label>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={11}
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', sanitizeDigits(e.target.value, 11))}
                                                    placeholder="Ej. 04121234567 (11 dígitos)"
                                                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-blue-200/80 text-[#051C33] text-xs sm:text-sm focus:bg-white focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition outline-none"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs sm:text-sm font-semibold text-[#0A2540] mb-1.5">Correo Electrónico</label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value.toLowerCase())}
                                                placeholder="ejemplo@gmail.com"
                                                autoComplete="email"
                                                className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-blue-200/80 text-[#051C33] text-xs sm:text-sm focus:bg-white focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition outline-none"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs sm:text-sm font-semibold text-[#0A2540] mb-1.5">Foto de la Cédula</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setData('cedula_image', e.target.files[0])}
                                                className="w-full text-xs sm:text-sm text-[#4A607A] file:mr-3 sm:file:mr-4 file:py-2 file:px-3.5 sm:file:py-2.5 sm:file:px-4 file:rounded-xl file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-[#E3F2FD] file:text-[#0066FF] hover:file:bg-[#0066FF] hover:file:text-white file:transition cursor-pointer"
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full py-3 sm:py-3.5 px-6 rounded-xl bg-[#0066FF] text-white font-semibold text-xs sm:text-sm hover:bg-[#0052CC] focus:ring-4 focus:ring-[#0066FF]/30 transition shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-4"
                                        >
                                            <span>{processing ? 'Enviando código...' : 'Continuar y Validar Correo'}</span>
                                        </button>
                                    </form>
                                </>
                            ) : (
                                /* PASO 2: PANTALLA DE LOS 6 RECUADROS DE CÓDIGO */
                                <div className="text-center py-4 sm:py-6 flex flex-col items-center">
                                    
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#E3F2FD] text-[#0066FF] flex items-center justify-center mb-5 sm:mb-6 shadow-md shadow-blue-500/10">
                                        <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>

                                    <h2 className="text-xl sm:text-3xl font-extrabold text-[#051C33] tracking-tight mb-2">
                                        Revisa tu bandeja de entrada
                                    </h2>
                                    <p className="text-xs sm:text-sm text-[#4A607A] max-w-sm mb-6 sm:mb-8 leading-relaxed break-all sm:break-normal">
                                        Introduce el código de 6 dígitos enviado a <span className="font-semibold text-[#051C33]">{data.email}</span> para completar tu registro.
                                    </p>

                                    <form onSubmit={handleVerifySubmit} className="w-full space-y-6 sm:space-y-8">
                                        <div className="flex justify-center gap-1.5 sm:gap-4">
                                            {code.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    ref={(el) => (inputRefs.current[index] = el)}
                                                    type="text"
                                                    maxLength="1"
                                                    value={digit}
                                                    onChange={(e) => handleCodeChange(index, e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                                    className="w-10 h-12 sm:w-14 sm:h-16 text-center text-lg sm:text-2xl font-bold text-[#051C33] bg-[#F8FAFC] border-2 border-blue-200 rounded-xl sm:rounded-2xl focus:bg-white focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/20 outline-none transition shadow-sm"
                                                />
                                            ))}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full max-w-md mx-auto py-3 sm:py-3.5 px-6 rounded-xl bg-[#0066FF] text-white font-semibold text-xs sm:text-sm hover:bg-[#0052CC] focus:ring-4 focus:ring-[#0066FF]/30 transition shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            <span>{processing ? 'Verificando...' : 'Confirmar y Finalizar Registro'}</span>
                                        </button>
                                    </form>

                                    <div className="mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setStep('form')}
                                            className="text-xs font-semibold text-[#4A607A] hover:text-[#0066FF] transition"
                                        >
                                            ← Volver a corregir mis datos
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </main>

                <footer className="bg-[#051C33] text-[#90caf9] py-6 border-t border-blue-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-center sm:text-left">
                        <p>© 2026 Aula Virtual Académica. Todos los derechos reservados.</p>
                        <p className="font-medium text-[#E3F2FD]">Plataforma Educativa Oficial</p>
                    </div>
                </footer>
            </div>
        </>
    );
}