import { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function AdminSidebar({ sidebarOpen, setSidebarOpen, activeMenu }) {
    const [internalOpen, setInternalOpen] = useState(false);

    const isOpen = typeof sidebarOpen === 'boolean' ? sidebarOpen : internalOpen;

    const toggleSidebar = () => {
        const nextState = !isOpen;
        setInternalOpen(nextState);
        if (typeof setSidebarOpen === 'function') {
            setSidebarOpen(nextState);
        }
    };

    return (
        <aside className={`${isOpen ? 'w-52 sm:w-64' : 'w-16 sm:w-20'} bg-[#051C33] text-white border-r border-slate-800 flex flex-col sticky top-0 h-screen z-30 shadow-xl shrink-0`}>
            {/* CABECERA SUPERIOR */}
            <div className="h-16 sm:h-20 px-3 sm:px-5 flex items-center gap-2.5 sm:gap-3 border-b border-white/10 shrink-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#0066FF] to-[#3385FF] flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-md shadow-blue-500/25 shrink-0">
                    AD
                </div>
                {isOpen && (
                    <span className="text-sm sm:text-base font-bold tracking-tight text-white whitespace-nowrap truncate">
                        Panel <span className="text-[#3385FF]">Admin</span>
                    </span>
                )}
            </div>

            {/* BOTÓN ENTRE LA CABECERA Y EL PRIMER ENLACE */}
            <div className="px-2.5 sm:px-4 pt-2.5 sm:pt-3 pb-1 border-b border-white/10 shrink-0">
                <button
                    type="button"
                    onClick={toggleSidebar}
                    title={isOpen ? 'Ocultar menú lateral' : 'Desplegar menú lateral'}
                    aria-label={isOpen ? 'Ocultar menú lateral' : 'Desplegar menú lateral'}
                    className="w-full py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 hover:text-white hover:bg-[#0066FF] hover:border-[#0066FF] text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                    <span>{isOpen ? '◀ Ocultar' : '▶'}</span>
                </button>
            </div>

            {/* NAVEGACIÓN */}
            <div className="flex-1 overflow-y-auto">
                <nav className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-2">
                    {/* Dashboard */}
                    <Link
                        href={route('admin.dashboard')}
                        className={`flex items-center ${isOpen ? 'gap-3 sm:gap-3.5 px-3 sm:px-4' : 'justify-center px-2'} py-2.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm transition ${
                            activeMenu === 'dashboard'
                                ? 'bg-[#0066FF] text-white shadow-md shadow-blue-600/20'
                                : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        {isOpen && <span className="truncate">Dashboard</span>}
                    </Link>

                    {/* Estudiantes */}
                    <Link
                        href={route('admin.students.index')}
                        className={`flex items-center ${isOpen ? 'gap-3 sm:gap-3.5 px-3 sm:px-4' : 'justify-center px-2'} py-2.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm transition ${
                            activeMenu === 'students'
                                ? 'bg-[#0066FF] text-white shadow-md shadow-blue-600/20'
                                : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        {isOpen && <span className="truncate">Estudiantes</span>}
                    </Link>

                    {/* Estudiantes en Espera */}
                    <Link
                        href={route('admin.students.pending')}
                        className={`flex items-center ${isOpen ? 'gap-3 sm:gap-3.5 px-3 sm:px-4' : 'justify-center px-2'} py-2.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm transition ${
                            activeMenu === 'pending'
                                ? 'bg-[#0066FF] text-white shadow-md shadow-blue-600/20'
                                : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {isOpen && <span className="truncate">Estudiantes en Espera</span>}
                    </Link>

                    {/* Calificaciones */}
                    <Link
                        href={route('admin.grades')}
                        className={`flex items-center ${isOpen ? 'gap-3 sm:gap-3.5 px-3 sm:px-4' : 'justify-center px-2'} py-2.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm transition ${
                            activeMenu === 'grades'
                                ? 'bg-[#0066FF] text-white shadow-md shadow-blue-600/20'
                                : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {isOpen && <span className="truncate">Calificaciones</span>}
                    </Link>

                    {/* Crear Curso */}
                    <Link
                        href={route('admin.courses.create')}
                        className={`flex items-center ${isOpen ? 'gap-3 sm:gap-3.5 px-3 sm:px-4' : 'justify-center px-2'} py-2.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm transition ${
                            activeMenu === 'create-course'
                                ? 'bg-[#0066FF] text-white shadow-md shadow-blue-600/20'
                                : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        {isOpen && <span className="truncate">Crear Curso</span>}
                    </Link>

                    {/* Editar Cursos */}
                    <Link
                        href={route('admin.courses.edit.list')}
                        className={`flex items-center ${isOpen ? 'gap-3 sm:gap-3.5 px-3 sm:px-4' : 'justify-center px-2'} py-2.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm transition ${
                            activeMenu === 'edit-courses'
                                ? 'bg-[#0066FF] text-white shadow-md shadow-blue-600/20'
                                : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        {isOpen && <span className="truncate">Editar Cursos</span>}
                    </Link>

                    {/* Eliminar Cursos */}
                    <Link
                        href={route('admin.courses.manage')}
                        className={`flex items-center ${isOpen ? 'gap-3 sm:gap-3.5 px-3 sm:px-4' : 'justify-center px-2'} py-2.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm transition ${
                            activeMenu === 'manage-courses'
                                ? 'bg-[#0066FF] text-white shadow-md shadow-blue-600/20'
                                : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {isOpen && <span className="truncate">Eliminar Cursos</span>}
                    </Link>
                </nav>
            </div>
        </aside>
    );
}