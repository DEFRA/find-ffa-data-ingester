import { config } from '~/src/config/index.js'
import { getGovukContent } from '~/src/api/gather-data/services/govuk-api.js'

async function getWoodlandOfferGrants() {
  const grant = await getGovukContent(config.get('woodlandOffer.url'))

  return [grant]
}

export { getWoodlandOfferGrants }
