import { SearchClient, AzureKeyCredential } from '@azure/search-documents'

import { config } from '~/src/config/index.js'
import { createLogger } from '~/src/helpers/logging/logger.js'

/**
 * Upload document to Azure AI Search
 * @param {{ chunk_id: string, parent_id: string, chunk: string, title: string, grant_scheme_name: string, source_url: string, content_vector: number[] }} document
 * @param { SearchClient } searchClient
 * @returns { Promise<string[]> }
 */
const uploadDocument = async (document, searchClient) => {
  const logger = createLogger()
  const uploadResult = await searchClient.uploadDocuments([document])

  const uploadedKeys = uploadResult.results
    .filter((result) => result.succeeded)
    .map((result) => result.key)

  const failedKeys = uploadResult.results
    .filter((result) => !result.succeeded)
    .map((result) => result.key)

  if (failedKeys.length > 0) {
    logger.info('failed keys: ', failedKeys)
  }

  return uploadedKeys
}

/**
 * Delete documents from Azure AI Search
 * @param {string[]} keys
 * @param {SearchClient} searchClient
 * @returns boolean
 */
const deleteDocuments = async (keys, searchClient) => {
  const deletedRes = await searchClient.deleteDocuments(
    config.get('azureOpenAI.primaryKeyName'),
    keys
  )
  const unsuccessfulDeletes = deletedRes.results.filter(
    (result) => !result.succeeded
  )

  return unsuccessfulDeletes.length === 0
}

const getSearchClient = () => {
  const { searchUrl, indexName, searchApiKey } = config.get('azureOpenAI')
  const proxyUrlConfig = config.get('httpsProxy') ?? config.get('httpProxy')
  let proxyOptions
  if (proxyUrlConfig) {
    const proxyUrl = new URL(proxyUrlConfig)
    const port = proxyUrl.protocol.toLowerCase() === 'http:' ? 80 : 443
    proxyOptions = {
      host: proxyUrl.href,
      port
    }
  }

  const searchClient = new SearchClient(
    searchUrl,
    indexName,
    new AzureKeyCredential(searchApiKey),
    {
      proxyOptions
    }
  )

  return searchClient
}

const getSearchSummariesClient = () => {
  const { searchUrl, summaryIndexName, searchApiKey } =
    config.get('azureOpenAI')
  const searchClient = new SearchClient(
    searchUrl,
    summaryIndexName,
    new AzureKeyCredential(searchApiKey)
  )

  return searchClient
}

export {
  getSearchClient,
  getSearchSummariesClient,
  uploadDocument,
  deleteDocuments
}
