import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, PointerEvent as ReactPointerEvent } from 'react';

import { cn } from '../../lib/cn.ts';
import {
  AdvanceSeconds,
  GoBackSeconds,
  Pause,
  Play,
  Retry,
  Spinner,
  VolumeMuted,
  VolumeOn,
} from '../../lib/glyphs.tsx';

/**
 * Migrado desde `eduardoalvarez.dev/src/components/audio-player/index.tsx`.
 *
 * La lógica no se reescribió: los tres modos, el reproductor flotante, los
 * saltos de ±15s, el ciclo de velocidad 1 → 1.25 → 1.5 → 1.75 → 2 y el volumen
 * con mute son los mismos. Lo que cambió es la piel y las dos dependencias que
 * un paquete no puede tener:
 *
 * - `Icon` del portafolio → los glifos viven ahora en `src/lib/glyphs.tsx`,
 *   con los mismos trazados.
 * - `trackEvent` de analítica → la prop `onFirstPlay`, que el consumidor
 *   conecta a lo que use. Sigue disparándose una sola vez por carga.
 *
 * Y tres cosas que el sistema no permite:
 *
 * - La onda ya no anima `scaleY`. Las barras siguen ahí y siguen distinguiendo
 *   reproducción de pausa por opacidad, pero no escalan.
 * - El reproductor flotante aparece y desaparece en vez de deslizarse.
 * - La barra de progreso ya no interpola el ancho.
 *
 * El giro del spinner de carga se queda, con la misma justificación que en
 * `Button`: es realimentación de progreso, no de estado, y va en `motion-safe`.
 */

export type AudioPlayerMode = 'full' | 'compact' | 'banner';

export type AudioPlayerProps = {
  src: string;
  title?: string;
  /**
   * `full` para páginas de podcast, `compact` para barras laterales y `banner`
   * para artículos con narración. `compact` y `banner` traen además el
   * reproductor flotante cuando el estático sale de vista.
   */
  mode?: AudioPlayerMode | undefined;
  /**
   * Se llama una sola vez por carga, la primera vez que el audio arranca.
   * Aquí es donde el proyecto engancha su analítica; la librería no la trae.
   */
  onFirstPlay?: ((title?: string) => void) | undefined;
};

function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

const WAVEFORM_HEIGHTS = [35, 65, 100, 65, 35];
const RATES = [1, 1.25, 1.5, 1.75, 2];


/* --------------------------------------------------------------- piezas */

/*
 * Todas viven a nivel de módulo, no dentro de `AudioPlayer`. Un componente
 * declarado dentro del cuerpo de otro cambia de identidad en cada render, y
 * React lo desmonta y lo vuelve a montar: con `timeupdate` disparando cuatro
 * veces por segundo, la barra de progreso perdería el pointer capture a mitad
 * del arrastre y el rango de volumen perdería el foco.
 */

/** Barras de la onda. Sin animación: la escala está fuera del sistema. */
function Onda({ grosor, alto, sonando }: { grosor: string; alto: string; sonando: boolean }) {
  return (
    <div className={cn('flex items-end gap-[2px]', alto)} aria-hidden="true">
      {WAVEFORM_HEIGHTS.map((h, i) => (
        <span
          key={i}
          className={cn('rounded-pill bg-accent transition-standard', grosor)}
          style={{ height: `${h}%`, opacity: sonando ? 1 : 0.3 + (h / 100) * 0.4 }}
        />
      ))}
    </div>
  );
}

type PunteroProps = {
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: ReactPointerEvent<HTMLDivElement>) => void;
};

function BarraProgreso({
  alto,
  perilla,
  progreso,
  redondeada = true,
  tabIndex = 0,
  ...puntero
}: PunteroProps & {
  alto: string;
  /** Diámetro de la perilla en px. Se usa también para centrarla sobre el punto. */
  perilla: number;
  progreso: number;
  redondeada?: boolean;
  tabIndex?: number;
}) {
  return (
    <div
      className={cn(
        'group bg-surface-raised relative cursor-pointer',
        alto,
        redondeada && 'rounded-pill',
      )}
      role="slider"
      aria-label="Progreso del audio"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progreso)}
      tabIndex={tabIndex}
      {...puntero}
    >
      <div
        className={cn('bg-accent absolute h-full', redondeada && 'rounded-pill')}
        style={{ width: `${progreso}%` }}
      />
      <div
        className="rounded-pill bg-text-primary absolute top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
        style={{
          width: perilla,
          height: perilla,
          left: `calc(${progreso}% - ${perilla / 2}px)`,
        }}
      />
    </div>
  );
}

