import { getLoggedInUser } from "./LocalStorage";

const HISTORY_KEY = "podcastListeningHistory";

// Get history specific to the logged-in user
export function getUserHistory() {
  const user = getLoggedInUser();
  if (!user) return [];

  const rawHistory = localStorage.getItem(`${HISTORY_KEY}_${user.email}`);
  return rawHistory ? JSON.parse(rawHistory) : [];
}

// Add an episode to history
export function addToHistory(episode) {
  const user = getLoggedInUser();
  if (!user) return; // Only track for logged in users

  const history = getUserHistory();
  
  // Check if it already exists, remove it so we can push it to the front
  const existingIndex = history.findIndex((item) => item.id === episode.id);
  if (existingIndex > -1) {
    history.splice(existingIndex, 1);
  }

  // Add a timestamp
  const newEntry = {
    ...episode,
    listenedAt: new Date().toISOString()
  };

  history.unshift(newEntry); // Add to beginning

  // Limit history length (e.g., last 200 episodes)
  if (history.length > 200) {
    history.pop();
  }

  localStorage.setItem(`${HISTORY_KEY}_${user.email}`, JSON.stringify(history));
}

// Calculate statistics from history
export function getHistoryStats() {
  const history = getUserHistory();
  
  let totalTimeSec = 0;
  const genreCounts = {};
  const datesSet = new Set();
  
  // Weekly Activity Array (Last 7 days)
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7Days.push({
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      count: 0
    });
  }

  history.forEach((episode) => {
    // Add time
    if (episode.audio_length_sec) {
      totalTimeSec += episode.audio_length_sec;
    }

    // Count genres
    const genre = episode.primaryGenreName || 'General';
    if (genreCounts[genre]) {
      genreCounts[genre]++;
    } else {
      genreCounts[genre] = 1;
    }
    
    // Active Days & Weekly Activity
    if (episode.listenedAt) {
      const dateStr = episode.listenedAt.split('T')[0];
      datesSet.add(dateStr);
      
      const activityDay = last7Days.find(d => d.dateStr === dateStr);
      if (activityDay) {
        activityDay.count++;
      }
    }
  });

  const uniqueDaysListened = datesSet.size;
  const averageTimePerDay = uniqueDaysListened > 0 ? Math.floor(totalTimeSec / uniqueDaysListened) : 0;

  // Sort genres by count
  const sortedGenres = Object.keys(genreCounts).map((genre) => ({
    name: genre,
    count: genreCounts[genre]
  })).sort((a, b) => b.count - a.count);

  return {
    totalEpisodes: history.length,
    totalTimeSec,
    uniqueDaysListened,
    averageTimePerDay,
    weeklyActivity: last7Days,
    topGenres: sortedGenres.slice(0, 5), // Top 5
    recentEpisodes: history.slice(0, 8)  // Last 8
  };
}

export function clearHistory() {
  const user = getLoggedInUser();
  if (!user) return;
  localStorage.removeItem(`${HISTORY_KEY}_${user.email}`);
}
