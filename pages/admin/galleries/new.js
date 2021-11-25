import { Fragment } from 'react'
import { withAuthGateway } from '../../../lib/session'
import EditGallery from '../../../components/admin/edit-gallery'

export const getServerSideProps = withAuthGateway(async function ({ req }) {
  return { props: {} };
})

export default function Gallery() {
  return (
    <Fragment>
      <h1>New Gallery</h1>
      <EditGallery id="new" cancel="/admin" />
    </Fragment>
  )
}
