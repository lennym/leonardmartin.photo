
exports.up = async function(knex) {
  await knex.schema.createTable('galleries', (table) => {
    table.string('id').notNullable().primary()
    table.boolean('public').notNullable().defaultTo(false)
    table.string('title')
    table.string('cover')
    table.date('updated')
  })
};

exports.down = async function(knex) {
  await knex.schema.dropTable('galleries')
};
