import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand
} from '@aws-sdk/client-s3'

import { config } from '~/src/config/index.js'
import { createLogger } from '~/src/helpers/logging/logger.js'

/**
 * Upload manifest to s3 bucket
 * @param {import('../domain/processor.js').Manifest[]} manifestData
 * @param {string} manifestFilename
 */
async function uploadManifest(manifestData, manifestFilename) {
  const logger = createLogger()
  try {
    const s3Client = getS3Client()

    const manifestText = JSON.stringify(manifestData, null, 2)

    await s3Client.send(
      new PutObjectCommand({
        Bucket: config.get('aws.s3bucket'),
        Body: manifestText,
        Key: manifestFilename
      })
    )

    logger.info(`Manifest uploaded successfully: ${manifestFilename}`)
  } catch (error) {
    logger.error(error, 'Error uploading manifest to S3')
  }
}

/**
 * Get a list of grant links processed in previous runs
 * @param {string} manifestFilename
 * @returns {Promise<import('../domain/processor.js').Manifest[]>}
 */
async function getManifest(manifestFilename) {
  const logger = createLogger()

  try {
    const s3Client = getS3Client()

    const obj = await s3Client.send(
      new GetObjectCommand({
        Bucket: config.get('aws.s3bucket'),
        Key: manifestFilename
      })
    )

    const body = await obj.Body?.transformToString()

    const manifestJSON = JSON.parse(body ?? '[]')

    return manifestJSON
  } catch (error) {
    if (!error.statusCode || error.statusCode !== 404) {
      logger.error(error, 'Error fetching Manifest')
    }

    return []
  }
}

function getS3Client() {
  return new S3Client({
    region: config.get('aws.region'),
    ...(config.get('aws.s3Endpoint') && {
      endpoint: config.get('aws.s3Endpoint'),
      forcePathStyle: true
    })
  })
}

export { getManifest, uploadManifest }
