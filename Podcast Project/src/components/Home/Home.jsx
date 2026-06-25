import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { podcastApi } from '../../services/podcastApi'
import { useSearch } from '../../hooks/useSearch'
import PodcastCard from '../Common/PodcastCard/PodcastCard'
import CategoryCard from '../Common/CategoryCard/CategoryCard'
import LoadingSpinner from '../Common/LoadingSpinner/LoadingSpinner'
import styles from './Home.module.css'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [featuredPodcasts, setFeaturedPodcasts] = useState([])
  const [categories, setCategories] = useState([])
  const [trendingPodcasts, setTrendingPodcasts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { setSearchResults, setIsSearching } = useSearch()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [curatedRes, genresRes, bestRes] = await Promise.all([
          podcastApi.getCuratedPodcasts('all', 0),
          podcastApi.getGenres(),
          podcastApi.getBestPodcasts('', 0),
        ])

        setFeaturedPodcasts(
          curatedRes.data.podcasts ? curatedRes.data.podcasts.slice(0, 6) : []
        )
        setCategories(
          genresRes.data.genres
            ? genresRes.data.genres.slice(0, 8).map((g) => ({
              ...g,
              id: g.id,
            }))
            : []
        )
        setTrendingPodcasts(bestRes.data.podcasts ? bestRes.data.podcasts.slice(0, 6) : [])
      } catch (error) {
        console.error('Error fetching home data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleHeroSearch = async (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearching(true)
      try {
        const response = await podcastApi.search(searchQuery)
        setSearchResults(response.data)
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsSearching(false)
      }
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Discover Your Next Favorite Podcast</h1>
          <p>Explore thousands of podcasts covering every topic imaginable</p>
          <form onSubmit={handleHeroSearch} className={styles.heroSearch}>
            <input
              type="text"
              placeholder="Search podcasts, topics, or creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <i className="fas fa-search"></i> Search
            </button>
          </form>
        </div>
      </section>

      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>50K+</div>
          <div className={styles.statLabel}>Podcasts</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>1M+</div>
          <div className={styles.statLabel}>Episodes</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>100+</div>
          <div className={styles.statLabel}>Categories</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>10M+</div>
          <div className={styles.statLabel}>Listeners</div>
        </div>
      </div>

      {/* Featured Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Featured Podcasts</h2>
          <p>Hand-picked selections just for you</p>
        </div>
        <div className={styles.grid}>
          {featuredPodcasts.map((podcast, index) => (
            <div key={podcast.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fadeInUp">
              <PodcastCard podcast={podcast} />
            </div>
          ))}
        </div>
        <div className={styles.viewAll}>
          <Link to="/categories" className={styles.viewAllBtn}>
            View All Podcasts <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Popular Categories</h2>
          <p>Browse podcasts by category</p>
        </div>
        <div className={`${styles.grid} ${styles.categoryGrid}`}>
          {categories.map((category, index) => (
            <div key={category.id} style={{ animationDelay: `${index * 0.05}s` }} className="animate-fadeInUp">
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </section>

      {/* AI Features Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Listen Smarter with AI</h2>
          <p>Powered by advanced AI to enhance your listening experience</p>
        </div>
        <div className={styles.aiFeatures}>
          <div className={styles.aiCard}>
            <div className={styles.aiCardIcon}>
              <i className="fas fa-bolt"></i>
            </div>
            <h3>Instant Summaries</h3>
            <p>Get the gist of any 2-hour podcast in just 60 seconds with our neural text distillation.</p>
          </div>
          <div className={styles.aiCard}>
            <div className={styles.aiCardIcon}>
              <i className="fas fa-key"></i>
            </div>
            <h3>Key Takeaways</h3>
            <p>Automatic timestamp extraction for the most important insights mentioned.</p>
          </div>
          <div className={styles.aiCard}>
            <div className={styles.aiCardIcon}>
              <i className="fas fa-search"></i>
            </div>
            <h3>Smart Search</h3>
            <p>Search by topic or emotion, not just by title or episode name.</p>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Trending Now</h2>
          <p>The most popular podcasts right now</p>
        </div>
        <div className={styles.grid}>
          {trendingPodcasts.map((podcast, index) => (
            <div key={podcast.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fadeInUp">
              <PodcastCard podcast={podcast} />
            </div>
          ))}
        </div>
        <div className={styles.viewAll}>
          <Link to="/trending" className={styles.viewAllBtn}>
            View All Trending <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </section>
    </div>
  )
}