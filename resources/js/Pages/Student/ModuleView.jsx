import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import StudentSidebar from '@/Components/StudentSidebar';
import PdfViewerModal from '@/Components/PdfViewerModal';
import VideoPlayerModal from '@/Components/VideoPlayerModal';

export default function ModuleView({ auth, course, module }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    // Estado para controlar el PDF activo en el visor protegido
    const [activePdf, setActivePdf] = useState(null);

    const [activeVideo, setActiveVideo] = useState(null);

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
                        {/* Fechas de disponibilidad del módulo o curso */}
                        <div className="flex flex-wrap gap-4 text-xs text-[#4A607A] mt-2 bg-blue-50/50 p-3 rounded-xl border border-blue-50">
                            <span>📅 <strong>Inicio del Módulo:</strong> {module.start_date || course.start_date || 'No definida'}</span>
                            <span>🏁 <strong>Cierre del Módulo:</strong> {module.end_date || course.end_date || 'No definida'}</span>
                        </div>

                        {/* Materiales y Recursos Académicos */}
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
                                                        <button
                                                            onClick={() => setActivePdf({
                                                                url: route('student.contents.view-pdf', content.id),
                                                                title: content.title
                                                            })}
                                                            className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-semibold transition shadow-sm"
                                                        >
                                                            Ver PDF Seguro
                                                        </button>
                                                    )}
                                                    {videoResource && (
                                                        <button
                                                            onClick={() => setActiveVideo({
                                                                url: videoResource, // <-- Aquí pasa la URL directa que viene de tu base de datos
                                                                title: content.title
                                                            })}
                                                            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#051C33] text-xs font-semibold transition cursor-pointer"
                                                        >
                                                            Ver Video Seguro
                                                        </button>
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

                        {/* Sección de Exámenes y Evaluaciones */}
                        <div className="bg-white rounded-3xl border border-blue-100 shadow-xl p-8">
                            <h2 className="text-xl font-extrabold text-[#051C33] mb-6">Evaluación del Módulo</h2>
                            <div className="p-6 rounded-2xl border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h3 className="font-extrabold text-[#051C33] text-base">Prueba Interactiva</h3>
                                    <p className="text-xs text-[#4A607A] mt-0.5">Presenta tu evaluación con preguntas aleatorias y cronómetro.</p>
                                </div>
                                <Link
                                    href={route('student.courses.modules.exam', [course.id, module.id])}
                                    className="w-full sm:w-auto px-5 py-2.5 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/20 transition whitespace-nowrap text-center"
                                >
                                    Presentar Examen
                                </Link>
                            </div>
                        </div>

                    </main>

                    {/* Renderizar el Visor Protegido si hay un PDF activo */}
                    {activePdf && (
                        <PdfViewerModal
                            pdfUrl={activePdf.url}
                            title={activePdf.title}
                            onClose={() => setActivePdf(null)}
                        />
                    )}

                    {/* Renderizar el Reproductor de Video Protegido */}
                    {activeVideo && (
                        <VideoPlayerModal
                            videoUrl={activeVideo.url}
                            title={activeVideo.title}
                            onClose={() => setActiveVideo(null)}
                        />
                    )}

                    <footer className="h-12 bg-white border-t border-slate-100"></footer>
                </div>
            </div>
        </>
    );
}