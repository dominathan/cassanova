
  exports.up = function(knex, Promise) {
    return Promise.all([
      knex.schema.table('chats',function(table) {
        table.string('username')
      })
    ])
  };

  exports.down = function(knex, Promise) {
    return Promise.all([
      knex.schema.table('chats',function(table) {
        table.dropColumn('username')
      })
    ])
  };
