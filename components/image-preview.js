import Link from 'next/link'
import Image from './image'

export default function ImagePreview({ className = '', gallery_id, id, size = 'small' }) {
  return (
    <div className={`${className} bg-white shadow-md rounded-md overflow-hidden relative`}>
      <Link href={`/galleries/${gallery_id}/${id}`}>
        <a className="">
          <Image src={`/preview/${gallery_id}/${id}?size=${size}`} objectFit="contain" unoptimized={true} />
        </a>
      </Link>
    </div>
  )
}
