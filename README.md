# find-ffa-data-ingester

Populates the FFA Vector store. Based on the Core delivery platform Node.js Backend Template.

- [find-ffa-data-ingester](#find-ffa-data-ingester)
  - [Requirements](#requirements)
    - [Node.js](#nodejs)
  - [Local development](#local-development)
    - [Setup](#setup)
    - [Development](#development)
    - [Testing](#testing)
    - [Production](#production)
    - [Npm scripts](#npm-scripts)
    - [Update dependencies](#update-dependencies)
    - [Formatting](#formatting)
      - [Windows prettier issue](#windows-prettier-issue)
  - [Development helpers](#development-helpers)
    - [Secrets \& Environment Variables](#secrets--environment-variables)
    - [MongoDB Locks](#mongodb-locks)
  - [Docker](#docker)
    - [Development image](#development-image)
    - [Production image](#production-image)
    - [Docker Compose](#docker-compose)
    - [Dependabot](#dependabot)
    - [SonarCloud](#sonarcloud)
  - [Licence](#licence)
    - [About the licence](#about-the-licence)

## Requirements

### Node.js

To use the correct version of Node.js for this application, via Node Version Manager [nvm](https://github.com/creationix/nvm):

```bash
cd find-ffa-data-ingester
nvm use
```

## Local development

### Setup

Install application dependencies:

```bash
npm install
```

Then setup [Secrets \& Environment Variables](#secrets--environment-variables)

### Development

Once setup (above), get the dependencies up and running using [Docker Compose - see below](#docker-compose).

Then run the application in `development` mode:

```bash
npm run dev
```

### Testing

To test the application run:

```bash
npm run test
```

### Production

To mimic the application running in `production` mode locally run:

```bash
npm start
```

### Npm scripts

All available Npm scripts can be seen in [package.json](./package.json)
To view them in your command line run:

```bash
npm run
```

### Update dependencies

To update dependencies use [npm-check-updates](https://github.com/raineorshine/npm-check-updates):

> The following script is a good start. Check out all the options on
> the [npm-check-updates](https://github.com/raineorshine/npm-check-updates)

```bash
ncu --interactive --format group
```

### Formatting

#### Windows prettier issue

If you are having issues with formatting of line breaks on Windows update your global git config by running:

```bash
git config --global core.autocrlf false
```

## Development helpers

### Secrets & Environment Variables

Create a `.env` file by making a copy of the `.env.example` and adding the missing secrets.

Do not add secrets to `.env.example` as this is under version control!

### MongoDB Locks

If you require a write lock for Mongo you can acquire it via `server.locker` or `request.locker`:

```javascript
async function doStuff(server) {
  const lock = await server.locker.lock('unique-resource-name')

  if (!lock) {
    // Lock unavailable
    return
  }

  try {
    // do stuff
  } finally {
    await lock.free()
  }
}
```

Keep it small and atomic.

You may use **using** for the lock resource management.
Note test coverage reports do not like that syntax.

```javascript
async function doStuff(server) {
  await using lock = await server.locker.lock('unique-resource-name')

  if (!lock) {
    // Lock unavailable
    return
  }

  // do stuff

  // lock automatically released
}
```

Helper methods are also available in `/src/helpers/mongo-lock.js`.

## Docker

### Development image

Build:

```bash
docker build --target development --no-cache --tag find-ffa-data-ingester:development .
```

Run:

```bash
docker run -e PORT=3001 -p 3001:3001 find-ffa-data-ingester:development
```

### Production image

Build:

```bash
docker build --no-cache --tag find-ffa-data-ingester .
```

Run:

```bash
docker run -e PORT=3001 -p 3001:3001 find-ffa-data-ingester
```

### Docker Compose

A local environment with:

- Localstack for AWS services (S3, SQS)
- Redis
- MongoDB

```bash
docker compose up --build -d
```

### Dependabot

We have added an example dependabot configuration file to the repository. You can enable it by renaming
the [.github/example.dependabot.yml](.github/example.dependabot.yml) to `.github/dependabot.yml`

### SonarCloud

Instructions for setting up SonarCloud can be found in [sonar-project.properties](./sonar-project.properties)

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable
information providers in the public sector to license the use and re-use of their information under a common open
licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
