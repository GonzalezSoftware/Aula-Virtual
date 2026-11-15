import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function ModuleView({ course, module }) {
    const { auth } = usePage().props;
    const studentName = auth?.user?.name || 'Estudiante';

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Head title={`${module.title} - ${course.title}`} />

            {/* Sidebar lateral idéntico */}
            <aside className="w-64 bg-[#0a192f] text-white flex flex-col justify-between hidden md:flex shrink-0 shadow-lg">
                <div>
                    <div className="p-6 flex items-center space-x-3 border-b border-white/10">
                        <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-extrabold text-white shadow-md shadow-blue-600/40">
                            E
                        </div>
                        <span className="font-bold text-lg tracking-wide text-white">Portal Estudiante</span>
                    </div>

                    <nav className="p-4 space-y-2">
                        <Link
                            href={route('dashboard')}
                            className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/30 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span>Inicio / Cursos</span>
                        </Link>

                        <Link
                            href={route('student.password.edit')}
                            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all font-medium"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                            <span>Cambiar Contraseña</span>
                        </Link>
                    </nav>
                </div>

                <div className="p-4 border-t border-white/10">
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white text-sm transition-all font-medium">
                        <span>◀ Ocultar</span>
                    </button>
                </div>
            </aside>

            {/* Contenido Principal */}
            <main className="flex-1 min-w-0 overflow-y-auto">
                <header className="bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center shadow-sm">
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">Contenido del Módulo</h1>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <span className="block text-xs text-gray-400 font-medium">Estudiante Activo</span>
                            <span className="text-sm font-bold text-gray-800">{studentName}</span>
                        </div>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-sm rounded-xl transition-colors border border-red-100"
                        >
                            Cerrar Sesión
                        </Link>
                    </div>
                </header>

                <div className="p-8 max-w-5xl mx-auto space-y-6">
                    {/* Botón de retorno al curso */}
                    <div>
                        <Link
                            href={route('student.courses.show', course.id)}
                            className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-100 transition-all"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Volver al curso: {course.title}
                        </Link>
                    </div>

                    {/* Cabecera del Módulo */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider mb-3">
                            Módulo de Estudio
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                            {module.title}
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {module.description || "Revisa los materiales de lectura y completa las evaluaciones correspondientes a este módulo."}
                        </p>
                    </div>

                    {/* Sección de Contenidos Teóricos */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-6 flex items-center">
                            <span>Materiales y Contenidos</span>
                        </h3>

                        {module.contents && module.contents.length > 0 ? (
                            <div className="space-y-4">
                                {module.contents.map((content) => (
                                    <div key={content.id} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-blue-200 transition-all">
                                        <h4 className="font-bold text-gray-900 text-base mb-1">{content.title}</h4>
                                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{content.body || content.description}</p>
                                        
                                        {content.file_url && (
                                            <a
                                                href={content.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-50/80 px-4 py-2 rounded-xl border border-blue-100 transition-colors"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Descargar / Ver Recurso Adjunto
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <p className="text-gray-500 font-medium text-sm">No hay contenidos teóricos cargados en este módulo todavía.</p>
                            </div>
                        )}
                    </div>

                    {/* Sección de Exámenes y Evaluaciones */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-6 flex items-center">
                            <span>Evaluaciones y Pruebas</span>
                        </h3>

                        {module.exams && module.exams.length > 0 ? (
                            <div className="space-y-4">
                                {module.exams.map((exam) => (
                                    <div key={exam.id} className="p-5 rounded-2xl border border-amber-100 bg-amber-50/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-base">{exam.title}</h4>
                                            <p className="text-sm text-gray-600 mt-0.5">{exam.description || "Completa esta evaluación para validar los conocimientos adquiridos."}</p>
                                        </div>
                                        <button 
                                            onClick={() => alert('Próximamente interfaz interactiva de exámenes')}
                                            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-600/30 transition-all whitespace-nowrap active:scale-95"
                                        >
                                            Presentar Examen
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <p className="text-gray-500 font-medium text-sm">No hay evaluaciones pendientes en este módulo.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}