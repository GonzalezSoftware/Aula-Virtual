import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import AdminSidebar from '@/Components/AdminSidebar';

export default function Dashboard({ auth }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <>
            <Head title="Panel de Administración - Aula Virtual" />

            <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] font-['Poppins'] flex">
                <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeMenu="dashboard" />

                <div className="flex-1 flex flex-col justify-between min-h-screen overflow-x-hidden min-w-0">
                    <header className="w-full bg-white/95 backdrop-blur-md border-b border-blue-100 px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sticky top-0 z-10 shadow-sm">
                        <h2 className="text-base sm:text-lg font-extrabold text-[#051C33] tracking-tight truncate">Dashboard Admin</h2>
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

                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full flex-grow">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            <div className="bg-white p-5 sm:p-7 rounded-2xl border border-blue-100 shadow-xl shadow-blue-900/5">
                                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#051C33] mb-1">0</h3>
                                <p className="text-xs sm:text-sm font-medium text-[#4A607A]">Cantidad de Estudiantes</p>
                            </div>
                            <div className="bg-white p-5 sm:p-7 rounded-2xl border border-blue-100 shadow-xl shadow-blue-900/5">
                                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#051C33] mb-1">0</h3>
                                <p className="text-xs sm:text-sm font-medium text-[#4A607A]">Cantidad de Cursos</p>
                            </div>
                            <div className="bg-white p-5 sm:p-7 rounded-2xl border border-blue-100 shadow-xl shadow-blue-900/5 sm:col-span-2 lg:col-span-1">
                                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#051C33] mb-1">$0.00</h3>
                                <p className="text-xs sm:text-sm font-medium text-[#4A607A]">Cantidad de Dinero</p>
                            </div>
                        </div>
                    </main>
                    <footer className="h-12 bg-white border-t border-slate-100"></footer>
                </div>
            </div>
        </>
    );
}