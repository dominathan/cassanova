
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('votes'),
    knex.schema.dropTable('responses')
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('responses',function(table) {
      table.increments('id').primary();
      table.integer('conversation_id').references('id').inTable('conversations');
      table.text('response_text');
      table.timestamps();
    }),
    knex.schema.createTable('votes',function(table) {
      table.increments('id').primary();
      table.integer('response_id').references('id').inTable('responses');
      table.integer('conversation_id').references('id').inTable('conversations');
      table.integer('up').notNullable().defaultTo(0);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
  ])


};
