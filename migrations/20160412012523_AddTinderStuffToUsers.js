
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('fake_accounts', function(table) {
      table.integer('user_id').references('id').inTable('users').notNullable().defaultTo(1);
      table.boolean('private').notNullable().defaultTo(false);
      table.string('facebook_email').unique().notNullable().defaultTo("");
      table.string('facebook_password').notNullable().defaultTo("");
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('fake_accounts',function(table) {
      table.dropColumn('user_id');
      table.dropColumn('private');
      table.dropColumn('facebook_email');
      table.dropColumn('facebook_password');
    })
  ])
};
