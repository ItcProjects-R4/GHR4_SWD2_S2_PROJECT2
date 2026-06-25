// Mock podcast data for testing without API key
export const mockPodcasts = [
  {
    id: 'mock-1',
    title: 'The Daily',
    publisher: 'The New York Times',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&h=300&fit=crop',
    description: 'This is what the news should sound like. The biggest stories of our time, told by the best journalists.',
    total_episodes: 500,
    latest_pub_date_ms: Date.now(),
  },
  {
    id: 'mock-2',
    title: 'True Crime Junkie',
    publisher: 'Audioboom',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    description: 'Uncovering the truth behind real crimes.',
    total_episodes: 150,
    latest_pub_date_ms: Date.now() - 86400000,
  },
  {
    id: 'mock-3',
    title: 'Stuff You Should Know',
    publisher: 'iHeartRadio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    description: 'From the stuff you should know about history.',
    total_episodes: 600,
    latest_pub_date_ms: Date.now() - 172800000,
  },
  {
    id: 'mock-4',
    title: 'The Joe Rogan Experience',
    publisher: 'Joe Rogan',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    description: 'A long form, deep dive conversational podcast.',
    total_episodes: 1500,
    latest_pub_date_ms: Date.now() - 259200000,
  },
  {
    id: 'mock-5',
    title: 'Serial',
    publisher: 'Gimlet Media',
    image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop',
    description: 'One story, one season, all the details.',
    total_episodes: 5,
    latest_pub_date_ms: Date.now() - 345600000,
  },
  {
    id: 'mock-6',
    title: 'Reply All',
    publisher: 'Gimlet Media',
    image: 'https://images.unsplash.com/photo-1478737270695-42489db1fe41?w=300&h=300&fit=crop',
    description: 'Stories from the internet.',
    total_episodes: 200,
    latest_pub_date_ms: Date.now() - 432000000,
  },
]

export const mockCategories = [
  {
    id: 'all',
    name: 'All',
    artwork_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
    podcasts_count: 1500000,
  },
  {
    id: 'news',
    name: 'News & Politics',
    artwork_url: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=300&h=300&fit=crop',
    podcasts_count: 15000,
  },
  {
    id: 'comedy',
    name: 'Comedy',
    artwork_url: 'https://images.unsplash.com/photo-1527269540754-5a4db46f4d5f?w=300&h=300&fit=crop',
    podcasts_count: 8000,
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    artwork_url: 'https://images.unsplash.com/photo-1508700115892-f51f8e96df47?w=300&h=300&fit=crop',
    podcasts_count: 12000,
  },
  {
    id: 'education',
    name: 'Education',
    artwork_url: 'https://images.unsplash.com/photo-1456627348059-92afde62bc61?w=300&h=300&fit=crop',
    podcasts_count: 9000,
  },
  {
    id: 'sports',
    name: 'Sports',
    artwork_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&h=300&fit=crop',
    podcasts_count: 7000,
  },
  {
    id: 'technology',
    name: 'Technology',
    artwork_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=300&fit=crop',
    podcasts_count: 6000,
  },
  {
    id: 'business',
    name: 'Business',
    artwork_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=300&fit=crop',
    podcasts_count: 5000,
  },
]

export const mockEpisodes = [
  {
    id: 'ep-1',
    title: 'Episode 1: The Beginning',
    podcast_title: 'The Daily',
    description: 'This is the first episode of our podcast series.',
    pub_date_ms: Date.now() - 86400000,
    audio_length_sec: 1800,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=200&h=200&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 'ep-2',
    title: 'Episode 2: Going Deeper',
    podcast_title: 'The Daily',
    description: 'We dive deeper into the story.',
    pub_date_ms: Date.now() - 172800000,
    audio_length_sec: 2100,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=200&h=200&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
]

export function getMockResponse(type, params = {}) {
  switch (type) {
    case 'search':
      return {
        data: {
          podcasts: mockPodcasts.filter((p) => {
            const query = params.q?.toLowerCase() || ''
            return (
              p.title.toLowerCase().includes(query) ||
              p.publisher.toLowerCase().includes(query) ||
              p.description.toLowerCase().includes(query)
            )
          }),
          count: mockPodcasts.length,
        },
      }
    case 'genres':
      return {
        data: {
          genres: mockCategories,
        },
      }
    case 'curated':
      return {
        data: {
          podcasts: mockPodcasts,
          count: mockPodcasts.length,
        },
      }
    case 'best':
      return {
        data: {
          podcasts: mockPodcasts,
          count: mockPodcasts.length,
        },
      }
    case 'podcast':
      return {
        data: {
          ...mockPodcasts[0],
          episodes: mockEpisodes,
        },
      }
    case 'episode':
      return {
        data: mockEpisodes[0],
      }
    default:
      return { data: {} }
  }
}
