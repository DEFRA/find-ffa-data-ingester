import { createLogger } from '~/src/helpers/logging/logger.js'
import { config } from '~/src/config/index.js'
import { getContainer } from '~/src/api/gather-data/services/blob-client.js'
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
  const containerClient = await getContainer()
  const searchClient = getSearchClient()
  const searchSummariesClient = getSearchSummariesClient()

  const totalFarmingFinderGrants = await getNumberOfGrants()

  const responseSfi = await processFarmingFinderData({
    containerClient,
    searchClient,
    count: totalFarmingFinderGrants,
    searchSummariesClient
  })

  const responseWoodland = await processWoodlandData({
    containerClient,
    searchClient,
    searchSummariesClient
  })
  const responseVetVisits = await processVetVisitsData({
    containerClient,
    searchClient,
    searchSummariesClient
  })
  const responseWoodlandOffer = await processWoodlandOfferData({
    containerClient,
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
  containerClient,
  searchClient,
  searchSummariesClient
}) => {
  const scheme = config.get('vetVisits')
  const grants = await getVetVisits()

  const result = await processGrants({
    grants,
    scheme,
    containerClient,
    searchClient,
    searchSummariesClient
  })

  return result
}

const processWoodlandData = async ({
  containerClient,
  searchClient,
  searchSummariesClient
}) => {
  const scheme = config.get('woodlandCreation')
  const grants = await getWoodlandGrants()

  const result = await processGrants({
    grants,
    scheme,
    containerClient,
    searchClient,
    searchSummariesClient
  })

  return result
}

const processWoodlandOfferData = async ({
  containerClient,
  searchClient,
  searchSummariesClient
}) => {
  const scheme = config.get('woodlandOffer')
  const grants = await getWoodlandOfferGrants()

  const result = await processGrants({
    grants,
    scheme,
    containerClient,
    searchClient,
    searchSummariesClient
  })

  return result
}

const processFarmingFinderData = async ({
  containerClient,
  searchClient,
  count,
  searchSummariesClient
}) => {
  const scheme = config.get('farmingFinder')
  const grants = await getFinderGrants(count)

  const result = await processGrants({
    grants,
    scheme,
    containerClient,
    searchClient,
    searchSummariesClient
  })

  return result
}

const processGrants = async ({
  grants,
  scheme,
  containerClient,
  searchClient,
  searchSummariesClient
}) => {
  try {
    const { chunkCount, processedGrants } = await process({
      grants,
      scheme,
      containerClient,
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
