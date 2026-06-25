import axios from 'axios'

const ITUNES_API_URL = 'https://itunes.apple.com'

const api = axios.create({
  baseURL: ITUNES_API_URL,
})

const ITUNES_GENRES = [
  {
    id: 'comedy',
    name: 'Comedy',
    artwork_url:
      'https://images.unsplash.com/photo-1527269540754-5a4db46f4d5f?w=300&h=300&fit=crop',
    podcasts_count: 12000,
  },
  {
    id: 'news',
    name: 'News',
    artwork_url:
      'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=300&h=300&fit=crop',
    podcasts_count: 15000,
  },
  {
    id: 'technology',
    name: 'Technology',
    artwork_url:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=300&fit=crop',
    podcasts_count: 9000,
  },
  {
    id: 'business',
    name: 'Business',
    artwork_url:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=300&fit=crop',
    podcasts_count: 11000,
  },
  {
    id: 'health',
    name: 'Health & Fitness',
    artwork_url:
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=300&fit=crop',
    podcasts_count: 8000,
  },
  {
    id: 'education',
    name: 'Education',
    artwork_url:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=300&fit=crop',
    podcasts_count: 7000,
  },
  {
    id: 'true crime',
    name: 'True Crime',
    artwork_url:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    podcasts_count: 6000,
  },
  {
    id: 'sports',
    name: 'Sports',
    artwork_url:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&h=300&fit=crop',
    podcasts_count: 5000,
  },
]

function mapPodcast(item) {
  if (!item) return null

  return {
    id: item.collectionId,
    title: item.collectionName,
    publisher: item.artistName,
    image: item.artworkUrl600 || item.artworkUrl100,
    description:
      item.description ||
      item.primaryGenreName ||
      `A ${item.primaryGenreName || 'podcast'} show by ${item.artistName}`,
    total_episodes: item.trackCount || 0,
    latest_pub_date_ms: item.releaseDate
      ? new Date(item.releaseDate).getTime()
      : null,
    primaryGenreName: item.primaryGenreName,
    feedUrl: item.feedUrl,
    collectionViewUrl: item.collectionViewUrl,
  }
}

function mapEpisode(item) {
  if (!item) return null

  // Check if it's an episode (has previewUrl and trackName) or a podcast collection
  const isEpisode = item.previewUrl && item.trackName && item.collectionId
  const isPodcast = item.collectionId && !item.previewUrl

  // If it's a podcast collection, return null (we only want episodes here)
  if (!isEpisode || isPodcast) return null

  return {
    id: item.trackId || item.collectionId,
    title: item.trackName || item.collectionName,
    description: item.description || '',
    audio: item.previewUrl,
    audio_url: item.previewUrl,
    podcast_id: item.collectionId,
    podcast_title: item.collectionName,
    pub_date_ms: item.releaseDate
      ? new Date(item.releaseDate).getTime()
      : null,
    audio_length_sec: item.trackTimeMillis
      ? Math.round(item.trackTimeMillis / 1000)
      : null,
    image: item.artworkUrl600 || item.artworkUrl100,
    primaryGenreName: item.primaryGenreName,
  }
}

function isPodcastEpisode(item) {
  return (
    item.wrapperType === 'podcastEpisode' ||
    (item.wrapperType === 'track' && item.kind === 'podcast-episode') ||
    (item.previewUrl && item.trackName && item.collectionId)
  )
}

function isPodcastCollection(item) {
  return (
    item.wrapperType === 'collection' ||
    (item.wrapperType === 'track' && item.kind === 'podcast') ||
    (item.collectionId && !item.previewUrl)
  )
}

function filterPodcasts(results = []) {
  return results
    .filter(
      (item) =>
        item.wrapperType === 'track' &&
        item.kind === 'podcast' &&
        item.collectionId
    )
    .map(mapPodcast)
    .filter(Boolean)
}

