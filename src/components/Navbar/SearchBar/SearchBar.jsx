import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '../../../hooks/useSearch'
import { podcastApi } from '../../../services/podcastApi'
import styles from './SearchBar.module.css'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()
  const { setSearchResults, setIsSearching } = useSearch()

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (query.trim()) {
      setIsSearching(true)
      try {
        const response = await podcastApi.search(query)
        setSearchResults(response.data)
        navigate(`/search?q=${encodeURIComponent(query)}`)
        setQuery('')
        setSuggestions([])
        setShowSuggestions(false)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsSearching(false)
      }
    }
  }

  const handleInputChange = async (e) => {
    const value = e.target.value
    setQuery(value)

    if (value.length > 2) {
      setShowSuggestions(true)
      setIsLoading(true)
      try {
        const response = await podcastApi.search(value)
        setSuggestions(
          response.data.podcasts ? response.data.podcasts.slice(0, 5) : []
        )
      } catch (error) {
        console.error('Suggestions error:', error)
      } finally {
        setIsLoading(false)
      }
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (podcast) => {
    navigate(`/podcast/${podcast.id}`)
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
  }

  return (
    <div className={styles.searchContainer} ref={searchRef}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search podcasts..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length > 2 && setShowSuggestions(true)}
        />
        <button type="submit" className={styles.searchBtn}>
          <i className="fas fa-search"></i>
        </button>
      </form>

      {showSuggestions && (
        <div className={styles.suggestions}>
          {isLoading ? (
            <div className={styles.suggestionsLoading}></div>
          ) : suggestions.length > 0 ? (
            suggestions.map((podcast) => (
              <div
                key={podcast.id}
                className={styles.suggestionItem}
                onClick={() => handleSuggestionClick(podcast)}
              >
                {podcast.image && (
                  <img src={podcast.image} alt={podcast.title} />
                )}
                <div className={styles.suggestionContent}>
                  <div className={styles.suggestionTitle}>{podcast.title}</div>
                  <div className={styles.suggestionPublisher}>
                    {podcast.publisher}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.suggestionsEmpty}>
              <i className="fas fa-search"></i>
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  )
}