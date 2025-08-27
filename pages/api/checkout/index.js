import { get } from 'lodash';
import Stripe from 'stripe';

import { database } from '../../../knex';
import sendConfirmation from '../../../lib/send-confirmation';
import { withSessionRoute } from '../../../lib/session';

const stripe = Stripe(process.env.STRIPE_KEY_SECRET, {
  apiVersion: '2020-08-27',
});

export default withSessionRoute(async function Checkout(req, res) {
  if (req.method === 'POST') {
    try {
      const knex = await database();
      const basket = req.session.basket || [];
      const { amount, email } = req.body;
      const order = await knex('orders')
        .insert({ email, amount })
        .returning('*');
      const images = await knex('order_images').insert(
        basket.map((image_id) => ({ image_id, order_id: order[0].id }))
      );
      req.session.basket = [];
      await req.session.save();
      if (email) {
        await sendConfirmation(email, order[0].id);
      }
      res.status(200).json({ ...order[0], images: basket });
    } catch (error) {
      console.error(error);
      res
        .status(get(error, 'raw.statusCode') || 500)
        .json({ error: error.message });
    }
  }
});
