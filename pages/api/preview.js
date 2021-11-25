import readPhoto from '../../lib/read-photo'

export default async function helloAPI(req, res) {
  const { gallery, image, size = 'medium' } = req.query
  if (!gallery || !image) {
    res.status(404)
    res.send('Not found')
  }

  res.setHeader('Content-Type', 'image/jpeg')
  res.status(200)
  const stream = await readPhoto(gallery, image, size)
  stream.pipe(res)
  stream.on('error', e => {
    res.status(500);
    if (e.code === 'NoSuckKey') {
      res.status(404)
    }
    res.setHeader('Content-Type', 'text/plain')
    res.send(e.message);
  })
}
