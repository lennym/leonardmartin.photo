import { database } from '../../../knex'
import { withSessionRoute } from '../../../lib/session'

export default withSessionRoute(async function Basket(req, res) {
  const knex = await database()
  req.session.basket = req.session.basket || []
  const { id } = req.body
  switch (req.method) {
    case 'POST':
      req.session.basket = [...req.session.basket, id]
      break;
    case 'DELETE':
      req.session.basket = req.session.basket.filter(item => item !== id)
      break;
  }
  await req.session.save()
  const basket = await knex('images')
    .select(
      'images.id',
      'images.gallery_id',
      'galleries.title'
    )
    .join('galleries', 'galleries.id', '=', 'images.gallery_id')
    .whereIn('images.id', req.session.basket)
  res.json({ basket })
})
