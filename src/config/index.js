import convict from 'convict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const isProduction = process.env.NODE_ENV === 'production'
const isDev = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV === 'test'
const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3001,
    env: 'PORT'
  },
  serviceName: {
    doc: 'Api Service Name',
    format: String,
    default: 'find-ffa-data-ingester'
  },
  root: {
    doc: 'Project root',
    format: String,
    default: path.resolve(dirname, '../..')
  },
  isProduction: {
    doc: 'If this application running in the production environment',
    format: Boolean,
    default: isProduction
  },
  isDevelopment: {
    doc: 'If this application running in the development environment',
    format: Boolean,
    default: isDev
  },
  isTest: {
    doc: 'If this application running in the test environment',
    format: Boolean,
    default: isTest
  },
  log: {
    enabled: {
      doc: 'Is logging enabled',
      format: Boolean,
      default: !isTest,
      env: 'LOG_ENABLED'
    },
    level: {
      doc: 'Logging level',
      format: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
      default: 'info',
      env: 'LOG_LEVEL'
    },
    format: {
      doc: 'Format to output logs in.',
      format: ['ecs', 'pino-pretty'],
      default: isProduction ? 'ecs' : 'pino-pretty',
      env: 'LOG_FORMAT'
    }
  },
  mongoUri: {
    doc: 'URI for mongodb',
    format: '*',
    default: 'mongodb://127.0.0.1:27017/',
    env: 'MONGO_URI'
  },
  mongoDatabase: {
    doc: 'database for mongodb',
    format: String,
    default: 'find-ffa-data-ingester',
    env: 'MONGO_DATABASE'
  },
  httpProxy: {
    doc: 'HTTP Proxy',
    format: String,
    nullable: true,
    default: null,
    env: 'CDP_HTTP_PROXY'
  },
  httpsProxy: {
    doc: 'HTTPS Proxy',
    format: String,
    nullable: true,
    default: null,
    env: 'CDP_HTTPS_PROXY'
  },
  enableSecureContext: {
    doc: 'Enable Secure Context',
    format: Boolean,
    default: isProduction,
    env: 'ENABLE_SECURE_CONTEXT'
  },
  enableMetrics: {
    doc: 'Enable metrics reporting',
    format: Boolean,
    default: isProduction,
    env: 'ENABLE_METRICS'
  },
  farmingFinder: {
    searchUrl: {
      format: String,
      default: 'https://www.gov.uk/api/search.json?filter_format=farming_grant'
    },
    findFarmingUrl: {
      format: String,
      default: 'https://www.gov.uk/api/content'
    },
    manifestFile: {
      format: String,
      default: 'manifest-farming-finder.json'
    },
    schemeName: {
      format: String,
      default: 'Sustainable Farming Incentive (SFI)'
    }
  },
  vetVisits: {
    url: {
      format: String,
      default:
        'https://www.gov.uk/api/content/government/collections/funding-to-improve-animal-health-and-welfare-guidance-for-farmers-and-vets'
    },
    manifestFile: {
      format: String,
      default: 'manifest-vet-visits.json'
    },
    schemeName: {
      format: String,
      default: 'Vet Visits'
    }
  },
  woodlandCreation: {
    url: {
      format: String,
      default:
        'https://www.gov.uk/api/content/government/publications/england-woodland-creation-partnerships-grants-and-advice-table/england-woodland-creation-partnerships-grants-and-advice-table'
    },
    manifestFile: {
      format: String,
      default: 'manifest-woodland-creation.json'
    },
    schemeName: {
      format: String,
      default: 'England Woodland Creation Partnerships grants'
    }
  },
  woodlandOffer: {
    url: {
      format: String,
      default:
        'https://www.gov.uk/api/content/guidance/england-woodland-creation-offer'
    },
    manifestFile: {
      format: String,
      default: 'manifest-woodland-offer.json'
    },
    schemeName: {
      format: String,
      default: 'England Woodland Creation Offer'
    }
  },
  azureOpenAI: {
    searchUrl: {
      format: String,
      default: '',
      env: 'AZURE_AISEARCH_ENDPOINT'
    },
    searchApiKey: {
      format: String,
      default: '',
      env: 'AZURE_AISEARCH_KEY'
    },
    primaryKeyName: {
      format: String,
      default: 'chunk_id'
    },
    indexName: {
      format: String,
      default: '',
      env: 'AZURE_SEARCH_INDEX_NAME'
    },
    summaryIndexName: {
      format: String,
      default: '',
      env: 'AZURE_SEARCH_SUMMARIES_INDEX_NAME'
    },
    openAiInstanceName: {
      format: String,
      default: '',
      env: 'AZURE_OPENAI_API_INSTANCE_NAME'
    },
    openAiKey: {
      format: String,
      default: '',
      env: 'AZURE_OPENAI_API_KEY'
    },
    openAiModelName: {
      format: String,
      default: '',
      env: 'AZURE_OPENAI_MODEL_NAME'
    }
  },
  aws: {
    region: {
      format: String,
      default: 'eu-west-2',
      env: 'AWS_REGION'
    },
    s3bucket: {
      format: String,
      default: '',
      env: 'S3_BUCKET'
    },
    s3Endpoint: {
      doc: 'The S3 HTTP(S) endpoint, if required (e.g. a local development dev service). Activating this will force path style addressing for compatibility with Localstack.',
      format: String,
      default: '',
      env: 'S3_ENDPOINT'
    }
  }
})

config.validate({ allowed: 'strict' })

export { config }
