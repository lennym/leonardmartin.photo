import { S3 } from 'aws-sdk'
import { database } from '../../../../../knex'
import { withApiAuthGateway } from '../../../../../lib/session'

const s3 = new S3({
  accessKeyId: process.env.S3_ACCESS,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_REGION
});

const Delete = withApiAuthGateway(async function(req, res) {
  const { id } = req.query
  if (req.method === 'POST') {
    const knex = await database()

    const { imageId } = req.body;

    await new Promise((resolve, reject) => {
      s3.deleteObject({
        Bucket: process.env.S3_BUCKET,
        Key: `${id}/${imageId}.jpg`
      }, (err, result) => {
        err ? reject(err) : resolve()
      })
    })

    await knex('images').where({ id: imageId }).delete();

    return res.json({})
  }
  return res.status(400).json({})
})

export default Delete
