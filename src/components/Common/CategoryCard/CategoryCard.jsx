import React from 'react'
import { Link } from 'react-router-dom'
import styles from './CategoryCard.module.css'

// Category icons mapping
const categoryIcons = {
  'Arts': 'fa-palette',
  'Business': 'fa-briefcase',
  'Comedy': 'fa-laugh-beam',
  'Education': 'fa-graduation-cap',
  'Fiction': 'fa-book',
  'Health': 'fa-heartbeat',
  'History': 'fa-landmark',
  'Kids': 'fa-child',
  'Music': 'fa-music',
  'News': 'fa-newspaper',
  'Religion': 'fa-pray',
  'Science': 'fa-flask',
  'Sports': 'fa-running',
  'Technology': 'fa-microchip',
  'True Crime': 'fa-user-secret',
  'TV & Film': 'fa-film',
  'default': 'fa-folder'
}

// Category colors mapping
const categoryColors = [
  'blue', 'green', 'orange', 'red', 'pink', 'cyan', 'indigo', 'purple'
]

export default function CategoryCard({ category }) {
  const getIcon = () => {
    const icon = categoryIcons[category.name] || categoryIcons['default']
    return icon
  }

  const getColor = () => {
    // Use category id to deterministically pick a color
    const colorIndex = (category.id || 0) % categoryColors.length
    return categoryColors[colorIndex]
  }

  return (
    <Link 
      to={`/category/${category.id}`} 
      className={styles.card}
      data-color={getColor()}
    >
      <div className={styles.iconWrapper}>
        <i className={`fas ${getIcon()}`}></i>
      </div>
      <h3 className={styles.title}>{category.name}</h3>
      {category.podcastCount && (
        <span className={styles.count}>{category.podcastCount} podcasts</span>
      )}
      <div className={styles.arrow}>
        <i className="fas fa-arrow-right"></i>
      </div>
    </Link>
  )
}