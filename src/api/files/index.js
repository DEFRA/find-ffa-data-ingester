import { findAllFilesController } from '~/src/api/files/controller/find-all-controller.js'
import { findFileController } from '~/src/api/files/controller/find-controller.js'

/**
 * @satisfies {ServerRegisterPluginObject<void>}
 */
const files = {
  plugin: {
    name: 'files',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/files',
          ...findAllFilesController
        },
        {
          method: 'GET',
          path: '/files/{fileName}',
          ...findFileController
        }
      ])
    }
  }
}

export { files }

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */
