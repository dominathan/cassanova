
  exports.up = function(knex, Promise) {
    return Promise.all([
      knex.schema.table('targets',function(table) {
        table.integer('user_id').references('id').inTable('users')
        table.boolean('accessible').defaultTo(false);
      })
    ])
  };

  exports.down = function(knex, Promise) {
    return Promise.all([
      knex.schema.table('targets',function(table) {
        table.dropColumn('user_id');
        table.dropColumn('accessible');
      })
    ])
  };
