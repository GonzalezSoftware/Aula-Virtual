import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function CourseShow({ course }) {
    const { auth } = usePage().props;
    const studentName = auth?.user?.name || 'Estudiante';

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Head title={course.title} />

            {/* Sidebar lateral idéntico al panel de estudiante */}
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
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">Detalles del Curso</h1>
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
                    {/* Tarjeta de Información Principal del Curso */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                            <div className="space-y-3">
                                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
                                    Curso Académico
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                                    {course.title}
                                </h2>
                                <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
                                    {course.description || "Explora los contenidos, materiales y asignaciones programadas para este curso."}
                                </p>
                                {course.start_date && (
                                    <div className="flex items-center space-x-2 text-xs font-medium text-gray-500 pt-1">
                                        <span>📅 Vigencia:</span>
                                        <span className="font-bold text-gray-800">{course.start_date} {course.end_date ? ` al ${course.end_date}` : ''}</span>
                                    </div>
                                )}
                            </div>

                            {course.image && (
                                <img 
                                    src={`/storage/${course.image}`} 
                                    alt={course.title} 
                                    className="w-full md:w-48 h-32 object-cover rounded-2xl shadow-sm border border-gray-100 shrink-0"
                                />
                            )}
                        </div>
                    </div>

                    {/* Sección de Módulos */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                                Módulos de Estudio Disponibles
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Selecciona un módulo para visualizar sus clases, recursos teóricos y evaluaciones.
                            </p>
                        </div>

                        {course.modules && course.modules.length > 0 ? (
                            <div className="grid gap-4">
                                {course.modules.map((module, index) => (
                                    <div 
                                        key={module.id} 
                                        className="bg-gray-50/60 rounded-2xl p-5 border border-gray-100 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
                                                0{index + 1}
                                            </div>
                                            <div>
                                                <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {module.title}
                                                </h4>
                                                <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                                                    {module.description || "Material de contenido y evaluaciones interactivas."}
                                                </p>
                                            </div>
                                        </div>

                                        <Link 
                                            href={route('student.courses.modules.show', [course.id, module.id])}
                                            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-600/30 transition-all whitespace-nowrap active:scale-95"
                                        >
                                            Ingresar al Módulo
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <p className="text-gray-500 font-medium text-sm">No hay módulos habilitados en este curso por el momento.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}