import { createLogger } from '~/src/helpers/logging/logger.js'
import { gatherData } from '~/src/api/gather-data/helpers/gather-data.js'

const postGatherData = {
  /**
   * @param { import('@hapi/hapi').Request } request
   * @param { import('@hapi/hapi').ResponseToolkit } h
   * @returns {Promise<*>}
   */
  handler: async (request, h) => {
    const logger = createLogger()
    logger.info(`Gather data started at ${new Date().toISOString()}`)

    const results = await gatherData()

    return h.response({ message: 'success', results }).code(200)
  }
}

export { postGatherData }
