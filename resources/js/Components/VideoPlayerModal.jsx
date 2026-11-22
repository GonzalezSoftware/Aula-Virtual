import { useEffect } from 'react';

export default function VideoPlayerModal({ videoUrl, title, onClose }) {
    
    // Bloquear clic derecho, atajos de teclado para inspeccionar código o copiar URLs
    useEffect(() => {
        const handleContextMenu = (e) => e.preventDefault();
        const handleKeyDown = (e) => {
            if (
                (e.ctrlKey && (e.key === 's' || e.key === 'u' || e.key === 'c' || e.key === 'i' || e.key === 'I')) ||
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'C')) ||
                e.key === 'F12'
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

    // Detectar si la URL es de YouTube o Vimeo para usar el reproductor embebido adecuado
    const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
    const isVimeo = videoUrl.includes('vimeo.com');

    // Función auxiliar para limpiar y formatear la URL de YouTube si es necesario
    const getEmbedUrl = (url) => {
        if (isYouTube) {
            let videoId = '';
            if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1]?.split('?')[0];
            } else if (url.includes('watch?v=')) {
                videoId = url.split('watch?v=')[1]?.split('&')[0];
            } else if (url.includes('embed/')) {
                videoId = url.split('embed/')[1]?.split('?')[0];
            }
            // Parámetros estrictos para ocultar marca de agua, recomendaciones y controles de compartir
            return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&controls=1`;
        }
        if (isVimeo) {
            const vimeoId = url.split('vimeo.com/')[1]?.split('?')[0];
            return `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`;
        }
        return url; // Si es un archivo de video directo (mp4, webm, etc.)
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 select-none">
            <div className="bg-slate-900 w-full max-w-5xl rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-700">
                
                {/* Header corporativo */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-[#051C33] text-white flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2.5 sm:gap-3 select-none">
                    <h3 className="font-extrabold text-xs sm:text-sm tracking-tight truncate max-w-full sm:max-w-xl text-white">
                        🎬 {title} <span className="text-[11px] sm:text-xs text-blue-400 font-normal ml-1.5 sm:ml-2">(Reproducción Protegida)</span>
                    </h3>
                    <button 
                        onClick={onClose}
                        className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-red-500/25 hover:bg-red-600 text-red-200 hover:text-white text-xs font-semibold transition cursor-pointer shrink-0"
                    >
                        Cerrar Reproductor
                    </button>
                </div>

                {/* Contenedor del Reproductor con Capa Antirrobo */}
                <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
                    
                    {/* 🛡️ Capa invisible de protección: evita que hagan clic derecho sobre el iframe o video */}
                    <div 
                        className="absolute inset-0 z-20 bg-transparent pointer-events-none" 
                    />

                    {isYouTube || isVimeo ? (
                        <iframe 
                            src={getEmbedUrl(videoUrl)}
                            className="w-full h-full border-none pointer-events-auto"
                            title={title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen={false}
                        />
                    ) : (
                        <video 
                            src={videoUrl} 
                            controls 
                            controlsList="nodownload noplaybackrate" 
                            disablePictureInPicture
                            onContextMenu={(e) => e.preventDefault()}
                            className="w-full h-full object-contain pointer-events-auto"
                            autoPlay
                        >
                            Tu navegador no soporta la reproducción de video.
                        </video>
                    )}
                </div>

            </div>
        </div>
    );
}