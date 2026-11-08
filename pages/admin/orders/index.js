import Link from 'next/link';
import { Fragment } from 'react';
import TimeStamp from '../../../components/date';
import { database } from '../../../knex';
import { withAuthGateway } from '../../../lib/session';

export const getServerSideProps = withAuthGateway(async function () {
  const knex = await database();
  const orders = await knex('orders')
    .select('orders.*')
    .select(
      knex('order_images')
        .count('*')
        .where('order_id', knex.ref('orders.id'))
        .as('images'),
    )
    .where('orders.email', '!=', 'leonard.martin@gmail.com')
    .orderBy('date', 'desc');

  return {
    props: {
      orders,
    },
  };
});

export default function Orders({ orders }) {
  return (
    <Fragment>
      <h1>Orders</h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">#</th>
            <th className="p-2 text-left">£</th>
            <th className="p-2 text-left">Time</th>
            <th className="p-2 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t">
              <td className="p-2">{order.email}</td>
              <td className="p-2">{order.images}</td>
              <td className="p-2">{(order.amount / 100).toFixed(2)}</td>
              <td className="p-2">
                <TimeStamp timestamp={order.date} showTime={true} />
              </td>
              <td className="p-2 text-right">
                <Link href={`/orders/${order.id}`}>
                  <a>download</a>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
}
