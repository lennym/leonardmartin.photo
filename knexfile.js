const { loadEnvConfig } = require('@next/env')

const dev = process.env.NODE_ENV !== 'production'
const { DATABASE_URL } = loadEnvConfig('./', dev).combinedEnv

module.exports = {
  client: 'pg',
  connection: DATABASE_URL,
  migrations: {
    directory: './knex/migrations',
  },
  seeds: {
    directory: './knex/seeds',
  },
}