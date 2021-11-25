import Layout from '../components/layout'
import AdminLayout from '../components/admin/layout'
import '../styles/global.css'

function MyApp({ Component, pageProps, router }) {

  if (router.pathname.match(/^\/admin\//)) {
    return <AdminLayout {...pageProps}>
      <Component {...pageProps} />
    </AdminLayout>
  }
  return <Layout {...pageProps}>
    <Component {...pageProps} />
  </Layout>
}

export default MyApp
