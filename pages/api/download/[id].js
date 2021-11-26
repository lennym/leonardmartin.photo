import archiver from 'archiver'
import { S3 } from 'aws-sdk'
import { database } from '../../../knex'
import readPhoto from '../../../lib/read-photo'

export default async function Download(req, res) {

  if (req.method === 'GET') {
    const knex = await database()
    const { id } = req.query

    const images = await knex('order_images')
      .join('images', 'images.id', '=', 'order_images.image_id')
      .select('images.*')
      .where('order_images.order_id', id)

    const archive = archiver('zip')

    images.forEach(file => {
      archive.append(readPhoto(file.gallery_id, file.id, 'full'), { name: `${file.gallery_id}/${file.id}.jpg` });
    })

    archive.finalize()

    res.setHeader('Content-Disposition', 'attachment; filename="download.zip"')
    archive.pipe(res)

  }

}
