import { createLogger } from '~/src/helpers/logging/logger.js'
import { config } from '~/src/config/index.js'
import {
  getFinderGrants,
  getNumberOfGrants
} from '~/src/api/gather-data/services/farming-finder.js'
import { getVetVisits } from '~/src/api/gather-data/services/vet-visits.js'
import { getWoodlandGrants } from '~/src/api/gather-data/services/woodland.js'
import { getWoodlandOfferGrants } from '~/src/api/gather-data/services/woodland-offer.js'
import { process } from '~/src/api/gather-data/domain/processor.js'
import {
  getSearchClient,
  getSearchSummariesClient
} from '~/src/api/gather-data/services/azure-search-service.js'

export async function gatherData() {
  const logger = createLogger()
  const searchClient = getSearchClient()
  const searchSummariesClient = getSearchSummariesClient()

  const totalFarmingFinderGrants = await getNumberOfGrants()

  const responseSfi = await processFarmingFinderData({
    searchClient,
    count: totalFarmingFinderGrants,
    searchSummariesClient
  })

  const responseWoodland = await processWoodlandData({
    searchClient,
    searchSummariesClient
  })
  const responseVetVisits = await processVetVisitsData({
    searchClient,
    searchSummariesClient
  })
  const responseWoodlandOffer = await processWoodlandOfferData({
    searchClient,
    searchSummariesClient
  })

  logger.info(`Finished running gather data at ${new Date().toISOString()}`)

  const results = {
    farmingFinder: {
      addedGrants: responseSfi.processedGrantsCount
    },
    woodlandCreationPartnership: {
      addedGrants: responseWoodland.processedGrantsCount
    },
    vetVisits: {
      addedGrants: responseVetVisits.processedGrantsCount
    },
    woodlandOffer: {
      addedGrants: responseWoodlandOffer.processedGrantsCount
    }
  }

  return results
}

const processVetVisitsData = async ({
  searchClient,
  searchSummariesClient
}) => {
  const scheme = config.get('vetVisits')
  const grants = await getVetVisits()

  const result = await processGrants({
    grants,
    scheme,
    searchClient,
    searchSummariesClient
  })

  return result
}

const processWoodlandData = async ({ searchClient, searchSummariesClient }) => {
  const scheme = config.get('woodlandCreation')
  const grants = await getWoodlandGrants()

  const result = await processGrants({
    grants,
    scheme,
    searchClient,
    searchSummariesClient
  })

  return result
}

const processWoodlandOfferData = async ({
  searchClient,
  searchSummariesClient
}) => {
  const scheme = config.get('woodlandOffer')
  const grants = await getWoodlandOfferGrants()

  const result = await processGrants({
    grants,
    scheme,
    searchClient,
    searchSummariesClient
  })

  return result
}

const processFarmingFinderData = async ({
  searchClient,
  count,
  searchSummariesClient
}) => {
  const scheme = config.get('farmingFinder')
  const grants = await getFinderGrants(count)

  const result = await processGrants({
    grants,
    scheme,
    searchClient,
    searchSummariesClient
  })

  return result
}

const processGrants = async ({
  grants,
  scheme,
  searchClient,
  searchSummariesClient
}) => {
  try {
    const { chunkCount, processedGrants } = await process({
      grants,
      scheme,
      searchClient,
      searchSummariesClient
    })

    return {
      chunkCount,
      processedGrantsCount: processedGrants.length
    }
  } catch (error) {
    const logger = createLogger()
    logger.error(error)

    return {
      processedGrantsCount: 0
    }
  }
}
