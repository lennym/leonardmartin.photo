import path from 'path'
import { v4 as uuid } from 'uuid'
import { S3 } from 'aws-sdk'
import Busboy from 'busboy'
import { database } from '../../../../../knex'
import { withApiAuthGateway } from '../../../../../lib/session'

const s3 = new S3({
  accessKeyId: process.env.S3_ACCESS,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_REGION
});

export const config = {
  api: {
    bodyParser: false,
  },
}

const Upload = withApiAuthGateway(async function(req, res) {
  const { id: gallery_id } = req.query
  const knex = database()
  let id = uuid()
  let skipped = false
  let exif
  let created
  try {
    const filename = req.headers['x-filename'];
    const hash = req.headers['x-md5']

    const existing = await knex('images').where({ gallery_id, filename }).first()

    if (existing) {
      if (existing.hash === hash) {
        skipped = true
      }
      id = existing.id
    }

    const busboy = new Busboy({ headers: req.headers, filesLimit: 1 })

    await new Promise((resolve, reject) => {
      busboy.on('field', (name, value) => {
        if (name === 'exif') {
          exif = JSON.parse(value)
          created = new Date(exif.CreateDate * 1000).toISOString()
        }
      })
      busboy.on('file', (field, Body, file) => {
        if (skipped) {
          let body = '';
          Body.on('data', chunk => body += chunk)
          Body.on('end', resolve)
          return;
        }
        const ext = path.extname(file)
        const Key = `${gallery_id}/${id}${ext}`
        s3.upload({
          Bucket: process.env.S3_BUCKET,
          Key,
          Body
        }, (err, result) => {
          err ? reject(err) : resolve()
        })
      })
      req.pipe(busboy)
    })

    if (existing) {
      await knex('images').update({ hash, created, exif }).where({ id });
    } else {
      await knex('images').insert({ id, gallery_id, filename, hash, created, exif });
    }

    return res.status(200).json({ id, gallery_id, filename, hash, skipped });
  } catch (e) {
    res.status(500).json({ message: e.message, stack: e.stack })
  }

})

export default Upload
