
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('votes',function(table) {
      table.increments('id').primary();
      table.integer('response_id').references('id').inTable('responses').notNullable();
      table.integer('conversation_id').references('id').inTable('conversations');
      table.integer('up').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('votes')
  ])
};
