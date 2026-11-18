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
                    <header className="w-full bg-white/95 backdrop-blur-md border-b border-blue-100 px-8 h-20 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                        <h2 className="text-lg font-extrabold text-[#051C33] tracking-tight">Panel de Administración</h2>
                        <div className="flex items-center gap-5">
                            <span className="text-sm font-bold text-[#051C33]">{auth?.user?.name || 'Administrador'}</span>
                        </div>
                    </header>

                    <main className="max-w-5xl mx-auto px-8 py-10 w-full flex-grow">
                        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-900/5 border border-blue-100">
                            <h1 className="text-2xl font-extrabold text-[#051C33] mb-6 border-b border-blue-100 pb-4">
                                Selecciona el Curso que deseas Editar
                            </h1>

                            {courses.length === 0 ? (
                                <p className="text-sm text-slate-500 text-center py-10">No hay cursos registrados en la plataforma.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {courses.map((course) => (
                                        <div key={course.id} className="border border-blue-100 rounded-2xl p-5 bg-[#F8FAFC] flex flex-col justify-between shadow-sm">
                                            <div>
                                                <h3 className="text-base font-bold text-[#051C33] mb-2">{course.title}</h3>
                                                <p className="text-xs text-[#4A607A] line-clamp-2 mb-4">{course.description}</p>
                                                <span className="text-[11px] bg-blue-50 text-[#0066FF] px-3 py-1 rounded-full font-semibold">
                                                    {course.modules?.length || 0} Módulos registrados
                                                </span>
                                            </div>
                                            <div className="mt-6 pt-4 border-t border-blue-100 flex justify-end">
                                                <Link
                                                    href={route('admin.courses.edit', course.id)}
                                                    className="px-5 py-2.5 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold rounded-xl shadow-md transition"
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