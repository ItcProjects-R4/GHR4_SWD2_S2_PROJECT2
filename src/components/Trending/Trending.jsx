import React, { useState, useEffect } from 'react'
import { podcastApi } from '../../services/podcastApi'
import PodcastCard from '../Common/PodcastCard/PodcastCard'
import LoadingSpinner from '../Common/LoadingSpinner/LoadingSpinner'
import styles from './Trending.module.css'

export default function Trending() {
  const [podcasts, setPodcasts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true)
        const response = await podcastApi.getTrendingPodcasts()
        setPodcasts(response.data.podcasts || [])
      } catch (error) {
        console.error('Error fetching trending podcasts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrending()
  }, [])

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <div className={styles.trending}>
      <div className={styles.header}>
        <h1><i className="fas fa-fire"></i> Trending Podcasts</h1>
        <p>The hottest podcasts right now, hand-picked by our editors and community engagement</p>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statPill}>
          <i className="fas fa-fire"></i>
          <span>Updated Daily</span>
        </div>
        <div className={styles.statPill}>
          <i className="fas fa-users"></i>
          <span>Community Picks</span>
        </div>
        <div className={styles.statPill}>
          <i className="fas fa-chart-line"></i>
          <span>Most Popular</span>
        </div>
      </div>

      <div className={styles.grid}>
        {podcasts.map((podcast, index) => (
          <div 
            key={podcast.id} 
            style={{ animationDelay: `${index * 0.08}s` }}
            className="animate-fadeInUp"
          >
            <PodcastCard podcast={podcast} showTrending={index < 3} />
          </div>
        ))}
      </div>

      {podcasts.length === 0 && (
        <div className={styles.emptyState}>
          <i className="fas fa-fire-alt"></i>
          <h3>No trending podcasts found</h3>
          <p>Check back later for the latest trending shows</p>
        </div>
      )}
    </div>
  )
}