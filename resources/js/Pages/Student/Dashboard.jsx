import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import StudentSidebar from '@/Components/StudentSidebar';
import Swal from 'sweetalert2';

export default function StudentDashboard({ auth, courses = [] }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { flash, errors } = usePage().props;
    const shownAlertRef = useRef(null);

    useEffect(() => {
        const errorMsg = flash?.error || errors?.error;
        if (errorMsg && shownAlertRef.current !== errorMsg) {
            shownAlertRef.current = errorMsg;
            Swal.fire({
                icon: 'warning',
                title: 'Acceso Restringido por Fecha',
                text: errorMsg,
                confirmButtonText: 'OK',
                confirmButtonColor: '#0066FF',
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
        }
    }, [flash?.error, errors?.error]);

    return (
        <>
            <Head title="Panel de Estudiante - Aula Virtual" />

            <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] font-['Poppins'] flex">
                <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeMenu="dashboard" />

                <div className="flex-1 flex flex-col justify-between min-h-screen overflow-x-hidden min-w-0">
                    <header className="w-full bg-white/95 backdrop-blur-md border-b border-blue-100 px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sticky top-0 z-10 shadow-sm">
                        <h2 className="text-base sm:text-lg font-extrabold text-[#051C33] tracking-tight truncate">Dashboard Académico</h2>
                        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                            <div className="text-right hidden sm:block">
                                <span className="text-xs text-[#4A607A] block">Estudiante Activo</span>
                                <span className="text-sm font-bold text-[#051C33]">{auth?.user?.name || 'Estudiante'}</span>
                            </div>
                            <Link
                                href={route('student.logout')}
                                method="post"
                                as="button"
                                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm font-semibold hover:bg-red-600 hover:text-white transition flex items-center gap-2 shadow-sm whitespace-nowrap"
                            >
                                <span>Cerrar Sesión</span>
                            </Link>
                        </div>
                    </header>

                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full flex-grow">
                        <div className="mb-6 sm:mb-8">
                            <h1 className="text-xl sm:text-2xl font-extrabold text-[#051C33]">Mis Cursos Asignados</h1>
                            <p className="text-xs sm:text-sm text-[#4A607A] mt-1">Explora las asignaturas y materiales disponibles en tu ciclo actual.</p>
                        </div>

                        {courses.length === 0 ? (
                            <div className="bg-white rounded-2xl sm:rounded-3xl border border-blue-100 p-6 sm:p-8 text-center">
                                <p className="text-xs sm:text-sm text-[#4A607A]">No hay cursos disponibles por ahora.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {courses.map((course) => (
                                    <div key={course.id} className="bg-white rounded-2xl sm:rounded-3xl border border-blue-100 shadow-xl overflow-hidden flex flex-col justify-between min-w-0">
                                        <div>
                                            {course.image ? (
                                                <img src={`/storage/${course.image}`} alt={course.title} className="w-full h-44 sm:h-48 object-cover" />
                                            ) : (
                                                <div className="w-full h-44 sm:h-48 bg-gradient-to-tr from-[#051C33] to-[#0066FF] flex items-center justify-center text-white font-bold text-lg sm:text-xl px-4 text-center">{course.title}</div>
                                            )}
                                            <div className="p-4 sm:p-6 space-y-3">
                                                <h3 className="text-base sm:text-lg font-extrabold text-[#051C33]">{course.title}</h3>
                                                <p className="text-xs text-[#4A607A] line-clamp-3">{course.description}</p>

                                                <div className="flex flex-wrap gap-2 pt-1">
                                                    <span className="text-[11px] bg-blue-50 text-[#0066FF] px-3 py-1 rounded-full font-semibold border border-blue-100">
                                                        {course.modules?.length || 0} Módulos
                                                    </span>
                                                    {course.start_date && (
                                                        <span className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                                                            Inicio: {course.start_date}
                                                        </span>
                                                    )}
                                                    {course.end_date && (
                                                        <span className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                                                            Cierre: {course.end_date}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 sm:p-6 pt-0">
                                            <Link href={`/student/courses/${course.id}`} className="w-full block text-center py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-semibold transition">
                                                Ingresar al Curso
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </main>
                    <footer className="h-12 bg-white border-t border-slate-100"></footer>
                </div>
            </div>
        </>
    );
}