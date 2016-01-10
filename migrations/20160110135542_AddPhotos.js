
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('photos', function(table) {
      table.increments('id').primary();
      table.integer('target_id').references('id').inTable('targets');
      table.string('photo_url');
      table.timestamps();
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('photos')
  ])
};
