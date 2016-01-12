
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('fake_accounts',function(table) {
      table.dateTime('facebook_expiration_time');
      table.dateTime('tinder_expiration_time');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('fake_accounts', function(table) {
      table.dropColumn('facebook_expiration_time');
      table.dropColumn('tinder_expiration_time');
    })
  ])
};
