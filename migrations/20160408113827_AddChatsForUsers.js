exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('chats',function(table) {
      table.increments('id').primary();
      table.integer('room_id').notNullable()
      table.text('text').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('chats')
  ]);
};
