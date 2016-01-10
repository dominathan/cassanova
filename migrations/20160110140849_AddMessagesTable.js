
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('responses',function(table) {
      table.increments('id').primary();
      table.integer('conversation_id').references('id').inTable('conversations');
      table.text('response_text');
      table.timestamps();
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('responses')
  ])
};
