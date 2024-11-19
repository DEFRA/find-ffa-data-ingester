import { testOpenAi } from '~/src/api/test/controller.js'

/**
 * @satisfies {ServerRegisterPluginObject<void>}
 */
const test = {
  plugin: {
    name: 'test',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/test',
          ...testOpenAi
        }
      ])
    }
  }
}

export { test }

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */
