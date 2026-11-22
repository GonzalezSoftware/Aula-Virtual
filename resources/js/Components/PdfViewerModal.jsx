import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function PdfViewerModal({ pdfUrl, title, onClose }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loadingPdf, setLoadingPdf] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    const pdfDocRef = useRef(null);
    const renderTaskRef = useRef(null);
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    // Bloquear clic derecho, atajos de teclado y copiado
    useEffect(() => {
        const handleContextMenu = (e) => e.preventDefault();
        const handleKeyDown = (e) => {
            if (
                (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'u' || e.key === 'c' || e.key === 'a')) ||
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i'))
            ) {
                e.preventDefault();
            }
        };

        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Cargar documento PDF con pdfjs-dist
    useEffect(() => {
        let cancelled = false;
        setLoadingPdf(true);
        setErrorMsg('');
        setCurrentPage(1);

        const loadingTask = pdfjsLib.getDocument({
            url: pdfUrl,
            withCredentials: true,
        });

        loadingTask.promise
            .then((doc) => {
                if (cancelled) return;
                pdfDocRef.current = doc;
                setTotalPages(doc.numPages || 1);
                setLoadingPdf(false);
            })
            .catch(() => {
                if (cancelled) return;
                setErrorMsg('No se pudo cargar el documento PDF en el visor.');
                setLoadingPdf(false);
            });

        return () => {
            cancelled = true;
            if (renderTaskRef.current?.cancel) {
                renderTaskRef.current.cancel();
            }
            if (pdfDocRef.current?.destroy) {
                pdfDocRef.current.destroy();
                pdfDocRef.current = null;
            }
        };
    }, [pdfUrl]);

    // Renderizar la página actual en el canvas ajustada al ancho disponible
    useEffect(() => {
        const doc = pdfDocRef.current;
        const canvas = canvasRef.current;
        const container = containerRef.current;

        if (!doc || !canvas || !container || loadingPdf || errorMsg) return;

        let cancelled = false;

        const renderPage = async () => {
            try {
                if (renderTaskRef.current?.cancel) {
                    renderTaskRef.current.cancel();
                }

                const page = await doc.getPage(currentPage);
                if (cancelled) return;

                const availableWidth = Math.max(container.clientWidth - 16, 260);
                const unscaledViewport = page.getViewport({ scale: 1 });
                const scale = availableWidth / unscaledViewport.width;
                const viewport = page.getViewport({ scale });

                const context = canvas.getContext('2d');
                canvas.width = Math.floor(viewport.width);
                canvas.height = Math.floor(viewport.height);

                const renderTask = page.render({
                    canvasContext: context,
                    viewport,
                });
                renderTaskRef.current = renderTask;

                await renderTask.promise;
            } catch (err) {
                if (err?.name !== 'RenderingCancelledException' && !cancelled) {
                    setErrorMsg('Ocurrió un error al renderizar la página del PDF.');
                }
            }
        };

        renderPage();

        const handleResize = () => {
            if (!cancelled) renderPage();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            cancelled = true;
            window.removeEventListener('resize', handleResize);
        };
    }, [currentPage, loadingPdf, errorMsg]);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4 select-none">
            <div className="bg-white w-full max-w-5xl h-[94vh] sm:h-[92vh] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-blue-100">
                
                {/* Header corporativo con Paginación Integrada */}
                <div className="px-3.5 sm:px-6 py-3 sm:py-3.5 bg-[#051C33] text-white flex flex-col sm:flex-row justify-between items-center gap-2.5 sm:gap-3 select-none">
                    <h3 className="font-extrabold text-xs sm:text-sm tracking-tight truncate max-w-full sm:max-w-md text-white text-center sm:text-left">
                        📖 {title}
                    </h3>

                    {/* Controles de Paginación Centrales */}
                    <div className="flex items-center justify-center gap-2 sm:gap-3 bg-slate-800/80 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-700 w-full sm:w-auto">
                        <button 
                            type="button"
                            onClick={prevPage}
                            disabled={currentPage === 1 || loadingPdf}
                            className="px-2.5 sm:px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white text-xs font-semibold transition cursor-pointer shrink-0"
                        >
                            Anterior
                        </button>
                        <span className="text-[11px] sm:text-xs font-medium text-slate-200 whitespace-nowrap">
                            Página <strong className="text-white">{currentPage}</strong> de <strong className="text-white">{totalPages}</strong>
                        </span>
                        <button 
                            type="button"
                            onClick={nextPage}
                            disabled={currentPage >= totalPages || loadingPdf}
                            className="px-2.5 sm:px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white text-xs font-semibold transition cursor-pointer shrink-0"
                        >
                            Siguiente
                        </button>
                    </div>

                    <button 
                        type="button"
                        onClick={onClose}
                        className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-red-500/25 hover:bg-red-600 text-red-200 hover:text-white text-xs font-semibold transition cursor-pointer shrink-0"
                    >
                        Cerrar Visor
                    </button>
                </div>

                {/* Contenedor principal con visor paginado y capa de seguridad */}
                <div
                    ref={containerRef}
                    className="flex-1 bg-slate-950 relative overflow-y-auto overflow-x-hidden select-none flex items-start justify-center p-2 sm:p-4"
                >
                    {/* CAPA INVISIBLE ANTIRROBO (z-20) */}
                    <div 
                        className="absolute inset-0 z-20 bg-transparent cursor-default"
                        onMouseDown={(e) => e.preventDefault()}
                        onSelectStart={(e) => e.preventDefault()}
                        onContextMenu={(e) => e.preventDefault()}
                    />

                    {loadingPdf && (
                        <div className="my-auto text-xs sm:text-sm font-medium text-slate-300 z-10">
                            Cargando documento PDF...
                        </div>
                    )}

                    {!loadingPdf && errorMsg && (
                        <div className="my-auto px-4 py-3 rounded-xl bg-red-950/70 border border-red-500/40 text-xs sm:text-sm text-red-200 z-10 text-center">
                            {errorMsg}
                        </div>
                    )}

                    <canvas
                        ref={canvasRef}
                        className={`max-w-full h-auto rounded-lg shadow-lg bg-white pointer-events-none select-none z-10 ${
                            loadingPdf || errorMsg ? 'hidden' : 'block'
                        }`}
                    />
                </div>

            </div>
        </div>
    );
}