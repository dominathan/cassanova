
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('conversations',function(table) {
      table.increments('id').primary();
      table.integer('target_id').references('id').inTable('targets').notNullable();
      table.integer('fake_account_id').references('id').inTable('fake_accounts');
      table.text('message').notNullable();
      table.datetime('sent_date').notNullable();
      table.boolean('received').notNullable();
      table.string('tinder_id').notNullable().unique();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('conversations')
  ])
};
