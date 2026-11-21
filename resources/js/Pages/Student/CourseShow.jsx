import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import StudentSidebar from '@/Components/StudentSidebar';

export default function CourseShow({ auth, course }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                icon: 'success',
                title: '¡Examen Terminado!',
                text: flash.success,
                confirmButtonText: 'OK',
                confirmButtonColor: '#0066FF',
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
        } else if (flash?.error) {
            Swal.fire({
                icon: 'error',
                title: 'Atención',
                text: flash.error,
                confirmButtonText: 'OK',
                confirmButtonColor: '#0066FF',
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
        }
    }, [flash?.success, flash?.error]);

    return (
        <>
            <Head title={`${course.title} - Aula Virtual`} />

            <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] font-['Poppins'] flex">
                <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeMenu="dashboard" />

                <div className="flex-1 flex flex-col justify-between min-h-screen overflow-x-hidden min-w-0">
                    <header className="w-full bg-white/95 backdrop-blur-md border-b border-blue-100 px-6 h-16 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                        <h2 className="text-base font-extrabold text-[#051C33] tracking-tight">Detalles del Curso</h2>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <span className="text-xs text-[#4A607A] block">Estudiante Activo</span>
                                <span className="text-xs font-bold text-[#051C33]">{auth?.user?.name || 'Estudiante'}</span>
                            </div>
                            <Link
                                href={route('student.logout')}
                                method="post"
                                as="button"
                                className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-600 hover:text-white transition flex items-center gap-2 shadow-sm"
                            >
                                <span>Cerrar Sesión</span>
                            </Link>
                        </div>
                    </header>

                    <main className="max-w-6xl mx-auto px-6 py-8 w-full flex-grow space-y-6">
                        {/* Tarjeta de información del curso */}
                        <div className="bg-white rounded-2xl border border-blue-100 shadow-lg p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
                            <div className="space-y-2 flex-1">
                                <span className="inline-block px-3 py-0.5 bg-blue-50 text-[#0066FF] text-[11px] font-bold rounded-full uppercase tracking-wider">
                                    Curso Activo
                                </span>
                                <h1 className="text-xl md:text-2xl font-extrabold text-[#051C33]">{course.title}</h1>
                                <p className="text-xs text-[#4A607A] leading-relaxed">{course.description || "Sin descripción detallada para este curso."}</p>
                            </div>
                            {course.image && (
                                <img src={`/storage/${course.image}`} alt={course.title} className="w-full md:w-44 h-28 object-cover rounded-xl shadow-sm border border-blue-50 shrink-0" />
                            )}
                        </div>

                        {/* Lista de Módulos */}
                        <div className="bg-white rounded-2xl border border-blue-100 shadow-lg p-6">
                            <div className="mb-4">
                                <h2 className="text-lg font-extrabold text-[#051C33]">Módulos de Estudio Disponibles</h2>
                            </div>
                            {course.modules && course.modules.length > 0 ? (
                                <div className="grid gap-3">
                                    {course.modules.map((module) => (
                                        <div key={module.id} className="bg-[#F8FAFC] rounded-xl p-4 border border-blue-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                            <div>
                                                <h3 className="text-sm font-extrabold text-[#051C33]">{module.title}</h3>
                                                <p className="text-xs text-[#4A607A] mt-0.5">{module.description}</p>
                                            </div>
                                            <Link
                                                href={route('student.courses.modules.show', [course.id, module.id])}
                                                className="w-full sm:w-auto text-center px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-semibold rounded-xl shadow-sm transition"
                                            >
                                                Ingresar al Módulo
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-[#4A607A]">No hay módulos registrados en este curso.</p>
                            )}
                        </div>
                    </main>
                    <footer className="h-10 bg-white border-t border-slate-100"></footer>
                </div>
            </div>
        </>
    );
}