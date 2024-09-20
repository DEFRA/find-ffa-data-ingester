import { postGatherData } from '~/src/api/gather-data/controllers/post-gather-data.js'

/**
 * @satisfies {ServerRegisterPluginObject<void>}
 */
const gatherData = {
  plugin: {
    name: 'gather-data',
    register: (server) => {
      server.route([
        {
          method: 'POST',
          path: '/gather-data',
          ...postGatherData
        }
      ])
    }
  }
}

export { gatherData }

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */
