
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('votes',function(table) {
      table.integer('user_id').references('id').inTable('users');
    }),
    knex.schema.table('responses',function(table) {
      table.integer('user_id').references('id').inTable('users').notNullable();
    }),
    knex.schema.table('chats',function(table) {
      table.integer('user_id').references('id').inTable('users');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('votes',function(table) {
      table.dropColumn('user_id')
    }),
    knex.schema.table('responses',function(table) {
      table.dropColumn('user_id')
    }),
    knex.schema.table('chats',function(table) {
      table.dropColumn('user_id')
    })
  ])
};
