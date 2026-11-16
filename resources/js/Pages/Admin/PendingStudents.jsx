import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import AdminSidebar from '@/Components/AdminSidebar';

export default function PendingStudents({ auth, students }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredStudents = students.filter(student => {
        const matchesSearch = 
            student.name.toLowerCase().includes(search.toLowerCase()) ||
            (student.lastname && student.lastname.toLowerCase().includes(search.toLowerCase())) ||
            (student.cedula && student.cedula.toLowerCase().includes(search.toLowerCase())) ||
            student.email.toLowerCase().includes(search.toLowerCase());
        return student.en_espera === 1 && matchesSearch;
    });

    const openDetailsModal = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
    };

    const handleApprove = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "El estudiante será aprobado y se le enviará una clave temporal.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0066FF',
            confirmButtonText: 'Sí, confirmar',
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('admin.students.approve', id), {}, {
                    onSuccess: () => {
                        closeModal();
                        Swal.fire('¡Estudiante Aprobado!', 'Se ha enviado su contraseña.', 'success');
                    }
                });
            }
        });
    };

    return (
        <>
            <Head title="Estudiantes en Espera - Panel Admin" />
            
            <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] font-['Poppins'] flex">
                <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeMenu="pending" />

                <div className="flex-1 flex flex-col justify-between min-h-screen overflow-x-hidden">
                    <header className="w-full bg-white/95 backdrop-blur-md border-b border-blue-100 px-8 h-20 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                        <h2 className="text-lg font-extrabold text-[#051C33] tracking-tight">Estudiantes en Espera de Confirmación</h2>
                        <div className="flex items-center gap-5">
                            <span className="text-sm font-bold text-[#051C33]">{auth?.user?.name || 'Administrador'}</span>
                            <Link href={route('admin.logout')} method="post" as="button" className="px-4 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-600 hover:text-white transition">Cerrar Sesión</Link>
                        </div>
                    </header>

                    <main className="max-w-7xl mx-auto px-8 py-10 w-full flex-grow">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-2xl font-extrabold text-[#051C33]">Solicitudes Pendientes</h1>
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
                                <p className="text-center text-slate-500 py-10">No hay estudiantes en espera.</p>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b text-xs font-semibold text-slate-400 uppercase">
                                            <th className="py-3 px-4">Estudiante</th>
                                            <th className="py-3 px-4">Cédula</th>
                                            <th className="py-3 px-4 text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y text-sm">
                                        {filteredStudents.map((student) => (
                                            <tr key={student.id} className="hover:bg-slate-50">
                                                <td className="py-4 px-4 font-semibold">{student.name} {student.lastname}</td>
                                                <td className="py-4 px-4 text-slate-600">{student.cedula}</td>
                                                <td className="py-4 px-4 text-center">
                                                    <button onClick={() => openDetailsModal(student)} className="px-3.5 py-1.5 rounded-xl bg-[#E3F2FD] text-[#0066FF] text-xs font-semibold">Ver Detalles</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </main>
                    <footer className="h-12 bg-white border-t border-slate-100"></footer>
                </div>

                {isModalOpen && selectedStudent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 space-y-4">
                            <h3 className="text-lg font-bold">Detalles de la Solicitud</h3>
                            <p><strong>Nombre:</strong> {selectedStudent.name} {selectedStudent.lastname}</p>
                            <button onClick={() => handleApprove(selectedStudent.id)} className="px-5 py-2.5 bg-[#0066FF] text-white rounded-xl text-sm font-semibold">Aceptar</button>
                            <button onClick={closeModal} className="ml-2 px-4 py-2.5 bg-gray-200 rounded-xl text-sm">Cerrar</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}