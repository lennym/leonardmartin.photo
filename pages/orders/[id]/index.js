import Link from 'next/link'
import { database } from '../../../knex'
import Image from '../../../components/image'

export async function getServerSideProps({ params }) {

  const knex = await database()

  const order = await knex('orders').where({ id: params.id })

  if (!order) {
    return { notFound: true }
  }

  const images = await knex('order_images')
      .join('images', 'images.id', '=', 'order_images.image_id')
      .select('images.*')
      .where('order_images.order_id', params.id)

  return {
    props: {
      id: params.id,
      images
    }
  }
}

export default function Order({ id, images }) {
  return (
    <section>
      <h1>Order complete</h1>
      <p>Thank you for your order.</p>
      <p className="grid grid-cols-4 gap-2">
        {
          images.map(image => <Image key={image.id} src={`/preview/${image.gallery_id}/${image.id}?size=small`} />)
        }
      </p>
      <p>You can download your photos at the following link:</p>
      <p><Link href={`/orders/${id}/download`}><a className="btn">Download</a></Link></p>
    </section>
  )
}
