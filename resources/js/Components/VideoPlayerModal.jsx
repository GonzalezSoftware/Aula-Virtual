import { useEffect } from 'react';

export default function VideoPlayerModal({ videoUrl = '', title, onClose }) {
    useEffect(() => {
        const handleContextMenu = (e) => e.preventDefault();

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose?.();
                return;
            }

            if (
                (e.ctrlKey && ['s', 'S', 'u', 'U', 'c', 'C', 'i', 'I'].includes(e.key)) ||
                (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) ||
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
    }, [onClose]);

    const extractYouTubeId = (url) => {
        if (!url) return null;
        try {
            const parsed = new URL(url);
            const host = parsed.hostname.replace(/^www\./, '');

            if (host === 'youtu.be') {
                return parsed.pathname.split('/').filter(Boolean)[0] || null;
            }

            if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
                if (parsed.pathname === '/watch') {
                    return parsed.searchParams.get('v');
                }
                const parts = parsed.pathname.split('/').filter(Boolean);
                if (parts[0] === 'embed' || parts[0] === 'shorts' || parts[0] === 'live') {
                    return parts[1] || null;
                }
            }
        } catch {
            const match = url.match(/(?:v=|\/embed\/|\/shorts\/|\/live\/|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
            return match ? match[1] : null;
        }
        return null;
    };

    const extractVimeoId = (url) => {
        if (!url) return null;
        const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
        return match ? match[1] : null;
    };

    const youtubeId = extractYouTubeId(videoUrl);
    const vimeoId = !youtubeId ? extractVimeoId(videoUrl) : null;

    const getEmbedSrc = () => {
        if (youtubeId) {
            const originParam = typeof window !== 'undefined'
                ? `&origin=${encodeURIComponent(window.location.origin)}`
                : '';
            return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&controls=1${originParam}`;
        }

        if (vimeoId) {
            return `https://player.vimeo.com/video/${encodeURIComponent(vimeoId)}?autoplay=1&title=0&byline=0&portrait=0`;
        }

        return videoUrl;
    };

    const isEmbeddedPlayer = Boolean(youtubeId || vimeoId);

    const blockInteraction = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 select-none"
            onContextMenu={blockInteraction}
            onDragStart={blockInteraction}
        >
            <div className="bg-slate-900 w-full max-w-5xl rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-700">
                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-[#051C33] text-white flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2.5 sm:gap-3 select-none">
                    <h3 className="font-extrabold text-xs sm:text-sm tracking-tight truncate max-w-full sm:max-w-xl text-white">
                        {title}{' '}
                        <span className="text-[11px] sm:text-xs text-blue-400 font-normal ml-1.5 sm:ml-2">
                            (Reproducción Protegida)
                        </span>
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-red-500/25 hover:bg-red-600 text-red-200 hover:text-white text-xs font-semibold transition cursor-pointer shrink-0"
                    >
                        Cerrar Reproductor
                    </button>
                </div>

                <div
                    className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden"
                    onContextMenu={blockInteraction}
                >
                    {isEmbeddedPlayer && (
                        <>
                            <div
                                onClick={blockInteraction}
                                onContextMenu={blockInteraction}
                                className="absolute top-0 left-0 w-64 h-16 z-20 bg-transparent cursor-default"
                                aria-hidden="true"
                            />
                            <div
                                onClick={blockInteraction}
                                onContextMenu={blockInteraction}
                                className="absolute bottom-8 left-0 w-14 h-10 z-20 bg-transparent cursor-default"
                                aria-hidden="true"
                            />
                            <div
                                onClick={blockInteraction}
                                onContextMenu={blockInteraction}
                                className="absolute bottom-8 right-0 w-28 h-10 z-20 bg-transparent cursor-default"
                                aria-hidden="true"
                            />
                        </>
                    )}

                    {isEmbeddedPlayer ? (
                        <iframe
                            src={getEmbedSrc()}
                            className="w-full h-full border-none z-10"
                            title={title}
                            referrerPolicy="strict-origin-when-cross-origin"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen={false}
                        />
                    ) : (
                        <video
                            src={videoUrl}
                            controls
                            controlsList="nodownload noplaybackrate"
                            disablePictureInPicture
                            onContextMenu={blockInteraction}
                            className="w-full h-full object-contain z-10"
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