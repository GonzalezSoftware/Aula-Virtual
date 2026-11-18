import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import AdminSidebar from '@/Components/AdminSidebar';

export default function Students({ auth, students, courses = [] }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [search, setSearch] = useState('');
    
    // Estados para el Modal de Asignación de Cursos
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [assignedCourseIds, setAssignedCourseIds] = useState([]);

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

    const openCourseModal = (student) => {
        setSelectedStudent(student);
        // Cargamos los IDs de los cursos que el estudiante ya tiene asignados previamente
        const currentCourses = student.courses ? student.courses.map(c => c.id) : [];
        setAssignedCourseIds(currentCourses);
        setIsCourseModalOpen(true);
    };

    const closeCourseModal = () => {
        setIsCourseModalOpen(false);
        setSelectedStudent(null);
        setAssignedCourseIds([]);
    };

    const handleCheckboxChange = (courseId) => {
        if (assignedCourseIds.includes(courseId)) {
            setAssignedCourseIds(assignedCourseIds.filter(id => id !== courseId));
        } else {
            setAssignedCourseIds([...assignedCourseIds, courseId]);
        }
    };

    const saveAssignedCourses = () => {
        router.post(route('admin.students.assign-courses', selectedStudent.id), {
            courses: assignedCourseIds
        }, {
            onSuccess: () => {
                closeCourseModal();
                Swal.fire({
                    icon: 'success',
                    title: '¡Cursos actualizados!',
                    text: 'Los permisos de acceso a los cursos se han guardado correctamente.',
                    confirmButtonColor: '#0066FF',
                    customClass: { popup: 'rounded-3xl font-[\'Poppins\']' }
                });
            }
        });
    };

    const handleDelete = (id, studentName) => {
        Swal.fire({
            title: '¿Eliminar estudiante?',
            text: `¿Estás seguro de eliminar a ${studentName}? Esta acción borrará su cuenta y sus datos permanentemente.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#4A607A',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            customClass: { popup: 'rounded-3xl font-[\'Poppins\']' }
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.students.reject', id), {
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Estudiante Eliminado!',
                            text: 'El registro ha sido removido del sistema exitosamente.',
                            confirmButtonColor: '#0066FF',
                            customClass: { popup: 'rounded-3xl font-[\'Poppins\']' }
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
                
                {/* SIDEBAR IMPORTADO */}
                <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeMenu="students" />

                {/* CONTENEDOR PRINCIPAL */}
                <div className="flex-1 flex flex-col justify-between min-h-screen overflow-x-hidden">
                    
                    <header className="w-full bg-white/95 backdrop-blur-md border-b border-blue-100 px-8 h-20 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                        <h2 className="text-lg font-extrabold text-[#051C33] tracking-tight">
                            Gestión de Estudiantes
                        </h2>

                        <div className="flex items-center gap-5">
                            <div className="text-right hidden sm:block">
                                <span className="text-xs text-[#4A607A] block">Administrador Maestro</span>
                                <span className="text-sm font-bold text-[#051C33]">{auth?.user?.name || 'Administrador'}</span>
                            </div>

                            <Link
                                href={route('admin.logout')}
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
                                <p className="text-sm text-[#4A607A] mt-1">Estudiantes activos y control de acceso a cursos.</p>
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
                                                <th className="py-3 px-4 text-center">Cursos Asignados</th>
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
                                                    <td className="py-4 px-4 text-center">
                                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E3F2FD] text-[#0066FF] border border-blue-200">
                                                            {student.courses ? student.courses.length : 0} Cursos
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-center flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => openCourseModal(student)}
                                                            className="px-3 py-1.5 rounded-xl bg-[#0066FF] text-white text-xs font-semibold hover:bg-[#0052CC] transition shadow-sm"
                                                        >
                                                            Asignar Cursos
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(student.id, `${student.name} ${student.lastname}`)}
                                                            className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-600 hover:text-white transition shadow-sm border border-red-200"
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

                {/* MODAL PARA ASIGNAR CURSOS */}
                {isCourseModalOpen && selectedStudent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-blue-100 overflow-hidden transform transition-all">
                            
                            <div className="bg-[#051C33] text-white px-6 py-5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold">Asignar Cursos al Estudiante</h3>
                                    <p className="text-xs text-slate-300">{selectedStudent.name} {selectedStudent.lastname}</p>
                                </div>
                                <button 
                                    onClick={closeCourseModal}
                                    className="text-slate-300 hover:text-white text-lg font-bold px-2 py-1 outline-none"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                                <p className="text-xs text-[#4A607A]">
                                    Selecciona los cursos a los que este estudiante tendrá acceso. Si desmarcas un curso, perderá acceso al mismo.
                                </p>

                                {courses.length === 0 ? (
                                    <div className="text-center py-8 text-slate-400 text-sm">
                                        No hay cursos creados en el sistema todavía.
                                    </div>
                                ) : (
                                    <div className="space-y-2.5">
                                        {courses.map((course) => {
                                            const isChecked = assignedCourseIds.includes(course.id);
                                            return (
                                                <label 
                                                    key={course.id}
                                                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                                                        isChecked ? 'bg-blue-50/70 border-[#0066FF]' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <input 
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => handleCheckboxChange(course.id)}
                                                            className="w-4 h-4 text-[#0066FF] rounded focus:ring-[#0066FF] cursor-pointer"
                                                        />
                                                        <div>
                                                            <span className="block text-sm font-bold text-[#051C33]">{course.title}</span>
                                                            <span className="text-xs text-[#4A607A] line-clamp-1">{course.description}</span>
                                                        </div>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
                                <button
                                    onClick={closeCourseModal}
                                    className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-100 transition shadow-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={saveAssignedCourses}
                                    className="px-5 py-2.5 rounded-xl bg-[#0066FF] text-white text-sm font-semibold hover:bg-[#0052CC] transition shadow-md shadow-blue-600/20"
                                >
                                    Guardar Cambios
                                </button>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </>
    );
}