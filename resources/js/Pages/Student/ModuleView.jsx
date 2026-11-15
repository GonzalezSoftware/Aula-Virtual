import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function ModuleView({ course, module }) {
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <Head title={`${module.title} - ${course.title}`} />

            <div className="max-w-4xl mx-auto">
                {/* Botón de retorno */}
                <div className="mb-6">
                    <Link
                        href={route('student.courses.show', course.id)}
                        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver al curso: {course.title}
                    </Link>
                </div>

                {/* Encabezado del Módulo */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6">
                    <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full mb-3 uppercase tracking-wider">
                        Módulo de Estudio
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                        {module.title}
                    </h1>
                    <p className="text-gray-600 leading-relaxed">
                        {module.description || "Explora los materiales y recursos asignados para este módulo."}
                    </p>
                </div>

                {/* Sección de Contenidos (Videos, PDFs, Textos) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Contenidos del Módulo
                    </h2>

                    {module.contents && module.contents.length > 0 ? (
                        <div className="space-y-4">
                            {module.contents.map((content) => (
                                <div key={content.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-all">
                                    <h3 className="font-semibold text-gray-900 mb-1">{content.title}</h3>
                                    <p className="text-sm text-gray-600 mb-3">{content.body || content.description}</p>
                                    
                                    {/* Enlace o recurso adjunto */}
                                    {content.file_url && (
                                        <a
                                            href={content.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                        >
                                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            Ver recurso / archivo
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">No hay contenidos teóricos cargados todavía para este módulo.</p>
                    )}
                </div>

                {/* Sección de Exámenes / Evaluaciones */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2m-6 9l2 2 4-4" />
                        </svg>
                        Evaluaciones y Exámenes
                    </h2>

                    {module.exams && module.exams.length > 0 ? (
                        <div className="space-y-4">
                            {module.exams.map((exam) => (
                                <div key={exam.id} className="p-4 rounded-xl border border-amber-100 bg-amber-50/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                                        <p className="text-sm text-gray-600">{exam.description || "Completa esta evaluación para medir tu progreso."}</p>
                                    </div>
                                    <button 
                                        onClick={() => alert('Próximamente interfaz del examen interactiva')}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors whitespace-nowrap"
                                    >
                                        Presentar Examen
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">No hay evaluaciones pendientes en este módulo.</p>
                    )}
                </div>
            </div>
        </div>
    );
}