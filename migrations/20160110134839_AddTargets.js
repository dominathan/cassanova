
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('targets',function(table) {
      table.increments('id').primary();
      table.string('tinder_id').unique().notNullable();
      table.string('name');
      table.text('bio');
      table.string('gender');
      table.date('birth_date');
      table.boolean('blocked').defaultTo(false);
      table.integer('fake_account_id').references('id').inTable('fake_accounts').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.string('match_id').unique().notNullable();
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('targets')
  ])
};
