
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users',function(table) {
      table.date('birth_date');
      table.string('gender');
      table.string('latitude');
      table.string('longitude');
      table.string('name');
      table.string('tinder_id').unique()
      table.string('facebook_user_id').unique()
      table.string('facebook_email');
      table.string('facebook_password');
      table.string('facebook_authentication_token');
      table.string('tinder_authentication_token');
      table.integer('facebook_expiration_time')
      table.string('bio');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users',function(table) {
      table.dropColumn('birth_date');
      table.dropColumn('gender');
      table.dropColumn('latitude');
      table.dropColumn('longitude');
      table.dropColumn('name');
      table.dropColumn('tinder_id')
      table.dropColumn('facebook_user_id')
      table.dropColumn('facebook_authentication_token');
      table.dropColumn('tinder_authentication_token');
      table.dropColumn('facebook_expiration_time');
      table.dropColumn('bio');
    })
  ])
};
