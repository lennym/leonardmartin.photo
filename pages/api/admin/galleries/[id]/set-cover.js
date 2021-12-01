import { database } from '../../../../../knex'
import { withApiAuthGateway } from '../../../../../lib/session'

const SetCoverPage = withApiAuthGateway(async function(req, res) {
  const { id } = req.query
  if (req.method === 'POST') {
    const knex = await database()

    const { cover } = req.body;
    await knex('galleries').where({ id }).update({ cover });
    await knex('image').where({ id: cover }).update({ pick: true });

    return res.json({ cover })
  }
  return res.status(400).json({})
})

export default SetCoverPage
