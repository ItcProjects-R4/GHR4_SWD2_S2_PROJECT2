import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Notfound.module.css'

export default function Notfound() {
  return (
    <div className={styles.notfound}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <i className="fas fa-podcast"></i>
          <span className={styles.errorCode}>404</span>
        </div>
        <h1>Page Not Found</h1>
        <p>
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back to discovering great podcasts.
        </p>
        <Link to="/" className={styles.homeLink}>
          <i className="fas fa-home"></i> Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
