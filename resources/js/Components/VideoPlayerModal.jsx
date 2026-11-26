import { useEffect, useRef, useState } from 'react';

export default function VideoPlayerModal({ videoUrl = '', title, onClose }) {
    const playerContainerRef = useRef(null);
    const playerInstanceRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

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
        if (/^[A-Za-z0-9_-]{11}$/.test(url.trim())) return url.trim();
        try {
            const parsed = new URL(url);
            const host = parsed.hostname.replace(/^www\./, '');
            if (host === 'youtu.be') return parsed.pathname.split('/').filter(Boolean)[0] || null;
            if (['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(host)) {
                if (parsed.pathname === '/watch') return parsed.searchParams.get('v');
                const parts = parsed.pathname.split('/').filter(Boolean);
                if (['embed', 'shorts', 'live'].includes(parts[0])) return parts[1] || null;
            }
        } catch {
            const match = url.match(/(?:v=|\/embed\/|\/shorts\/|\/live\/|youtu\.be\/)([A-Za-z0-9_-]{11})/);
            return match ? match[1] : null;
        }
        return null;
    };

    const youtubeId = extractYouTubeId(videoUrl);

    useEffect(() => {
        if (!youtubeId) return;

        let intervalId;

        const initPlayer = () => {
            if (!window.YT || !window.YT.Player) return;

            playerInstanceRef.current = new window.YT.Player('yt-protected-player', {
                videoId: youtubeId,
                host: 'https://www.youtube-nocookie.com',
                playerVars: {
                    autoplay: 1,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    iv_load_policy: 3,
                    modestbranding: 1,
                    rel: 0,
                    playsinline: 1,
                    origin: window.location.origin,
                },
                events: {
                    onReady: (event) => {
                        setDuration(event.target.getDuration() || 0);
                        setIsMuted(event.target.isMuted());
                        event.target.playVideo();
                    },
                    onStateChange: (event) => {
                        const playing = event.data === window.YT.PlayerState.PLAYING;
                        setIsPlaying(playing);
                        setDuration(event.target.getDuration() || 0);
                    },
                },
            });

            intervalId = setInterval(() => {
                if (playerInstanceRef.current?.getCurrentTime) {
                    setCurrentTime(playerInstanceRef.current.getCurrentTime() || 0);
                }
            }, 500);
        };

        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.body.appendChild(tag);
            window.onYouTubeIframeAPIReady = initPlayer;
        }

        return () => {
            clearInterval(intervalId);
            if (playerInstanceRef.current?.destroy) {
                playerInstanceRef.current.destroy();
            }
        };
    }, [youtubeId]);

    const togglePlay = () => {
        const player = playerInstanceRef.current;
        if (!player) return;
        if (isPlaying) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    };

    const toggleMute = () => {
        const player = playerInstanceRef.current;
        if (!player) return;
        if (isMuted) {
            player.unMute();
            setIsMuted(false);
        } else {
            player.mute();
            setIsMuted(true);
        }
    };

    const handleSeek = (e) => {
        const newTime = Number(e.target.value);
        setCurrentTime(newTime);
        playerInstanceRef.current?.seekTo(newTime, true);
    };

    const toggleFullscreen = async () => {
        const container = playerContainerRef.current;
        if (!container) return;
        if (!document.fullscreenElement) {
            await container.requestFullscreen?.();
            setIsFullscreen(true);
        } else {
            await document.exitFullscreen?.();
            setIsFullscreen(false);
        }
    };

    const formatTime = (sec) => {
        const total = Math.floor(sec || 0);
        const mins = Math.floor(total / 60);
        const rem = total % 60;
        return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
    };

    const blockEvent = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 select-none"
            onContextMenu={blockEvent}
            onDragStart={blockEvent}
        >
            <div
                ref={playerContainerRef}
                className="bg-slate-900 w-full max-w-5xl rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-700"
            >
                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-[#051C33] text-white flex justify-between items-center gap-3">
                    <h3 className="font-extrabold text-xs sm:text-sm truncate">
                        {title}{' '}
                        <span className="text-[11px] text-blue-400 font-normal ml-2">
                            (Reproducción Protegida)
                        </span>
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-xl bg-red-500/25 hover:bg-red-600 text-red-200 hover:text-white text-xs font-semibold transition cursor-pointer shrink-0"
                    >
                        Cerrar Reproductor
                    </button>
                </div>

                <div
                    className="relative w-full aspect-video bg-black overflow-hidden"
                    onContextMenu={blockEvent}
                >
                    {youtubeId ? (
                        <>
                            <div id="yt-protected-player" className="w-full h-full pointer-events-none" />
                            <button
                                type="button"
                                onClick={togglePlay}
                                onContextMenu={blockEvent}
                                aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
                                className="absolute inset-0 z-20 w-full h-full bg-transparent cursor-pointer"
                            />
                        </>
                    ) : (
                        <video
                            src={videoUrl}
                            controls
                            controlsList="nodownload noplaybackrate"
                            disablePictureInPicture
                            onContextMenu={blockEvent}
                            className="w-full h-full object-contain"
                            autoPlay
                        />
                    )}
                </div>

                {youtubeId && (
                    <div className="px-4 py-3 bg-slate-950 text-white flex items-center gap-3 sm:gap-4 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={togglePlay}
                            className="px-3 py-1.5 rounded-lg bg-[#0066FF] hover:bg-[#0052CC] text-xs font-semibold cursor-pointer shrink-0"
                        >
                            {isPlaying ? 'Pausar' : 'Reproducir'}
                        </button>

                        <span className="text-xs font-mono text-slate-300 shrink-0">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>

                        <input
                            type="range"
                            min={0}
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            className="flex-1 accent-[#0066FF] cursor-pointer"
                        />

                        <button
                            type="button"
                            onClick={toggleMute}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold cursor-pointer shrink-0"
                        >
                            {isMuted ? 'Activar audio' : 'Silenciar'}
                        </button>

                        <button
                            type="button"
                            onClick={toggleFullscreen}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold cursor-pointer shrink-0"
                        >
                            {isFullscreen ? 'Salir pantalla completa' : 'Pantalla completa'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}