/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { config } from '~/src/config/index.js'
import { createLogger } from '~/src/helpers/logging/logger.js'
import { getGovukContent } from '~/src/api/gather-data/services/govuk-api.js'
import { proxyFetch } from '~/src/helpers/proxy-fetch.js'

/**
 * Get grants from "Find funding for land or farms" finder
 * @param {number} count
 * @returns {Promise<import('./govuk-api.js').Grant[]>}
 */
async function getFinderGrants(count) {
  const urls = await getLinksFromSearchApi(count)
  const grants = []

  for (const url of urls) {
    try {
      const grant = await getGovukContent(url)

      grants.push(grant)
    } catch (error) {
      const logger = createLogger()
      logger.error(error)
    }
  }

  return grants
}

/**
 * Get "link" values from search API from Specialist Publisher tool
 * @param {number} count
 * @returns {Promise<string[]>}
 */
async function getLinksFromSearchApi(count) {
  const url = `${config.get('farmingFinder.searchUrl')}&count=${count}`
  const response = await proxyFetch(url, {})

  const json = await response.json()

  const links = json.results.map(
    (result) => config.get('farmingFinder.findFarmingUrl') + result.link
  )

  return links
}

/**
 * Get the total number of grants in farming funding finder
 * @returns {Promise<number>}
 */
async function getNumberOfGrants() {
  const logger = createLogger()
  const url = `${config.get('farmingFinder.searchUrl')}`
  const response = await proxyFetch(url, {})
  const json = await response.json()

  logger.info(`Fetch ${url}. Status Code ${response.status}`)

  return json.total
}

export { getFinderGrants, getNumberOfGrants }
