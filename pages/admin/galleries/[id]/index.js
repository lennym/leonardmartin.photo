import { Fragment, useState, useEffect } from 'react'
import Link from 'next/link'

import { withAuthGateway } from '../../../../lib/session'
import { withGallery } from '../../../../lib/get-gallery'
import TimeStamp from '../../../../components/date'
import Image from '../../../../components/image'
import ImagePreview from '../../../../components/image-preview'

export const getServerSideProps = withAuthGateway(withGallery())

export default function Gallery({ id, title, updated, cover, images = [] }) {

  const [coverId, setCover] = useState(cover)

  useEffect(async () => {
    await fetch(`/api/admin/galleries/${id}/set-cover`, {
      method: 'POST',
      body: JSON.stringify({ cover: coverId }),
      headers: { 'Content-Type': 'application/json' }
    })
  }, [coverId])

  return (
  	<Fragment>
      <div className="xl:grid xl:grid-cols-2 gap-4">
        <div>
      		<h1>{ title }</h1>
          <p className="mb-0 text-gray-400 text-base">/{ id }</p>
          <p className="mb-0 text-gray-500 text-base"><TimeStamp timestamp={ updated} /></p>
          <ImagePreview gallery_id={id} id={coverId} size="medium" className="mt-4 mb-12" />
          <p>
          	<Link href={`/admin/galleries/${id}/edit`}><a className="btn">Edit details</a></Link>
            <Link href={`/admin/galleries/${id}/upload`}><a className="btn">Add images</a></Link>
            <Link href={`/admin/galleries`}><a className="">Back</a></Link>
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-2 self-start gap-2">
          {
            images.map(image => (
              <div key={image.id} className="relative">
                <input type="radio" name="cover" value={image.id} checked={image.id === coverId} className="absolute z-10 top-1 right-1 w-4 h-4" onChange={e => setCover(e.target.value)} />
                <Image src={`/preview/${id}/${image.id}?size=small`} className="relative z-0" />
              </div>
            ))
          }
        </div>
      </div>
    </Fragment>
  )
}
