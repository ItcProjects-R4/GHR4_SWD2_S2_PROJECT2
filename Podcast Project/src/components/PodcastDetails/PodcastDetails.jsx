import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { podcastApi } from '../../services/podcastApi'
import { summarizeContent } from '../../services/aiService'
import { useFavorites } from '../../hooks/useFavorites'
import EpisodeCard from '../Common/EpisodeCard/EpisodeCard'
import LoadingSpinner from '../Common/LoadingSpinner/LoadingSpinner'
import styles from './PodcastDetails.module.css'

export default function PodcastDetails() {
  const { id } = useParams()
  const [podcast, setPodcast] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLoadingSummary, setIsLoadingSummary] = useState(false)
  const [summaryError, setSummaryError] = useState(null)
  const [summaryText, setSummaryText] = useState('')
  const [selectedEpisode, setSelectedEpisode] = useState(null)
  const { isFavorite, toggleFavorite } = useFavorites()
  const isFav = podcast && isFavorite(podcast.id)

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        setLoading(true)
        const response = await podcastApi.getPodcast(id)
        setPodcast(response.data)
        setEpisodes(response.data?.episodes || [])
        setSummaryText('')
        setSummaryError(null)
        setSelectedEpisode(null)
      } catch (error) {
        console.error('Error fetching podcast:', error)
        setPodcast(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPodcast()
  }, [id])

  const handleSummarize = async (episode = null) => {
    if (!podcast) return

    setIsLoadingSummary(true)
    setSummaryError(null)
    setSelectedEpisode(episode)

    try {
      const summary = await summarizeContent({
        title: podcast.title,
        publisher: podcast.publisher,
        primaryGenreName: podcast.primaryGenreName,
        description: podcast.description,
        episodeTitle: episode?.title,
        episodeDescription: episode?.description,
        releaseDate: episode?.pub_date_ms
          ? new Date(episode.pub_date_ms).toLocaleDateString()
          : null,
        trackTimeMillis: episode?.audio_length_sec
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
  if (!podcast) return (
    <div className={styles.notFound}>
      <i className="fas fa-podcast"></i>
      Podcast not found
    </div>
  )

  return (
    <div className={styles.podcastDetails}>
      <div className={styles.podcastDetailsInner}>
        <div className={styles.header}>
        <div className={styles.cover}>
          <img src={podcast.image} alt={podcast.title} />
          <button
            className={`${styles.favoriteBtn} ${isFav ? styles.active : ''}`}
            onClick={() => toggleFavorite(podcast)}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <i className={`fas fa-heart${isFav ? '' : '-o'}`}></i>
          </button>
        </div>
        <div className={styles.info}>
          <h1>{podcast.title}</h1>
          <p className={styles.publisher}>{podcast.publisher}</p>
          {podcast.primaryGenreName && (
            <span className={styles.genre}>
              <i className="fas fa-tag"></i> {podcast.primaryGenreName}
            </span>
          )}
          <p className={styles.description}>{podcast.description}</p>
          <div className={styles.meta}>
            <span>
              <i className="fas fa-play-circle"></i> {episodes.length} episodes
            </span>
            {podcast.latest_pub_date_ms && (
              <span>
                <i className="fas fa-calendar"></i>{' '}
                {new Date(podcast.latest_pub_date_ms).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.aiSummary}>
        <div className={styles.aiSummaryHeader}>
          <h2>
            <i className="fas fa-wand-magic-sparkles"></i> AI Summary
          </h2>
          <div className={styles.aiSummaryActions}>
            <button
              className={styles.summarizeBtn}
              onClick={() => handleSummarize(null)}
              disabled={isLoadingSummary}
            >
              {isLoadingSummary && !selectedEpisode ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Summarizing...
                </>
              ) : (
                <>
                  <i className="fas fa-robot"></i> Summarize Podcast
                </>
              )}
            </button>
          </div>
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
            {selectedEpisode && (
              <p className={styles.summaryEpisodeLabel}>
                Summary for: <strong>{selectedEpisode.title}</strong>
              </p>
            )}
            <div className={styles.summaryMarkdown}>
              <ReactMarkdown>{summaryText}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      <div className={styles.episodes}>
        <h2><i className="fas fa-list-ul"></i> Episodes</h2>
        <div className={styles.episodesList}>
          {episodes.length > 0 ? (
            episodes.map((episode) => (
              <EpisodeCard
                key={episode.id}
                episode={episode}
                onSummarize={() => handleSummarize(episode)}
                isSummarizing={
                  isLoadingSummary &&
                  selectedEpisode?.id === episode.id
                }
              />
            ))
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
              No episodes available
            </p>
          )}
        </div>
        </div>
      </div>
    </div>
  )
}
