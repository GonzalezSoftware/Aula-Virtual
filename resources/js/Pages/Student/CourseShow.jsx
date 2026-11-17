import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import StudentSidebar from '@/Components/StudentSidebar';

export default function CourseShow({ auth, course }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <>
            <Head title={`${course.title} - Aula Virtual`} />

            <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] font-['Poppins'] flex">
                <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeMenu="dashboard" />

                <div className="flex-1 flex flex-col justify-between min-h-screen overflow-x-hidden min-w-0">
                    <header className="w-full bg-white/95 backdrop-blur-md border-b border-blue-100 px-4 sm:px-8 h-20 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                        <h2 className="text-base sm:text-lg font-extrabold text-[#051C33] tracking-tight">Detalles del Curso</h2>
                        <div className="flex items-center gap-3 sm:gap-5">
                            <div className="text-right hidden sm:block">
                                <span className="text-xs text-[#4A607A] block">Estudiante Activo</span>
                                <span className="text-sm font-bold text-[#051C33]">{auth?.user?.name || 'Estudiante'}</span>
                            </div>
                            <Link
                                href={route('student.logout')}
                                method="post"
                                as="button"
                                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm font-semibold hover:bg-red-600 hover:text-white transition flex items-center gap-2 shadow-sm"
                            >
                                <span>Cerrar Sesión</span>
                            </Link>
                        </div>
                    </header>

                    <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10 w-full flex-grow space-y-6 sm:space-y-8">
                        <div className="bg-white rounded-3xl border border-blue-100 shadow-xl shadow-blue-950/5 p-6 sm:p-8 flex flex-col md:flex-row gap-6 sm:gap-8 items-center justify-between">
                            <div className="space-y-3 flex-1">
                                <span className="inline-block px-3.5 py-1 bg-blue-50 text-[#0066FF] text-xs font-bold rounded-full uppercase tracking-wider">
                                    Curso Activo
                                </span>
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#051C33]">{course.title}</h1>
                                <p className="text-xs sm:text-sm text-[#4A607A] leading-relaxed">{course.description || "Sin descripción detallada para este curso."}</p>
                            </div>
                            {course.image && (
                                <img src={`/storage/${course.image}`} alt={course.title} className="w-full md:w-52 h-36 object-cover rounded-2xl shadow-md border border-blue-50 shrink-0" />
                            )}
                        </div>

                        <div className="bg-white rounded-3xl border border-blue-100 shadow-xl shadow-blue-950/5 p-6 sm:p-8">
                            <div className="mb-6">
                                <h2 className="text-lg sm:text-xl font-extrabold text-[#051C33]">Módulos de Estudio Disponibles</h2>
                            </div>
                            {course.modules && course.modules.length > 0 ? (
                                <div className="grid gap-4">
                                    {course.modules.map((module) => (
                                        <div key={module.id} className="bg-[#F8FAFC] rounded-2xl p-4 sm:p-6 border border-blue-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div>
                                                <h3 className="text-sm sm:text-base font-extrabold text-[#051C33]">{module.title}</h3>
                                                <p className="text-xs text-[#4A607A] mt-1">{module.description}</p>
                                            </div>
                                            <Link href={route('student.courses.modules.show', [course.id, module.id])} className="w-full sm:w-auto text-center px-5 py-2.5 bg-[#0066FF] text-white text-xs font-semibold rounded-xl">
                                                Ingresar al Módulo
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-[#4A607A]">No hay módulos registrados.</p>
                            )}
                        </div>
                    </main>
                    <footer className="h-12 bg-white border-t border-slate-100"></footer>
                </div>
            </div>
        </>
    );
}