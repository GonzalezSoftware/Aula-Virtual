import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import StudentSidebar from '@/Components/StudentSidebar';

export default function ModuleView({ auth, course, module }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <>
            <Head title={`${module.title} - ${course.title}`} />

            <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] font-['Poppins'] flex">
                <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeMenu="dashboard" />

                <div className="flex-1 flex flex-col justify-between min-h-screen overflow-x-hidden">
                    <header className="w-full bg-white/95 backdrop-blur-md border-b border-blue-100 px-8 h-20 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                        <h2 className="text-lg font-extrabold text-[#051C33] tracking-tight">Contenido del Módulo</h2>
                        <div className="flex items-center gap-5">
                            <div className="text-right hidden sm:block">
                                <span className="text-xs text-[#4A607A] block">Estudiante Activo</span>
                                <span className="text-sm font-bold text-[#051C33]">{auth?.user?.name || 'Estudiante'}</span>
                            </div>
                            <Link
                                href={route('student.logout')}
                                method="post"
                                as="button"
                                className="px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-600 hover:text-white transition flex items-center gap-2 shadow-sm"
                            >
                                <span>Cerrar Sesión</span>
                            </Link>
                        </div>
                    </header>

                    <main className="max-w-7xl mx-auto px-8 py-10 w-full flex-grow space-y-8">
                        <div>
                            <Link href={route('student.courses.show', course.id)} className="inline-flex items-center gap-2 text-xs font-bold text-[#0066FF] bg-white px-4 py-2.5 rounded-xl shadow-sm border border-blue-100">
                                Volver al curso: {course.title}
                            </Link>
                        </div>

                        <div className="bg-white rounded-3xl border border-blue-100 shadow-xl p-8">
                            <h1 className="text-2xl font-extrabold text-[#051C33] mb-2">{module.title}</h1>
                            <p className="text-sm text-[#4A607A]">{module.description}</p>
                        </div>

                        <div className="bg-white rounded-3xl border border-blue-100 shadow-xl p-8">
                            <h2 className="text-xl font-extrabold text-[#051C33] mb-6">Materiales y Recursos Académicos</h2>
                            {module.contents && module.contents.length > 0 ? (
                                <div className="space-y-6">
                                    {module.contents.map((content) => {
                                        const fileResource = content.file_url || content.file || content.path || content.file_path;
                                        const videoResource = content.video_url || content.url || content.link;
                                        return (
                                            <div key={content.id} className="bg-white rounded-2xl border border-blue-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                                <div>
                                                    <h3 className="font-extrabold text-[#051C33] text-lg">{content.title}</h3>
                                                    <p className="text-sm text-[#4A607A] mt-1">{content.body || content.description}</p>
                                                </div>
                                                <div className="flex gap-3">
                                                    {fileResource && (
                                                        <a href={fileResource.startsWith('http') ? fileResource : `/storage/${fileResource}`} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-xl bg-[#0066FF] text-white text-xs font-semibold">
                                                            Ver PDF
                                                        </a>
                                                    )}
                                                    {videoResource && (
                                                        <a href={videoResource} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-xl bg-slate-100 text-[#051C33] text-xs font-semibold">
                                                            Ver Video
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-[#4A607A]">No hay contenidos cargados.</p>
                            )}
                        </div>
                    </main>
                    <footer className="h-12 bg-white border-t border-slate-100"></footer>
                </div>
            </div>
        </>
    );
}