/*
 * TODO - replace with AWS S3 client
 */
async function getContainer() {
  return Promise.resolve({})
}

/**
 * Upload manifest to azure blob storage
 * @param {import('../domain/processor.js').Manifest[]} manifestData
 * @param {string} manifestFilename
 * @param {unknown} containerClient
 */
async function uploadManifest(manifestData, manifestFilename, containerClient) {
  // eslint-disable-next-line no-console
  console.log(manifestData, manifestFilename, containerClient)
  return Promise.resolve()
}

/**
 * Get a list of grant links processed in previous runs
 * @param {string} manifestFilename
 * @param {unknown} containerClient
 * @returns {Promise<import('../domain/processor.js').Manifest[]>}
 */
async function getManifest(manifestFilename, containerClient) {
  // eslint-disable-next-line no-console
  console.log(manifestFilename, containerClient)
  return Promise.resolve([])
}

export { getContainer, getManifest, uploadManifest }
