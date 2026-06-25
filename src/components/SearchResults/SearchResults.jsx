import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSearch } from '../../hooks/useSearch'
import { podcastApi } from '../../services/podcastApi'
import PodcastCard from '../Common/PodcastCard/PodcastCard'
import PaginationComponent from '../Common/PaginationComponent/PaginationComponent'
import LoadingSpinner from '../Common/LoadingSpinner/LoadingSpinner'
import styles from './SearchResults.module.css'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')
  const { setSearchResults, isSearching } = useSearch()
  const [currentPage, setCurrentPage] = useState(0)
  const [results, setResults] = useState({ podcasts: [] })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) return

    const fetchSearch = async () => {
      try {
        setLoading(true)
        setCurrentPage(0)
        const response = await podcastApi.search(query)
        setResults(response.data)
        setSearchResults(response.data)
      } catch (error) {
        console.error('Error fetching search results:', error)
        setResults({ podcasts: [] })
      } finally {
        setLoading(false)
      }
    }

    fetchSearch()
  }, [query, setSearchResults])

  if (isSearching || loading) return <LoadingSpinner fullScreen />

  const podcasts = results.podcasts || []
  const itemsPerPage = 10
  const totalPages = Math.ceil(podcasts.length / itemsPerPage)
  const paginatedPodcasts = podcasts.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  return (
    <div className={styles.searchResults}>
      <div className={styles.header}>
        <h1>Search Results</h1>
        <p>
          Results for "<strong>{query}</strong>"
          {podcasts.length > 0 && ` (${podcasts.length} found)`}
        </p>
      </div>

      {podcasts.length === 0 ? (
        <div className={styles.emptyState}>
          <i className="fas fa-search"></i>
          <h2>No results found</h2>
          <p>Try searching for something different</p>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {paginatedPodcasts.map((podcast, index) => (
              <div 
                key={podcast.id} 
                style={{ animationDelay: `${index * 0.05}s` }}
                className="animate-fadeInUp"
              >
                <PodcastCard podcast={podcast} />
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={podcasts.length}
            />
          )}
        </>
      )}
    </div>
  )
}