import { uniq } from 'lodash'
import { database } from '../../../../../knex'
import { withApiAuthGateway } from '../../../../../lib/session'

const GalleryAdmin = withApiAuthGateway(async function(req, res) {
  const { id } = req.query
  const knex = await database()

  if (req.method === 'POST') {
    const params = req.body;
    const gallery_id = params.id || id
    params.title = params.title || 'Untitled gallery'
    params.updated = params.updated || new Date().toISOString()
    console.log(params.public)

    const tags = uniq(params.tags.split(',').map(tag => tag.trim())).map(value => ({ gallery_id, value }))
    delete params.tags

    if (id === 'new') {
      await knex('galleries').insert(params);
    } else {
      await knex('galleries').where({ id }).update(params);
    }

    await knex('tags').delete().where({ gallery_id })
    if (tags.length) {
      await knex('tags').insert(tags)
    }
    return res.redirect(`/admin/galleries/${gallery_id}`)
  }

  return res.redirect(`/admin/galleries/${id}`)

})

export default GalleryAdmin
