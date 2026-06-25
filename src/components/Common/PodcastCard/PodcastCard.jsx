import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../../../hooks/useFavorites'
import styles from './PodcastCard.module.css'

export default function PodcastCard({ podcast, showTrending = false }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const [imgError, setImgError] = useState(false)

  const favorite = isFavorite(podcast.id)

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(podcast)
  }

  const handleImageError = () => {
    setImgError(true)
  }

  const getImageUrl = () => {
    if (imgError || !podcast.image) {
      return 'https://via.placeholder.com/300x300/7C3AED/FFFFFF?text=Podcast'
    }
    return podcast.image
  }

  const formatDuration = (seconds) => {
    if (!seconds) return null
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    }
    return `${minutes}m`
  }

  return (
    <Link 
      to={`/podcast/${podcast.id}`} 
      className={styles.card}
    >
      {/* Trending Badge */}
      {showTrending && (
        <div className={styles.trendingBadge}>
          <i className="fas fa-fire"></i> Trending
        </div>
      )}

      {/* Image Container */}
      <div className={styles.imageContainer}>
        <img 
          src={getImageUrl()} 
          alt={podcast.title}
          onError={handleImageError}
          loading="lazy"
        />

        {/* Hover Overlay */}
        <div className={styles.imageOverlay}>
          <button className={styles.playButton} aria-label="Play podcast">
            <i className="fas fa-play"></i>
          </button>
        </div>

        {/* Duration Badge */}
        {podcast.audio_length_sec && (
          <div className={styles.durationBadge}>
            <i className="fas fa-clock" style={{ fontSize: '0.7rem', marginRight: '4px' }}></i>
            {formatDuration(podcast.audio_length_sec)}
          </div>
        )}

        {/* Favorite Button */}
        <button
          className={`${styles.favoriteBtn} ${favorite ? styles.active : ''}`}
          onClick={handleFavoriteClick}
          type="button"
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={favorite}
        >
          <i className={favorite ? 'fas fa-heart' : 'far fa-heart'}></i>
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {podcast.genre && (
          <div className={styles.category}>
            <i className="fas fa-tag"></i> {podcast.genre}
          </div>
        )}

        <h3 className={styles.title}>{podcast.title}</h3>

        {podcast.publisher && (
          <div className={styles.publisher}>
            <i className="fas fa-microphone" style={{ marginRight: '6px', fontSize: '0.8rem' }}></i>
            {podcast.publisher}
          </div>
        )}

        {podcast.description && (
          <p className={styles.description}>{podcast.description}</p>
        )}

        {/* Meta Info */}
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <i className="fas fa-headphones"></i>
            <span>{podcast.total_episodes || 0} eps</span>
          </div>

          {podcast.rating && (
            <div className={styles.rating}>
              <i className="fas fa-star"></i>
              <span>{podcast.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
