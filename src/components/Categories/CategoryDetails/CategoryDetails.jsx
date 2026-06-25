import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { podcastApi } from '../../../services/podcastApi'
import PodcastCard from '../../Common/PodcastCard/PodcastCard'
import PaginationComponent from '../../Common/PaginationComponent/PaginationComponent'
import LoadingSpinner from '../../Common/LoadingSpinner/LoadingSpinner'
import styles from './CategoryDetails.module.css'

export default function CategoryDetails() {
  const { id } = useParams()
  const [podcasts, setPodcasts] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [categoryName, setCategoryName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setLoading(true)
        const response = await podcastApi.getBestPodcasts(id, currentPage)
        setPodcasts(response.data.podcasts || [])
        setTotalPages(Math.ceil((response.data.total || 0) / 10))
        setCategoryName(response.data.name || `Category ${id}`)
      } catch (error) {
        console.error('Error fetching category podcasts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPodcasts()
  }, [id, currentPage])

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <div className={styles.categoryDetails}>
      <div className={styles.header}>
        <h1>{categoryName}</h1>
        <p>Discover the best podcasts in this category</p>
      </div>
      <div className={styles.grid}>
        {podcasts.map((podcast) => (
          <PodcastCard key={podcast.id} podcast={podcast} />
        ))}
      </div>
      {podcasts.length === 0 && (
        <div className={styles.emptyState}>
          <i className="fas fa-inbox"></i>
          <p>No podcasts found in this category</p>
        </div>
      )}
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={totalPages * 10}
      />
    </div>
  )
}
