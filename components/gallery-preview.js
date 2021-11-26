import Link from 'next/link'
import Image from './image'

import TimeStamp from './date'

export default function GalleryPreview({ className, cover, title, id, updated, tags = [] }) {
  return (
    <div className={`${className} bg-white shadow-md rounded-md overflow-hidden relative`}>
      <Link href={`/galleries/${id}`}>
        <a className="">
          <Image src={`/preview/${id}/${cover}?size=medium`} />
          <p className="pt-4 px-6 mb-0">{ title }</p>
          <p className="px-6 mb-0 text-gray-400 text-base">
            <TimeStamp timestamp={updated} />
          </p>
          <p className="pb-4 px-6 mb-0 text-gray-400 text-base">
            {
              tags.map(tag => {
                return <span key={tag} className="inline-block bg-gray-100 rounded-md px-2 mr-1 mb-1">{tag}</span>
              })
            }
          </p>
        </a>
      </Link>
    </div>
  )
}
