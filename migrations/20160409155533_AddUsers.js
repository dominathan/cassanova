exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users',function(table) {
      table.increments('id').primary();
      table.string('email').notNullable().unique();
      table.string('username').notNullable().unique();
      table.string('password').notNullable();
      table.string('ip_address');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users')
  ]);
};
