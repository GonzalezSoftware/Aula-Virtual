import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function PendingStudents({ auth, students }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filtrar únicamente los estudiantes con en_espera === 1 que coincidan con la búsqueda
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
            text: "El estudiante será aprobado y se le enviará una clave temporal de 8 dígitos a su correo.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0066FF',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, confirmar y enviar clave',
            cancelButtonText: 'Cancelar',
            customClass: { popup: 'rounded-2xl font-[\'Poppins\']' }
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('admin.students.approve', id), {}, {
                    onSuccess: () => {
                        closeModal();
                        Swal.fire({
                            icon: 'success',
                            title: '¡Estudiante Aprobado!',
                            text: 'Se ha generado y enviado su contraseña temporal por correo con éxito.',
                            confirmButtonColor: '#0066FF',
                            customClass: { popup: 'rounded-2xl font-[\'Poppins\']' }
                        });
                    }
                });
            }
        });
    };
    
    const handleReject = (id) => {
        Swal.fire({
            title: '¿Rechazar solicitud?',
            text: "Esta acción eliminará el registro y la solicitud del estudiante.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#4A607A',
            confirmButtonText: 'Sí, rechazar',
            cancelButtonText: 'Cancelar',
            customClass: { popup: 'rounded-2xl font-[\'Poppins\']' }
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.students.reject', id), {
                    onSuccess: () => {
                        closeModal();
                        Swal.fire({
                            icon: 'success',
                            title: 'Solicitud Rechazada',
                            text: 'El registro ha sido descartado.',
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
            <Head title="Estudiantes en Espera - Panel Admin" />
            
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
                                className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white font-medium text-sm transition"
                            >
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                {sidebarOpen && <span>Estudiantes</span>}
                            </Link>

                            <Link
                                href={route('admin.students.pending')}
                                className="flex items-center gap-3.5 px-4 py-3 rounded-xl bg-[#0066FF] text-white font-medium text-sm transition shadow-md shadow-blue-600/20"
                            >
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {sidebarOpen && <span>Estudiantes en Espera</span>}
                            </Link>

                            {/* NUEVA OPCIÓN: CREAR CURSO */}
                            <Link
                                href={route('admin.courses.create')}
                                className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white font-medium text-sm transition"
                            >
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                {sidebarOpen && <span>Crear Curso</span>}
                            </Link>

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
                            Estudiantes en Espera de Confirmación
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
                                <h1 className="text-2xl font-extrabold text-[#051C33]">Solicitudes Pendientes</h1>
                                <p className="text-sm text-[#4A607A] mt-1">Revisa, valida la cédula y acepta o rechaza a los nuevos aspirantes.</p>
                            </div>

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

                        <div className="bg-white rounded-3xl border border-blue-100 shadow-xl shadow-blue-900/5 p-6 overflow-hidden">
                            {filteredStudents.length === 0 ? (
                                <div className="text-center space-y-3 py-16">
                                    <div className="w-16 h-16 bg-blue-50 text-[#0066FF] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#051C33]">No hay estudiantes en espera</h3>
                                    <p className="text-sm text-[#4A607A]">Todas las solicitudes pendientes han sido procesadas.</p>
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
                                                        <button
                                                            onClick={() => openDetailsModal(student)}
                                                            className="px-3.5 py-1.5 rounded-xl bg-[#E3F2FD] text-[#0066FF] text-xs font-semibold hover:bg-[#0066FF] hover:text-white transition shadow-sm"
                                                        >
                                                            Ver Detalles
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

                {/* MODAL DE DETALLES */}
                {isModalOpen && selectedStudent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-blue-100 overflow-hidden transform transition-all">
                            
                            <div className="bg-[#051C33] text-white px-6 py-5 flex items-center justify-between">
                                <h3 className="text-lg font-bold">Detalles de la Solicitud</h3>
                                <button 
                                    onClick={closeModal}
                                    className="text-slate-300 hover:text-white text-lg font-bold px-2 py-1 outline-none"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="block text-xs font-semibold text-[#4A607A]">Nombres:</span>
                                        <span className="font-bold text-[#051C33]">{selectedStudent.name}</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-semibold text-[#4A607A]">Apellidos:</span>
                                        <span className="font-bold text-[#051C33]">{selectedStudent.lastname}</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-semibold text-[#4A607A]">Cédula:</span>
                                        <span className="font-bold text-[#051C33]">{selectedStudent.cedula}</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-semibold text-[#4A607A]">Teléfono:</span>
                                        <span className="font-bold text-[#051C33]">{selectedStudent.phone}</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="block text-xs font-semibold text-[#4A607A]">Correo Electrónico:</span>
                                        <span className="font-bold text-[#051C33]">{selectedStudent.email}</span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <span className="block text-xs font-semibold text-[#4A607A] mb-2">Foto de la Cédula Adjunta:</span>
                                    <div className="border border-blue-200 rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center p-2">
                                        {selectedStudent.cedula_image ? (
                                            <img 
                                                src={`/storage/${selectedStudent.cedula_image}`} 
                                                alt="Cédula del estudiante" 
                                                className="max-h-60 object-contain rounded-xl shadow-sm"
                                            />
                                        ) : (
                                            <span className="text-sm text-slate-400 py-6">Sin imagen disponible</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
                                <button
                                    onClick={() => handleReject(selectedStudent.id)}
                                    className="px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-600 hover:text-white transition shadow-sm"
                                >
                                    Rechazar
                                </button>
                                <button
                                    onClick={() => handleApprove(selectedStudent.id)}
                                    className="px-5 py-2.5 rounded-xl bg-[#0066FF] text-white text-sm font-semibold hover:bg-[#0052CC] transition shadow-md shadow-blue-600/20"
                                >
                                    Aceptar Estudiante
                                </button>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </>
    );
}