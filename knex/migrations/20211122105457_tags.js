
exports.up = async function(knex) {
  await knex.schema.createTable('tags', (table) => {
    table.string('gallery_id').references('id').inTable('galleries')
    table.string('value').nullable()
  })
};

exports.down = async function(knex) {
  await knex.schema.dropTable('images')
};
