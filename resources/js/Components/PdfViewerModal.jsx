import { useEffect, useState } from 'react';

export default function PdfViewerModal({ pdfUrl, title, onClose }) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 15; // ⚠️ Puedes ajustar o dejar un número estándar de páginas estimado del documento

    // Bloquear clic derecho, atajos de teclado y copiado
    useEffect(() => {
        const handleContextMenu = (e) => e.preventDefault();
        const handleKeyDown = (e) => {
            if (
                (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'u' || e.key === 'c' || e.key === 'a')) ||
                (e.ctrlKey && e.shiftKey && e.key === 'I')
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

    // Funciones para cambiar de página de manera limpia
    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    // Construimos la URL dinámica asegurando que el visor renderice la página solicitada y se ajuste a la vista completa
    const securePdfSrc = `${pdfUrl}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=0&view=FitH,top`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 select-none">
            <div className="bg-white w-full max-w-5xl h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-blue-100">
                
                {/* Header corporativo con Paginación Integrada */}
                <div className="px-6 py-3.5 bg-[#051C33] text-white flex flex-col sm:flex-row justify-between items-center gap-3 select-none">
                    <h3 className="font-extrabold text-sm tracking-tight truncate max-w-md text-white">
                        📖 {title}
                    </h3>

                    {/* Controles de Paginación Centrales */}
                    <div className="flex items-center gap-3 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                        <button 
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white text-xs font-semibold transition cursor-pointer"
                        >
                            Anterior
                        </button>
                        <span className="text-xs font-medium text-slate-200">
                            Página <strong className="text-white">{currentPage}</strong> de <strong className="text-white">{totalPages}</strong>
                        </span>
                        <button 
                            onClick={nextPage}
                            disabled={currentPage >= totalPages}
                            className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white text-xs font-semibold transition cursor-pointer"
                        >
                            Siguiente
                        </button>
                    </div>

                    <button 
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-xl bg-red-500/25 hover:bg-red-600 text-red-200 hover:text-white text-xs font-semibold transition cursor-pointer"
                    >
                        Cerrar Visor
                    </button>
                </div>

                {/* Contenedor principal con visor paginado y capa de seguridad absoluta */}
                <div className="flex-1 bg-slate-900 relative overflow-hidden select-none flex items-center justify-center">
                    
                    {/* 🛡️ CAPA INVISIBLE ANTIRROBO ABSOLUTA (z-20): 
                        Bloquea cualquier intento de clic, arrastre o selección de texto sobre el documento. */}
                    <div 
                        className="absolute inset-0 z-20 bg-transparent cursor-default"
                        onMouseDown={(e) => e.preventDefault()}
                        onSelectStart={(e) => e.preventDefault()}
                        onContextMenu={(e) => e.preventDefault()}
                    />

                    {/* Iframe actualizado reactivamente con la URL y la página actual */}
                    <iframe 
                        key={currentPage} 
                        src={securePdfSrc} 
                        className="w-full h-full border-none select-none pointer-events-none bg-slate-800"
                        title={title}
                    />
                </div>

            </div>
        </div>
    );
}