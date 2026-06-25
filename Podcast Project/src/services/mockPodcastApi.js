// Mock API response data for testing without a real API key
const MOCK_PODCASTS = [
  {
    id: 'mock-1',
    title: 'The Daily',
    publisher: 'The New York Times',
    image: 'https://cdn-images-1.listennotes.com/podcasts/the-daily-the-new-york-times-4d3216987302-1UoZtBJ_box_1400.jpg',
    description: 'This is what the news should sound like. The biggest stories of our time, told by the best journalists in the world.',
    total_episodes: 1200,
    latest_pub_date_ms: Date.now()
  },
  {
    id: 'mock-2',
    title: 'Stuff You Should Know',
    publisher: 'iHeartMedia',
    image: 'https://cdn-images-1.listennotes.com/podcasts/stuff-you-should-know-iheartmedia-_mKfPyj8yf6-0fVb7P6Wy0w.jpg',
    description: 'If you have ever wanted to know about champagne, satanism, the Stonewall Uprising, chaos theory, LSD, El Niño, true crime, or just why Roman fish sauce was so expensive.',
    total_episodes: 800,
    latest_pub_date_ms: Date.now()
  },
  {
    id: 'mock-3',
    title: 'Serial',
    publisher: 'Serial Productions',
    image: 'https://cdn-images-1.listennotes.com/podcasts/serial-serial-productions-PvWJrIGzqM1-2bT2-ND3hg5.jpg',
    description: 'One story. Told over one season. Gimlet\'s narrative podcast about a single topic, unfolds one episode at a time.',
    total_episodes: 50,
    latest_pub_date_ms: Date.now()
  },
  {
    id: 'mock-4',
    title: 'Joe Rogan Experience',
    publisher: 'Joe Rogan',
    image: 'https://cdn-images-1.listennotes.com/podcasts/the-joe-rogan-experience-joe-rogan-5d6d5g3zzz3-_5T2-e2WEr9.jpg',
    description: 'The Joe Rogan Experience is a long form conversational comedy podcast.',
    total_episodes: 2000,
    latest_pub_date_ms: Date.now()
  },
  {
    id: 'mock-5',
    title: 'Freakonomics Radio',
    publisher: 'Freakonomics',
    image: 'https://cdn-images-1.listennotes.com/podcasts/freakonomics-radio-freakonomics-gg4aasddswd-1g5W4GJs5yt.jpg',
    description: 'Discover the hidden incentives that drive the world.',
    total_episodes: 500,
    latest_pub_date_ms: Date.now()
  },
  {
    id: 'mock-6',
    title: 'TED Talks Daily',
    publisher: 'TED',
    image: 'https://cdn-images-1.listennotes.com/podcasts/ted-talks-daily-ted-kkkdkddkdk-234L4Jzz82j.jpg',
    description: 'Ideas worth spreading, one day at a time.',
    total_episodes: 3000,
    latest_pub_date_ms: Date.now()
  }
]

const MOCK_GENRES = [
  { id: '1', name: 'Technology', artwork_url: 'https://i.pinimg.com/564x/a0/5e/8d/a05e8dbdf8c6c9ad2ece0bb2ae03d887.jpg', podcasts_count: 5000 },
  { id: '2', name: 'Business', artwork_url: 'https://i.pinimg.com/564x/8a/6e/7a/8a6e7a9e7c8e9f8e8e8e8e8e8e8e8e8e.jpg', podcasts_count: 4000 },
  { id: '3', name: 'News', artwork_url: 'https://i.pinimg.com/564x/1a/2b/3c/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p.jpg', podcasts_count: 3000 },
  { id: '4', name: 'Sports', artwork_url: 'https://i.pinimg.com/564x/9z/8y/7x/9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k.jpg', podcasts_count: 2500 },
  { id: '5', name: 'Entertainment', artwork_url: 'https://i.pinimg.com/564x/7a/6b/5c/7a6b5c4d3e2f1g0h9i8j7k6l5m4n3o2p.jpg', podcasts_count: 6000 },
  { id: '6', name: 'Education', artwork_url: 'https://i.pinimg.com/564x/4x/3y/2z/4x3y2z1w0v9u8t7s6r5q4p3o2n1m0l9k.jpg', podcasts_count: 3500 },
  { id: '7', name: 'Health', artwork_url: 'https://i.pinimg.com/564x/2m/3n/4o/2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b.jpg', podcasts_count: 2800 },
  { id: '8', name: 'Comedy', artwork_url: 'https://i.pinimg.com/564x/8p/9q/0r/8p9q0r1s2t3u4v5w6x7y8z9a0b1c2d3e.jpg', podcasts_count: 4200 }
]

const MOCK_EPISODES = [
  {
    id: 'ep-1',
    title: 'The Butterfly Effect (Part 1)',
    pub_date_ms: Date.now() - 86400000,
    audio_length_sec: 2400,
    description: 'A 16-year-old girl is murdered in small-town Pakistan on New Year\'s Eve, 1999.',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 'ep-2',
    title: 'Hands Up',
    pub_date_ms: Date.now() - 172800000,
    audio_length_sec: 1800,
    description: 'What happened when a man refused to put his hands up for police.',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: 'ep-3',
    title: 'Rumor',
    pub_date_ms: Date.now() - 259200000,
    audio_length_sec: 2100,
    description: 'Urban legends about celebrities turned out to be true stories.',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  }
]

export const mockPodcastApi = {
  search: async (query) => ({
    data: {
      podcasts: MOCK_PODCASTS.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    }
  }),

  getCuratedPodcasts: async () => ({
    data: { podcasts: MOCK_PODCASTS }
  }),

  getBestPodcasts: async () => ({
    data: { podcasts: MOCK_PODCASTS }
  }),

  getPodcast: async (podcastId) => ({
    data: {
      ...MOCK_PODCASTS[0],
      episodes: MOCK_EPISODES
    }
  }),

  getEpisode: async (episodeId) => ({
    data: MOCK_EPISODES[0]
  }),

  getGenres: async () => ({
    data: { genres: MOCK_GENRES }
  }),

  getTrendingPodcasts: async () => ({
    data: { podcasts: MOCK_PODCASTS }
  })
}
