import { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useSWR from 'swr'
import { useSwipeable } from 'react-swipeable';

import getGallery from '../../../lib/get-gallery'
import withSessionSsr from '../../../lib/session'
import ImagePreview from '../../../components/image-preview'
import Image from 'next/image'
import TimeStamp from '../../../components/date'
import CloseIcon from '../../../components/icons/close'

export async function getServerSideProps({ params }) {
  const [galleryId, imageId] = params.slug
  const props = await getGallery(galleryId)
  if (imageId) {
    props.imageId = imageId
    props.index = props.images.findIndex(i => i.id === imageId)
  }
  return {
    props
  }
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

function Overlay({ id, imageId, title, index, images }) {
  if (!imageId) {
    return null
  }
  const router = useRouter()
  const [maximised, setMaximised] = useState(false)
  const { data, mutate } = useSWR('/api/basket', url => fetch(url).then(response => response.json()))

  const basket = data ? data.basket : []
  const inBasket = basket.some(image => image.id === imageId)
  const { exif } = images.find(i => i.id === imageId)

  const handlers = useSwipeable({
    onSwiped: ({ dir }) => navigate(dir === 'Left' ? 'next': 'previous')
  });

  const exit = () => {
    return router.replace(`/galleries/${id}`)
  }

  const navigate = direction => {
    switch (direction) {
      case 'previous':
        const prevImage = images[(index - 1 + images.length) % images.length]
        return router.replace(`/galleries/${id}/${prevImage.id}`)
      case 'next':
        const nextImage = images[(index + 1) % images.length]
        return router.replace(`/galleries/${id}/${nextImage.id}`)
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
    <div className="flex-grow m-2 md:m-6 relative z-1 md:mr-4">
      {
        maximised && (
          <a onClick={exit} className="absolute z-10 top-4 right-6 p-1 bg-gray-300 rounded-full flex cursor-pointer">
            <CloseIcon size={20} className="text-white" />
          </a>
        )
      }
      <Image src={`/preview/${id}/${imageId}?size=medium`} layout="fill" objectFit="contain" className="shadow-lg" unoptimized={true} />
    </div>
    {
      !maximised && (
        <div className="md:w-72 bg-gray-100 md:ml-0 p-4 relative z-1 m-2 md:m-6 shadow-md rounded-md">
          <a onClick={exit} className="absolute top-4 right-4 p-1 bg-gray-300 rounded-full flex cursor-pointer">
            <CloseIcon size={20} className="text-white" />
          </a>
          <h2 className="mb-2">{title}</h2>
          <p className="text-base text-gray-400 mb-4">{ index+1 }/{ images.length}</p>
          <Exif {...exif} />
          <p className="mb-0">
            <button className="btn" onClick={() => addToBasket(imageId)}>{ inBasket ? 'Remove from download' : 'Add to download' }</button>
          </p>
        </div>
      )
    }
  </div>
}

export default function Gallery(props) {
  const { title, updated, images, tags } = props
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

  return (
    <section>
      <h1 className="mb-6">{ title }</h1>
      <p className="text-gray-400 mb-0">
        <TimeStamp timestamp={updated} />
      </p>
      <p>
        {
          tags.map(tag => {
            return <span key={tag} className="inline-block bg-gray-200 text-gray-400 rounded-md px-2 mr-1 mb-1">{tag}</span>
          })
        }
      </p>
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-12">
        {
          images.map((image, i) => {
            return <ImagePreview key={image.id} {...image} className={getCallout(i)} size="small" />
          })
        }
      </div>
      <Overlay {...props} />
    </section>
  )
}
