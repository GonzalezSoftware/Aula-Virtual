import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import AdminSidebar from '@/Components/AdminSidebar';

export default function Students({ auth, students, courses = [] }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [search, setSearch] = useState('');

    const filteredStudents = students.filter(student => {
        const isActive = student.en_espera === 0 && student.email !== 'admin_oculto';
        const matchesSearch = 
            student.name.toLowerCase().includes(search.toLowerCase()) ||
            (student.lastname && student.lastname.toLowerCase().includes(search.toLowerCase())) ||
            (student.cedula && student.cedula.toLowerCase().includes(search.toLowerCase())) ||
            student.email.toLowerCase().includes(search.toLowerCase());
        return isActive && matchesSearch;
    });

    return (
        <>
            <Head title="Listado de Estudiantes - Panel Admin" />
            
            <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] font-['Poppins'] flex">
                <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeMenu="students" />

                <div className="flex-1 flex flex-col justify-between min-h-screen overflow-x-hidden">
                    <header className="w-full bg-white/95 backdrop-blur-md border-b border-blue-100 px-8 h-20 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                        <h2 className="text-lg font-extrabold text-[#051C33] tracking-tight">Gestión de Estudiantes</h2>
                        <div className="flex items-center gap-5">
                            <span className="text-sm font-bold text-[#051C33]">{auth?.user?.name || 'Administrador'}</span>
                            <Link href={route('admin.logout')} method="post" as="button" className="px-4 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-600 hover:text-white transition">Cerrar Sesión</Link>
                        </div>
                    </header>

                    <main className="max-w-7xl mx-auto px-8 py-10 w-full flex-grow">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-2xl font-extrabold text-[#051C33]">Lista General de Alumnos</h1>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar por nombre, cédula..."
                                className="px-4 py-2.5 rounded-xl bg-white border border-blue-200 text-sm outline-none"
                            />
                        </div>

                        <div className="bg-white rounded-3xl border border-blue-100 p-6 shadow-xl">
                            {filteredStudents.length === 0 ? (
                                <p className="text-center text-slate-500 py-10">No se encontraron estudiantes.</p>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b text-xs font-semibold text-slate-400 uppercase">
                                            <th className="py-3 px-4">Estudiante</th>
                                            <th className="py-3 px-4">Cédula</th>
                                            <th className="py-3 px-4">Correo</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y text-sm">
                                        {filteredStudents.map((student) => (
                                            <tr key={student.id} className="hover:bg-slate-50">
                                                <td className="py-4 px-4 font-semibold">{student.name} {student.lastname}</td>
                                                <td className="py-4 px-4 text-slate-600">{student.cedula}</td>
                                                <td className="py-4 px-4 text-slate-600">{student.email}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </main>
                    <footer className="h-12 bg-white border-t border-slate-100"></footer>
                </div>
            </div>
        </>
    );
}