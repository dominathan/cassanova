
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('votes')
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('votes',function(table) {
      table.increments('id').primary();
      table.integer('response_id').references('id').inTable('responses');
      table.integer('conversation_id').references('id').inTable('conversations');
      table.integer('up');
      table.integer('down');
      table.timestamps();
    })
  ])
};
