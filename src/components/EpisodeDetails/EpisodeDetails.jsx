import React, { useState, useEffect } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { podcastApi } from '../../services/podcastApi'
import { summarizeContent } from '../../services/aiService'
import LoadingSpinner from '../Common/LoadingSpinner/LoadingSpinner'
import CustomAudioPlayer from '../Common/CustomAudioPlayer/CustomAudioPlayer'
import styles from './EpisodeDetails.module.css'

export default function EpisodeDetails() {
  const { id } = useParams()
  const location = useLocation()
  const [episode, setEpisode] = useState(location.state?.episode || null)
  const [loading, setLoading] = useState(!location.state?.episode)
  const [isLoadingSummary, setIsLoadingSummary] = useState(false)
  const [summaryError, setSummaryError] = useState(null)
  const [summaryText, setSummaryText] = useState('')

  useEffect(() => {
    // If we already have episode data from route state, no need to fetch
    if (location.state?.episode) {
      setEpisode(location.state.episode)
      setSummaryText('')
      setSummaryError(null)
      return
    }

    const fetchEpisode = async () => {
      try {
        setLoading(true)
        // Try direct episode lookup first
        const response = await podcastApi.getEpisode(id)
        if (response.data) {
          setEpisode(response.data)
          setSummaryText('')
          setSummaryError(null)
        } else {
          setEpisode(null)
        }
      } catch (error) {
        console.error('Error fetching episode:', error)
        setEpisode(null)
      } finally {
        setLoading(false)
      }
    }

    fetchEpisode()
  }, [id])

  const handleSummarize = async () => {
    if (!episode) return

    setIsLoadingSummary(true)
    setSummaryError(null)

    try {
      const summary = await summarizeContent({
        title: episode.podcast_title,
        publisher: episode.podcast_title,
        primaryGenreName: episode.primaryGenreName,
        description: episode.description,
        episodeTitle: episode.title,
        episodeDescription: episode.description,
        releaseDate: episode.pub_date_ms
          ? new Date(episode.pub_date_ms).toLocaleDateString()
          : null,
        trackTimeMillis: episode.audio_length_sec
          ? episode.audio_length_sec * 1000
          : null,
      })
      setSummaryText(summary)
    } catch (error) {
      console.error('Summary error:', error)
      setSummaryError(
        error.message || 'Failed to generate summary. Please try again.'
      )
      setSummaryText('')
    } finally {
      setIsLoadingSummary(false)
    }
  }

  if (loading) return <LoadingSpinner fullScreen />
  if (!episode) return (
    <div className={styles.notFound}>
      <i className="fas fa-podcast"></i>
      Episode not found
    </div>
  )

  const audioUrl = episode.audio || episode.audio_url

  return (
    <div className={styles.episodeDetails}>
      <div className={styles.episodeDetailsInner}>
        <Link to={`/podcast/${episode.podcast_id}`} className={styles.backLink}>
          <i className="fas fa-arrow-left"></i> Back to Podcast
        </Link>

      <div className={styles.header}>
        {episode.image && (
          <img src={episode.image} alt={episode.title} className={styles.image} />
        )}
        <div className={styles.info}>
          <h1>{episode.title}</h1>
          <p className={styles.podcast}>{episode.podcast_title}</p>
          <div className={styles.meta}>
            {episode.pub_date_ms && (
              <span>
                <i className="fas fa-calendar"></i>{' '}
                {new Date(episode.pub_date_ms).toLocaleDateString()}
              </span>
            )}
            {episode.audio_length_sec && (
              <span>
                <i className="fas fa-clock"></i>{' '}
                {Math.round(episode.audio_length_sec / 60)} min
              </span>
            )}
          </div>
        </div>
      </div>

      {audioUrl && (
        <div className={styles.audioPlayer}>
          <h3>
            <i className="fas fa-headphones"></i> Listen
          </h3>
          <CustomAudioPlayer 
            src={audioUrl}
            episodeTitle={episode.title}
            podcastTitle={episode.podcast_title}
            episode={episode}
          />
          <p className={styles.previewNote}>
            Preview clip provided by Apple iTunes
          </p>
        </div>
      )}

      <div className={styles.aiSummary}>
        <div className={styles.aiSummaryHeader}>
          <h3>
            <i className="fas fa-wand-magic-sparkles"></i> Summarize Episode
          </h3>
          <button
            className={styles.summarizeBtn}
            onClick={handleSummarize}
            disabled={isLoadingSummary}
          >
            {isLoadingSummary ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Summarizing...
              </>
            ) : (
              <>
                <i className="fas fa-robot"></i> Generate Summary
              </>
            )}
          </button>
        </div>

        {isLoadingSummary && (
          <div className={styles.summaryLoading}>
            <LoadingSpinner />
            <p>Generating AI summary...</p>
          </div>
        )}

        {summaryError && (
          <div className={styles.summaryError}>
            <i className="fas fa-exclamation-circle"></i> {summaryError}
          </div>
        )}

        {summaryText && !isLoadingSummary && (
          <div className={styles.summaryOutput}>
            <div className={styles.summaryMarkdown}>
              <ReactMarkdown>{summaryText}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {episode.description && (
        <div className={styles.description}>
          <h3><i className="fas fa-align-left"></i> Description</h3>
          <p>{episode.description}</p>
        </div>
      )}
      </div>
    </div>
  )
}