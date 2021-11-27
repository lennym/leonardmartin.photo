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
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        has: [
          {
            type: 'host',
            value: 'leonardmartin.photo',
          },
        ],
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=1000; includeSubDomains; preload'
          }
        ]
      }
    ]
  }
}
