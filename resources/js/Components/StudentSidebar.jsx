import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';

export default function StudentSidebar({ sidebarOpen, setSidebarOpen, activeMenu }) {
    const [internalOpen, setInternalOpen] = useState(false);

    const isOpen = typeof sidebarOpen === 'boolean' ? sidebarOpen : internalOpen;

    useEffect(() => {
        setInternalOpen(false);
        if (typeof setSidebarOpen === 'function') {
            setSidebarOpen(false);
        }
    }, [activeMenu]);

    const toggleSidebar = () => {
        const nextState = !isOpen;
        setInternalOpen(nextState);
        if (typeof setSidebarOpen === 'function') {
            setSidebarOpen(nextState);
        }
    };

    return (
        <aside className={`${isOpen ? 'w-52 sm:w-64' : 'w-16 sm:w-20'} bg-[#051C33] text-white border-r border-slate-800 transition-all duration-300 flex flex-col sticky top-0 h-screen z-20 shadow-xl shrink-0`}>
            {/* CABECERA SUPERIOR */}
            <div className="h-16 sm:h-20 px-3 sm:px-5 flex items-center gap-2.5 sm:gap-3 border-b border-white/10 shrink-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#0066FF] to-[#3385FF] flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-md shadow-blue-500/25 shrink-0">
                    E
                </div>
                {isOpen && (
                    <span className="text-sm sm:text-base font-bold tracking-tight text-white whitespace-nowrap truncate">
                        Portal <span className="text-[#3385FF]">Estudiante</span>
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
                    <Link
                        href={route('dashboard')}
                        className={`flex items-center ${isOpen ? 'gap-3 sm:gap-3.5 px-3 sm:px-4' : 'justify-center px-2'} py-2.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm transition ${
                            activeMenu === 'dashboard' 
                                ? 'bg-[#0066FF] text-white shadow-md shadow-blue-600/20' 
                                : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {isOpen && <span className="truncate">Inicio / Cursos</span>}
                    </Link>

                    <Link
                        href={route('student.grades')}
                        className={`flex items-center ${isOpen ? 'gap-3 sm:gap-3.5 px-3 sm:px-4' : 'justify-center px-2'} py-2.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm transition ${
                            activeMenu === 'grades' 
                                ? 'bg-[#0066FF] text-white shadow-md shadow-blue-600/20' 
                                : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {isOpen && <span className="truncate">Mis Calificaciones</span>}
                    </Link>

                    <Link
                        href={route('student.password.edit')}
                        className={`flex items-center ${isOpen ? 'gap-3 sm:gap-3.5 px-3 sm:px-4' : 'justify-center px-2'} py-2.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm transition ${
                            activeMenu === 'password' 
                                ? 'bg-[#0066FF] text-white shadow-md shadow-blue-600/20' 
                                : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        {isOpen && <span className="truncate">Cambiar Contraseña</span>}
                    </Link>
                </nav>
            </div>
        </aside>
    );
}