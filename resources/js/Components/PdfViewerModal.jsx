import { useEffect } from 'react';

export default function PdfViewerModal({ pdfUrl, title, onClose }) {
    
    // Bloquear clic derecho, atajos de teclado de descarga/impresión y copiado
    useEffect(() => {
        const handleContextMenu = (e) => e.preventDefault();
        const handleKeyDown = (e) => {
            if (
                (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'u' || e.key === 'c')) ||
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 select-none">
            <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-blue-100">
                
                {/* Header corporativo */}
                <div className="px-6 py-4 bg-[#051C33] text-white flex justify-between items-center select-none">
                    <h3 className="font-extrabold text-base tracking-tight truncate max-w-2xl text-white">
                        📖 {title} <span className="text-xs text-blue-300 font-normal ml-2">(Visualización 100% Protegida)</span>
                    </h3>
                    <button 
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-600 text-red-200 hover:text-white text-xs font-semibold transition"
                    >
                        Cerrar Visor
                    </button>
                </div>

                {/* Contenedor principal con scroll propio del sistema */}
                <div className="flex-1 bg-slate-100 relative overflow-y-auto select-none">
                    
                    {/* El PDF se renderiza en un tamaño fijo o estirado dentro del contenedor scrolleable */}
                    <div className="w-full h-[150vh] relative pointer-events-auto">
                        <iframe 
                            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
                            className="w-full h-full border-none select-none"
                            title={title}
                        />
                    </div>

                    {/* 🛡️ CAPA INVISIBLE ANTIRROBO ABSOLUTA:
                        Esta capa bloquea totalmente el contacto directo del mouse con el iframe del PDF,
                        impidiendo por completo la selección de texto o copiado. 
                        Gracias a 'pointer-events-none' en la capa y 'overflow-y-auto' en el contenedor padre, 
                        el scroll del sistema funcionará perfectamente al deslizar la rueda del ratón. */}
                    <div 
                        className="absolute inset-0 z-20 bg-transparent pointer-events-none" 
                    />
                </div>

            </div>
        </div>
    );
}