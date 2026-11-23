import { useEffect, useState } from 'react';

export default function PdfViewerModal({ pdfUrl, title, onClose, contentId }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [imageSrc, setImageSrc] = useState('');
    const [loadingPage, setLoadingPage] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

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

    // Reiniciar a página 1 al abrir otro documento
    useEffect(() => {
        setCurrentPage(1);
        setTotalPages(1);
    }, [pdfUrl, contentId]);

    // Cargar la imagen de la página actual desde Laravel
    useEffect(() => {
        let revokedUrl = '';
        let cancelled = false;

        const fetchPageImage = async () => {
            setLoadingPage(true);
            setErrorMsg('');

            // Construye /student/contents/{id}/page/{currentPage} a partir de pdfUrl o contentId
            const pageUrl = contentId
                ? `/student/contents/${contentId}/page/${currentPage}`
                : `${pdfUrl.replace(/\/view-pdf\/?$/, '')}/page/${currentPage}`;

            try {
                const response = await fetch(pageUrl, {
                    credentials: 'same-origin',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });

                if (!response.ok) {
                    throw new Error('No se pudo cargar la página del documento.');
                }

                const headerTotal = parseInt(response.headers.get('X-Total-Pages') || '1', 10);
                const blob = await response.blob();
                if (cancelled) return;

                revokedUrl = URL.createObjectURL(blob);
                setImageSrc((prev) => {
                    if (prev) URL.revokeObjectURL(prev);
                    return revokedUrl;
                });
                if (!Number.isNaN(headerTotal) && headerTotal > 0) {
                    setTotalPages(headerTotal);
                }
                setLoadingPage(false);
            } catch (err) {
                if (cancelled) return;
                setErrorMsg(err?.message || 'Error al cargar la página.');
                setLoadingPage(false);
            }
        };

        fetchPageImage();

        return () => {
            cancelled = true;
            if (revokedUrl) {
                URL.revokeObjectURL(revokedUrl);
            }
        };
    }, [currentPage, pdfUrl, contentId]);

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
                            disabled={currentPage === 1 || loadingPage}
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
                            disabled={currentPage >= totalPages || loadingPage}
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

                {/* Contenedor principal con imagen de página y capa de seguridad */}
                <div className="flex-1 bg-slate-950 relative overflow-y-auto overflow-x-hidden select-none flex items-start justify-center p-2 sm:p-4">
                    
                    {/* CAPA INVISIBLE ANTIRROBO (z-20) */}
                    <div 
                        className="absolute inset-0 z-20 bg-transparent cursor-default"
                        onMouseDown={(e) => e.preventDefault()}
                        onSelectStart={(e) => e.preventDefault()}
                        onContextMenu={(e) => e.preventDefault()}
                    />

                    {loadingPage && (
                        <div className="my-auto text-xs sm:text-sm font-medium text-slate-300 z-10">
                            Cargando página {currentPage}...
                        </div>
                    )}

                    {!loadingPage && errorMsg && (
                        <div className="my-auto px-4 py-3 rounded-xl bg-red-950/70 border border-red-500/40 text-xs sm:text-sm text-red-200 z-10 text-center">
                            {errorMsg}
                        </div>
                    )}

                    {!loadingPage && !errorMsg && imageSrc && (
                        <img
                            src={imageSrc}
                            alt={`${title} - Página ${currentPage}`}
                            draggable={false}
                            className="max-w-full h-auto rounded-xl shadow-lg bg-white pointer-events-none select-none z-10"
                        />
                    )}
                </div>

            </div>
        </div>
    );
}