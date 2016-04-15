
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('usersphotos', function(table) {
      table.increments('id').primary();
      table.integer('fake_account_id').references('id').inTable('fake_accounts');
      table.string('photo_url').notNullable();
      table.string('tinder_id').notNullable().unique();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('usersphotos')
  ])
};
