import { database } from '../../../../../knex'
import { withApiAuthGateway } from '../../../../../lib/session'

const SetPick = withApiAuthGateway(async function(req, res) {
  const { id } = req.query
  if (req.method === 'POST') {
    const knex = await database()

    const { id, pick } = req.body;
    const image = await knex('images').where({ id }).update({ pick }).returning('*');

    return res.json(image[0])
  }
  return res.status(400).json({})
})

export default SetPick
