import { Link, Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const steps = [
    {
        number: '01',
        badge: 'Paso 01 · Solicitud',
        title: 'Completa tu registro de estudiante',
        description:
            'Ingresa tus nombres, apellidos, cédula de identidad, teléfono de 11 dígitos, correo @gmail.com y adjunta la foto de tu cédula para iniciar tu solicitud.',
        detail: 'Validación estricta de datos y prevención de registros duplicados.',
        icon: 'user-plus',
    },
    {
        number: '02',
        badge: 'Paso 02 · Correo',
        title: 'Verifica el código de 6 dígitos',
        description:
            'Al enviar tus datos, recibirás un código de verificación de 6 dígitos en tu bandeja de entrada para confirmar que el correo electrónico te pertenece.',
        detail: 'Confirmación rápida antes de pasar a revisión administrativa.',
        icon: 'mail-check',
    },
    {
        number: '03',
        badge: 'Paso 03 · Validación',
        title: 'Espera la verificación del administrador',
        description:
            'Tu cuenta queda en estado de espera mientras el equipo administrativo revisa tu información y la foto de tu cédula para aprobar tu acceso.',
        detail: 'Control de seguridad para mantener una comunidad académica verificada.',
        icon: 'shield-check',
    },
    {
        number: '04',
        badge: 'Paso 04 · Acceso',
        title: 'Recibe tu clave temporal de 8 dígitos',
        description:
            'Una vez que el administrador apruebe tu cuenta, te llegará a tu correo una clave temporal de 8 dígitos con la que podrás iniciar sesión en tu panel de estudiante.',
        detail: 'Ingreso directo a tus asignaturas, contenidos y evaluaciones.',
        icon: 'key-round',
    },
    {
        number: '05',
        badge: 'Paso 05 · Seguridad',
        title: 'Personaliza tu contraseña en el panel',
        description:
            'Cuando ya estés dentro de tu panel de estudiante, podrás cambiar esa clave temporal por una contraseña personal y segura cuando lo desees.',
        detail: 'Gestión de seguridad de tu cuenta desde el panel estudiantil.',
        icon: 'lock-reset',
    },
];

const communitySlides = [
    {
        tag: 'Comunidad Activa',
        stat: '+500',
        statLabel: 'estudiantes registrados',
        title: 'Una comunidad académica en crecimiento',
        description:
            'Estudiantes ya forman parte del entorno virtual gestionando asignaturas, materiales y seguimiento de notas desde un solo lugar.',
        items: [
            'Registro con validación de datos y foto de cédula',
            'Código de 6 dígitos al correo y aprobación administrativa',
            'Clave temporal de 8 dígitos y cambio libre desde tu panel',
        ],
    },
    {
        tag: 'Flujo Transparente',
        stat: '5 Pasos',
        statLabel: 'de ingreso guiado',
        title: 'Del registro inicial hasta tu panel personal',
        description:
            'Cada etapa está pensada para que sepas qué sigue: correo de 6 dígitos, revisión del administrador, clave temporal de 8 dígitos y contraseña propia.',
        items: [
            'Solicitud con cédula, teléfono de 11 dígitos y correo @gmail.com',
            'Verificación de identidad antes de habilitar tu cuenta',
            'Control total de tu contraseña una vez dentro del sistema',
        ],
    },
    {
        tag: 'Seguridad y Acceso',
        stat: '8 Dígitos',
        statLabel: 'clave temporal al aprobarse',
        title: 'Acceso seguro y personalizable en todo momento',
        description:
            'Al recibir la aprobación del administrador, entra con tu clave temporal de 8 dígitos y cámbiala cuando quieras desde tu panel de estudiante.',
        items: [
            'Notificación directa al correo registrado tras la aprobación',
            'Inicio de sesión rápido con tu clave temporal inicial',
            'Posibilidad de actualizar tu contraseña dentro del panel',
        ],
    },
];

const faqs = [
    {
        q: '¿Por qué debo esperar tras ingresar el código de 6 dígitos?',
        a: 'Porque cada solicitud pasa por revisión del administrador para validar tus datos y la imagen de tu cédula antes de activar tu acceso al aula.',
    },
    {
        q: '¿Cómo ingreso por primera vez luego de ser aprobado?',
        a: 'Te llegará a tu correo una clave temporal de 8 dígitos. Con ella entras en Iniciar Sesión y accedes a tu panel de estudiante.',
    },
    {
        q: '¿Puedo cambiar la clave temporal después de entrar?',
        a: 'Sí. Dentro de tu panel de estudiante cuentas con la opción para actualizar y cambiar tu contraseña por una de tu preferencia.',
    },
];

function StepIcon({ type }) {
    switch (type) {
        case 'user-plus':
            return (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
            );
        case 'mail-check':
            return (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            );
        case 'shield-check':
            return (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            );
        case 'key-round':
            return (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
            );
        default:
            return (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            );
    }
}

export default () => {
    const [activeStep, setActiveStep] = useState(0);
    const [openFaq, setOpenFaq] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeCommunitySlide, setActiveCommunitySlide] = useState(0);
    const [autoRotateCommunity, setAutoRotateCommunity] = useState(true);

    const currentStep = steps[activeStep];
    const currentSlide = communitySlides[activeCommunitySlide];

    const prevStep = () => {
        setActiveStep((prev) => (prev === 0 ? steps.length - 1 : prev - 1));
    };

    const nextStep = () => {
        setActiveStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
    };

    const prevCommunitySlide = () => {
        setActiveCommunitySlide((prev) => (prev === 0 ? communitySlides.length - 1 : prev - 1));
    };

    const nextCommunitySlide = () => {
        setActiveCommunitySlide((prev) => (prev === communitySlides.length - 1 ? 0 : prev + 1));
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (!autoRotateCommunity) return;
        const interval = setInterval(() => {
            setActiveCommunitySlide((prev) => (prev === communitySlides.length - 1 ? 0 : prev + 1));
        }, 4200);
        return () => clearInterval(interval);
    }, [autoRotateCommunity]);

    return (
        <>
            <Head title="Aula Virtual Académica" />

            <style>{`
                @keyframes orbitSpin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                @keyframes slideReveal {
                    from {
                        opacity: 0.35;
                        transform: translateY(8px) rotate(-0.6deg);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) rotate(0deg);
                    }
                }
                .orbit-ring-slow {
                    animation: orbitSpin 18s linear infinite;
                }
                .community-slide-enter {
                    animation: slideReveal 0.45s ease-out;
                }
            `}</style>

            <div className="min-h-screen overflow-x-hidden bg-[#F0F6FF] text-[#0A2540] flex flex-col justify-between font-['Poppins']">
                {/* 1. BARRA DE NAVEGACIÓN SUPERIOR */}
                <header className="w-full bg-white/95 backdrop-blur-md shadow-sm fixed top-0 z-50 transition-all border-b border-blue-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
                        {/* Logotipo */}
                        <a href="#" className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#0066FF] to-[#3385FF] flex items-center justify-center text-white font-bold text-base sm:text-xl shadow-md shadow-blue-500/25 shrink-0">
                                AV
                            </div>
                            <span className="text-sm sm:text-xl font-bold tracking-tight text-[#0A2540] truncate">
                                Aula Virtual <span className="text-[#0066FF]">Académica</span>
                            </span>
                        </a>

                        {/* Navegación Escritorio (md+) */}
                        <nav className="hidden md:flex items-center gap-4 lg:gap-6 shrink-0">
                            <a
                                href="#como-funciona"
                                className="text-sm font-semibold text-[#4A607A] hover:text-[#0066FF] transition whitespace-nowrap"
                            >
                                Cómo funciona
                            </a>
                            <a
                                href="#video-guia"
                                className="text-sm font-semibold text-[#4A607A] hover:text-[#0066FF] transition whitespace-nowrap"
                            >
                                Vídeo guía
                            </a>
                            <Link
                                href={route('login')}
                                className="px-4 lg:px-5 py-2.5 text-sm lg:text-base text-[#0066FF] font-semibold hover:text-[#0052CC] transition whitespace-nowrap"
                            >
                                Iniciar Sesión
                            </Link>
                            <Link
                                href={route('register')}
                                className="px-5 lg:px-6 py-2.5 text-sm lg:text-base rounded-xl bg-[#0066FF] text-white font-medium hover:bg-[#0052CC] transition shadow-md shadow-blue-600/30 whitespace-nowrap"
                            >
                                Registrarse
                            </Link>
                        </nav>

                        {/* Botón Menú Hamburguesa Móvil (< md) */}
                        <div className="flex md:hidden items-center shrink-0">
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen((prev) => !prev)}
                                aria-expanded={mobileMenuOpen}
                                aria-controls="mobile-nav-menu"
                                aria-label={mobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
                                className="w-10 h-10 rounded-xl bg-[#F0F6FF] border border-blue-100 text-[#051C33] hover:text-[#0066FF] hover:border-[#0066FF]/40 flex items-center justify-center transition"
                            >
                                {mobileMenuOpen ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Panel Desplegable Móvil */}
                    {mobileMenuOpen && (
                        <div
                            id="mobile-nav-menu"
                            className="md:hidden bg-white border-t border-blue-100 shadow-lg px-4 py-4 space-y-2"
                        >
                            <a
                                href="#como-funciona"
                                onClick={closeMobileMenu}
                                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-[#051C33] hover:bg-[#F0F6FF] hover:text-[#0066FF] transition"
                            >
                                <span>Cómo funciona</span>
                                <span className="text-xs text-[#4A607A]">→</span>
                            </a>
                            <a
                                href="#video-guia"
                                onClick={closeMobileMenu}
                                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-[#051C33] hover:bg-[#F0F6FF] hover:text-[#0066FF] transition"
                            >
                                <span>Vídeo guía</span>
                                <span className="text-xs text-[#4A607A]">→</span>
                            </a>

                            <div className="pt-2 border-t border-blue-50 grid grid-cols-2 gap-2.5">
                                <Link
                                    href={route('login')}
                                    onClick={closeMobileMenu}
                                    className="py-2.5 px-3 rounded-xl bg-[#E3F2FD] text-[#0066FF] text-xs font-bold text-center hover:bg-[#0066FF] hover:text-white transition"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href={route('register')}
                                    onClick={closeMobileMenu}
                                    className="py-2.5 px-3 rounded-xl bg-[#0066FF] text-white text-xs font-bold text-center hover:bg-[#0052CC] transition shadow-md shadow-blue-600/20"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        </div>
                    )}
                </header>

                {/* CONTENIDO PRINCIPAL */}
                <main className="flex-grow pt-16 sm:pt-20">
                    {/* 2. SECCIÓN HERO */}
                    <div className="relative bg-[#051C33] text-white overflow-hidden py-14 sm:py-24 lg:py-32">
                        {/* Imagen de fondo local */}
                        <img
                            src="/images/hero-banner.jpg"
                            alt="Banner Cursos Aula Virtual"
                            className="absolute inset-0 z-0 w-full h-full object-cover object-center opacity-40"
                        />

                        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#051C33]/85 via-[#051C33]/50 to-[#0A3266]/25"></div>

                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
                            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
                                <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#1e88e5]/20 text-[#90caf9] border border-[#1e88e5]/40 text-[10px] sm:text-xs font-semibold tracking-wider uppercase">
                                    <span className="w-2 h-2 rounded-full bg-[#3385FF] animate-pulse"></span>
                                    Plataforma Educativa Oficial
                                </span>

                                <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                                    Impulsa tu aprendizaje con <span className="text-[#3385FF]">cursos en línea</span>
                                </h1>

                                <p className="text-xs sm:text-base lg:text-lg text-[#E3F2FD] max-w-2xl font-light leading-relaxed">
                                    Un entorno virtual moderno, seguro y estructurado para cursar asignaturas, revisar materiales académicos, presentar evaluaciones y llevar un control claro de tu avance.
                                </p>

                                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4">
                                    <Link
                                        href={route('register')}
                                        className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-[#0066FF] text-white text-xs sm:text-base font-semibold hover:bg-[#0052CC] transition shadow-lg shadow-blue-500/40 text-center"
                                    >
                                        Comenzar Ahora
                                    </Link>
                                    <a
                                        href="#como-funciona"
                                        className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/20 text-xs sm:text-base font-semibold hover:bg-white/20 transition text-center"
                                    >
                                        Ver Paso a Paso
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. BARRA DE ESTADÍSTICAS DESTACADAS */}
                    <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-10">
                        <div className="bg-white rounded-2xl sm:rounded-3xl border border-blue-100 shadow-xl shadow-blue-900/5 grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-blue-100">
                            <div className="p-4 sm:p-7 text-center sm:text-left">
                                <p className="text-xl sm:text-4xl font-extrabold text-[#0066FF]">+500</p>
                                <p className="text-xs sm:text-sm font-semibold text-[#051C33] mt-1">Estudiantes Registrados</p>
                                <p className="text-[10px] sm:text-[11px] text-[#4A607A] mt-0.5">Comunidad en crecimiento continuo</p>
                            </div>
                            <div className="p-4 sm:p-7 text-center sm:text-left">
                                <p className="text-xl sm:text-4xl font-extrabold text-[#051C33]">100%</p>
                                <p className="text-xs sm:text-sm font-semibold text-[#051C33] mt-1">Acceso Verificado</p>
                                <p className="text-[10px] sm:text-[11px] text-[#4A607A] mt-0.5">Código de correo y revisión admin</p>
                            </div>
                            <div className="p-4 sm:p-7 text-center sm:text-left">
                                <p className="text-xl sm:text-4xl font-extrabold text-[#0066FF]">8 Dígitos</p>
                                <p className="text-xs sm:text-sm font-semibold text-[#051C33] mt-1">Clave Temporal Inicial</p>
                                <p className="text-[10px] sm:text-[11px] text-[#4A607A] mt-0.5">Modificable dentro de tu panel</p>
                            </div>
                            <div className="p-4 sm:p-7 text-center sm:text-left">
                                <p className="text-xl sm:text-4xl font-extrabold text-[#051C33]">24/7</p>
                                <p className="text-xs sm:text-sm font-semibold text-[#051C33] mt-1">Disponibilidad en Línea</p>
                                <p className="text-[10px] sm:text-[11px] text-[#4A607A] mt-0.5">Consulta de cursos y calificaciones</p>
                            </div>
                        </div>
                    </section>

                    {/* 4. CARRUSEL INTERACTIVO PASO A PASO */}
                    <section id="como-funciona" className="scroll-mt-20 py-14 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14 space-y-2.5 sm:space-y-3">
                            <span className="inline-block px-3.5 py-1 rounded-full bg-[#E3F2FD] text-[#0066FF] text-xs font-semibold uppercase tracking-wider">
                                Guía de Ingreso
                            </span>
                            <h2 className="text-xl sm:text-4xl font-extrabold text-[#051C33]">
                                ¿Cómo funciona el acceso a la plataforma?
                            </h2>
                            <p className="text-xs sm:text-sm text-[#4A607A]">
                                Recorre cada etapa del proceso en el carrusel para saber exactamente qué ocurre desde que te registras hasta que personalizas tu contraseña.
                            </p>
                        </div>

                        {/* Selector de pasos arriba del carrusel */}
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-5 sm:mb-6">
                            {steps.map((item, idx) => {
                                const isActive = idx === activeStep;
                                return (
                                    <button
                                        key={item.number}
                                        type="button"
                                        onClick={() => setActiveStep(idx)}
                                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 border ${isActive
                                            ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-md shadow-blue-600/25'
                                            : 'bg-white text-[#0A2540] border-blue-100 hover:border-[#0066FF]/50'
                                            }`}
                                    >
                                        <span>Paso {item.number}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tarjeta principal del carrusel */}
                        <div className="bg-white rounded-2xl sm:rounded-3xl border border-blue-100 shadow-xl shadow-blue-900/5 overflow-hidden">
                            <div className="grid grid-cols-1 lg:grid-cols-12">
                                {/* Panel izquierdo oscuro */}
                                <div className="lg:col-span-5 bg-[#051C33] text-white p-5 sm:p-10 flex flex-col justify-between relative overflow-hidden">
                                    <div className="space-y-3 sm:space-y-4 relative z-10">
                                        <span className="inline-block px-3 py-1 rounded-full bg-[#1e88e5]/20 text-[#90caf9] border border-[#1e88e5]/40 text-[11px] sm:text-xs font-semibold">
                                            {currentStep.badge}
                                        </span>
                                        <div className="flex items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#0066FF] text-white flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
                                                <StepIcon type={currentStep.icon} />
                                            </div>
                                            <span className="text-3xl sm:text-5xl font-extrabold text-white/20 select-none">
                                                {currentStep.number}
                                            </span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-[#E3F2FD] leading-relaxed pt-1 sm:pt-2">
                                            {currentStep.detail}
                                        </p>
                                    </div>

                                    {/* Controles del carrusel */}
                                    <div className="pt-5 sm:pt-8 mt-5 sm:mt-8 border-t border-white/10 flex items-center justify-between gap-2 sm:gap-4 relative z-10">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition flex items-center gap-1 shrink-0"
                                        >
                                            <span>← Ant.</span>
                                        </button>

                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            {steps.map((s, index) => (
                                                <button
                                                    key={s.number}
                                                    type="button"
                                                    aria-label={`Ir al paso ${s.number}`}
                                                    onClick={() => setActiveStep(index)}
                                                    className={`h-2 sm:h-2.5 rounded-full transition-all ${index === activeStep ? 'w-5 sm:w-7 bg-[#3385FF]' : 'w-2 sm:w-2.5 bg-white/30 hover:bg-white/50'
                                                        }`}
                                                />
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs sm:text-sm font-semibold transition flex items-center gap-1 shrink-0"
                                        >
                                            <span>Sig. →</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Panel derecho con detalle del paso */}
                                <div className="lg:col-span-7 p-5 sm:p-12 flex flex-col justify-center space-y-4 sm:space-y-5">
                                    <span className="text-xs font-bold uppercase tracking-wider text-[#0066FF]">
                                        Etapa {activeStep + 1} de {steps.length}
                                    </span>
                                    <h3 className="text-xl sm:text-3xl font-extrabold text-[#051C33] leading-snug">
                                        {currentStep.title}
                                    </h3>
                                    <p className="text-xs sm:text-base text-[#4A607A] leading-relaxed">
                                        {currentStep.description}
                                    </p>

                                    <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
                                        <Link
                                            href={route('register')}
                                            className="px-5 py-3 rounded-xl bg-[#0066FF] text-white text-xs sm:text-sm font-semibold hover:bg-[#0052CC] transition shadow-md shadow-blue-600/20 text-center"
                                        >
                                            Ir al Registro
                                        </Link>
                                        <Link
                                            href={route('login')}
                                            className="px-5 py-3 rounded-xl bg-[#E3F2FD] text-[#0066FF] text-xs sm:text-sm font-semibold hover:bg-[#0066FF] hover:text-white transition text-center"
                                        >
                                            Ya tengo clave temporal
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 5. SECCIÓN DE VÍDEO EXPLICATIVO */}
                    <section id="video-guia" className="scroll-mt-20 py-12 sm:py-20 bg-white border-y border-blue-100">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                                <div className="lg:col-span-5 space-y-3 sm:space-y-4">
                                    <span className="inline-block px-3.5 py-1 rounded-full bg-[#E3F2FD] text-[#0066FF] text-xs font-semibold uppercase tracking-wider">
                                        Recorrido Visual
                                    </span>
                                    <h2 className="text-xl sm:text-3xl font-extrabold text-[#051C33] leading-tight">
                                        Vídeo explicativo del Aula Virtual
                                    </h2>
                                    <p className="text-xs sm:text-sm text-[#4A607A] leading-relaxed">
                                        Aquí podrás ver un recorrido guiado sobre cómo registrarte, validar tu correo, esperar la aprobación del administrador y gestionar tus cursos y contraseñas dentro del panel.
                                    </p>
                                    <div className="bg-[#F0F6FF] border border-blue-100 rounded-2xl p-4 text-xs text-[#0A2540] space-y-1.5">
                                        <p className="font-bold text-[#0066FF]">Guía disponible en línea</p>
                                        <p className="text-[#4A607A]">
                                            Reproduce el vídeo directamente desde aquí para conocer cada paso del acceso estudiantil.
                                        </p>
                                    </div>
                                </div>

                                {/* Contenedor con vídeo de YouTube */}
                                <div className="lg:col-span-7">
                                    <div className="relative rounded-2xl sm:rounded-3xl bg-[#051C33] border-2 border-blue-100 shadow-2xl shadow-blue-900/10 overflow-hidden aspect-video">
                                        <iframe
                                            src="https://www.youtube.com/embed/76wN-o5zIwI?rel=0&modestbranding=1"
                                            title="Vídeo explicativo del Aula Virtual"
                                            className="w-full h-full border-0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            referrerPolicy="strict-origin-when-cross-origin"
                                            allowFullScreen
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 6. MÓDULOS ACADÉMICOS PRINCIPALES */}
                    <section id="cursos" className="scroll-mt-20 py-14 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-2.5 sm:space-y-4">
                            <span className="inline-block px-3.5 py-1 rounded-full bg-[#E3F2FD] text-[#0066FF] text-xs font-semibold uppercase tracking-wider">
                                Herramientas del Sistema
                            </span>
                            <h2 className="text-xl sm:text-3xl font-bold text-[#051C33]">Módulos Académicos Principales</h2>
                            <p className="text-xs sm:text-sm text-[#4A607A]">
                                Herramientas diseñadas bajo altos estándares de usabilidad para profesores y alumnos.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
                            <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-blue-100 hover:shadow-md transition group">
                                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-[#E3F2FD] text-[#0066FF] flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-[#0066FF] group-hover:text-white transition shadow-sm">
                                    <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-base sm:text-xl font-bold text-[#051C33] mb-2 sm:mb-3">Gestión de Cursos</h3>
                                <p className="text-[#4A607A] leading-relaxed text-xs sm:text-sm">
                                    Consulta materiales didácticos, guías de estudio y recursos organizados temáticamente por cada unidad.
                                </p>
                            </div>

                            <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-blue-100 hover:shadow-md transition group">
                                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-[#E3F2FD] text-[#0066FF] flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-[#0066FF] group-hover:text-white transition shadow-sm">
                                    <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-base sm:text-xl font-bold text-[#051C33] mb-2 sm:mb-3">Seguimiento y Notas</h3>
                                <p className="text-[#4A607A] leading-relaxed text-xs sm:text-sm">
                                    Monitorea calificaciones, entregas de asignaciones y reportes de rendimiento académico en tiempo real.
                                </p>
                            </div>

                            <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-blue-100 hover:shadow-md transition group">
                                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-[#E3F2FD] text-[#0066FF] flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-[#0066FF] group-hover:text-white transition shadow-sm">
                                    <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-base sm:text-xl font-bold text-[#051C33] mb-2 sm:mb-3">Roles y Accesos</h3>
                                <p className="text-[#4A607A] leading-relaxed text-xs sm:text-sm">
                                    Interfaces especializadas y seguras para administradores, docentes y alumnos dentro de la plataforma.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 6.5 APARTADO DE CERTIFICACIÓN DE CURSOS */}
                    <section className="pb-14 sm:pb-20 max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="bg-white rounded-3xl border border-blue-100 shadow-xl shadow-blue-900/5 p-6 sm:p-10 lg:p-12">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                                {/* Columna izquierda: texto informativo */}
                                <div className="lg:col-span-6 space-y-4">
                                    <span className="inline-block px-3.5 py-1 rounded-full bg-[#E3F2FD] text-[#0066FF] text-xs font-semibold uppercase tracking-wider">
                                        Acreditación Académica
                                    </span>

                                    <h2 className="text-2xl sm:text-4xl font-extrabold text-[#051C33] leading-tight">
                                        Obtén un <span className="text-[#0066FF]">Certificado</span> al completar tus cursos
                                    </h2>

                                    <p className="text-xs sm:text-sm text-[#4A607A] leading-relaxed">
                                        Nuestros cursos cuentan con certificación que respalda tu dedicación, el avance de tus módulos y las evaluaciones aprobadas dentro del Aula Virtual.
                                    </p>

                                    <p className="text-xs sm:text-sm text-[#4A607A] leading-relaxed">
                                        Contar con constancia de tus estudios es un excelente respaldo para validar tus conocimientos y fortalecer tu perfil académico y profesional.
                                    </p>

                                    <div className="pt-2 flex flex-wrap gap-2.5 text-xs font-semibold text-[#0A2540]">
                                        <span className="px-3.5 py-1.5 rounded-xl bg-[#F0F6FF] border border-blue-100">
                                            ✓ Cursos con certificado
                                        </span>
                                        <span className="px-3.5 py-1.5 rounded-xl bg-[#F0F6FF] border border-blue-100">
                                            ✓ Respaldo de aprobación
                                        </span>
                                    </div>
                                </div>

                                {/* Columna derecha: imagen enmarcada certificado.jpg */}
                                <div className="lg:col-span-6">
                                    <div className="bg-[#F0F6FF] border border-blue-100 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-inner">
                                        <div className="bg-white p-2 sm:p-3 rounded-2xl border-4 border-white shadow-lg overflow-hidden">
                                            <img
                                                src="/images/certificado.jpg"
                                                alt="Certificado de finalización de cursos del Aula Virtual"
                                                className="w-full h-auto max-h-[380px] object-contain mx-auto rounded-xl"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 7. PREGUNTAS FRECUENTES INTERACTIVAS */}
                    <section className="pb-14 sm:pb-24 max-w-4xl mx-auto px-4 sm:px-6">
                        <div className="text-center mb-8 sm:mb-10 space-y-2">
                            <span className="inline-block px-3.5 py-1 rounded-full bg-[#E3F2FD] text-[#0066FF] text-xs font-semibold uppercase tracking-wider">
                                Resolución de Dudas
                            </span>
                            <h2 className="text-xl sm:text-3xl font-bold text-[#051C33]">Preguntas Frecuentes</h2>
                        </div>

                        <div className="space-y-3">
                            {faqs.map((faq, idx) => {
                                const isOpen = openFaq === idx;
                                return (
                                    <div
                                        key={faq.q}
                                        className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                                            className="w-full px-4 sm:px-6 py-3.5 sm:py-4 text-left flex items-center justify-between gap-3 sm:gap-4 hover:bg-[#F8FAFC] transition"
                                        >
                                            <span className="text-xs sm:text-sm font-bold text-[#051C33]">{faq.q}</span>
                                            <span className="w-7 h-7 rounded-lg bg-[#E3F2FD] text-[#0066FF] flex items-center justify-center font-bold text-sm shrink-0">
                                                {isOpen ? '−' : '+'}
                                            </span>
                                        </button>
                                        {isOpen && (
                                            <div className="px-4 sm:px-6 pb-4 sm:pb-5 text-xs sm:text-sm text-[#4A607A] leading-relaxed border-t border-blue-50 pt-3">
                                                {faq.a}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </main>

                {/* 8. PIE DE PÁGINA */}
                <footer className="bg-[#051C33] text-[#90caf9] py-6 sm:py-8 border-t border-blue-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-center sm:text-left">
                        <p>© 2026 Grupo Académico LEIL. Todos los derechos reservados.</p>
                        <p className="font-medium text-[#E3F2FD]">Plataforma Educativa Oficial</p>
                    </div>
                </footer>
            </div>
        </>
    );
};