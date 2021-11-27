const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const PORT = process.env.PORT || 3000

app.prepare().then(() => {
  createServer((req, res) => {
    if (!req.headers.host.match(/localhost/) && req.headers['x-forwarded-proto'] === 'http') {
      res.statusCode = 301;
      res.setHeader('Location', `https://${req.headers.host}${req.url}`)
      return res.end()
    }
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(PORT, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${PORT}`)
  })
})