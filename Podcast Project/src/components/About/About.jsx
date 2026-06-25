import React from 'react'
import { Link } from 'react-router-dom'
import styles from './About.module.css'

export default function About() {
  return (
    <div className={styles.about}>
      <div className={styles.hero}>
        <h1>About PodCastt</h1>
        <p>Your gateway to the world of podcasts. Discover, stream, and enjoy thousands of shows from creators around the globe.</p>
      </div>

      <section className={styles.section}>
        <h2>Our Mission</h2>
        <p>
          PodCastt is dedicated to helping you discover and enjoy podcasts from around the world.
          We believe in the power of audio content to inform, inspire, and entertain.
          Our platform brings together the best podcasts across every genre, making it easy 
          for you to find your next favorite show.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Features</h2>
        <ul>
          <li>Search and discover thousands of podcasts</li>
          <li>Browse by categories and genres</li>
          <li>Keep track of your favorite podcasts</li>
          <li>Listen to episodes right in the app</li>
          <li>Explore trending podcasts</li>
          <li>Dark mode support for comfortable listening</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Powered By</h2>
        <p>
          PodCastt is built with React and powered by the{' '}
          <a href="https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/" target="_blank" rel="noopener noreferrer">
            Apple iTunes Search API
          </a>
          , which provides access to one of the largest podcast databases in the world.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Get Started</h2>
        <p>
          Start exploring now! Use the search bar to find podcasts you love, or browse through our
          categories to discover something new. Create an account to save your favorites and 
          keep track of your listening journey.
        </p>
      </section>

      <div className={styles.ctaSection}>
        <h2>Ready to Start Listening?</h2>
        <p>Join thousands of listeners discovering their next favorite podcast.</p>
        <Link to="/categories" className={styles.ctaButton}>
          <i className="fas fa-compass"></i> Explore Podcasts
        </Link>
      </div>
    </div>
  )
}