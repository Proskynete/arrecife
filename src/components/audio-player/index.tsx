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
 * Migrated from `eduardoalvarez.dev/src/components/audio-player/index.tsx`.
 *
 * The logic was not rewritten: the three modes, the floating player, the ±15s
 * skips, the 1 → 1.25 → 1.5 → 1.75 → 2 speed cycle and the volume with mute are
 * the same. What changed is the skin and the two dependencies a package cannot
 * have:
 *
 * - the portfolio's `Icon` → the glyphs now live in `src/lib/glyphs.tsx`, with
 *   the same paths.
 * - analytics' `trackEvent` → the `onFirstPlay` prop, which the consumer wires
 *   to whatever they use. It still fires exactly once per load.
 *
 * And three things the system does not allow:
 *
 * - The waveform no longer animates `scaleY`. The bars are still there and still
 *   tell playback from pause by opacity, but they do not scale.
 * - The floating player appears and disappears instead of sliding.
 * - The progress bar no longer interpolates its width.
 *
 * The loading spinner's spin stays, with the same justification as in `Button`:
 * it is feedback about progress, not about state, and it sits in `motion-safe`.
 */

export type AudioPlayerMode = 'full' | 'compact' | 'banner';

export type AudioPlayerProps = {
  src: string;
  title?: string;
  /**
   * `full` for podcast pages, `compact` for sidebars and `banner` for articles
   * with narration. `compact` and `banner` also bring the floating player when
   * the static one leaves the viewport.
   */
  mode?: AudioPlayerMode | undefined;
  /**
   * Called once per load, the first time the audio starts.
   * This is where the project hooks up its analytics; the library ships none.
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
 * They all live at module level, not inside `AudioPlayer`. A component declared
 * inside another's body changes identity on every render, and React unmounts and
 * remounts it: with `timeupdate` firing four times a second, the progress bar
 * would lose pointer capture mid-drag and the volume range would lose focus.
 */

/** The waveform's bars. No animation: scale is outside the system. */
function Wave({ strokeWidth, height, playing }: { strokeWidth: string; height: string; playing: boolean }) {
  return (
    <div className={cn('flex items-end gap-[2px]', height)} aria-hidden="true">
      {WAVEFORM_HEIGHTS.map((h, i) => (
        <span
          key={i}
          className={cn('rounded-pill bg-accent transition-standard', strokeWidth)}
          style={{ height: `${h}%`, opacity: playing ? 1 : 0.3 + (h / 100) * 0.4 }}
        />
      ))}
    </div>
  );
}

type PointerProps = {
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: ReactPointerEvent<HTMLDivElement>) => void;
};

function ProgressBar({
  height,
  knob,
  progress,
  redondeada = true,
  tabIndex = 0,
  ...pointer
}: PointerProps & {
  height: string;
  /** Knob diameter in px. Also used to centre it over the point. */
  knob: number;
  progress: number;
  redondeada?: boolean;
  tabIndex?: number;
}) {
  return (
    <div
      className={cn(
        'group bg-surface-raised relative cursor-pointer',
        height,
        redondeada && 'rounded-pill',
      )}
      role="slider"
      aria-label="Progreso del audio"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      tabIndex={tabIndex}
      {...pointer}
    >
      <div
        className={cn('bg-accent absolute h-full', redondeada && 'rounded-pill')}
        style={{ width: `${progress}%` }}
      />
      <div
        className="rounded-pill bg-text-primary absolute top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
        style={{
          width: knob,
          height: knob,
          left: `calc(${progress}% - ${knob / 2}px)`,
        }}
      />
    </div>
  );
}

const CONTROL =
  'rounded-chip transition-standard cursor-pointer focus-ring';

function SkipButton({
  seconds,
  className,
  size,
  onSkip,
}: {
  seconds: number;
  className: string;
  size: string;
  onSkip: (s: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSkip(seconds)}
      className={cn('text-text-muted hover:text-text-primary', CONTROL, className)}
      aria-label={seconds < 0 ? 'Retroceder 15 segundos' : 'Adelantar 15 segundos'}
    >
      {seconds < 0 ? <GoBackSeconds className={size} /> : <AdvanceSeconds className={size} />}
    </button>
  );
}

