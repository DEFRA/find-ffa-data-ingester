/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import * as cheerio from 'cheerio'
import { proxyFetch } from '~/src/helpers/proxy-fetch.js'

import { config } from '~/src/config/index.js'
import {
  webpageToMarkdown,
  stripLinksFromMarkdown
} from '~/src/api/gather-data/utils/markdown-utils.js'

/**
 * Get woodland grants
 * @returns {Promise<{title: string, content: string, updateDate: Date, url: string}[]>}
 */
async function getWoodlandGrants() {
  const url = config.get('woodlandCreation.url')
  const response = await proxyFetch(url, {})
  const responseJSON = await response.json()

  const updateDate = new Date(responseJSON.updated_at)

  const responseBody = responseJSON.details.body

  const grants = splitWoodlandContentBody(responseBody)

  const markdownGrants = []

  for (const grant of grants) {
    const markdown = webpageToMarkdown(grant.content)
    const strippedContent = stripLinksFromMarkdown(markdown)

    markdownGrants.push({
      title: grant.title,
      content: strippedContent,
      updateDate,
      url
    })
  }

  return markdownGrants
}

/**
 * Remove ignored grants and return relevant grants as an array
 * @param {string} body
 * @returns {{title: string, content: string}[]}
 */
function splitWoodlandContentBody(body) {
  const $ = cheerio.load(body)
  const sections = []
  let currentSection = { title: '', content: '' }

  $('div')
    .children()
    .each((index, element) => {
      if (element.tagName === 'h2') {
        if (currentSection.title || currentSection.content) {
          sections.push(currentSection)
          currentSection = { title: '', content: '' }
        }
        currentSection.title = $(element).text()
      } else {
        currentSection.content += $.html(element)
      }
    })

  if (currentSection.title || currentSection.content) {
    sections.push(currentSection)
  }
  // Remove first 5 elements as these are either irrelevant or closed grants that we don't want to process
  return sections.slice(5)
}

export { getWoodlandGrants }