export const podcastApi = {
  search: async (query, _type, offset = 0) => {
    const response = await api.get('/search', {
      params: {
        term: query,
        media: 'podcast',
        limit: 20,
        offset,
      },
    })

    const podcasts = filterPodcasts(response.data.results)

    return {
      data: {
        podcasts,
        total: response.data.resultCount || podcasts.length,
        count: podcasts.length,
      },
    }
  },

  getCuratedPodcasts: async () => {
    const response = await api.get('/search', {
      params: {
        term: 'podcast',
        limit: 20,
        media: 'podcast',
      },
    })

    const podcasts = filterPodcasts(response.data.results)

    return {
      data: {
        podcasts,
        total: response.data.resultCount || podcasts.length,
      },
    }
  },

  getBestPodcasts: async (genre = '', page = 0) => {
    const genreInfo = ITUNES_GENRES.find((g) => g.id === genre)
    const term = genreInfo ? genreInfo.name : genre || 'podcast'

    const response = await api.get('/search', {
      params: {
        term,
        media: 'podcast',
        limit: 20,
        offset: page * 20,
      },
    })

    const podcasts = filterPodcasts(response.data.results)

    return {
      data: {
        podcasts,
        total: response.data.resultCount || podcasts.length,
        name: genreInfo?.name || term,
      },
    }
  },

  getPodcast: async (podcastId) => {
    const response = await api.get('/lookup', {
      params: {
        id: podcastId,
        entity: 'podcastEpisode',
        limit: 50,
      },
    })

    const results = response.data.results || []
    const collection =
      results.find((item) => isPodcastCollection(item)) || results[0]

    if (!collection) {
      return { data: null }
    }

    const episodes = results
      .filter((item) => isPodcastEpisode(item))
      .map(mapEpisode)
      .filter(Boolean)

    return {
      data: {
        ...mapPodcast(collection),
        episodes,
      },
    }
  },

  getEpisode: async (episodeId) => {
    try {
      const response = await api.get('/lookup', {
        params: {
          id: episodeId,
        },
      })

      const results = response.data.results || []

      // Try to find an episode first
      let item = results.find((r) => r.previewUrl && r.trackName && r.collectionId)

      // If no episode found, try the first result
      if (!item && results.length > 0) {
        item = results[0]
      }

      if (!item) {
        return { data: null }
      }

      const mappedEpisode = mapEpisode(item)

      // If mapEpisode returns null, try to create a basic episode object
      if (!mappedEpisode) {
        return {
          data: {
            id: item.trackId || item.collectionId,
            title: item.trackName || item.collectionName || 'Unknown Episode',
            description: item.description || '',
            audio: item.previewUrl || null,
            audio_url: item.previewUrl || null,
            podcast_id: item.collectionId,
            podcast_title: item.collectionName || 'Unknown Podcast',
            pub_date_ms: item.releaseDate
              ? new Date(item.releaseDate).getTime()
              : null,
            audio_length_sec: item.trackTimeMillis
              ? Math.round(item.trackTimeMillis / 1000)
              : null,
            image: item.artworkUrl600 || item.artworkUrl100,
            primaryGenreName: item.primaryGenreName,
          }
        }
      }

      return { data: mappedEpisode }
    } catch (error) {
      console.error('Error fetching episode:', error)
      return { data: null }
    }
  },

  getGenres: async () => {
    return {
      data: {
        genres: ITUNES_GENRES,
      },
    }
  },

  getRecommendations: async (podcastId) => {
    const podcastRes = await api.get('/lookup', {
      params: { id: podcastId },
    })

    const podcast = podcastRes.data.results?.[0]
    const term = podcast?.primaryGenreName || podcast?.collectionName || 'podcast'

    const response = await api.get('/search', {
      params: {
        term,
        media: 'podcast',
        limit: 10,
      },
    })

    const podcasts = filterPodcasts(response.data.results).filter(
      (p) => String(p.id) !== String(podcastId)
    )

    return {
      data: {
        podcasts: podcasts.slice(0, 6),
      },
    }
  },

  getTrendingPodcasts: async () => {
    const response = await api.get('/search', {
      params: {
        term: 'top podcast',
        media: 'podcast',
        limit: 20,
      },
    })

    const podcasts = filterPodcasts(response.data.results)

    return {
      data: {
        podcasts,
        total: response.data.resultCount || podcasts.length,
      },
    }
  },
}

export default api