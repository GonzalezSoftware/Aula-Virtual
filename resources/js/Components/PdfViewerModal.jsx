import { useEffect } from 'react';

export default function PdfViewerModal({ pdfUrl, title, onClose }) {
    
    // Bloquear clic derecho, atajos de teclado de descarga/impresión y copiado
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 select-none">
            <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-blue-100">
                
                {/* Header corporativo */}
                <div className="px-6 py-4 bg-[#051C33] text-white flex justify-between items-center select-none">
                    <h3 className="font-extrabold text-base tracking-tight truncate max-w-2xl text-white">
                        📖 {title} <span className="text-xs text-blue-300 font-normal ml-2">(Protegido contra copia)</span>
                    </h3>
                    <button 
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-600 text-red-200 hover:text-white text-xs font-semibold transition"
                    >
                        Cerrar Visor
                    </button>
                </div>

                {/* Contenedor limpio con una sola barra de desplazamiento */}
                <div className="flex-1 bg-slate-900 relative overflow-hidden select-none">
                    <style>{`
                        .protected-pdf-frame {
                            -webkit-user-select: none !important;
                            -moz-user-select: none !important;
                            -ms-user-select: none !important;
                            user-select: none !important;
                            pointer-events: auto;
                        }
                    `}</style>
                    
                    {/* Usamos un parámetro de vista que ajusta el ancho y deshabilita elementos flotantes */}
                    <iframe 
                        src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&statusbar=0&messages=0`} 
                        className="protected-pdf-frame w-full h-full border-none"
                        title={title}
                    />
                </div>

            </div>
        </div>
    );
}