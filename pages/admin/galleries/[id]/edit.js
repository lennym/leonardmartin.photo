import { Fragment } from 'react'

import { withAuthGateway } from '../../../../lib/session'
import { withGallery } from '../../../../lib/get-gallery'

import EditGallery from '../../../../components/admin/edit-gallery'

export const getServerSideProps = withAuthGateway(withGallery())

export default function Gallery({ id, title, updated, public: published, tags = [] }) {
  return (
    <Fragment>
      <h1>{ title }</h1>
      <EditGallery id={id} title={title} updated={updated} published={published} tags={tags.map(tag => tag.value).join(', ')} cancel={`/admin/galleries/${id}`} />
    </Fragment>
  )
}
