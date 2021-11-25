import { get } from 'lodash'
import Stripe from 'stripe'

export default async function Basket(req, res) {
  const stripe = Stripe(process.env.STRIPE_KEY_SECRET, { apiVersion: '2020-08-27' })

  try {
    const charge = await stripe.charges.create({
      amount: req.body.amount,
      currency: 'gbp',
      description: 'Photo sale',
      source: req.body.token.id
    })
    res.status(200).json({})
  } catch (error) {
    res.status(get(error, 'raw.statusCode' || 402)).json({ error: error.message })
  }

}
