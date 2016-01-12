// Update with your config settings.

module.exports = {

  development: {
    client: 'postgresql',
    debug: true,
    connection: {
      database: 'cassanova_dev'
    },
    pool: {
      min: 2,
      max: 10
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'cassanova_staging',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
