import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function CourseShow({ course }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50/30 py-10 px-4 sm:px-6 lg:px-8">
            <Head title={course.title} />

            <div className="max-w-5xl mx-auto">
                {/* Botón de Retorno al Dashboard */}
                <div className="mb-6">
                    <Link
                        href={route('dashboard')}
                        className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver a Mis Cursos
                    </Link>
                </div>

                {/* Banner Principal del Curso */}
                <div className="bg-white rounded-3xl shadow-xl shadow-indigo-950/5 border border-gray-100 overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 sm:p-10 text-white">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-wider">
                                Curso Activo
                            </span>
                            {course.start_date && (
                                <span className="text-xs text-indigo-100 font-medium">
                                    📅 Inicio: {course.start_date}
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                            {course.title}
                        </h1>
                        <p className="text-indigo-100 text-base sm:text-lg max-w-3xl leading-relaxed">
                            {course.description || "Bienvenido al contenido programático de este curso. Desarrolla las actividades y módulos a tu propio ritmo."}
                        </p>
                    </div>

                    {/* Estadísticas rápidas o resumen */}
                    <div className="px-8 py-4 bg-gray-50/80 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span className="font-semibold text-gray-900">
                                {course.modules ? course.modules.length : 0} Módulos de estudio
                            </span>
                        </div>
                    </div>
                </div>

                {/* Sección de Módulos */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                            Contenido y Módulos
                        </h2>
                    </div>

                    {course.modules && course.modules.length > 0 ? (
                        <div className="grid gap-4">
                            {course.modules.map((module, index) => (
                                <div 
                                    key={module.id} 
                                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            0{index + 1}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                {module.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                {module.description || "Contenido disponible para estudio y evaluación."}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Botón de acceso directo al módulo corregido */}
                                    <Link 
                                        href={route('student.courses.modules.show', [course.id, module.id])}
                                        className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-indigo-600/30 transition-all transform active:scale-95 whitespace-nowrap"
                                    >
                                        Acceder al Módulo
                                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                            <p className="text-gray-500 font-medium">Aún no hay módulos publicados para este curso.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}