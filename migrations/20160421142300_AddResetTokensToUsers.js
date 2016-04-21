exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users',function(table) {
      table.string('reset_password_token');
      table.datetime('reset_password_expires');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users',function(table) {
      table.dropColumn('reset_password_token');
      table.dropColumn('reset_password_expires');
    })
  ])
};