const CONTROL =
  'rounded-chip transition-standard cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

function BotonSalto({
  segundos,
  className,
  tamano,
  onSaltar,
}: {
  segundos: number;
  className: string;
  tamano: string;
  onSaltar: (s: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSaltar(segundos)}
      className={cn('text-text-muted hover:text-text-primary', CONTROL, className)}
      aria-label={segundos < 0 ? 'Retroceder 15 segundos' : 'Adelantar 15 segundos'}
    >
      {segundos < 0 ? <GoBackSeconds className={tamano} /> : <AdvanceSeconds className={tamano} />}
    </button>
  );
}

function BotonVelocidad({
  className,
  velocidad,
  onCambiar,
}: {
  className: string;
  velocidad: number;
  onCambiar: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onCambiar}
      className={cn(
        // `textMuted` sobre `surfaceRaised` da 4.07:1 en oscuro y no pasa AA.
        // El original del portafolio arrastra ese mismo fallo.
        'text-text-secondary hover:text-text-primary bg-surface-raised',
        CONTROL,
        className,
      )}
      aria-label="Cambiar velocidad de reproducción"
    >
      {velocidad}x
    </button>
  );
}

function Volumen({
  tamano,
  ancho,
  silenciado,
  volumen,
  onSilenciar,
  onCambiarVolumen,
}: {
  tamano: string;
  ancho: string;
  silenciado: boolean;
  volumen: number;
  onSilenciar: () => void;
  onCambiarVolumen: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="gap-xs hidden items-center sm:flex">
      <button
        type="button"
        onClick={onSilenciar}
        className={cn('text-text-muted hover:text-text-primary p-1', CONTROL)}
        aria-label={silenciado ? 'Activar sonido' : 'Silenciar'}
      >
        {silenciado || volumen === 0 ? (
          <VolumeMuted className={tamano} />
        ) : (
          <VolumeOn className={tamano} />
        )}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={silenciado ? 0 : volumen}
        onChange={onCambiarVolumen}
        className={cn(
          'bg-surface-raised rounded-pill h-1 cursor-pointer appearance-none',
          '[accent-color:var(--color-accent)]',
          ancho,
        )}
        aria-label="Volumen"
      />
    </div>
  );
}

type EstadoPlay = { cargando: boolean; error: boolean; sonando: boolean };

function IconoPlay({ className, cargando, error, sonando }: EstadoPlay & { className: string }) {
  // El giro se queda, con la misma justificación que en `Button`: es
  // realimentación de progreso, no de estado, y `motion-safe` lo apaga.
  if (cargando) return <Spinner className={cn('motion-safe:animate-spin', className)} />;
  if (error) return <Retry className={className} />;
  if (sonando) return <Pause className={className} />;
  return <Play className={className} />;
}

function BotonPlay({
  className,
  tamano,
  etiqueta,
  texto,
  onAlternar,
  ...estado
}: EstadoPlay & {
  className: string;
  tamano: string;
  etiqueta: string;
  texto?: string;
  onAlternar: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onAlternar}
      className={cn(
        'text-accent-on transition-standard cursor-pointer',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        estado.error ? 'bg-error hover:bg-error/80' : 'bg-accent hover:bg-accent-hover',
        className,
      )}
      aria-label={etiqueta}
    >
      <IconoPlay className={tamano} {...estado} />
      {texto ? <span>{texto}</span> : null}
    </button>
  );
}

