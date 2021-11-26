import path from 'path';
import { S3 } from 'aws-sdk';

const s3 = new S3({
  accessKeyId: process.env.S3_ACCESS,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_REGION
});

module.exports = (gallery, image, size = 'medium') => {
  const Key = size === 'full' ? `${gallery}/${image}.jpg` : `thumbnails/${gallery}/${image}.${size}.jpg`

  const params = {
    Key,
    Bucket: process.env.S3_BUCKET
  };

  return s3.getObject(params).createReadStream()

};
