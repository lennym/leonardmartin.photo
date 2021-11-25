import { Lambda } from 'aws-sdk'
import { withApiAuthGateway } from '../../../../../lib/session'

const lambda = new Lambda({
  accessKeyId: process.env.S3_ACCESS,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_REGION
});

const RefreshThumbnails = withApiAuthGateway(async function(req, res) {
  const { id } = req.query
  if (req.method === 'POST') {
    const { imageId } = req.body
    const params = {
      FunctionName: process.env.LAMBDA_FUNCTION,
      Payload: JSON.stringify({
        Records: [
          {
            s3: {
              bucket: {
                name: process.env.S3_BUCKET
              },
              object: {
                key: `${id}/${imageId}.jpg`
              }
            }
          }
        ]
      })
    }

    await new Promise((resolve, reject) => {
      lambda.invoke(params, (err, result) => {
        err ? reject(err) : resolve(result)
      })
    })

    return res.json({ imageId })
  }
  return res.status(400).json({})
})

export default RefreshThumbnails
