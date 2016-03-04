exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('responses',function(table) {
      table.increments('id').primary();
      table.integer('conversation_id').notNullable().references('id').inTable('conversations');
      table.integer('target_id').notNullable().references('id').inTable('targets');
      table.text('response_text').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('votes',function(table) {
      table.increments('id').primary();
      table.integer('response_id').references('id').inTable('responses');
      table.integer('conversation_id').references('id').inTable('conversations');
      table.integer('up').notNullable().defaultTo(0);
      table.integer('down').notNullable().defaultTo(0);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('votes'),
    knex.schema.dropTable('responses')
  ])
};
