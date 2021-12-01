import { Fragment, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { withAuthGateway } from '../../../../lib/session'
import { withGallery } from '../../../../lib/get-gallery'
import TimeStamp from '../../../../components/date'
import Image from '../../../../components/image'
import ImagePreview from '../../../../components/image-preview'

export const getServerSideProps = withAuthGateway(withGallery())

function ImageThumbnail({ id, pick, galleryId, coverId, onSetCover }) {
  const [refreshing, setRefreshing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [cachebuster, setCacheBuster] = useState('')
  const [isPick, setPick] = useState(pick)
  const router = useRouter();

  const refresh = async () => {
    setRefreshing(true)
    const response = await fetch(`/api/admin/galleries/${galleryId}/refresh`, {
      method: 'POST',
      body: JSON.stringify({ imageId: id }),
      headers: { 'Content-Type': 'application/json' }
    })
    setCacheBuster(Date.now())
    setRefreshing(false)
  }

  const deleteImage = async () => {
    confirm('Delete image?')
    setDeleting(true)
    const response = await fetch(`/api/admin/galleries/${galleryId}/delete`, {
      method: 'POST',
      body: JSON.stringify({ imageId: id }),
      headers: { 'Content-Type': 'application/json' }
    })
    setDeleting(false)
    router.reload()
  }

  const togglePick = async () => {
    const response = await fetch(`/api/admin/galleries/${galleryId}/pick`, {
      method: 'POST',
      body: JSON.stringify({ id, pick: !isPick }),
      headers: { 'Content-Type': 'application/json' }
    })
    const result = await response.json()
    setPick(result.pick)
  }

  return <div className="relative">
    <div className="absolute z-10 top-1 right-1 w-4 h-4">
      <input type="radio" name="cover" value={id} checked={id === coverId} onChange={e => onSetCover(e.target.value)} />
      <button onClick={() => refresh()} disabled={refreshing}>{refreshing ? '⏱' : '⟲'}</button>
      <button onClick={() => deleteImage()} disabled={deleting}>{deleting ? '⏱' : '🚫'}</button>
    </div>
    <div className={`relative z-0 box-border ${isPick ? 'border border-4 -m-1 border-red-500' : ''}`} onClick={() => togglePick()}>
      <Image src={`/preview/${galleryId}/${id}?size=small&cachebuster=${cachebuster}`} />
    </div>
  </div>

}

export default function Gallery({ id, title, updated, cover, images = [], tags=[] }) {

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
        <div className="relative">
          <div className="sticky top-0">
            <h1>{ title }</h1>
            <p className="mb-0 text-gray-400 text-base">/{ id }</p>
            <p className="mb-0 text-gray-500 text-base"><TimeStamp timestamp={ updated} /></p>
            <p className="mb-0 text-sm">
              {
                tags.map(tag => {
                  return <span key={tag} className="inline-block bg-gray-200 text-gray-400 rounded-md px-2 mr-1">{tag}</span>
                })
              }
            </p>
            <ImagePreview gallery_id={id} id={coverId} size="medium" className="mt-4 mb-12" />
            <p>
              <Link href={`/admin/galleries/${id}/edit`}><a className="btn">Edit details</a></Link>
              <Link href={`/admin/galleries/${id}/upload`}><a className="btn">Add images</a></Link>
              <Link href={`/admin/galleries`}><a className="">Back</a></Link>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-2 self-start gap-2">
          {
            images.map(image => (
              <ImageThumbnail key={image.id} id={image.id} galleryId={id} coverId={coverId} onSetCover={setCover} />
            ))
          }
        </div>
      </div>
    </Fragment>
  )
}
