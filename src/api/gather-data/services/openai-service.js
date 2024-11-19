import { OpenAIEmbeddings, ChatOpenAI } from '@langchain/openai'
import { URL } from 'node:url'
import { HttpsProxyAgent } from 'https-proxy-agent'

import { config } from '~/src/config/index.js'
import { createLogger } from '~/src/helpers/logging/logger.js'

// eslint-disable-next-line @typescript-eslint/require-await
const onFailedAttempt = async (error) => {
  if (error.retriesLeft === 0) {
    const logger = createLogger()
    logger.error(error, 'Failed to get embeddings')
    throw error
  }
}

/**
 * Generates vector embeddings for content
 * @param {string} chunk
 * @returns {Promise<number[]>}
 */
const generateEmbedding = async (chunk) => {
  const proxyUrlConfig = config.get('httpsProxy') ?? config.get('httpProxy')
  let httpAgent
  if (proxyUrlConfig) {
    const proxyUrl = new URL(proxyUrlConfig)
    httpAgent = new HttpsProxyAgent(proxyUrl)
  }

  const embeddings = new OpenAIEmbeddings({
    azureOpenAIApiInstanceName: config.get('azureOpenAI.openAiInstanceName'),
    azureOpenAIApiKey: config.get('azureOpenAI.openAiKey'),
    azureOpenAIApiDeploymentName: 'text-embedding-ada-002',
    azureOpenAIApiVersion: '2024-02-01',
    verbose: true,
    configuration: {
      httpAgent
    },
    onFailedAttempt
  })

  const embedding = await embeddings.embedDocuments([chunk])

  return embedding[0]
}

/**
 * Generates a short summary for a given text
 * @param {string} text - The text to summarize
 * @param {number | undefined} summaryTokenLimit - The token limit for the summary
 * @returns {Promise<string>} - The generated summary
 */
const generateShortSummary = async (text, summaryTokenLimit = 100) => {
  const proxyUrlConfig = config.get('httpsProxy') ?? config.get('httpProxy')
  let httpAgent
  if (proxyUrlConfig) {
    const proxyUrl = new URL(proxyUrlConfig)
    httpAgent = new HttpsProxyAgent(proxyUrl)
  }

  const model = new ChatOpenAI({
    azureOpenAIApiInstanceName: config.get('azureOpenAI.openAiInstanceName'),
    azureOpenAIApiKey: config.get('azureOpenAI.openAiKey'),
    azureOpenAIApiDeploymentName: 'gpt-35-turbo-16k',
    azureOpenAIApiVersion: '2024-02-01',
    verbose: true,
    configuration: {
      httpAgent
    },
    onFailedAttempt
  })

  const messages = [
    [
      'user',
      `
      Generate a summary of the following text without explaining that this is a summary. The result should be in the same tone and style as the original text. Limit the summary to ${summaryTokenLimit} tokens:
      ${text}
    `
    ]
  ]

  try {
    const response = await model.generate(messages)

    return response.generations.flat()[0].text.replace(/\n/g, ' ').trim()
  } catch (error) {
    const logger = createLogger()
    try {
      logger.error('Error generating summary using openai:', error)
      if (typeof document !== 'string') {
        logger.error('Document is not a string', document)
        return ''
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const summary = document.split(' ').slice(0, summaryTokenLimit).join(' ')
      const lastSentenceEnd = Math.max(
        summary.lastIndexOf('.'),
        summary.lastIndexOf('\n')
      )

      return summary.slice(0, lastSentenceEnd + 1)
    } catch (error) {
      logger.error('Error generating summary using fallback:', error)
      return ''
    }
  }
}

export { generateEmbedding, generateShortSummary }
