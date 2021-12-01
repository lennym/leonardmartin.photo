import { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useSWR from 'swr'
import { useSwipeable } from 'react-swipeable';

import getGallery from '../../../lib/get-gallery'
import withSessionSsr from '../../../lib/session'
import NextImage from 'next/image'
import Image from '../../../components/image'
import TimeStamp from '../../../components/date'
import CloseIcon from '../../../components/icons/close'

export async function getServerSideProps({ params }) {
  const [galleryId, imageId] = params.slug
  const props = await getGallery(galleryId)
  if (imageId) {
    props.imageId = imageId
  }
  return {
    props
  }
}

function ImagePreview({ className = '', gallery_id, id, size = 'small' }) {
  const router = useRouter()
  const url = `/galleries/${gallery_id}/${id}`
  const open = e => {
    e.preventDefault()
    router.push(url, url, { scroll: false })
  }
  return (
    <div className={`${className} bg-white shadow-md rounded-md overflow-hidden relative`}>
      <a href={url} onClick={open}>
        <Image src={`/preview/${gallery_id}/${id}?size=${size}`} objectFit="contain" unoptimized={true} />
      </a>
    </div>
  )
}

function Exif({ FNumber, ISO, Model, LensModel, ExposureTime }) {
  let exposure;
  if (ExposureTime >= 1) {
    exposure = `${ExposureTime}"`
  } else if (ExposureTime) {
    exposure = `1/${Math.round(1 / ExposureTime)}"`
  }
  return <div className="mb-6 hidden md:block">
    { Model && <p className="mb-0 text-xs text-gray-400">{Model}</p> }
    { LensModel && <p className="mb-0 text-xs text-gray-400">{LensModel}</p> }
    { FNumber && <p className="mb-0 text-xs text-gray-400">f/{FNumber}</p> }
    { exposure && <p className="mb-0 text-xs text-gray-400">{exposure}</p>}
    { ISO && <p className="mb-0 text-xs text-gray-400">ISO{ISO}</p> }
  </div>
}

function Overlay({ id, imageId, title, images }) {
  if (!imageId) {
    return null
  }
  const index = images.findIndex(image => image.id === imageId)
  const router = useRouter()
  const [maximised, setMaximised] = useState(false)
  const { data, mutate } = useSWR('/api/basket', url => fetch(url).then(response => response.json()))

  const basket = data ? data.basket : []
  const inBasket = basket.some(image => image.id === imageId)
  const { exif } = images.find(i => i.id === imageId)

  const handlers = useSwipeable({
    onSwiped: ({ dir }) => {
      switch (dir) {
        case 'Left':
          return navigate('next')
        case 'Right':
          return navigate('previous')
        case 'Down':
          return exit()
      }
    }
  });

  const exit = () => {
    return router.replace(`/galleries/${id}`, `/galleries/${id}`, { scroll: false })
  }

  const navigate = direction => {
    let url
    switch (direction) {
      case 'previous':
        const prevImage = images[(index - 1 + images.length) % images.length]
        url = `/galleries/${id}/${prevImage.id}`
        return router.replace(url, url, { scroll: false })
      case 'next':
        const nextImage = images[(index + 1) % images.length]
        url = `/galleries/${id}/${nextImage.id}`
        return router.replace(url, url, { scroll: false })
    }
  }

  const keypress = (e) => {
    if (imageId) {
      switch (e.key) {
        case 'ArrowLeft':
          return navigate('previous')
        case 'ArrowRight':
          return navigate('next')
        case 'ArrowUp':
          return setMaximised(true)
        case 'ArrowDown':
          return setMaximised(false)
        case 'Escape':
          return exit()
      }
    }
  }

  useEffect(() => {
    document.body.addEventListener('keydown', keypress)
    return () => {
      document.body.removeEventListener('keydown', keypress)
    }
  })

  const addToBasket = async (id) => {
    const method = inBasket ? 'DELETE' : 'POST'
    const request = await fetch(`/api/basket`, {
      method,
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' }
    })
    mutate(request.json(), false)
  }

  const style = {
    backgroundImage: `url("/preview/${id}/${imageId}?size=tiny")`
  }

  return <div className="fixed inset-0 flex flex-col md:flex-row" {...handlers} >
    <div className="absolute inset-0 w-full h-full bg-cover bg-gray-200" style={style} onClick={exit} />
    <div className="flex-grow m-1 md:m-4 relative z-1 md:mr-4">
      {
        maximised && (
          <a onClick={exit} className="absolute z-10 top-4 right-6 p-1 bg-gray-300 rounded-full flex cursor-pointer">
            <CloseIcon size={20} className="text-white" />
          </a>
        )
      }
      <NextImage src={`/preview/${id}/${imageId}?size=medium`} layout="fill" objectFit="contain" className="shadow-lg" unoptimized={true} />
    </div>
    {
      !maximised && (
        <div className="md:w-72 bg-gray-100 md:ml-0 p-2 md:p-4 relative z-1 m-1 mt-0 md:m-4 shadow-md rounded-md">
          <a onClick={exit} className="absolute top-4 right-2 md:right-4 p-1 bg-gray-300 rounded-full flex cursor-pointer">
            <CloseIcon size={20} className="text-white" />
          </a>
          <h2 className="hidden portrait:block md:block mb-2">{title}</h2>
          <p className="hidden portrait:block md:block text-base text-gray-400 mb-4">{ index+1 }/{ images.length}</p>
          <Exif {...exif} />
          <p className="mb-0 text-base">
            <button className="btn" onClick={() => addToBasket(imageId)}>{ inBasket ? 'Remove from download' : 'Add to download' }</button>
          </p>
        </div>
      )
    }
  </div>
}

export default function Gallery(props) {
  let images = props.images
  const hasPicks = images.some(image => image.pick)
  const router = useRouter()
  const [selected, setSelected] = useState(hasPicks && router.query.selected !== 'all')
  const { id, title, updated, tags } = props

  if (selected) {
    images = images.filter(image => image.pick)
  }

  const getCallout = index => {
    const callout = {
      sm: (index % 7 === 0),
      md: (index % 18 === 0) || (index % 18 === 10),
      lg: (index % 26 === 0) || (index % 26 === 15)
    }
    return ['sm', 'md', 'lg'].reduce((arr, size) => {
      const classes = callout[size] ? `${size}:col-span-2 ${size}:row-span-2` : `${size}:col-span-1 ${size}:row-span-1`
      return [...arr, classes]
    }, [`index-${index}`]).join(' ')
  }

  const toggleSelected = e => {
    e.preventDefault();
    setSelected(!selected)
  }

  useEffect(() => {
    const url = selected ? `/galleries/${id}` : `/galleries/${id}?selected=all`
    router.replace(url, url, { scroll: false })
  }, [selected])

  return (
    <section>
      <h1 className="mb-6">{ title }</h1>
      <p className="text-gray-400 mb-0">
        <TimeStamp timestamp={updated} />
      </p>
      <p>
        {
          tags.map(tag => {
            return <Link href={`/galleries?tags=${tag}`} key={tag}><a key={tag} className="inline-block bg-gray-200 text-gray-400 rounded-md px-2 mr-1 mb-1">{tag}</a></Link>
          })
        }
      </p>

      {
        selected ?
          <p><span className="text-gray-400">Showing:</span> Highlights | <Link href={`/galleries/${id}?selected=all`}><a onClick={toggleSelected}>All</a></Link></p> :
          <p><span className="text-gray-400">Showing:</span> <Link href={`/galleries/${id}`}><a onClick={toggleSelected}>Highlights</a></Link> | All</p>
      }

      {
        selected ?
          <div className="grid grid-cols-1 gap-1 md:grid-cols-2 mb-12">
            {
              images.map((image, i) => {
                return <ImagePreview key={image.id} {...image} size="medium" />
              })
            }
          </div> :
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-12">
            {
              images.map((image, i) => {
                return <ImagePreview key={image.id} {...image} className={getCallout(i)} size="small" />
              })
            }
          </div>
      }
      <Overlay {...props} images={images} />
    </section>
  )
}
