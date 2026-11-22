import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import AdminSidebar from '@/Components/AdminSidebar';

export default function ManageCourses({ auth, courses }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { delete: destroy, processing } = useForm();

    const handleDelete = (courseId, courseTitle) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `Vas a eliminar el curso "${courseTitle}". Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('admin.courses.destroy', courseId), {
                    onSuccess: () => {
                        Swal.fire('¡Eliminado!', 'El curso ha sido borrado correctamente.', 'success');
                    }
                });
            }
        });
    };

    return (
        <>
            <Head title="Gestionar y Eliminar Cursos - Admin" />
            
            <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] font-['Poppins'] flex">
                <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeMenu="manage-courses" />

                <div className="flex-1 flex flex-col justify-between min-h-screen overflow-x-hidden min-w-0">
                    <header className="w-full bg-white/95 backdrop-blur-md border-b border-blue-100 px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sticky top-0 z-10 shadow-sm">
                        <h2 className="text-base sm:text-lg font-extrabold text-[#051C33] tracking-tight truncate">Gestión y Eliminación de Cursos</h2>
                        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                            <span className="text-xs sm:text-sm font-bold text-[#051C33] hidden sm:inline">{auth?.user?.name || 'Administrador'}</span>
                            <Link href={route('admin.logout')} method="post" as="button" className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-red-50 text-red-600 text-xs sm:text-sm font-semibold hover:bg-red-600 hover:text-white transition whitespace-nowrap">Cerrar Sesión</Link>
                        </div>
                    </header>

                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full flex-grow">
                        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-blue-100 shadow-xl shadow-blue-900/5">
                            <h3 className="text-lg sm:text-xl font-bold text-[#051C33] mb-6">Cursos Registrados</h3>
                            {courses.length === 0 ? (
                                <p className="text-slate-500 text-xs sm:text-sm">No hay cursos registrados actualmente.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[480px]">
                                        <thead>
                                            <tr className="border-b border-slate-100 text-xs uppercase text-slate-400 font-semibold">
                                                <th className="py-3 px-3 sm:px-4">Título del Curso</th>
                                                <th className="py-3 px-3 sm:px-4">Descripción</th>
                                                <th className="py-3 px-3 sm:px-4 text-center">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                                            {courses.map((course) => (
                                                <tr key={course.id} className="hover:bg-slate-50 transition">
                                                    <td className="py-4 px-3 sm:px-4 font-bold text-[#051C33]">{course.title}</td>
                                                    <td className="py-4 px-3 sm:px-4 text-slate-600 truncate max-w-[160px] sm:max-w-xs">{course.description || 'Sin descripción'}</td>
                                                    <td className="py-4 px-3 sm:px-4 text-center">
                                                        <button
                                                            onClick={() => handleDelete(course.id, course.title)}
                                                            disabled={processing}
                                                            className="px-3 sm:px-4 py-2 rounded-xl bg-red-50 text-red-600 font-semibold text-xs hover:bg-red-600 hover:text-white transition border border-red-200 whitespace-nowrap"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </main>
                    <footer className="h-12 bg-white border-t border-slate-100"></footer>
                </div>
            </div>
        </>
    );
}