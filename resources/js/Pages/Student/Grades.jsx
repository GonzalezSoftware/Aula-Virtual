import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import StudentSidebar from '@/Components/StudentSidebar';

export default function Grades({ auth, grades = [] }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const formatScore = (val) => {
        if (val === null || val === undefined) return '—';
        return `${Number(val).toFixed(2)} / 20`;
    };

    return (
        <>
            <Head title="Mis Calificaciones - Aula Virtual" />

            <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] font-['Poppins'] flex">
                <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeMenu="grades" />

                <div className="flex-1 flex flex-col justify-between min-h-screen overflow-x-hidden min-w-0">
                    <header className="w-full bg-white/95 backdrop-blur-md border-b border-blue-100 px-6 h-16 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                        <h2 className="text-base font-extrabold text-[#051C33] tracking-tight">Mis Calificaciones</h2>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <span className="text-xs text-[#4A607A] block">Estudiante Activo</span>
                                <span className="text-xs font-bold text-[#051C33]">{auth?.user?.name || 'Estudiante'}</span>
                            </div>
                            <Link
                                href={route('student.logout')}
                                method="post"
                                as="button"
                                className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-600 hover:text-white transition flex items-center gap-2 shadow-sm"
                            >
                                <span>Cerrar Sesión</span>
                            </Link>
                        </div>
                    </header>

                    <main className="max-w-6xl mx-auto px-6 py-8 w-full flex-grow space-y-6">
                        <div className="bg-white rounded-2xl border border-blue-100 shadow-lg p-6">
                            <span className="inline-block px-3 py-0.5 bg-blue-50 text-[#0066FF] text-[11px] font-bold rounded-full uppercase tracking-wider mb-2">
                                Registro Académico
                            </span>
                            <h1 className="text-xl md:text-2xl font-extrabold text-[#051C33]">Mis Calificaciones por Curso y Módulo</h1>
                            <p className="text-xs text-[#4A607A] mt-1">
                                Consulta la calificación de cada módulo evaluado y la nota promedio del curso sobre 20 puntos.
                            </p>
                        </div>

                        {grades.length > 0 ? (
                            <div className="space-y-6">
                                {grades.map((course) => (
                                    <div key={course.id} className="bg-white rounded-2xl border border-blue-100 shadow-lg p-6 space-y-5">
                                        {/* Encabezado del curso + Nota total del curso */}
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                                            <div>
                                                <h2 className="text-lg font-extrabold text-[#051C33]">{course.title}</h2>
                                                <p className="text-xs text-[#4A607A] mt-0.5">
                                                    Módulos evaluados: <strong>{course.evaluated_modules_count}</strong> de <strong>{course.total_modules_count}</strong>
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="bg-blue-50 border border-blue-100 px-4 py-2.5 rounded-xl text-right">
                                                    <span className="block text-[11px] font-semibold text-[#4A607A] uppercase">Nota Total del Curso</span>
                                                    <span className="text-base font-extrabold text-[#0066FF]">
                                                        {formatScore(course.course_score)}
                                                    </span>
                                                </div>

                                                <Link
                                                    href={route('student.courses.show', course.id)}
                                                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#051C33] text-xs font-semibold rounded-xl transition whitespace-nowrap"
                                                >
                                                    Ver Curso
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Desglose por módulo */}
                                        {course.modules && course.modules.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="border-b border-slate-100 text-[11px] uppercase text-[#4A607A]">
                                                            <th className="py-2.5 px-3 font-bold">Módulo</th>
                                                            <th className="py-2.5 px-3 font-bold">Estado</th>
                                                            <th className="py-2.5 px-3 font-bold">Intentos</th>
                                                            <th className="py-2.5 px-3 font-bold text-right">Calificación</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100 text-xs">
                                                        {course.modules.map((mod) => (
                                                            <tr key={mod.id} className="hover:bg-slate-50/70">
                                                                <td className="py-3 px-3 font-bold text-[#051C33]">{mod.title}</td>
                                                                <td className="py-3 px-3">
                                                                    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                                                        mod.score !== null
                                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                                    }`}>
                                                                        {mod.status}
                                                                    </span>
                                                                </td>
                                                                <td className="py-3 px-3 text-[#4A607A]">{mod.attempts_count}</td>
                                                                <td className="py-3 px-3 text-right font-extrabold text-[#051C33]">
                                                                    {formatScore(mod.score)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-[#4A607A]">Este curso aún no tiene módulos registrados.</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-blue-100 shadow-lg p-6 text-center">
                                <p className="text-sm text-[#4A607A]">Aún no tienes cursos asignados ni calificaciones registradas.</p>
                            </div>
                        )}
                    </main>

                    <footer className="h-10 bg-white border-t border-slate-100"></footer>
                </div>
            </div>
        </>
    );
}