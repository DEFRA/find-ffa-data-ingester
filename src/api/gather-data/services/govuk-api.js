import axios from 'axios'

import {
  webpageToMarkdown,
  stripLinksFromMarkdown
} from '~/src/api/gather-data/utils/markdown-utils.js'

/**
 * @typedef {{title: string, content: string, updateDate: Date, url: string}} Grant
 */

/**
 * Fetches content from GOV.UK
 * @param {string} url - GOV.UK API URL (Needs to include /api/content in the URL)
 * @returns {Promise<Grant>}
 */
const getGovukContent = async (url) => {
  const response = await axios.get(url)
  const responseJson = response.data

  if (
    response.status !== 200 ||
    !responseJson.title ||
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    !responseJson.details ||
    !responseJson.details.body
  ) {
    throw new Error(`Unable to parse content from ${url}`)
  }

  let title = responseJson.title
  const updateDate = new Date(responseJson.updated_at)

  title = title.replace('\\', '')
  title = title.replace('/', 'or')

  const responseBody = responseJson.details.body

  const markdownContent = webpageToMarkdown(responseBody)
  const strippedContent = stripLinksFromMarkdown(markdownContent)

  return {
    title,
    content: strippedContent,
    updateDate,
    url
  }
}

export { getGovukContent }
