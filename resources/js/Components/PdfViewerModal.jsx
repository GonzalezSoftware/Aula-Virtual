import { useEffect } from 'react';

export default function PdfViewerModal({ pdfUrl, title, onClose }) {
    
    // Bloquear clic derecho y atajos de teclado de descarga/impresión
    useEffect(() => {
        const handleContextMenu = (e) => e.preventDefault();
        const handleKeyDown = (e) => {
            if (
                (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'u')) ||
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-blue-100">
                
                {/* Header corporativo */}
                <div className="px-6 py-4 bg-[#051C33] text-white flex justify-between items-center">
                    <h3 className="font-extrabold text-base tracking-tight truncate max-w-2xl text-white">
                        📖 {title} <span className="text-xs text-blue-300 font-normal ml-2">(Visualización protegida)</span>
                    </h3>
                    <button 
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-600 text-red-200 hover:text-white text-xs font-semibold transition"
                    >
                        Cerrar Visor
                    </button>
                </div>

                {/* Contenedor del Visor */}
                <div className="flex-1 bg-slate-100 relative select-none">
                    <iframe 
                        src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
                        className="w-full h-full border-none select-none pointer-events-auto"
                        title={title}
                    />
                    <div className="absolute inset-0 pointer-events-none" />
                </div>

            </div>
        </div>
    );
}