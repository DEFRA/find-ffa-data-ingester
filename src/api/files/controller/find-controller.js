import Boom from '@hapi/boom'
import isNull from 'lodash/isNull.js'

import { getManifest } from '~/src/api/gather-data/services/s3-client.js'

/**
 *
 * @satisfies {Partial<ServerRoute>}
 */
const findFileController = {
  /**
   * @param { import('@hapi/hapi').Request } request
   * @param { import('@hapi/hapi').ResponseToolkit } h
   * @returns {Promise<*>}
   */
  handler: async (request, h) => {
    const entity = await getManifest(request.params.fileName)
    if (isNull(entity)) {
      return Boom.boomify(Boom.notFound())
    }

    return h.response({ message: 'success', entity }).code(200)
  }
}

export { findFileController }

/**
 * @import { ServerRoute} from '@hapi/hapi'
 */
