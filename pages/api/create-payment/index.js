import { get } from 'lodash'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_KEY_SECRET, {
  apiVersion: '2020-08-27',
});

export default async function CreatePayment(req, res) {

  const { amount, paymentIntent } = req.body

  if (req.method === 'POST') {
    if (paymentIntent) {
      try {
        // If a paymentIntent is passed, retrieve the paymentIntent
        const intent = await stripe.paymentIntents.retrieve(paymentIntent);
        // If a paymentIntent is retrieved update its amount
        if (intent) {
          const updated = await stripe.paymentIntents.update(paymentIntent, { amount });
          return res.status(200).json(updated);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Internal server error';
        return res.status(500).json({ statusCode: 500, message });
      }
    }
    try {
      // Create PaymentIntent
      const params = {
        amount: amount,
        currency: 'gbp',
        description: 'Photo sale',
        automatic_payment_methods: { enabled: true }
      }
      const intent = await stripe.paymentIntents.create(params)
      //Return the payment_intent object
      res.status(200).json(intent);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Internal server error';
      res.status(500).json({ statusCode: 500, message });
    }
  }

}
