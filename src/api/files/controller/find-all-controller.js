import { findAllFiles } from '~/src/api/files/helpers/find-all-files.js'

/**
 * Controller for files on S3
 * @satisfies {Partial<ServerRoute>}
 */
const findAllFilesController = {
  /**
   * @param { import('@hapi/hapi').Request } request
   * @param { import('@hapi/hapi').ResponseToolkit } h
   * @returns {Promise<*>}
   */
  handler: async (request, h) => {
    const entities = await findAllFiles()

    return h.response({ message: 'success', entities }).code(200)
  }
}

export { findAllFilesController }

/**
 * @import { ServerRoute} from '@hapi/hapi'
 */
