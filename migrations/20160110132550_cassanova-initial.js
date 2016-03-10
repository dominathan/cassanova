
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('fake_accounts', function(table) {
      table.increments('id').primary();
      table.text('bio');
      table.date('birth_date');
      table.string('gender');
      table.string('latitude');
      table.string('longitude');
      table.string('name');
      table.string('tinder_id').unique().notNullable();
      table.string('facebook_user_id').unique();
      table.string('facebook_authentication_token');
      table.string('tinder_authentication_token');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
  ])
};

exports.down = function(knex, Promise) {
 return Promise.all([
    knex.schema.dropTable('fake_accounts')
  ])
};
