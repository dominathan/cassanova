
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('conversations',function(table) {
      table.increments('id').primary();
      table.integer('target_id').references('id').inTable('targets');
      table.integer('fake_account_id').references('id').inTable('fake_accounts');
      table.text('message');
      table.datetime('sent_date');
      table.boolean('received');
      table.timestamps();
    })
  ])
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('conversations');
};
