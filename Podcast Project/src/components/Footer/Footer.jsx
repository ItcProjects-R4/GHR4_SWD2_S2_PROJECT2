import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Newsletter Section */}
        <div className={styles.newsletter}>
          <div className={styles.newsletterContent}>
            <h3>Stay in the loop</h3>
            <p>Get the latest podcast updates and AI-powered insights delivered to your inbox.</p>
          </div>
          <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              className={styles.newsletterInput}
              placeholder="Enter your email"
            />
            <button type="submit" className={styles.newsletterBtn}>
              Subscribe
            </button>
          </form>
        </div>

        <div className={styles.grid}>
          <div className={styles.section}>
            <h4>
              <i className="fas fa-podcast"></i>
              <span className={styles.brandText}>PodCastt</span>
            </h4>
            <p>Discover, stream, and enjoy the best podcasts with AI-powered recommendations. Your next favorite show is just a click away.</p>
            <div className={styles.socials}>
              <a href="#" title="Facebook" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" title="Twitter" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" title="Instagram" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" title="YouTube" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" title="Discord" aria-label="Discord">
                <i className="fab fa-discord"></i>
              </a>
            </div>
          </div>

          <div className={styles.section}>
            <h5>Navigation</h5>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/categories">Categories</Link>
              </li>
              <li>
                <Link to="/trending">Trending</Link>
              </li>
              <li>
                <Link to="/favorites">Favorites</Link>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h5>About</h5>
            <ul>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h5>Resources</h5>
            <ul>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">Help Center</a>
              </li>
              <li>
                <a href="#">API Documentation</a>
              </li>
              <li>
                <a href="#">Status</a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            &copy; {new Date().getFullYear()} PodCastt. All rights reserved. | Powered by{' '}
            <a href="https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/" target="_blank" rel="noopener noreferrer">
              Apple iTunes Search API
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}