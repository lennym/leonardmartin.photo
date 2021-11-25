import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';

const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: 'lmphoto',
}

export function withSessionRoute(handler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr(handler) {
  return withIronSessionSsr(handler, sessionOptions);
}

export function withAuthGateway(handler) {
  return withSessionSsr((args) => {
    const { req } = args
    if (!req.session.admin) {
      return {
        redirect: {
          destination: '/admin/login'
        }
      }
    }
    return handler(args)
  });
}

export function withApiAuthGateway(handler) {
  return handler
  return withSessionRoute((req, res) => {
    if (!req.session.admin) {
      return res.status(401).json({})
    }
    return handler(req, res)
  });
}
