import { database } from '../knex'

export default async function getGalleries({ withNonPublished = false } = {}) {
  const knex = await database();
  const galleries = await knex('galleries')
    .select('*')
    .select(knex('images').count('*').where('gallery_id', knex.ref('galleries.id')).as('images'))
    .where(builder => {
      if (!withNonPublished) {
        builder.where({ public: true })
      }
    })
    .groupBy('galleries.id')
    .orderBy('updated', 'desc')

  const tags = await knex('tags').whereIn('gallery_id', galleries.map(gallery => gallery.id))

  for await (const gallery of galleries) {
    if (!gallery.cover) {
      const cover = await knex('images').where({ gallery_id: gallery.id }).first();
      if (cover) {
        gallery.cover = cover.id;
      }
    }
    gallery.tags = tags.filter(tag => tag.gallery_id === gallery.id).map(tag => tag.value)
  }

  return galleries;
}
