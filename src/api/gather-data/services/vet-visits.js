import { config } from '~/src/config/index.js'
import { getGovukContent } from '~/src/api/gather-data/services/govuk-api.js'

async function getVetVisits() {
  const grant = await getGovukContent(config.get('vetVisits.url'))

  return [grant]
}

export { getVetVisits }
