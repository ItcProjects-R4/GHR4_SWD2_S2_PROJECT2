import React, { useEffect, useState } from 'react';
import { getHistoryStats } from '../../services/HistoryService';
import EpisodeCard from '../Common/EpisodeCard/EpisodeCard';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Load stats from localStorage
    const data = getHistoryStats();
    setStats(data);
  }, []);

  if (!stats) return null;

  const { 
    totalEpisodes, 
    totalTimeSec, 
    topGenres, 
    recentEpisodes,
    uniqueDaysListened,
    averageTimePerDay,
    weeklyActivity 
  } = stats;

  const hours = Math.floor(totalTimeSec / 3600);
  const minutes = Math.floor((totalTimeSec % 3600) / 60);

  const avgHours = Math.floor(averageTimePerDay / 3600);
  const avgMinutes = Math.floor((averageTimePerDay % 3600) / 60);

  // Maximum count for percentage bars
  const maxGenreCount = topGenres.length > 0 ? topGenres[0].count : 1;
  const maxActivityCount = Math.max(...weeklyActivity.map(d => d.count), 1);

  return (
    <div className={`page-wrapper ${styles.dashboardWrapper}`}>
      <div className={`container ${styles.dashboardContainer}`}>
        <header className={styles.header}>
          <h1 className="gradient-text"><i className="fas fa-chart-pie"></i> Your Listening Dashboard</h1>
          <p>A comprehensive analysis of your podcast usage and preferences.</p>
        </header>

        <div className={styles.statsGrid}>
          <div className="card surface-elevated animate-fadeInUp stagger-1">
            <div className={styles.statCardInner}>
              <i className="fas fa-clock"></i>
              <h3>Total Time</h3>
              <p className={styles.statValue}>
                {hours > 0 ? `${hours}h ` : ''}{minutes}m
              </p>
            </div>
          </div>
          
          <div className="card surface-elevated animate-fadeInUp stagger-2">
            <div className={styles.statCardInner}>
              <i className="fas fa-headphones"></i>
              <h3>Episodes Played</h3>
              <p className={styles.statValue}>{totalEpisodes}</p>
            </div>
          </div>
          
          <div className="card surface-elevated animate-fadeInUp stagger-3">
            <div className={styles.statCardInner}>
              <i className="fas fa-fire"></i>
              <h3>Active Days</h3>
              <p className={styles.statValue}>{uniqueDaysListened}</p>
            </div>
          </div>

          <div className="card surface-elevated animate-fadeInUp stagger-4">
            <div className={styles.statCardInner}>
              <i className="fas fa-stopwatch"></i>
              <h3>Daily Average</h3>
              <p className={styles.statValue}>
                {avgHours > 0 ? `${avgHours}h ` : ''}{avgMinutes}m
              </p>
            </div>
          </div>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.leftColumn}>
            {/* Weekly Activity Chart */}
            <section className={`card animate-slideInRight stagger-3 ${styles.analysisSection}`}>
              <h2><i className="fas fa-chart-line"></i> 7-Day Activity</h2>
              <div className={styles.activityChart}>
                {weeklyActivity.map((day, idx) => (
                  <div key={idx} className={styles.activityBarWrapper} title={`${day.count} episodes on ${day.dateStr}`}>
                    <div className={styles.activityBarBg}>
                      <div 
                        className={styles.activityBarFill}
                        style={{ height: `${(day.count / maxActivityCount) * 100}%` }}
                      ></div>
                    </div>
                    <span className={styles.activityDayLabel}>{day.dayName}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Top Genres */}
            <section className={`card animate-slideInRight stagger-4 ${styles.analysisSection}`}>
              <h2><i className="fas fa-chart-bar"></i> Top Genres</h2>
              {topGenres.length > 0 ? (
                <div className={styles.barsContainer}>
                  {topGenres.map((genre, index) => (
                    <div key={index} className={styles.barWrapper}>
                      <div className={styles.barLabel}>
                        <span>{genre.name}</span>
                        <span>{genre.count} listens</span>
                      </div>
                      <div className={styles.progressBg}>
                        <div 
                          className={styles.progressFill}
                          style={{ width: `${(genre.count / maxGenreCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.emptyMessage}>You haven't listened to enough podcasts to generate analysis yet.</p>
              )}
            </section>
          </div>

          <div className={styles.rightColumn}>
            <section className={`card animate-fadeInUp stagger-5 ${styles.recentSection}`}>
              <h2><i className="fas fa-history"></i> Recently Listened</h2>
              {recentEpisodes.length > 0 ? (
                <div className={styles.recentGrid}>
                  {recentEpisodes.map((episode, index) => (
                    <EpisodeCard key={`${episode.id}-${index}`} episode={episode} />
                  ))}
                </div>
              ) : (
                <p className={styles.emptyMessage}>Your history is empty. Start listening to see your recent podcasts here!</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
