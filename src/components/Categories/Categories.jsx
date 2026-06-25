import React, { useState, useEffect } from 'react'
import { podcastApi } from '../../services/podcastApi'
import CategoryCard from '../Common/CategoryCard/CategoryCard'
import LoadingSpinner from '../Common/LoadingSpinner/LoadingSpinner'
import styles from './Categories.module.css'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await podcastApi.getGenres()
        setCategories(response.data.genres || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <div className={styles.categories}>
      <div className={styles.header}>
        <h1>Podcast Categories</h1>
        <p>Explore thousands of podcasts across every genre and topic imaginable</p>
      </div>

      <div className={styles.grid}>
        {categories.map((category, index) => (
          <div 
            key={category.id} 
            style={{ animationDelay: `${index * 0.05}s` }}
            className="animate-fadeInUp"
          >
            <CategoryCard category={category} />
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className={styles.emptyState}>
          <i className="fas fa-folder-open"></i>
          <h3>No categories found</h3>
          <p>Try refreshing the page</p>
        </div>
      )}
    </div>
  )
}