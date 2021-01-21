## Description

SMART LIFE PATH run instructions

## DB requirements

SMART LIFE PATH requires postgres and the plugin postgis installed

## DB requirements

If you make chnages to any tables be sure to update the migrations scripts and test the data seed process

## Installation

```bash
$ npm install
```

## Update database

MAke sure you have created a database called smart-path-life

```bash

$ npm run migrate

```

## Seed DB with mock DATA

```bash

$ npm run seed

```

## Generate transaction database

$ npm run migrate:generate MigrationName

## Running the app

```bash
# local db start (optional)
$ docker-compose -f dev-db-doker.yaml up

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod


# Debug mode
$ nodemon run start

```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

