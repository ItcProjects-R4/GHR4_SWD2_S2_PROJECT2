import React from 'react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../../hooks/useFavorites'
import PodcastCard from '../Common/PodcastCard/PodcastCard'
import styles from './Favorites.module.css'

export default function Favorites() {
  const { favorites, clearFavorites } = useFavorites()

  return (
    <div className={styles.favorites}>
      <div className={styles.header}>
        <h1><i className="fas fa-heart"></i> My Favorites</h1>
        <p>Your personal collection of favorite podcasts</p>
      </div>

      {favorites.length === 0 ? (
        <div className={styles.emptyState}>
          <i className="fas fa-heart-broken"></i>
          <h2>No favorites yet</h2>
          <p>Start adding podcasts to your favorites to see them here. Explore our categories and trending podcasts to find your next favorite show!</p>
          <Link to="/categories" className={styles.exploreBtn}>
            <i className="fas fa-compass"></i> Explore Podcasts
          </Link>
        </div>
      ) : (
        <>
          <p className={styles.count}>
            You have <span>{favorites.length}</span> favorite{favorites.length !== 1 ? 's' : ''}
          </p>

          {favorites.length > 0 && (
            <button className={styles.clearBtn} onClick={clearFavorites}>
              <i className="fas fa-trash-alt"></i> Clear All Favorites
            </button>
          )}

          <div className={styles.grid}>
            {favorites.map((podcast, index) => (
              <div 
                key={podcast.id} 
                style={{ animationDelay: `${index * 0.08}s` }}
                className="animate-fadeInUp"
              >
                <PodcastCard podcast={podcast} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}