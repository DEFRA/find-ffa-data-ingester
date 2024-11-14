import { health } from '~/src/api/health/index.js'
import { gatherData } from '~/src/api/gather-data/index.js'
import { files } from '~/src/api/files/index.js'

/**
 * @satisfies { import('@hapi/hapi').ServerRegisterPluginObject<*> }
 */
const router = {
  plugin: {
    name: 'Router',
    register: async (server) => {
      // Health-check route. Used by platform to check if service is running, do not remove!
      await server.register([health])

      // Application specific routes
      await server.register([gatherData, files])
    }
  }
}

export { router }
