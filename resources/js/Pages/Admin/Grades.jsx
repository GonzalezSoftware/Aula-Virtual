import React, { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminSidebar from '@/Components/AdminSidebar';

export default function AdminGrades({ auth, records = [], courses = [] }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedCourseId, setSelectedCourseId] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredRecords = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();

        return records.filter((item) => {
            const matchesCourse =
                selectedCourseId === 'all' || Number(item.course_id) === Number(selectedCourseId);

            if (!matchesCourse) return false;
            if (!q) return true;

            const haystack = [
                item.student_name,
                item.cedula,
                item.email,
                item.course_title,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return haystack.includes(q);
        });
    }, [records, selectedCourseId, searchQuery]);

    const summary = useMemo(() => {
        const totalAssignments = filteredRecords.length;
        const uniqueStudents = new Set(filteredRecords.map((r) => r.student_id)).size;
        const scoredItems = filteredRecords.filter((r) => r.course_score !== null && r.course_score !== undefined);
        const averageScore =
            scoredItems.length > 0
                ? (
                      scoredItems.reduce((acc, r) => acc + Number(r.course_score), 0) /
                      scoredItems.length
                  ).toFixed(2)
                : '0.00';

        return {
            totalAssignments,
            uniqueStudents,
            averageScore,
        };
    }, [filteredRecords]);

    return (
        <>
            <Head title="Calificaciones de Estudiantes - Panel Admin" />

            <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] font-['Poppins'] flex">
                <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeMenu="grades" />

                <div className="flex-1 flex flex-col justify-between min-h-screen overflow-x-hidden min-w-0">
                    <header className="w-full bg-white/95 backdrop-blur-md border-b border-blue-100 px-8 h-20 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                        <h2 className="text-lg font-extrabold text-[#051C33] tracking-tight">Calificaciones de Estudiantes</h2>
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

                    <main className="max-w-7xl mx-auto px-8 py-10 w-full flex-grow space-y-6">
                        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-900/5 border border-blue-100 space-y-6">
                            <div className="border-b border-blue-100 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-extrabold text-[#051C33]">
                                        Notas por Estudiante y Curso Asignado
                                    </h1>
                                    <p className="text-sm text-[#4A607A] mt-1">
                                        Consulta las calificaciones sobre 20, intentos realizados y promedios de cada estudiante en los cursos que tiene asignados.
                                    </p>
                                </div>
                            </div>

                            {/* Tarjetas de resumen */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-[#F8FAFC] border border-blue-100 rounded-2xl p-4">
                                    <span className="text-xs font-semibold text-[#4A607A] block">Estudiantes listados</span>
                                    <span className="text-2xl font-extrabold text-[#051C33] mt-1 block">{summary.uniqueStudents}</span>
                                </div>
                                <div className="bg-[#F8FAFC] border border-blue-100 rounded-2xl p-4">
                                    <span className="text-xs font-semibold text-[#4A607A] block">Asignaciones curso-estudiante</span>
                                    <span className="text-2xl font-extrabold text-[#051C33] mt-1 block">{summary.totalAssignments}</span>
                                </div>
                                <div className="bg-[#F8FAFC] border border-blue-100 rounded-2xl p-4">
                                    <span className="text-xs font-semibold text-[#4A607A] block">Promedio general (sobre 20)</span>
                                    <span className="text-2xl font-extrabold text-[#0066FF] mt-1 block">{summary.averageScore} / 20</span>
                                </div>
                            </div>

                            {/* Filtros */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#F8FAFC] p-4 rounded-2xl border border-blue-100">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-[#051C33] mb-1">
                                        Buscar estudiante (nombre, cédula o correo)
                                    </label>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Ej. Pérez, 12345678, correo@ejemplo.com..."
                                        className="w-full border border-blue-200/80 rounded-xl px-4 py-2 text-xs outline-none bg-white text-[#051C33]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#051C33] mb-1">
                                        Filtrar por curso asignado
                                    </label>
                                    <select
                                        value={selectedCourseId}
                                        onChange={(e) => setSelectedCourseId(e.target.value)}
                                        className="w-full border border-blue-200/80 rounded-xl px-3 py-2 text-xs outline-none bg-white text-[#051C33]"
                                    >
                                        <option value="all">Todos los cursos</option>
                                        {courses.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Listado de calificaciones */}
                            {filteredRecords.length === 0 ? (
                                <div className="text-center py-12 bg-[#F8FAFC] rounded-2xl border border-blue-100">
                                    <p className="text-sm text-[#4A607A]">
                                        No se encontraron registros de calificaciones para los filtros seleccionados.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredRecords.map((item) => {
                                        const hasAverage = item.course_score !== null && item.course_score !== undefined;
                                        const isApproved = hasAverage && Number(item.course_score) >= 10;

                                        return (
                                            <div
                                                key={`${item.student_id}-${item.course_id}`}
                                                className="border border-blue-100 rounded-2xl p-6 bg-[#F8FAFC] space-y-4 shadow-sm"
                                            >
                                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-blue-100 pb-4">
                                                    <div className="space-y-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <h3 className="text-base font-extrabold text-[#051C33]">
                                                                {item.student_name}
                                                            </h3>
                                                            {item.cedula && (
                                                                <span className="text-[11px] bg-white text-[#4A607A] px-2.5 py-0.5 rounded-full border border-blue-100 font-medium">
                                                                    C.I.: {item.cedula}
                                                                </span>
                                                            )}
                                                            {item.en_espera && (
                                                                <span className="text-[11px] bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-semibold">
                                                                    En espera
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-[#4A607A]">
                                                            {item.email} • <strong className="text-[#051C33]">Curso:</strong> {item.course_title}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <span className="text-xs bg-blue-50 text-[#0066FF] px-3 py-1.5 rounded-xl font-semibold border border-blue-100">
                                                            Módulos evaluados: {item.evaluated_modules_count}/{item.total_modules_count}
                                                        </span>
                                                        <span
                                                            className={`text-xs px-3.5 py-1.5 rounded-xl font-extrabold border ${
                                                                !hasAverage
                                                                    ? 'bg-slate-100 text-slate-600 border-slate-200'
                                                                    : isApproved
                                                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                                      : 'bg-red-50 text-red-700 border-red-200'
                                                            }`}
                                                        >
                                                            Promedio: {hasAverage ? `${Number(item.course_score).toFixed(2)} / 20` : 'Sin nota'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Detalle por módulo */}
                                                {item.modules && item.modules.length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                        {item.modules.map((mod) => {
                                                            const modHasScore = mod.score !== null && mod.score !== undefined;
                                                            return (
                                                                <div
                                                                    key={mod.id}
                                                                    className="bg-white rounded-xl p-4 border border-blue-100 flex flex-col justify-between gap-2"
                                                                >
                                                                    <div>
                                                                        <p className="text-xs font-bold text-[#051C33] line-clamp-1">
                                                                            {mod.title}
                                                                        </p>
                                                                        <p className="text-[11px] text-[#4A607A] mt-0.5">
                                                                            Intentos: {mod.attempts_count} / {mod.max_attempts} • {mod.status}
                                                                        </p>
                                                                    </div>
                                                                    <div className="pt-1 flex items-center justify-between">
                                                                        <span className="text-[11px] text-[#4A607A]">Calificación</span>
                                                                        <span className="text-xs font-extrabold text-[#051C33]">
                                                                            {modHasScore ? `${Number(mod.score).toFixed(2)} / 20` : '—'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-[#4A607A]">Este curso no tiene módulos registrados.</p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </main>

                    <footer className="h-12 bg-white border-t border-blue-100"></footer>
                </div>
            </div>
        </>
    );
}