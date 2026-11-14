import { Link, Head } from '@inertiajs/react';

export default () => {
    return (
        <>
            <Head title="Aula Virtual Académica" />
            
            <div className="min-h-screen bg-[#F0F6FF] text-[#0A2540] flex flex-col justify-between font-['Poppins']">
                
                {/* 1. BARRA DE NAVEGACIÓN SUPERIOR */}
                <header className="w-full bg-white/95 backdrop-blur-md shadow-sm fixed top-0 z-50 transition-all border-b border-blue-100">
                    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                        
                        {/* Logotipo */}
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#0066FF] to-[#3385FF] flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-500/25">
                                AV
                            </div>
                            <span className="text-xl font-bold tracking-tight text-[#0A2540]">
                                Aula Virtual <span className="text-[#0066FF]">Académica</span>
                            </span>
                        </div>

                        {/* Enlaces de Autenticación (Siempre Muestra Login y Registro Públicos) */}
                        <nav className="flex items-center gap-5">
                            <Link
                                href={route('login')}
                                className="px-5 py-2.5 text-[#0066FF] font-semibold hover:text-[#0052CC] transition"
                            >
                                Iniciar Sesión
                            </Link>
                            <Link
                                href={route('register')}
                                className="px-6 py-2.5 rounded-xl bg-[#0066FF] text-white font-medium hover:bg-[#0052CC] transition shadow-md shadow-blue-600/30"
                            >
                                Registrarse
                            </Link>
                        </nav>
                    </div>
                </header>

                {/* 2. SECCIÓN HERO CON IMAGEN DE BANNER */}
                <main className="flex-grow pt-20">
                    <div className="relative bg-[#051C33] text-white overflow-hidden py-28 lg:py-36">
                        
                        <div className="absolute inset-0 z-0 opacity-25 mix-blend-overlay">
                            <img 
                                src="https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?w=1200&auto=format&fit=crop&q=80" 
                                alt="Banner Cursos Aula Virtual" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        
                        <div className="absolute inset-0 bg-gradient-to-r from-[#051C33] via-[#0A3266]/90 to-transparent z-0"></div>

                        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-[#1e88e5]/20 text-[#90caf9] border border-[#1e88e5]/40 text-xs font-semibold tracking-wider uppercase">
                                    Plataforma Educativa Oficial
                                </span>
                                <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                                    Impulsa tu aprendizaje con <span className="text-[#3385FF]">cursos en línea</span>
                                </h1>
                                <p className="text-base lg:text-lg text-[#E3F2FD] max-w-xl font-light leading-relaxed">
                                    Un entorno virtual moderno e intuitivo diseñado para gestionar asignaturas, contenido académico y un seguimiento detallado del rendimiento de los estudiantes.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <Link
                                        href={route('register')}
                                        className="px-8 py-4 rounded-xl bg-[#0066FF] text-white font-semibold hover:bg-[#0052CC] transition shadow-lg shadow-blue-500/40 text-center"
                                    >
                                        Comenzar Ahora
                                    </Link>
                                    <a
                                        href="#cursos"
                                        className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/20 font-semibold hover:bg-white/20 transition text-center"
                                    >
                                        Explorar Módulos
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. SECCIÓN DE INFORMACIÓN Y CURSOS */}
                    <section id="cursos" className="py-24 max-w-7xl mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                            <h2 className="text-3xl font-bold text-[#051C33]">Módulos Académicos Principales</h2>
                            <p className="text-[#4A607A]">
                                Herramientas diseñadas bajo altos estándares de usabilidad para profesores y alumnos.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-100 hover:shadow-md transition group">
                                <div className="w-14 h-14 rounded-xl bg-[#E3F2FD] text-[#0066FF] flex items-center justify-center mb-6 group-hover:bg-[#0066FF] group-hover:text-white transition shadow-sm">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-[#051C33] mb-3">Gestión de Cursos</h3>
                                <p className="text-[#4A607A] leading-relaxed text-sm">
                                    Consulta materiales didácticos, guías de estudio y recursos organizados temáticamente por cada unidad.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-100 hover:shadow-md transition group">
                                <div className="w-14 h-14 rounded-xl bg-[#E3F2FD] text-[#0066FF] flex items-center justify-center mb-6 group-hover:bg-[#0066FF] group-hover:text-white transition shadow-sm">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-[#051C33] mb-3">Seguimiento y Notas</h3>
                                <p className="text-[#4A607A] leading-relaxed text-sm">
                                    Monitorea calificaciones, entregas de asignaciones y reportes de rendimiento académico en tiempo real.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-100 hover:shadow-md transition group">
                                <div className="w-14 h-14 rounded-xl bg-[#E3F2FD] text-[#0066FF] flex items-center justify-center mb-6 group-hover:bg-[#0066FF] group-hover:text-white transition shadow-sm">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-[#051C33] mb-3">Roles y Accesos</h3>
                                <p className="text-[#4A607A] leading-relaxed text-sm">
                                    Interfaces especializadas y seguras para administradores, docentes y alumnos dentro de la plataforma.
                                </p>
                            </div>

                        </div>
                    </section>
                </main>

                {/* 4. PIE DE PÁGINA */}
                <footer className="bg-[#051C33] text-[#90caf9] py-8 border-t border-blue-900">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
                        <p>© 2026 Aula Virtual Académica. Todos los derechos reservados.</p>
                        <p className="font-medium text-[#E3F2FD]">Plataforma Educativa Oficial</p>
                    </div>
                </footer>

            </div>
        </>
    );
};