function SpeedButton({
  className,
  speed,
  onChange,
}: {
  className: string;
  speed: number;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        // `textMuted` over `surfaceRaised` gives 4.07:1 in dark and fails AA.
        // The portfolio original carries that same failure.
        'text-text-secondary hover:text-text-primary bg-surface-raised',
        CONTROL,
        className,
      )}
      aria-label="Cambiar velocidad de reproducción"
    >
      {speed}x
    </button>
  );
}

function Volume({
  size,
  width,
  muted,
  volume,
  onMute,
  onVolumeChange,
}: {
  size: string;
  width: string;
  muted: boolean;
  volume: number;
  onMute: () => void;
  onVolumeChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="gap-step-xs hidden items-center sm:flex">
      <button
        type="button"
        onClick={onMute}
        className={cn('text-text-muted hover:text-text-primary p-1', CONTROL)}
        aria-label={muted ? 'Activar sonido' : 'Silenciar'}
      >
        {muted || volume === 0 ? (
          <VolumeMuted className={size} />
        ) : (
          <VolumeOn className={size} />
        )}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={muted ? 0 : volume}
        onChange={onVolumeChange}
        className={cn(
          'bg-surface-raised rounded-pill h-1 cursor-pointer appearance-none',
          '[accent-color:var(--color-accent)]',
          width,
        )}
        aria-label="Volumen"
      />
    </div>
  );
}

type PlayState = { loading: boolean; error: boolean; playing: boolean };

function PlayIcon({ className, loading, error, playing }: PlayState & { className: string }) {
  // The spin stays, with the same justification as in `Button`: it is feedback
  // about progress, not about state, and `motion-safe` turns it off.
  if (loading) return <Spinner className={cn('motion-safe:animate-spin', className)} />;
  if (error) return <Retry className={className} />;
  if (playing) return <Pause className={className} />;
  return <Play className={className} />;
}

function PlayButton({
  className,
  size,
  label,
  text,
  onToggle,
  ...state
}: PlayState & {
  className: string;
  size: string;
  label: string;
  text?: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'text-accent-on transition-standard cursor-pointer',
        'focus-ring',
        state.error ? 'bg-error hover:bg-error/80' : 'bg-accent hover:bg-accent-hover',
        className,
      )}
      aria-label={label}
    >
      <PlayIcon className={size} {...state} />
      {text ? <span>{text}</span> : null}
    </button>
  );
}

