import { database } from '../knex'

export function withGallery() {
  return async function ({ params }) {
    const props = await getGallery(params.id)
    if (props) {
      return { props }
    }
    return { notFound: true }
  }
}

export default async function getGallery(id) {
  const knex = await database();
  const gallery = await knex('galleries').where({ id }).first()
  const images = await knex('images').where({ gallery_id: id }).orderBy('created', 'asc')
  const tags = await knex('tags').select('value').where({ gallery_id: id })

  if (!gallery.cover) {
    gallery.cover = images.length && images[0].id
  }

  return {
    ...gallery,
    images,
    tags: tags.map(t => t.value)
  }
}
