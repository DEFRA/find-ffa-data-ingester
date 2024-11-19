import { createLogger } from '~/src/helpers/logging/logger.js'
import { generateEmbedding } from '~/src/api/gather-data/services/openai-service.js'

const testOpenAi = {
  /**
   * @param { import('@hapi/hapi').Request } request
   * @param { import('@hapi/hapi').ResponseToolkit } h
   * @returns {Promise<*>}
   */
  handler: async (request, h) => {
    const logger = createLogger()
    logger.info(`Testing OpenAI ${new Date().toISOString()}`)

    const results = await generateEmbedding(
      'this is a test chunk that would just love to be embedded'
    )

    return h.response({ message: 'success', results }).code(200)
  }
}

export { testOpenAi }
