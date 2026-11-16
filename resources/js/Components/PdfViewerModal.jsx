import { useEffect, useRef } from 'react';

export default function PdfViewerModal({ pdfUrl, title, onClose }) {
    const containerRef = useRef(null);

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

    // Manejar el desplazamiento vertical con la rueda del ratón de forma fluida
    const handleWheel = (e) => {
        if (containerRef.current) {
            containerRef.current.scrollTop += e.deltaY;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 select-none">
            <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-blue-100">
                
                {/* Header corporativo */}
                <div className="px-6 py-4 bg-[#051C33] text-white flex justify-between items-center select-none">
                    <h3 className="font-extrabold text-base tracking-tight truncate max-w-2xl text-white">
                        📖 {title} <span className="text-xs text-blue-300 font-normal ml-2">(Blindado contra copia)</span>
                    </h3>
                    <button 
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-xl bg-red-500/25 hover:bg-red-600 text-red-200 hover:text-white text-xs font-semibold transition"
                    >
                        Cerrar Visor
                    </button>
                </div>

                {/* Contenedor con barra de desplazamiento única y capa de bloqueo de eventos */}
                <div 
                    ref={containerRef}
                    onWheel={handleWheel}
                    className="flex-1 bg-slate-900 relative overflow-y-auto select-none"
                    style={{ scrollbarWidth: 'thin' }}
                >
                    {/* Contenedor interno extendido para permitir el scroll del sistema */}
                    <div className="w-full h-[140%] relative select-none">
                        
                        {/* 🛡️ CAPA INVISIBLE ANTIRROBO ABSOLUTA (z-20): 
                            Se ubica encima del iframe con 'pointer-events-auto' para atrapar 
                            cualquier intento de clic, arrastre o selección de texto con el mouse. */}
                        <div 
                            className="absolute inset-0 z-20 bg-transparent cursor-default"
                            onMouseDown={(e) => e.preventDefault()}
                            onSelectStart={(e) => e.preventDefault()}
                            onContextMenu={(e) => e.preventDefault()}
                        />

                        {/* El iframe del PDF se encuentra debajo con los eventos de puntero desactivados 
                            para que no interfiera con el bloqueo de selección del navegador. */}
                        <iframe 
                            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} 
                            className="w-full h-full border-none select-none pointer-events-none"
                            title={title}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}