import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import AdminSidebar from '@/Components/AdminSidebar';

export default function PendingStudents({ auth, students }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);

    const filteredStudents = students.filter((student) => {
        const matchesSearch =
            student.name.toLowerCase().includes(search.toLowerCase()) ||
            (student.lastname && student.lastname.toLowerCase().includes(search.toLowerCase())) ||
            (student.cedula && student.cedula.toLowerCase().includes(search.toLowerCase())) ||
            (student.phone && student.phone.toLowerCase().includes(search.toLowerCase())) ||
            student.email.toLowerCase().includes(search.toLowerCase());
        return student.en_espera === 1 && matchesSearch;
    });

    const getCedulaUrl = (cedulaImage) => {
        if (!cedulaImage) return null;
        if (cedulaImage.startsWith('http://') || cedulaImage.startsWith('https://')) {
            return cedulaImage;
        }
        const cleaned = cedulaImage.replace(/^\/?storage\//, '');
        return `/storage/${cleaned}`;
    };

    const openDetailsModal = (student) => {
        setSelectedStudent(student);
        setImagePreviewOpen(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setImagePreviewOpen(false);
        setSelectedStudent(null);
    };

    const handleApprove = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'El estudiante será aprobado y se le enviará una clave temporal.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0066FF',
            cancelButtonColor: '#64748B',
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(
                    route('admin.students.approve', id),
                    {},
                    {
                        onSuccess: () => {
                            closeModal();
                            Swal.fire('¡Estudiante Aprobado!', 'Se ha enviado su contraseña.', 'success');
                        },
                    }
                );
            }
        });
    };

    const handleReject = (id) => {
        Swal.fire({
            title: '¿Rechazar solicitud?',
            text: 'Esta acción eliminará la solicitud pendiente del estudiante.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DC2626',
            cancelButtonColor: '#64748B',
            confirmButtonText: 'Sí, rechazar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.students.reject', id), {
                    onSuccess: () => {
                        closeModal();
                        Swal.fire('Solicitud Rechazada', 'El registro pendiente ha sido eliminado.', 'success');
                    },
                });
            }
        });
    };

    const selectedCedulaSrc = getCedulaUrl(selectedStudent?.cedula_image);

    return (
        <>
            <Head title="Estudiantes en Espera - Panel Admin" />

            <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] font-['Poppins'] flex">
                <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeMenu="pending" />

                <div className="flex-1 flex flex-col justify-between min-h-screen overflow-x-hidden min-w-0">
                    <header className="w-full bg-white/95 backdrop-blur-md border-b border-blue-100 px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sticky top-0 z-10 shadow-sm">
                        <h2 className="text-base sm:text-lg font-extrabold text-[#051C33] tracking-tight truncate">
                            Estudiantes en Espera de Confirmación
                        </h2>
                        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                            <span className="text-xs sm:text-sm font-bold text-[#051C33] hidden sm:inline">
                                {auth?.user?.name || 'Administrador'}
                            </span>
                            <Link
                                href={route('admin.logout')}
                                method="post"
                                as="button"
                                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-red-50 text-red-600 text-xs sm:text-sm font-semibold hover:bg-red-600 hover:text-white transition whitespace-nowrap"
                            >
                                Cerrar Sesión
                            </Link>
                        </div>
                    </header>

                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full flex-grow">
                        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6 sm:mb-8">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-extrabold text-[#051C33]">Solicitudes Pendientes</h1>
                                <p className="text-xs sm:text-sm text-[#4A607A] mt-0.5">
                                    Revisa los datos y la foto de la cédula antes de aprobar el acceso.
                                </p>
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar por nombre, cédula, correo..."
                                className="w-full sm:w-80 px-4 py-2.5 rounded-xl bg-white border border-blue-200 text-xs sm:text-sm focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 outline-none transition"
                            />
                        </div>

                        <div className="bg-white rounded-2xl sm:rounded-3xl border border-blue-100 p-4 sm:p-6 shadow-xl">
                            {filteredStudents.length === 0 ? (
                                <p className="text-center text-slate-500 py-10 text-xs sm:text-sm">
                                    No hay estudiantes en espera.
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[540px]">
                                        <thead>
                                            <tr className="border-b border-blue-100 text-xs font-semibold text-slate-400 uppercase">
                                                <th className="py-3 px-3 sm:px-4">Estudiante</th>
                                                <th className="py-3 px-3 sm:px-4">Cédula</th>
                                                <th className="py-3 px-3 sm:px-4 hidden md:table-cell">Correo</th>
                                                <th className="py-3 px-3 sm:px-4 text-center">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                                            {filteredStudents.map((student) => (
                                                <tr key={student.id} className="hover:bg-slate-50 transition">
                                                    <td className="py-4 px-3 sm:px-4 font-semibold text-[#051C33]">
                                                        {student.name} {student.lastname}
                                                    </td>
                                                    <td className="py-4 px-3 sm:px-4 text-slate-600">{student.cedula}</td>
                                                    <td className="py-4 px-3 sm:px-4 text-slate-600 hidden md:table-cell">
                                                        {student.email}
                                                    </td>
                                                    <td className="py-4 px-3 sm:px-4 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => openDetailsModal(student)}
                                                            className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-[#E3F2FD] text-[#0066FF] hover:bg-[#0066FF] hover:text-white text-xs font-semibold transition whitespace-nowrap"
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

                {/* MODAL COMPLETO DE DETALLES DEL ESTUDIANTE */}
                {isModalOpen && selectedStudent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
                        <div className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-blue-100 overflow-hidden my-auto">
                            {/* Encabezado del modal */}
                            <div className="bg-[#051C33] text-white px-5 sm:px-6 py-4 flex items-center justify-between gap-3">
                                <div>
                                    <span className="text-[11px] uppercase tracking-wider text-[#90caf9] font-semibold">
                                        Revisión de Solicitud
                                    </span>
                                    <h3 className="text-base sm:text-lg font-extrabold">
                                        Detalles del Estudiante
                                    </h3>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30 text-xs font-semibold shrink-0">
                                    En espera
                                </span>
                            </div>

                            {/* Cuerpo con toda la información y foto de cédula */}
                            <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm">
                                    <div className="bg-[#F8FAFC] border border-blue-100 rounded-xl p-3.5">
                                        <p className="text-[11px] font-semibold uppercase text-[#4A607A]">Nombres</p>
                                        <p className="font-bold text-[#051C33] mt-0.5">{selectedStudent.name}</p>
                                    </div>

                                    <div className="bg-[#F8FAFC] border border-blue-100 rounded-xl p-3.5">
                                        <p className="text-[11px] font-semibold uppercase text-[#4A607A]">Apellidos</p>
                                        <p className="font-bold text-[#051C33] mt-0.5">{selectedStudent.lastname || '—'}</p>
                                    </div>

                                    <div className="bg-[#F8FAFC] border border-blue-100 rounded-xl p-3.5">
                                        <p className="text-[11px] font-semibold uppercase text-[#4A607A]">Cédula de Identidad</p>
                                        <p className="font-bold text-[#051C33] mt-0.5">{selectedStudent.cedula || '—'}</p>
                                    </div>

                                    <div className="bg-[#F8FAFC] border border-blue-100 rounded-xl p-3.5">
                                        <p className="text-[11px] font-semibold uppercase text-[#4A607A]">Teléfono</p>
                                        <p className="font-bold text-[#051C33] mt-0.5">{selectedStudent.phone || '—'}</p>
                                    </div>

                                    <div className="bg-[#F8FAFC] border border-blue-100 rounded-xl p-3.5 sm:col-span-2">
                                        <p className="text-[11px] font-semibold uppercase text-[#4A607A]">Correo Electrónico</p>
                                        <p className="font-bold text-[#051C33] mt-0.5 break-all">{selectedStudent.email}</p>
                                    </div>
                                </div>

                                {/* Apartado de la foto de cédula */}
                                <div className="bg-[#F0F6FF] border border-blue-100 rounded-2xl p-4 space-y-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-xs sm:text-sm font-bold text-[#051C33]">
                                            Foto de la Cédula de Identidad
                                        </p>
                                        {selectedCedulaSrc && (
                                            <button
                                                type="button"
                                                onClick={() => setImagePreviewOpen((prev) => !prev)}
                                                className="text-xs font-semibold text-[#0066FF] hover:underline"
                                            >
                                                {imagePreviewOpen ? 'Tamaño normal' : 'Ampliar foto'}
                                            </button>
                                        )}
                                    </div>

                                    {selectedCedulaSrc ? (
                                        <div className="bg-white rounded-xl border border-blue-100 p-2.5 flex justify-center">
                                            <img
                                                src={selectedCedulaSrc}
                                                alt={`Cédula de ${selectedStudent.name} ${selectedStudent.lastname || ''}`}
                                                onClick={() => setImagePreviewOpen((prev) => !prev)}
                                                className={`rounded-lg object-contain cursor-zoom-in transition-all ${
                                                    imagePreviewOpen ? 'max-h-[460px] w-full' : 'max-h-56 w-auto'
                                                }`}
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-500 py-4 text-center">
                                            No se adjuntó imagen de cédula para esta solicitud.
                                        </p>
                                    )}
                                </div>

                                {/* Botones de acción */}
                                <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs sm:text-sm font-semibold transition"
                                    >
                                        Cerrar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleReject(selectedStudent.id)}
                                        className="px-4 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white text-xs sm:text-sm font-semibold transition"
                                    >
                                        Rechazar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleApprove(selectedStudent.id)}
                                        className="px-5 py-2.5 rounded-xl bg-[#0066FF] text-white hover:bg-[#0052CC] text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/20 transition"
                                    >
                                        Aceptar y Enviar Clave
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}