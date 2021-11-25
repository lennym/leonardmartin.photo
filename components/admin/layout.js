import { Provider } from 'react-redux'
import Layout from '../layout'
import AdminMenu from './menu'

import store from './store'

export default function AdminLayout({ children }) {
  return (
    <Layout>
      <section className="md:flex">
        <Provider store={ store }>
          <AdminMenu className="flex-0 md:mr-6 md:w-1/5" />
          <div className="flex-1">
            { children }
          </div>
        </Provider>
      </section>
    </Layout>
  )
}
