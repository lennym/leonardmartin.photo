
exports.up = async function(knex) {
  await knex.schema.table('images', (table) => {
    table.boolean('pick').notNullable().defaultTo(false)
  })
}

exports.down = async function(knex) {
  await knex.schema.table('images', table => {
    table.dropColumn('pick')
  })
}
