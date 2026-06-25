import React from 'react'
import { Link } from 'react-router-dom'
import CustomAudioPlayer from '../CustomAudioPlayer/CustomAudioPlayer'
import styles from './EpisodeCard.module.css'

export default function EpisodeCard({ episode, onSummarize, isSummarizing }) {
  const publishDate = episode.pub_date_ms
    ? new Date(episode.pub_date_ms).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Unknown date'

  const audioUrl = episode.audio || episode.audio_url

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h4 className={styles.title}>
            <Link to={`/episode/${episode.id}`} state={{ episode }}>{episode.title}</Link>
          </h4>
          {onSummarize && (
            <button
              className={styles.summarizeBtn}
              onClick={onSummarize}
              disabled={isSummarizing}
              title="Summarize with AI"
            >
              {isSummarizing ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-robot"></i>
              )}
            </button>
          )}
        </div>
        <div className={styles.meta}>
          <span>
            <i className="fas fa-calendar"></i> {publishDate}
          </span>
          {episode.audio_length_sec && (
            <span>
              <i className="fas fa-clock"></i>{' '}
              {Math.round(episode.audio_length_sec / 60)} min
            </span>
          )}
        </div>
        {episode.description && (
          <p className={styles.description}>
            {episode.description.substring(0, 200)}
            {episode.description.length > 200 ? '...' : ''}
          </p>
        )}
      </div>
      {audioUrl && (
        <div className={styles.audioContainer}>
          <CustomAudioPlayer 
            src={audioUrl}
            minimal={true}
            episode={episode}
          />
        </div>
      )}
    </div>
  )
}