export function AudioPlayer({ src, title, mode = 'full', onFirstPlay }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const staticRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  // A single playback measurement per load (not per play/pause).
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

  const floating = mode === 'banner' || mode === 'compact';

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

  // Detects when the static player leaves the viewport (banner and compact).
  useEffect(() => {
    if (!floating || !staticRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setIsStaticVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );
    observer.observe(staticRef.current);
    return () => observer.disconnect();
  }, [floating]);

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
  const playLabel = hasError ? 'Reintentar' : isPlaying ? 'Pausar' : 'Reproducir';

  const playState = { loading: isLoading, error: hasError, playing: isPlaying };
  const pointer = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
  };

  /** Floating player, shared by the banner and compact modes. */
  const floatingJsx = (
    <div
      aria-hidden={isStaticVisible}
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 xl:hidden',
        // It appears and disappears: the system does not animate displacement.
        isStaticVisible && 'hidden',
      )}
    >
      <ProgressBar
        height="h-1"
        knob={10}
        progress={progress}
        redondeada={false}
        tabIndex={-1}
        {...pointer}
      />

      <div className="bg-surface/95 border-accent/25 border-t backdrop-blur-md">
        <div className="gap-step-sm px-step-md flex items-center py-5">
          <div className="gap-step-xs flex shrink-0 items-center">
            <Wave strokeWidth="w-[2px]" height="h-4" playing={isPlaying} />
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
            <SkipButton seconds={-15} className="p-1.5" size="w-5 h-5" onSkip={skip} />
            <PlayButton
              className="rounded-pill px-step-sm gap-step-xs flex items-center py-1.5"
              size="w-4 h-4"
              label={playLabel}
              onToggle={togglePlay}
              {...playState}
            />
            <SkipButton seconds={15} className="p-1.5" size="w-5 h-5" onSkip={skip} />
            <SpeedButton
              className="text-label ml-0.5 px-1.5 py-0.5"
              speed={playbackRate}
              onChange={handlePlaybackRateChange}
            />
          </div>
        </div>
      </div>
    </div>
  );

  /* ─── banner · articles with narration ─────────────────────────────────── */
  if (mode === 'banner') {
    return (
      <>
        <audio ref={audioRef} src={src} preload="metadata" />

        <div ref={staticRef}>
          <div className="gap-step-sm mb-step-md flex items-center">
            <Wave strokeWidth="w-[3px]" height="h-5" playing={isPlaying} />
            <span className="text-eyebrow font-mono text-accent uppercase">
              Narración de audio
            </span>
            <span className="text-chip font-mono text-text-muted ml-auto tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="mb-step-md">
            <ProgressBar height="h-1.5" knob={14} progress={progress} {...pointer} />
          </div>

          <div className="gap-step-sm flex items-center">
            <SkipButton seconds={-15} className="p-2" size="w-6 h-6" onSkip={skip} />
            <PlayButton
              className="rounded-pill px-step-lg gap-step-xs text-ui flex items-center py-2 font-medium"
              size="w-4 h-4"
              label={playLabel}
              text={playLabel}
              onToggle={togglePlay}
              {...playState}
            />
            <SkipButton seconds={15} className="p-2" size="w-6 h-6" onSkip={skip} />

            <div className="gap-step-sm ml-auto flex items-center">
              <SpeedButton
                className="text-label px-2 py-1"
                speed={playbackRate}
                onChange={handlePlaybackRateChange}
              />
              <Volume
                size="w-4 h-4"
                width="w-16"
                muted={isMuted}
                volume={volume}
                onMute={toggleMute}
                onVolumeChange={handleVolumeChange}
              />
            </div>
          </div>
        </div>

        {floatingJsx}
      </>
    );
  }

  /* ─── compact · sidebars and inline uses ───────────────────────── */
  if (mode === 'compact') {
    return (
      <>
        <audio ref={audioRef} src={src} preload="metadata" />

        <div ref={staticRef} className="w-full">
          <div className="mb-step-xs">
            <ProgressBar height="h-1.5" knob={12} progress={progress} {...pointer} />
          </div>

          <div className="text-chip font-mono text-text-muted mb-step-sm flex justify-between">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <SkipButton seconds={-15} className="p-1.5" size="w-5 h-5" onSkip={skip} />
              <PlayButton
                // 34px, from the document. It is control size, not scale size.
                className="rounded-pill flex size-[34px] items-center justify-center"
                size="w-4 h-4"
                label={playLabel}
                onToggle={togglePlay}
                {...playState}
              />
              <SkipButton seconds={15} className="p-1.5" size="w-5 h-5" onSkip={skip} />
            </div>
            <SpeedButton
              className="text-label px-1.5 py-0.5"
              speed={playbackRate}
              onChange={handlePlaybackRateChange}
            />
          </div>
        </div>

        {floatingJsx}
      </>
    );
  }

  /* ─── full · podcasts and dedicated pages ──────────────────────────────── */
  return (
    <div className="bg-surface rounded-control border-border p-step-md w-full border">
      <audio ref={audioRef} src={src} preload="metadata" />

      {title ? (
        <p className="text-ui font-sans text-text-secondary mb-step-sm truncate">{title}</p>
      ) : null}

      <div className="mb-step-sm">
        <ProgressBar height="h-2" knob={16} progress={progress} {...pointer} />
      </div>

      <div className="text-chip font-mono text-text-muted mb-step-sm flex justify-between">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="gap-step-xs flex items-center">
          <SkipButton seconds={-15} className="p-2" size="w-5 h-5" onSkip={skip} />
          <PlayButton
            // 48px, from the document.
            className="rounded-pill flex size-12 items-center justify-center"
            size="w-6 h-6"
            label={playLabel}
            onToggle={togglePlay}
            {...playState}
          />
          <SkipButton seconds={15} className="p-2" size="w-5 h-5" onSkip={skip} />
        </div>

        <div className="gap-step-sm flex items-center">
          <SpeedButton
            className="text-label px-2 py-1"
            speed={playbackRate}
            onChange={handlePlaybackRateChange}
          />
          <Volume
            size="w-5 h-5"
            width="w-20"
            muted={isMuted}
            volume={volume}
            onMute={toggleMute}
            onVolumeChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  );
}
