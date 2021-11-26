import { Fragment } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { withAuthGateway, withSessionSsr } from '../../../lib/session'
import getGalleries from '../../../lib/get-galleries'
import TimeStamp from '../../../components/date'

export const getServerSideProps = withAuthGateway(async function ({ req }) {
  const galleries = await getGalleries({ withNonPublished: true })
  return {
    props: {
      galleries
    }
  }
})

export default function Galleries({ galleries }) {
  return (
    <Fragment>
      <h1>Manage galleries</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 mb-12 gap-2">
        {
          galleries.map(gallery => (
            <Link href={`/admin/galleries/${gallery.id}`}>
              <a className={`${gallery.public ? 'bg-white' : 'bg-red-100'} border rounded-md flex overflow-hidden relative`}>
                {
                  !gallery.public && <p className="absolute top-1 right-1 text-xs bg-gray-300 text-gray-500 p-1 px-2 rounded-md">private</p>
                }
                <div className="w-1/4 relative">
                  <Image src={`/preview/${gallery.id}/${gallery.cover}?size=small`} layout="fill" objectFit="cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-red-500">{ gallery.title } ({ gallery.images })</h3>
                  <p className="mb-0 text-gray-400 text-base">/{ gallery.id }</p>
                  <p className="mb-0 text-gray-500 text-base"><TimeStamp timestamp={ gallery.updated} /></p>
                  <p className="mb-0 text-sm">
                    {
                      gallery.tags.map(tag => {
                        return <span key={tag} className="inline-block bg-gray-100 text-gray-400 rounded-md px-2 mr-1 mb-1">{tag}</span>
                      })
                    }
                  </p>
                </div>
              </a>
            </Link>
          ))
        }
      </div>
      <p><Link href="/admin/galleries/new"><a className="btn">Add new gallery</a></Link></p>
    </Fragment>
  )
}
