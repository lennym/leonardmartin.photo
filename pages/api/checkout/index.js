import { get } from 'lodash'
import Stripe from 'stripe'

import { database } from '../../../knex'
import { withSessionRoute } from '../../../lib/session'
import sendConfirmation from '../../../lib/send-confirmation'

const stripe = Stripe(process.env.STRIPE_KEY_SECRET, { apiVersion: '2020-08-27' })

export default withSessionRoute(async function Checkout(req, res) {

  if (req.method === 'POST') {
    const knex = await database()
    const basket = req.session.basket || []

    try {
      const amount = req.body.amount
      let charge
      let email = req.body.email
      if (amount > 0) {
        charge = await stripe.charges.create({
          amount,
          currency: 'gbp',
          description: 'Photo sale',
          source: req.body.token.id
        })
      }
      if (charge) {
        email = get(charge, 'source.name');
      }
      const order = await knex('orders').insert({ email, amount }).returning('*')
      const images = await knex('order_images').insert(basket.map(image_id => ({ image_id, order_id: order[0].id })))
      req.session.basket = []
      await req.session.save()
      if (email) {
        await sendConfirmation(email, order[0].id)
      }
      res.status(200).json({ ...order[0], images: basket })
    } catch (error) {
      res.status(get(error, 'raw.statusCode') || 500).json({ error: error.message })
    }
  }

})
