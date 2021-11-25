
exports.up = async function(knex) {
  await knex.schema.raw('create extension if not exists "uuid-ossp"')
  await knex.schema.createTable('images', (table) => {
    table.string('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.string('gallery_id').references('id').inTable('galleries')
    table.string('filename').notNullable()
    table.string('hash').notNullable()
    table.jsonb('exif')
    table.datetime('created')
  })
};

exports.down = async function(knex) {
  await knex.schema.dropTable('images')
  await knex.schema.raw('drop extension if exists "uuid-ossp"')
};