export function AudioPlayer({ src, title, mode = 'full', onFirstPlay }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const staticRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  // Una sola medición de reproducción por carga (no por cada play/pausa).
  const hasTrackedPlay = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isStaticVisible, setIsStaticVisible] = useState(true);

  const flotante = mode === 'banner' || mode === 'compact';

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      setHasError(false);
    };
    const handleEnded = () => setIsPlaying(false);
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      setIsPlaying(false);
    };
    const handlePlaying = () => {
      setIsLoading(false);
      setHasError(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('playing', handlePlaying);

    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
      setDuration(audio.duration);
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('playing', handlePlaying);
    };
  }, []);

  // Detecta cuando el player estático sale de vista (banner y compact).
  useEffect(() => {
    if (!flotante || !staticRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setIsStaticVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );
    observer.observe(staticRef.current);
    return () => observer.disconnect();
  }, [flotante]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      setHasError(false);
      try {
        await audio.play();
        setIsPlaying(true);
        if (!hasTrackedPlay.current) {
          hasTrackedPlay.current = true;
          onFirstPlay?.(title);
        }
      } catch {
        setHasError(true);
        setIsPlaying(false);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isPlaying, onFirstPlay, title]);

  const seekTo = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const audio = audioRef.current;
      if (!audio) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const position = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.currentTime = position * duration;
    },
    [duration],
  );

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      isDragging.current = true;
      seekTo(e);
    },
    [seekTo],
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!isDragging.current) return;
      seekTo(e);
    },
    [seekTo],
  );

  const handlePointerUp = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    isDragging.current = false;
  }, []);

  const handleVolumeChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audio.volume = newVolume;
    setIsMuted(newVolume === 0);
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.volume = volume || 1;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const handlePlaybackRateChange = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextRate = RATES[(RATES.indexOf(playbackRate) + 1) % RATES.length] ?? 1;
    audio.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  }, [playbackRate]);

  const skip = useCallback(
    (seconds: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, duration));
    },
    [duration],
  );

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const etiquetaPlay = hasError ? 'Reintentar' : isPlaying ? 'Pausar' : 'Reproducir';

  const estadoPlay = { cargando: isLoading, error: hasError, sonando: isPlaying };
  const puntero = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
  };

  /** Reproductor flotante, compartido por los modos banner y compact. */
  const flotanteJsx = (
    <div
      aria-hidden={isStaticVisible}
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 xl:hidden',
        // Aparece y desaparece: el sistema no anima desplazamiento.
        isStaticVisible && 'hidden',
      )}
    >
      <BarraProgreso
        alto="h-1"
        perilla={10}
        progreso={progress}
        redondeada={false}
        tabIndex={-1}
        {...puntero}
      />

      <div className="bg-surface/95 border-accent/25 border-t backdrop-blur-md">
        <div className="gap-sm px-md flex items-center py-5">
          <div className="gap-xs flex shrink-0 items-center">
            <Onda grosor="w-[2px]" alto="h-4" sonando={isPlaying} />
            <span className="text-eyebrow font-mono text-accent hidden uppercase sm:block">
              Narración
            </span>
          </div>

          <div className="min-w-0 flex-1">
            {title ? (
              <p className="text-label font-sans text-text-secondary truncate">{title}</p>
            ) : null}
            <p className="text-chip font-mono text-text-muted tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <BotonSalto segundos={-15} className="p-1.5" tamano="w-5 h-5" onSaltar={skip} />
            <BotonPlay
              className="rounded-pill px-sm gap-xs flex items-center py-1.5"
              tamano="w-4 h-4"
              etiqueta={etiquetaPlay}
              onAlternar={togglePlay}
              {...estadoPlay}
            />
            <BotonSalto segundos={15} className="p-1.5" tamano="w-5 h-5" onSaltar={skip} />
            <BotonVelocidad
              className="text-label ml-0.5 px-1.5 py-0.5"
              velocidad={playbackRate}
              onCambiar={handlePlaybackRateChange}
            />
          </div>
        </div>
      </div>
    </div>
  );

  /* ─── banner · artículos con narración ─────────────────────────────────── */
  if (mode === 'banner') {
    return (
      <>
        <audio ref={audioRef} src={src} preload="metadata" />

        <div ref={staticRef}>
          <div className="gap-sm mb-md flex items-center">
            <Onda grosor="w-[3px]" alto="h-5" sonando={isPlaying} />
            <span className="text-eyebrow font-mono text-accent uppercase">
              Narración de audio
            </span>
            <span className="text-chip font-mono text-text-muted ml-auto tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="mb-md">
            <BarraProgreso alto="h-1.5" perilla={14} progreso={progress} {...puntero} />
          </div>

          <div className="gap-sm flex items-center">
            <BotonSalto segundos={-15} className="p-2" tamano="w-6 h-6" onSaltar={skip} />
            <BotonPlay
              className="rounded-pill px-lg gap-xs text-ui flex items-center py-2 font-medium"
              tamano="w-4 h-4"
              etiqueta={etiquetaPlay}
              texto={etiquetaPlay}
              onAlternar={togglePlay}
              {...estadoPlay}
            />
            <BotonSalto segundos={15} className="p-2" tamano="w-6 h-6" onSaltar={skip} />

            <div className="gap-sm ml-auto flex items-center">
              <BotonVelocidad
                className="text-label px-2 py-1"
                velocidad={playbackRate}
                onCambiar={handlePlaybackRateChange}
              />
              <Volumen
                tamano="w-4 h-4"
                ancho="w-16"
                silenciado={isMuted}
                volumen={volume}
                onSilenciar={toggleMute}
                onCambiarVolumen={handleVolumeChange}
              />
            </div>
          </div>
        </div>

        {flotanteJsx}
      </>
    );
  }

  /* ─── compact · barras laterales y usos en línea ───────────────────────── */
  if (mode === 'compact') {
    return (
      <>
        <audio ref={audioRef} src={src} preload="metadata" />

        <div ref={staticRef} className="w-full">
          <div className="mb-xs">
            <BarraProgreso alto="h-1.5" perilla={12} progreso={progress} {...puntero} />
          </div>

          <div className="text-chip font-mono text-text-muted mb-sm flex justify-between">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <BotonSalto segundos={-15} className="p-1.5" tamano="w-5 h-5" onSaltar={skip} />
              <BotonPlay
                // 34px, del documento. Es tamaño de control, no de escala.
                className="rounded-pill flex size-[34px] items-center justify-center"
                tamano="w-4 h-4"
                etiqueta={etiquetaPlay}
                onAlternar={togglePlay}
                {...estadoPlay}
              />
              <BotonSalto segundos={15} className="p-1.5" tamano="w-5 h-5" onSaltar={skip} />
            </div>
            <BotonVelocidad
              className="text-label px-1.5 py-0.5"
              velocidad={playbackRate}
              onCambiar={handlePlaybackRateChange}
            />
          </div>
        </div>

        {flotanteJsx}
      </>
    );
  }

  /* ─── full · podcasts y páginas dedicadas ──────────────────────────────── */
  return (
    <div className="bg-surface rounded-control border-border p-md w-full border">
      <audio ref={audioRef} src={src} preload="metadata" />

      {title ? (
        <p className="text-ui font-sans text-text-secondary mb-sm truncate">{title}</p>
      ) : null}

      <div className="mb-sm">
        <BarraProgreso alto="h-2" perilla={16} progreso={progress} {...puntero} />
      </div>

      <div className="text-chip font-mono text-text-muted mb-sm flex justify-between">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="gap-xs flex items-center">
          <BotonSalto segundos={-15} className="p-2" tamano="w-5 h-5" onSaltar={skip} />
          <BotonPlay
            // 48px, del documento.
            className="rounded-pill flex size-12 items-center justify-center"
            tamano="w-6 h-6"
            etiqueta={etiquetaPlay}
            onAlternar={togglePlay}
            {...estadoPlay}
          />
          <BotonSalto segundos={15} className="p-2" tamano="w-5 h-5" onSaltar={skip} />
        </div>

        <div className="gap-sm flex items-center">
          <BotonVelocidad
            className="text-label px-2 py-1"
            velocidad={playbackRate}
            onCambiar={handlePlaybackRateChange}
          />
          <Volumen
            tamano="w-5 h-5"
            ancho="w-20"
            silenciado={isMuted}
            volumen={volume}
            onSilenciar={toggleMute}
            onCambiarVolumen={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  );
}
