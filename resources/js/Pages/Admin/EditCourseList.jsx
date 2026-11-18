import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminSidebar from '@/Components/AdminSidebar';

export default function EditCourseList({ auth, courses }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <>
            <Head title="Seleccionar Curso para Editar - Panel Admin" />
            
            <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] font-['Poppins'] flex">
                <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeMenu="edit-courses" />

                <div className="flex-1 flex flex-col justify-between min-h-screen overflow-x-hidden">
                    
                    {/* HEADER ESTANDARIZADO */}
                    <header className="w-full bg-white/95 backdrop-blur-md border-b border-blue-100 px-8 h-20 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                        <h2 className="text-lg font-extrabold text-[#051C33] tracking-tight">Panel de Administración</h2>
                        <div className="flex items-center gap-5">
                            <div className="text-right hidden sm:block">
                                <span className="text-xs text-[#4A607A] block">Administrador Maestro</span>
                                <span className="text-sm font-bold text-[#051C33]">{auth?.user?.name || 'Administrador'}</span>
                            </div>
                            <Link
                                href={route('admin.logout')}
                                method="post"
                                as="button"
                                className="px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-600 hover:text-white transition flex items-center gap-2 shadow-sm"
                            >
                                <span>Cerrar Sesión</span>
                            </Link>
                        </div>
                    </header>

                    <main className="max-w-6xl mx-auto px-8 py-10 w-full flex-grow">
                        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-900/5 border border-blue-100">
                            <div className="mb-6 border-b border-blue-100 pb-4">
                                <h1 className="text-2xl font-extrabold text-[#051C33]">
                                    Seleccionar Curso para Editar
                                </h1>
                                <p className="text-sm text-[#4A607A] mt-1">
                                    Elige uno de los cursos creados para modificar su información, fechas, contenidos o evaluaciones.
                                </p>
                            </div>

                            {courses.length === 0 ? (
                                <div className="text-center py-16">
                                    <p className="text-sm text-slate-500">No hay cursos registrados en la plataforma todavía.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {courses.map((course) => (
                                        <div key={course.id} className="border border-blue-100 rounded-2xl overflow-hidden bg-[#F8FAFC] flex flex-col justify-between shadow-sm hover:shadow-md transition">
                                            <div>
                                                {/* IMAGEN DE PORTADA DEL CURSO */}
                                                <div className="w-full h-40 bg-blue-50/70 border-b border-blue-100 overflow-hidden relative">
                                                    {course.image ? (
                                                        <img 
                                                            src={`/storage/${course.image}`} 
                                                            alt={course.title} 
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                                            <svg className="w-10 h-10 mb-1 opacity-50" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <span className="text-xs font-medium">Sin portada</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="p-5">
                                                    <h3 className="text-base font-bold text-[#051C33] mb-2 line-clamp-1">{course.title}</h3>
                                                    <p className="text-xs text-[#4A607A] line-clamp-2 mb-4">{course.description}</p>
                                                    
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="text-[11px] bg-blue-50 text-[#0066FF] px-3 py-1 rounded-full font-semibold border border-blue-100">
                                                            {course.modules?.length || 0} Módulos
                                                        </span>
                                                        {course.start_date && (
                                                            <span className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                                                                Inicio: {course.start_date}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="px-5 py-4 bg-white border-t border-blue-100 flex justify-end">
                                                <Link
                                                    href={route('admin.courses.edit', course.id)}
                                                    className="w-full text-center px-4 py-2.5 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition"
                                                >
                                                    Editar Curso ➔
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </main>
                    <footer className="h-12 bg-white border-t border-blue-100"></footer>
                </div>
            </div>
        </>
    );
}