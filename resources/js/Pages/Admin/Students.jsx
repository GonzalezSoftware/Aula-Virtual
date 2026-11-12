import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Students({ auth, students }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 350); 
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head title="Historial de Estudiantes - Panel Admin" />
            
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
                            <Link
                                href={route('admin.dashboard')}
                                className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white font-medium text-sm transition"
                            >
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                {sidebarOpen && <span>Dashboard</span>}
                            </Link>

                            <Link
                                href={route('admin.students.index')}
                                className="flex items-center gap-3.5 px-4 py-3 rounded-xl bg-[#0066FF] text-white font-medium text-sm transition shadow-md shadow-blue-600/20"
                            >
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                {sidebarOpen && <span>Estudiantes</span>}
                            </Link>
                        </nav>
                    </div>

                    <div className="p-4 border-t border-white/10">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold flex items-center justify-center gap-2 transition"
                        >
                            <span>{sidebarOpen ? '◀ Ocultar' : '▶'}</span>
                        </button>
                    </div>
                </aside>

                {/* CONTENEDOR PRINCIPAL */}
                <div className="flex-1 flex flex-col justify-between min-h-screen overflow-x-hidden">
                    
                    {/* BARRA SUPERIOR CON EL TÍTULO "Estudiantes" */}
                    <header className="w-full bg-white/95 backdrop-blur-md border-b border-blue-100 px-8 h-20 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-extrabold text-[#051C33] tracking-tight">
                                Estudiantes
                            </h2>
                        </div>

                        <div className="flex items-center gap-5">
                            <div className="text-right hidden sm:block">
                                <span className="text-xs text-[#4A607A] block">Administrador Maestro</span>
                                <span className="text-sm font-bold text-[#051C33]">{auth?.user?.name || 'Administrador'}</span>
                            </div>

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-600 hover:text-white transition flex items-center gap-2 shadow-sm"
                            >
                                <span>Cerrar Sesión</span>
                            </Link>
                        </div>
                    </header>

                    {/* CONTENIDO DE ESTUDIANTES */}
                    <main className="max-w-7xl mx-auto px-8 py-10 w-full flex-grow">
                        <div className="bg-white rounded-3xl border border-blue-100 shadow-xl shadow-blue-900/5 p-8 min-h-[400px] flex flex-col justify-center items-center">
                            
                            {loading ? (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 border-4 border-blue-200 border-t-[#0066FF] rounded-full animate-spin"></div>
                                    <p className="text-sm font-medium text-[#4A607A]">Consultando registros...</p>
                                </div>
                            ) : students.length === 0 ? (
                                <div className="text-center space-y-3 py-12">
                                    <div className="w-16 h-16 bg-blue-50 text-[#0066FF] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#051C33]">No hay estudiantes registrados</h3>
                                    <p className="text-sm text-[#4A607A] max-w-sm mx-auto">
                                        Actualmente la base de datos no contiene cuentas de alumnos activas.
                                    </p>
                                </div>
                            ) : (
                                <div className="w-full overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-100 text-xs font-semibold text-[#4A607A] uppercase tracking-wider">
                                                <th className="py-3 px-4">Nombre</th>
                                                <th className="py-3 px-4">Correo Electrónico</th>
                                                <th className="py-3 px-4">Fecha de Registro</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm text-[#051C33]">
                                            {students.map((student) => (
                                                <tr key={student.id} className="hover:bg-slate-50 transition">
                                                    <td className="py-4 px-4 font-semibold">{student.name}</td>
                                                    <td className="py-4 px-4 text-[#4A607A]">{student.email}</td>
                                                    <td className="py-4 px-4 text-[#4A607A]">
                                                        {new Date(student.created_at).toLocaleDateString()}
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