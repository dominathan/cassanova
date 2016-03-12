
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('photos', function(table) {
      table.increments('id').primary();
      table.integer('target_id').references('id').inTable('targets').notNullable();
      table.string('photo_url').notNullable();
      table.string('tinder_id').notNullable().unique();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('photos')
  ])
};
