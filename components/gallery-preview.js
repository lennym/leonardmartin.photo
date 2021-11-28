import Link from 'next/link'
import Image from './image'

import TimeStamp from './date'

export default function GalleryPreview({ className, cover, title, id, updated, tags = [] }) {
  return (
    <div className={`${className} bg-white shadow-md rounded-md overflow-hidden relative`}>
      <Link href={`/galleries/${id}`}>
        <a className="">
          <Image src={`/preview/${id}/${cover}?size=medium`} />
          <div className="py-1 sm:py-3 px-2 sm:px-4">
            <p className="mb-0">{ title }</p>
            <p className="mb-0 text-gray-400 text-base">
              <TimeStamp timestamp={updated} />
            </p>
            <p className="mb-0 text-gray-400 text-base">
              {
                tags.map(tag => {
                  return <Link href={`/galleries?tags=${tag}`}><a key={tag} className="inline-block bg-gray-100 text-gray-400 rounded-md px-2 mr-1 mb-1">{tag}</a></Link>
                })
              }
            </p>
          </div>
        </a>
      </Link>
    </div>
  )
}
