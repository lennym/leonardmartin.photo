
exports.up = async function(knex) {
  await knex.schema.createTable('orders', (table) => {
    table.string('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.string('email')
    table.datetime('date').notNullable().defaultTo(knex.fn.now())
    table.integer('amount')
  })
  await knex.schema.createTable('order_images', (table) => {
    table.string('order_id').notNullable().references('id').inTable('orders')
    table.string('image_id').notNullable().references('id').inTable('images')
  })
};

exports.down = async function(knex) {
  await knex.schema.dropTable('order_images')
  await knex.schema.dropTable('orders')
};
