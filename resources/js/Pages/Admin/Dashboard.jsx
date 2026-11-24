import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import AdminSidebar from '@/Components/AdminSidebar';

export default function Dashboard({
    auth,
    stats = {
        pending_students: 0,
        accepted_students: 0,
        courses_count: 0,
        students_with_courses: 0,
        assigned_course_slots: 0,
        total_money: 0,
    },
    courseChartData = [],
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [chartMetric, setChartMetric] = useState('students'); // 'students' | 'revenue'

    const pendingCount = Number(stats.pending_students || 0);
    const acceptedCount = Number(stats.accepted_students || 0);
    const coursesCount = Number(stats.courses_count || 0);
    const studentsWithCoursesCount = Number(stats.students_with_courses || 0);
    const assignedCourseSlots = Number(stats.assigned_course_slots || 0);
    const totalMoney = Number(stats.total_money || 0);

    const acceptedWithoutCourses = Math.max(acceptedCount - studentsWithCoursesCount, 0);
    const totalStudentsTracked = pendingCount + acceptedCount;

    // Cálculos para gráfico circular (SVG Donut)
    const radius = 54;
    const circumference = 2 * Math.PI * radius;

    const pendingRatio = totalStudentsTracked > 0 ? pendingCount / totalStudentsTracked : 0;
    const activeWithCoursesRatio = totalStudentsTracked > 0 ? studentsWithCoursesCount / totalStudentsTracked : 0;
    const activeWithoutCoursesRatio = totalStudentsTracked > 0 ? acceptedWithoutCourses / totalStudentsTracked : 0;

    const pendingDash = pendingRatio * circumference;
    const withCoursesDash = activeWithCoursesRatio * circumference;
    const withoutCoursesDash = activeWithoutCoursesRatio * circumference;

    // Máximo para barras del gráfico de cursos
    const maxCourseValue = Math.max(
        1,
        ...courseChartData.map((c) =>
            chartMetric === 'students' ? Number(c.students_count || 0) : Number(c.revenue || 0)
        )
    );

    const formatMoney = (amount) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount);

    return (
        <>
            <Head title="Panel de Administración - Aula Virtual" />

            <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] font-['Poppins'] flex">
                <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeMenu="dashboard" />

                <div className="flex-1 flex flex-col justify-between min-h-screen overflow-x-hidden min-w-0">
                    {/* ENCABEZADO SUPERIOR */}
                    <header className="w-full bg-white/95 backdrop-blur-md border-b border-blue-100 px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sticky top-0 z-20 shadow-sm">
                        <h2 className="text-base sm:text-lg font-extrabold text-[#051C33] tracking-tight truncate">
                            Dashboard Admin
                        </h2>

                        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                            <div className="text-right hidden sm:block">
                                <span className="text-xs text-[#4A607A] block">Administrador Maestro</span>
                                <span className="text-sm font-bold text-[#051C33]">{auth?.user?.name || 'Administrador'}</span>
                            </div>

                            <Link
                                href={route('admin.logout')}
                                method="post"
                                as="button"
                                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm font-semibold hover:bg-red-600 hover:text-white transition flex items-center gap-2 shadow-sm whitespace-nowrap"
                            >
                                <span>Cerrar Sesión</span>
                            </Link>
                        </div>
                    </header>

                    {/* CONTENIDO PRINCIPAL */}
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full flex-grow space-y-6 sm:space-y-8">
                        {/* TÍTULO Y SUBTÍTULO */}
                        <div>
                            <h1 className="text-xl sm:text-2xl font-extrabold text-[#051C33]">
                                Resumen General de la Plataforma
                            </h1>
                            <p className="text-xs sm:text-sm text-[#4A607A] mt-0.5">
                                Indicadores en tiempo real de estudiantes, cursos y cálculo fijo de $10 por curso asignado.
                            </p>
                        </div>

                        {/* 4 TARJETAS DE MÉTRICAS PRINCIPALES */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                            {/* 1. Estudiantes en espera */}
                            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-blue-100 shadow-xl shadow-blue-900/5 flex flex-col justify-between">
                                <div className="flex items-center justify-between gap-3 mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                                        Pendientes
                                    </span>
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#051C33]">{pendingCount}</h3>
                                    <p className="text-xs sm:text-sm font-medium text-[#4A607A] mt-1">
                                        Cantidad de estudiantes en espera
                                    </p>
                                </div>
                            </div>

                            {/* 2. Estudiantes aceptados */}
                            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-blue-100 shadow-xl shadow-blue-900/5 flex flex-col justify-between">
                                <div className="flex items-center justify-between gap-3 mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                                        Activos
                                    </span>
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#051C33]">{acceptedCount}</h3>
                                    <p className="text-xs sm:text-sm font-medium text-[#4A607A] mt-1">
                                        Cantidad de estudiantes aceptados
                                    </p>
                                </div>
                            </div>

                            {/* 3. Cantidad de Cursos */}
                            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-blue-100 shadow-xl shadow-blue-900/5 flex flex-col justify-between">
                                <div className="flex items-center justify-between gap-3 mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-[#0066FF] bg-[#E3F2FD] border border-blue-200 px-2.5 py-1 rounded-full">
                                        Catálogo
                                    </span>
                                    <div className="w-10 h-10 rounded-xl bg-[#E3F2FD] text-[#0066FF] flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#051C33]">{coursesCount}</h3>
                                    <p className="text-xs sm:text-sm font-medium text-[#4A607A] mt-1">
                                        Cantidad de Cursos
                                    </p>
                                </div>
                            </div>

                            {/* 4. Cantidad de dinero ($10 por estudiante asignado a curso) */}
                            <div className="bg-gradient-to-br from-[#051C33] to-[#0A3266] text-white p-5 sm:p-6 rounded-2xl border border-blue-900 shadow-xl shadow-blue-900/15 flex flex-col justify-between">
                                <div className="flex items-center justify-between gap-3 mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-[#90caf9] bg-white/10 border border-white/15 px-2.5 py-1 rounded-full">
                                        $10 / Asignación
                                    </span>
                                    <div className="w-10 h-10 rounded-xl bg-[#0066FF] text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/30">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                                        {formatMoney(totalMoney)}
                                    </h3>
                                    <p className="text-xs sm:text-sm font-medium text-[#E3F2FD] mt-1">
                                        Cantidad de Dinero
                                    </p>
                                    <p className="text-[11px] text-[#90caf9] mt-1">
                                        {assignedCourseSlots} {assignedCourseSlots === 1 ? 'asignación activa' : 'asignaciones activas'} × $10 ({studentsWithCoursesCount} {studentsWithCoursesCount === 1 ? 'alumno' : 'alumnos'})
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* GRÁFICOS PROFESIONALES */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Gráfico 1: Dona de Estado de Estudiantes */}
                            <div className="lg:col-span-5 bg-white rounded-2xl sm:rounded-3xl border border-blue-100 shadow-xl shadow-blue-900/5 p-5 sm:p-7 flex flex-col justify-between">
                                <div className="mb-4">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0066FF]">
                                        Distribución Estudiantil
                                    </span>
                                    <h3 className="text-base sm:text-lg font-extrabold text-[#051C33] mt-0.5">
                                        Estado y Asignación de Alumnos
                                    </h3>
                                </div>

                                <div className="flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-6 my-auto py-2">
                                    <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                                        <svg className="w-40 h-40 -rotate-90" viewBox="0 0 140 140">
                                            <circle
                                                cx="70"
                                                cy="70"
                                                r={radius}
                                                fill="transparent"
                                                stroke="#E2E8F0"
                                                strokeWidth="16"
                                            />
                                            <circle
                                                cx="70"
                                                cy="70"
                                                r={radius}
                                                fill="transparent"
                                                stroke="#0066FF"
                                                strokeWidth="16"
                                                strokeDasharray={`${withCoursesDash} ${circumference}`}
                                                strokeDashoffset={0}
                                            />
                                            <circle
                                                cx="70"
                                                cy="70"
                                                r={radius}
                                                fill="transparent"
                                                stroke="#38BDF8"
                                                strokeWidth="16"
                                                strokeDasharray={`${withoutCoursesDash} ${circumference}`}
                                                strokeDashoffset={-withCoursesDash}
                                            />
                                            <circle
                                                cx="70"
                                                cy="70"
                                                r={radius}
                                                fill="transparent"
                                                stroke="#F59E0B"
                                                strokeWidth="16"
                                                strokeDasharray={`${pendingDash} ${circumference}`}
                                                strokeDashoffset={-(withCoursesDash + withoutCoursesDash)}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                            <span className="text-xl sm:text-2xl font-extrabold text-[#051C33]">
                                                {totalStudentsTracked}
                                            </span>
                                            <span className="text-[11px] font-semibold text-[#4A607A]">Total Alumnos</span>
                                        </div>
                                    </div>

                                    <div className="w-full space-y-2.5 text-xs sm:text-sm">
                                        <div className="flex items-center justify-between bg-[#F8FAFC] px-3.5 py-2 rounded-xl border border-slate-100">
                                            <span className="flex items-center gap-2 font-semibold text-[#051C33]">
                                                <span className="w-3 h-3 rounded-full bg-[#0066FF]"></span>
                                                Aceptados con cursos
                                            </span>
                                            <span className="font-extrabold text-[#0066FF]">{studentsWithCoursesCount}</span>
                                        </div>
                                        <div className="flex items-center justify-between bg-[#F8FAFC] px-3.5 py-2 rounded-xl border border-slate-100">
                                            <span className="flex items-center gap-2 font-semibold text-[#051C33]">
                                                <span className="w-3 h-3 rounded-full bg-[#38BDF8]"></span>
                                                Aceptados sin cursos ($0)
                                            </span>
                                            <span className="font-extrabold text-[#0A2540]">{acceptedWithoutCourses}</span>
                                        </div>
                                        <div className="flex items-center justify-between bg-[#F8FAFC] px-3.5 py-2 rounded-xl border border-slate-100">
                                            <span className="flex items-center gap-2 font-semibold text-[#051C33]">
                                                <span className="w-3 h-3 rounded-full bg-[#F59E0B]"></span>
                                                En espera de aprobación
                                            </span>
                                            <span className="font-extrabold text-amber-600">{pendingCount}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Gráfico 2: Barras por Curso */}
                            <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl border border-blue-100 shadow-xl shadow-blue-900/5 p-5 sm:p-7 flex flex-col justify-between">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                                    <div>
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#0066FF]">
                                            Rendimiento por Curso
                                        </span>
                                        <h3 className="text-base sm:text-lg font-extrabold text-[#051C33] mt-0.5">
                                            {chartMetric === 'students'
                                                ? 'Estudiantes Asignados por Curso'
                                                : 'Monto por Curso ($10 por Estudiante Asignado)'}
                                        </h3>
                                    </div>

                                    <div className="inline-flex rounded-xl bg-[#F0F6FF] p-1 border border-blue-100 self-start">
                                        <button
                                            type="button"
                                            onClick={() => setChartMetric('students')}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                                chartMetric === 'students'
                                                    ? 'bg-[#0066FF] text-white shadow-xs'
                                                    : 'text-[#4A607A] hover:text-[#051C33]'
                                            }`}
                                        >
                                            Estudiantes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setChartMetric('revenue')}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                                chartMetric === 'revenue'
                                                    ? 'bg-[#0066FF] text-white shadow-xs'
                                                    : 'text-[#4A607A] hover:text-[#051C33]'
                                            }`}
                                        >
                                            Dinero ($10)
                                        </button>
                                    </div>
                                </div>

                                {courseChartData.length === 0 ? (
                                    <div className="py-14 text-center text-xs sm:text-sm text-[#4A607A] bg-[#F8FAFC] rounded-2xl border border-dashed border-blue-200">
                                        Aún no hay cursos registrados para graficar.
                                    </div>
                                ) : (
                                    <div className="space-y-4 my-auto">
                                        {courseChartData.map((course) => {
                                            const rawValue =
                                                chartMetric === 'students'
                                                    ? Number(course.students_count || 0)
                                                    : Number(course.revenue || 0);
                                            const widthPercent = Math.max(
                                                4,
                                                Math.round((rawValue / maxCourseValue) * 100)
                                            );

                                            return (
                                                <div key={course.id} className="space-y-1.5">
                                                    <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                                                        <span className="font-bold text-[#051C33] truncate">
                                                            {course.title}
                                                        </span>
                                                        <span className="font-extrabold text-[#0066FF] shrink-0">
                                                            {chartMetric === 'students'
                                                                ? `${rawValue} ${rawValue === 1 ? 'alumno' : 'alumnos'}`
                                                                : formatMoney(rawValue)}
                                                        </span>
                                                    </div>
                                                    <div className="w-full h-3 rounded-full bg-[#F0F6FF] overflow-hidden border border-blue-100">
                                                        <div
                                                            className="h-full rounded-full bg-gradient-to-r from-[#0066FF] to-[#3385FF] transition-all duration-500"
                                                            style={{ width: `${widthPercent}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>

                    <footer className="h-12 bg-white border-t border-slate-100"></footer>
                </div>
            </div>
        </>
    );
}