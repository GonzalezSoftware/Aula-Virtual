import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function Students({ auth, students }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [search, setSearch] = useState('');

    // Filtrar estudiantes activos (en_espera === 0) que coincidan con la búsqueda
    const filteredStudents = students.filter(student => {
        const isActive = student.en_espera === 0 && student.email !== 'admin_oculto';
        const matchesSearch = 
            student.name.toLowerCase().includes(search.toLowerCase()) ||
            (student.lastname && student.lastname.toLowerCase().includes(search.toLowerCase())) ||
            (student.cedula && student.cedula.toLowerCase().includes(search.toLowerCase())) ||
            student.email.toLowerCase().includes(search.toLowerCase());
        
        return isActive && matchesSearch;
    });

    const handleDelete = (id, studentName) => {
        Swal.fire({
            title: '¿Eliminar estudiante?',
            text: `¿Estás seguro de eliminar a ${studentName}? Esta acción borrará su cuenta y sus archivos permanentemente.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#4A607A',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            customClass: { popup: 'rounded-2xl font-[\'Poppins\']' }
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.students.reject', id), {
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Estudiante Eliminado!',
                            text: 'El registro ha sido removido del sistema exitosamente.',
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
            <Head title="Listado de Estudiantes - Panel Admin" />
            
            <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] font-['Poppins'] flex">
                
                {/* SIDEBAR FIJO */}
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

                            {/* ESTUDIANTES ACTIVOS (ACTIVO EN ESTA VISTA) */}
                            <Link
                                href={route('admin.students.index')}
                                className="flex items-center gap-3.5 px-4 py-3 rounded-xl bg-[#0066FF] text-white font-medium text-sm transition shadow-md shadow-blue-600/20"
                            >
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                {sidebarOpen && <span>Estudiantes</span>}
                            </Link>

                            {/* ESTUDIANTES EN ESPERA */}
                            <Link
                                href={route('admin.students.pending')}
                                className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white font-medium text-sm transition"
                            >
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {sidebarOpen && <span>Estudiantes en Espera</span>}
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
                    
                    <header className="w-full bg-white/95 backdrop-blur-md border-b border-blue-100 px-8 h-20 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                        <h2 className="text-lg font-extrabold text-[#051C33] tracking-tight">
                            Gestión de Estudiantes
                        </h2>

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

                    <main className="max-w-7xl mx-auto px-8 py-10 w-full flex-grow">
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl font-extrabold text-[#051C33]">Lista General de Alumnos</h1>
                                <p className="text-sm text-[#4A607A] mt-1">Estudiantes registrados y activos en la plataforma.</p>
                            </div>

                            {/* BARRA DE BÚSQUEDA */}
                            <div className="w-full sm:w-72">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Buscar por nombre, cédula..."
                                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-blue-200/80 text-[#051C33] text-sm focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/25 outline-none transition shadow-sm"
                                />
                            </div>
                        </div>

                        {/* CONTENEDOR DE LA TABLA GENERAL */}
                        <div className="bg-white rounded-3xl border border-blue-100 shadow-xl shadow-blue-900/5 p-6 overflow-hidden">
                            {filteredStudents.length === 0 ? (
                                <div className="text-center space-y-3 py-16">
                                    <div className="w-16 h-16 bg-blue-50 text-[#0066FF] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#051C33]">No se encontraron estudiantes</h3>
                                    <p className="text-sm text-[#4A607A]">Intenta con otro término de búsqueda o no hay alumnos activos.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-100 text-xs font-semibold text-[#4A607A] uppercase tracking-wider">
                                                <th className="py-3 px-4">Estudiante</th>
                                                <th className="py-3 px-4">Cédula</th>
                                                <th className="py-3 px-4">Correo</th>
                                                <th className="py-3 px-4">Teléfono</th>
                                                <th className="py-3 px-4 text-center">Estado</th>
                                                <th className="py-3 px-4 text-center">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm text-[#051C33]">
                                            {filteredStudents.map((student) => (
                                                <tr key={student.id} className="hover:bg-slate-50 transition">
                                                    <td className="py-4 px-4 font-semibold">
                                                        {student.name} {student.lastname}
                                                    </td>
                                                    <td className="py-4 px-4 text-[#4A607A]">{student.cedula}</td>
                                                    <td className="py-4 px-4 text-[#4A607A]">{student.email}</td>
                                                    <td className="py-4 px-4 text-[#4A607A]">{student.phone}</td>
                                                    <td className="py-4 px-4 text-center">
                                                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold border border-emerald-200">
                                                            Activo
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-center">
                                                        <button
                                                            onClick={() => handleDelete(student.id, `${student.name} ${student.lastname}`)}
                                                            className="px-3.5 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-600 hover:text-white transition shadow-sm"
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