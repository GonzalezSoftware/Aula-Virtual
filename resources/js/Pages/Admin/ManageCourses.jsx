import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';

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
            customClass: { popup: 'rounded-2xl font-[\'Poppins\']' }
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('admin.courses.destroy', courseId), {
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Eliminado!',
                            text: 'El curso ha sido borrado correctamente.',
                            confirmButtonColor: '#0066FF',
                            customClass: { popup: 'rounded-2xl font-[\'Poppins\']' }
                        });
                    }
                });
            }
        });
    };

    return (
        <>
            <Head title="Gestionar y Eliminar Cursos - Admin" />

            <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] font-['Poppins'] flex">

                {/* SIDEBAR */}
                <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#051C33] text-white border-r border-slate-800 transition-all duration-300 flex flex-col justify-between z-20 shadow-xl`}>
                    <div>
                        <div className="h-20 px-6 flex items-center gap-3 border-b border-white/10">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0066FF] to-[#3385FF] flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/25 shrink-0">
                                AD
                            </div>
                            {sidebarOpen && (
                                <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                                    Panel <span className="text-[#3385FF]">Admin</span>
                                </span>
                            )}
                        </div>

                        <nav className="p-4 space-y-2">
                            <Link href={route('admin.dashboard')} className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white font-medium text-sm transition">
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                {sidebarOpen && <span>Dashboard</span>}
                            </Link>

                            <Link href={route('admin.students.index')} className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white font-medium text-sm transition">
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                {sidebarOpen && <span>Estudiantes</span>}
                            </Link>

                            <Link href={route('admin.students.pending')} className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white font-medium text-sm transition">
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {sidebarOpen && <span>Estudiantes en Espera</span>}
                            </Link>

                            <Link href={route('admin.courses.create')} className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white font-medium text-sm transition">
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                {sidebarOpen && <span>Crear Curso</span>}
                            </Link>

                            {/* NUEVA OPCIÓN: ELIMINAR / GESTIONAR CURSOS */}
                            <Link href={route('admin.courses.manage')} className="flex items-center gap-3.5 px-4 py-3 rounded-xl bg-[#0066FF] text-white font-medium text-sm transition shadow-md shadow-blue-600/20">
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                {sidebarOpen && <span>Eliminar Cursos</span>}
                            </Link>

                            {/* OPCIÓN: ELIMINAR CURSOS */}
                            <Link
                                href={route('admin.courses.manage')}
                                className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white font-medium text-sm transition"
                            >
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                {sidebarOpen && <span>Eliminar Cursos</span>}
                            </Link>
                        </nav>
                    </div>

                    <div className="p-4 border-t border-white/10">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold flex items-center justify-center gap-2 transition">
                            <span>{sidebarOpen ? '◀ Ocultar' : '▶'}</span>
                        </button>
                    </div>
                </aside>

                {/* CONTENIDO PRINCIPAL */}
                <div className="flex-1 flex flex-col justify-between min-h-screen overflow-x-hidden">
                    <header className="w-full bg-white/95 backdrop-blur-md border-b border-blue-100 px-8 h-20 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                        <h2 className="text-lg font-extrabold text-[#051C33] tracking-tight">Gestión y Eliminación de Cursos</h2>
                        <div className="flex items-center gap-5">
                            <span className="text-sm font-bold text-[#051C33]">{auth?.user?.name || 'Administrador'}</span>
                            <Link href={route('admin.logout')} method="post" as="button" className="px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-600 hover:text-white transition">Cerrar Sesión</Link>
                        </div>
                    </header>

                    <main className="max-w-7xl mx-auto px-8 py-10 w-full flex-grow">
                        <div className="bg-white rounded-3xl p-8 border border-blue-100 shadow-xl shadow-blue-900/5">
                            <h3 className="text-xl font-bold text-[#051C33] mb-6">Cursos Registrados</h3>

                            {courses.length === 0 ? (
                                <p className="text-slate-500 text-sm">No hay cursos registrados actualmente.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-100 text-xs uppercase text-slate-400 font-semibold">
                                                <th className="py-3 px-4">Título del Curso</th>
                                                <th className="py-3 px-4">Descripción</th>
                                                <th className="py-3 px-4 text-center">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm">
                                            {courses.map((course) => (
                                                <tr key={course.id} className="hover:bg-slate-50 transition">
                                                    <td className="py-4 px-4 font-bold text-[#051C33]">{course.title}</td>
                                                    <td className="py-4 px-4 text-slate-600 truncate max-w-xs">{course.description || 'Sin descripción'}</td>
                                                    <td className="py-4 px-4 text-center">
                                                        <button
                                                            onClick={() => handleDelete(course.id, course.title)}
                                                            disabled={processing}
                                                            className="px-4 py-2 rounded-xl bg-red-50 text-red-600 font-semibold text-xs hover:bg-red-600 hover:text-white transition border border-red-200 shadow-sm"
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