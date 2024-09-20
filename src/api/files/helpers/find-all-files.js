import { S3Client, ListObjectsCommand } from '@aws-sdk/client-s3'

import { config } from '~/src/config/index.js'
import { createLogger } from '~/src/helpers/logging/logger.js'

/**
 * Gets all Manifest files from S3
 * @returns {Promise<object[] | undefined>}
 */
async function findAllFiles() {
  const logger = createLogger()
  const bucket = config.get('aws.s3bucket')
  try {
    const s3Client = getS3Client()

    const { Contents } = await s3Client.send(
      new ListObjectsCommand({
        Bucket: bucket
      })
    )

    return Contents
  } catch (error) {
    logger.error(error, `Error fetching files on bucket ${bucket}`)
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

export { findAllFiles }
