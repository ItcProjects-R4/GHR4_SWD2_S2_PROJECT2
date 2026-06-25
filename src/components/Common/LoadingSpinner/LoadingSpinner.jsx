import React from 'react'
import styles from './LoadingSpinner.module.css'

export default function LoadingSpinner({ 
  size = 'medium', 
  fullScreen = false, 
  variant = 'circle',
  text = 'Loading...' 
}) {
  if (fullScreen) {
    return (
      <div className={styles.fullScreen}>
        <div className={`${styles.spinner} ${styles.spinnerLarge}`}>
          <div className={styles.spinnerCircle}></div>
        </div>
        <span className={styles.loadingText}>{text}</span>
      </div>
    )
  }

  const sizeClass = size === 'small' ? styles.spinnerSmall : 
                    size === 'large' ? styles.spinnerLarge : ''

  if (variant === 'dots') {
    return (
      <div className={`${styles.dotsSpinner} ${sizeClass}`}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div className={`${styles.pulseSpinner} ${sizeClass}`}></div>
    )
  }

  return (
    <div className={`${styles.spinner} ${sizeClass}`}>
      <div className={styles.spinnerCircle}></div>
    </div>
  )
}