module.exports = {
  async rewrites() {
    return [
      {
        source: '/preview/:gallery/:image',
        destination: '/api/preview?image=:image'
      },
      {
        source: '/admin',
        destination: '/admin/galleries'
      },
      {
        source: '/about',
        destination: '/portfolio'
      },
      {
        source: '/orders/:id/download',
        destination: '/api/download/:id'
      }
    ]
  }
}
