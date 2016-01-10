
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('targets',function(table) {
      table.increments('id').primary();
      table.string('tinder_id');
      table.string('name');
      table.text('bio');
      table.string('gender');
      table.date('birth_date');
      table.integer('fake_account_id').references('id').inTable('fake_accounts');
      table.timestamps();
      table.string('match_id');
    })
  ])
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('targets');
};
