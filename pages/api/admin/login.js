import { withSessionRoute } from '../../../lib/session'

export default withSessionRoute(async function Login(req, res) {
  if (req.method === 'POST') {
    const { password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      req.session.admin = false
      res.status(401)
    } else {
      req.session.admin = true
    }
    await req.session.save()
    return res.json({  })
  }
  res.redirect('/admin')
})
