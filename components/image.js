import Image from 'next/image'

export default function WrappedImage({ className = '', src, objectFit = 'cover', backdrop = true }) {

  const style = {
    backgroundImage: `url(${src.replace(/size=(small|medium|large)/, 'size=tiny')})`
  }
  return <div className={`${className} aspect-w-3 aspect-h-2 overflow-hidden`}>
    { backdrop && <div className="-m-6 p-6 w-full h-full bg-cover bg-no-repeat bg-center bg-origin-padding box-content absolute saturate-50 opacity-80 blur-lg" style={style} /> }
    <Image src={src} layout="fill" objectFit={ objectFit } />
  </div>
}