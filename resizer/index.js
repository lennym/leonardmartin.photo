// dependencies
const AWS = require('aws-sdk');
const util = require('util');
const path = require('path');
const sharp = require('sharp');

// get reference to S3 client
const s3 = new AWS.S3();

exports.handler = async (event, context, callback) => {

  // Read options from the event parameter.
  const srcBucket = event.Records[0].s3.bucket.name;
  // Object key may have spaces or unicode non-ASCII characters.
  const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
  console.log(srcKey);
  if (srcKey.match(/thumbnails/)) {
    return;
  }

  // Infer the image type from the file suffix.
  const typeMatch = srcKey.match(/\.([^.]*)$/);
  if (!typeMatch) {
    console.log("Could not determine the image type.");
    return;
  }

  // Check that the image type is supported
  const imageType = typeMatch[1].toLowerCase();
  if (imageType != "jpg" && imageType != "png") {
    console.log(`Unsupported image type: ${imageType}`);
    return;
  }

  // Download the image from the S3 source bucket.

  try {
    const params = {
      Bucket: srcBucket,
      Key: srcKey
    };
    var origimage = await s3.getObject(params).promise();

  } catch (error) {
    console.log(error);
    return;
  }

  // do the small thumbnail last because it's the most obvious to see when it's missing
  const sizes = {
    medium: 2400,
    tiny: 24,
    small: 240,
  };

  for await (size of Object.keys(sizes)) {

    console.log(`Creating ${size} image`);
    const image = sharp(origimage.Body);
    const metadata = await image.metadata();
    const target = metadata.height > metadata.width ? { height: sizes[size] } : { width: sizes[size] };
    let buffer;

    if (size === 'medium') {
      buffer = await image.resize(target).composite([{ input: './watermark.png', gravity: 'southeast' }]).toBuffer();
    } else {
      buffer = await image.resize(target).toBuffer();
    }

    const ext = path.extname(srcKey);
    const gallery = path.dirname(srcKey)
    const name = path.basename(srcKey, ext);

    const destparams = {
      Bucket: srcBucket,
      Key: `thumbnails/${gallery}/${name}.${size}${ext}`,
      Body: buffer,
      ContentType: "image"
    };
    await s3.putObject(destparams).promise();
    console.log(`Saved ${size} image`);
  }

};
