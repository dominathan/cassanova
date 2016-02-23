
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('votes',function(table) {
      table.dropColumn('created_at');
      table.dropColumn('updated_at');
    }),
    knex.schema.table('responses',function(table) {
      table.dropColumn('created_at');
      table.dropColumn('updated_at');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('votes',function(table) {
      table.timestamp('created_at');
      table.timestamp('updated_at');
    }),
    knex.schema.table('responses',function(table) {
      table.timestamp('created_at');
      table.timestamp('updated_at');
    })
  ])
};
