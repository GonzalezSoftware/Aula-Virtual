import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function CourseShow({ course }) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Head title={course.title} />

            {/* Barra lateral de navegación idéntica a tu Portal Estudiantil */}
            <aside className="w-64 bg-[#0a192f] text-white flex flex-col justify-between hidden md:flex shrink-0">
                <div>
                    <div className="p-6 flex items-center space-x-3 border-b border-white/10">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
                            E
                        </div>
                        <span className="font-bold text-lg tracking-wide">Portal Estudiante</span>
                    </div>

                    <nav className="p-4 space-y-2">
                        <Link
                            href={route('dashboard')}
                            className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium shadow-lg shadow-blue-600/30 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span>Inicio / Cursos</span>
                        </Link>

                        <Link
                            href={route('student.password.edit')}
                            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                            <span>Cambiar Contraseña</span>
                        </Link>
                    </nav>
                </div>

                <div className="p-4 border-t border-white/10">
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white text-sm transition-all">
                        <span>◀ Ocultar</span>
                    </button>
                </div>
            </aside>

            {/* Contenido Principal */}
            <main className="flex-1 min-w-0 overflow-y-auto">
                {/* Cabecera superior tipo panel */}
                <header className="bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center shadow-sm">
                    <h1 className="text-xl font-bold text-gray-900">Detalles del Curso</h1>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <span className="block text-xs text-gray-400 font-medium">Estudiante Activo</span>
                            <span className="text-sm font-bold text-gray-800">{auth?.user?.name || 'Estudiante'}</span>
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

                <div className="p-8 max-w-5xl mx-auto">
                    {/* Tarjeta de Presentación del Curso */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8 p-8">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            {course.image ? (
                                <img 
                                    src={`/storage/${course.image}`} 
                                    alt={course.title} 
                                    className="w-full md:w-64 h-40 object-cover rounded-xl shadow-inner border border-gray-100"
                                />
                            ) : (
                                <div className="w-full md:w-64 h-40 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
                                    <svg className="w-16 h-16 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                            )}

                            <div className="flex-1">
                                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                                    Asignación Activa
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
                                    {course.title}
                                </h2>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                    {course.description || "Sin descripción detallada para este curso."}
                                </p>
                                {course.start_date && (
                                    <div className="text-xs text-gray-500 font-medium">
                                        📅 Vigencia del curso: <span className="text-gray-700 font-bold">{course.start_date}</span> {course.end_date ? ` al ${course.end_date}` : ''}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Listado de Módulos */}
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <span>Módulos de Estudio Disponibles</span>
                        </h3>

                        {course.modules && course.modules.length > 0 ? (
                            <div className="grid gap-4">
                                {course.modules.map((module, index) => (
                                    <div 
                                        key={module.id} 
                                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-blue-200 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-600/30">
                                                #{index + 1}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-900">{module.title}</h4>
                                                <p className="text-sm text-gray-500 mt-0.5">{module.description || "Material de contenido y evaluaciones interactivas."}</p>
                                            </div>
                                        </div>

                                        <Link 
                                            href={route('student.courses.modules.show', [course.id, module.id])}
                                            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-600/30 transition-all whitespace-nowrap"
                                        >
                                            Ingresar al Módulo
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
                                <p className="text-gray-500 font-medium">No hay módulos registrados en este curso actualmente.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}