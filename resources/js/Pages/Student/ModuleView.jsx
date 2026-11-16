import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function ModuleView({ auth, course, module }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <>
            <Head title={`${module.title} - ${course.title}`} />

            <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] font-['Poppins'] flex">

                {/* SIDEBAR */}
                <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#051C33] text-white border-r border-slate-800 transition-all duration-300 flex flex-col justify-between sticky top-0 h-screen z-20 shadow-xl shrink-0`}>
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
                                className="flex items-center gap-3.5 px-4 py-3 rounded-xl bg-[#0066FF] text-white font-medium text-sm transition shadow-md shadow-blue-600/20"
                            >
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                {sidebarOpen && <span>Inicio / Cursos</span>}
                            </Link>

                            <Link
                                href={route('student.password.edit')}
                                className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 font-medium text-sm transition"
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
                        <h2 className="text-lg font-extrabold text-[#051C33] tracking-tight">
                            Contenido del Módulo
                        </h2>

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
                    <main className="max-w-7xl mx-auto px-8 py-10 w-full flex-grow space-y-8">

                        {/* Botón de Retorno */}
                        <div>
                            <Link
                                href={route('student.courses.show', course.id)}
                                className="inline-flex items-center gap-2 text-xs font-bold text-[#0066FF] hover:text-[#0052CC] bg-white px-4 py-2.5 rounded-xl shadow-sm border border-blue-100 transition"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Volver al curso: {course.title}
                            </Link>
                        </div>

                        {/* Cabecera del Módulo */}
                        <div className="bg-white rounded-3xl border border-blue-100 shadow-xl shadow-blue-950/5 p-8">
                            <span className="inline-block px-3.5 py-1 bg-blue-50 text-[#0066FF] text-xs font-bold rounded-full uppercase tracking-wider mb-3">
                                Módulo Académico
                            </span>
                            <h1 className="text-2xl font-extrabold text-[#051C33] mb-2">{module.title}</h1>
                            <p className="text-sm text-[#4A607A] leading-relaxed">
                                {module.description || "Revisa los materiales de lectura y completa las evaluaciones correspondientes a este módulo."}
                            </p>
                        </div>

                        {/* Contenidos del Módulo */}
                        <div className="bg-white rounded-3xl border border-blue-100 shadow-xl shadow-blue-950/5 p-8">
                            <h2 className="text-xl font-extrabold text-[#051C33] mb-6">Materiales y Recursos Académicos</h2>

                            {module.contents && module.contents.length > 0 ? (
                                <div className="space-y-6">
                                    {module.contents.map((content) => {
                                        // Detecta cualquier nombre posible de columna para archivos y videos en la BD
                                        const fileResource = content.file_url || content.file || content.path || content.file_path;
                                        const videoResource = content.video_url || content.url || content.link;

                                        return (
                                            <div key={content.id} className="p-6 rounded-2xl border border-blue-50 bg-[#F8FAFC] space-y-4">
                                                <div>
                                                    <h3 className="font-extrabold text-[#051C33] text-lg">{content.title}</h3>
                                                    <p className="text-sm text-[#4A607A] mt-1 leading-relaxed">{content.body || content.description}</p>
                                                </div>
                                                
                                                {/* Botón para Archivo / PDF */}
                                                {fileResource && (
                                                    <div className="pt-2">
                                                        <a
                                                            href={fileResource.startsWith('http') ? fileResource : `/storage/${fileResource}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-[#0066FF] hover:bg-[#0052CC] px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/20 transition"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            Ver / Descargar Archivo (PDF)
                                                        </a>
                                                    </div>
                                                )}

                                                {/* Botón para Video */}
                                                {videoResource && (
                                                    <div className="pt-2">
                                                        <a
                                                            href={videoResource}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 text-xs font-semibold text-[#051C33] bg-white border border-blue-200 hover:bg-blue-50 px-4 py-2.5 rounded-xl shadow-sm transition"
                                                        >
                                                            <svg className="w-4 h-4 text-[#0066FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Reproducir Video de la Clase
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-[#F8FAFC] rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-sm text-[#4A607A] font-medium">No hay contenidos teóricos cargados en este módulo todavía.</p>
                                </div>
                            )}
                        </div>

                        {/* Exámenes y Evaluaciones */}
                        <div className="bg-white rounded-3xl border border-blue-100 shadow-xl shadow-blue-950/5 p-8">
                            <h2 className="text-xl font-extrabold text-[#051C33] mb-6">Evaluaciones y Pruebas</h2>

                            {module.exams && module.exams.length > 0 ? (
                                <div className="space-y-4">
                                    {module.exams.map((exam) => (
                                        <div key={exam.id} className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div>
                                                <h3 className="font-extrabold text-[#051C33] text-base">{exam.title}</h3>
                                                <p className="text-xs text-[#4A607A] mt-0.5">{exam.description || "Completa esta evaluación para validar tus conocimientos."}</p>
                                            </div>
                                            <button 
                                                onClick={() => alert('Próximamente interfaz interactiva de exámenes')}
                                                className="w-full sm:w-auto px-5 py-2.5 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/20 transition whitespace-nowrap"
                                            >
                                                Presentar Examen
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-[#F8FAFC] rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-sm text-[#4A607A] font-medium">No hay evaluaciones pendientes en este módulo.</p>
                                </div>
                            )}
                        </div>

                    </main>

                    <footer className="h-12 bg-white border-t border-slate-100"></footer>
                </div>
            </div>
        </>
    );
}