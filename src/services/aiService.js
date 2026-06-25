import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
// Using 2.5-flash as the latest available model
const AI_MODEL = 'gemini-2.5-flash'

function buildPrompt(metadata) {
  const podcastTitle = metadata?.title || metadata?.podcast_title || 'Unknown'
  const publisher = metadata?.publisher || 'Unknown'
  const genre = metadata?.primaryGenreName || 'General'

  // Strip layout HTML tags to save precious token space
  const cleanPodcastDesc = (metadata?.description || 'No description available.').replace(/<[^>]*>/g, '')
  const cleanEpisodeDesc = (metadata?.episodeDescription || '').replace(/<[^>]*>/g, '')

  return `You are a podcast summarizer. Create a structured summary.

Podcast Title: ${podcastTitle}
Publisher/Author: ${publisher}
Genre: ${genre}
${metadata?.episodeTitle ? `Episode Title: ${metadata.episodeTitle}` : ''}

Podcast Description:
${cleanPodcastDesc}

${cleanEpisodeDesc ? `Episode Description:\n${cleanEpisodeDesc}` : ''}

Please provide a summary formatted exactly like this:

### 📖 Overview
(Write 2-3 sentences providing a general summary of the podcast or episode)

### ✨ Key Points
* (First key point)
* (Second key point)
* (Third key point)

### 🎯 Target Audience
(Write 1-2 sentences about who would enjoy this)

Keep it concise and engaging. Only output the markdown summary, no conversational filler.`
}

export async function summarizeContent(metadata) {
  if (!API_KEY) {
    throw new Error('Gemini API key not configured. Add VITE_GEMINI_API_KEY to your .env file.')
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY)
    const model = genAI.getGenerativeModel({ model: AI_MODEL })
    const prompt = buildPrompt(metadata)

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    if (!text) {
      throw new Error('Empty response from Gemini.')
    }

    return text
  } catch (error) {
    console.error('Gemini Service Error:', error)
    
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      throw new Error('The free AI limit was briefly reached. Please wait 10 seconds and click again!')
    }
    
    throw new Error(error.message || 'Failed to generate summary.')
  }
}

export default { summarizeContent }