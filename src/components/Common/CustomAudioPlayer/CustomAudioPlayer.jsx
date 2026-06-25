import React, { useRef, useState, useEffect } from 'react';
import styles from './CustomAudioPlayer.module.css';
import { addToHistory } from '../../../services/HistoryService';

export default function CustomAudioPlayer({
  src,
  episodeTitle,
  podcastTitle,
  minimal = false,
  episode
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  // Reset states when the audio track changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setPlaybackRate(1);
    if (audioRef.current) {
      audioRef.current.playbackRate = 1;
      audioRef.current.load();
    }
  }, [src]);

  // Sync internal playback rate state with the ref
  const changeSpeed = (rate) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
    setShowSpeedMenu(false);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play()
        .catch(err => console.log("Playback error: ", err));
    }
  };

  const skipTime = (amount) => {
    if (audioRef.current) {
      let newTime = audioRef.current.currentTime + amount;
      if (newTime < 0) newTime = 0;
      if (newTime > duration) newTime = duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
      audioRef.current.muted = vol === 0;
      setIsMuted(vol === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const nextMute = !isMuted;
      audioRef.current.muted = nextMute;
      setIsMuted(nextMute);
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs === Infinity) return '0:00';
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = Math.floor(secs % 60);

    if (hours > 0) {
      return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`${styles.playerContainer} ${minimal ? styles.minimalPlayer : ''}`}>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => {
          setIsPlaying(true);
          if (episode) addToHistory(episode);
        }}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Title block (only shown in full player mode) */}
      {!minimal && (episodeTitle || podcastTitle) && (
        <div className={styles.metaInfo}>
          {episodeTitle && <h4 className={styles.episodeTitle} title={episodeTitle}>{episodeTitle}</h4>}
          {podcastTitle && <span className={styles.podcastTitle}>{podcastTitle}</span>}
        </div>
      )}

      {/* Main Row of Controls */}
      <div className={styles.controlsRow}>
        
        {/* Playback rate pill */}
        <div className={styles.speedWrapper}>
          <button 
            type="button"
            className={styles.pillButton}
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            title="Playback Speed"
          >
            {playbackRate}x
          </button>
          
          {showSpeedMenu && (
            <div className={styles.speedDropdown}>
              {[1.0, 1.25, 1.5, 1.8, 2.0].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  className={`${styles.speedOption} ${playbackRate === rate ? styles.speedOptionActive : ''}`}
                  onClick={() => changeSpeed(rate)}
                >
                  {rate}x
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Playback navigation buttons */}
        <div className={styles.buttonsGroup}>
          <button
            type="button"
            className={styles.controlButton}
            onClick={() => skipTime(-10)}
            title="Rewind 10 seconds"
            aria-label="Rewind 10 seconds"
          >
            <i className="fas fa-undo"></i>
            <span className={styles.skipLabel}>10s</span>
          </button>

          <button
            type="button"
            className={styles.playPauseButton}
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
          </button>

          <button
            type="button"
            className={styles.controlButton}
            onClick={() => skipTime(15)}
            title="Skip forward 15 seconds"
            aria-label="Skip forward 15 seconds"
          >
            <i className="fas fa-redo"></i>
            <span className={styles.skipLabel}>15s</span>
          </button>
        </div>

        {/* Volume controls */}
        <div className={styles.volumeWrapper}>
          <button
            type="button"
            className={styles.volumeButton}
            onClick={toggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            <i className={`fas ${isMuted || volume === 0 ? 'fa-volume-mute' : volume < 0.5 ? 'fa-volume-down' : 'fa-volume-up'}`}></i>
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className={styles.volumeSlider}
            title="Volume"
            style={{ '--vol-pct': `${(isMuted ? 0 : volume) * 100}%` }}
          />
        </div>

      </div>

      {/* Progress Timeline Row */}
      <div className={styles.timelineRow}>
        <span className={styles.timeLabel}>{formatTime(currentTime)}</span>
        
        <div className={styles.progressContainer}>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className={styles.progressSlider}
            title="Seek Audio"
            style={{ '--prog-pct': `${progressPercent}%` }}
          />
          <div 
            className={styles.progressFill} 
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <span className={styles.timeLabel}>{formatTime(duration)}</span>
      </div>

    </div>
  );
}
