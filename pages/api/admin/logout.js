import { withSessionRoute } from '../../../lib/session'

export default withSessionRoute(async function Login(req, res) {
  req.session.admin = false
  await req.session.save()
  res.redirect('/admin/login')
})
