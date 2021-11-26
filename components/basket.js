import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'

import BasketIcon from './icons/basket'

function Count() {
  const { data, error } = useSWR('/api/basket', url => fetch(url).then(response => response.json()))
  if (error || !data) {
    return null
  }
  const { basket = [] } = data
  if (!basket.length) {
    return null
  }
  return <span className="absolute -top-2 -right-2 bg-red-500 rounded-full text-white font-bold text-sm w-5 h-5 leading-5 text-center shadow-md">{ basket.length }</span>
}

export default function Basket({ className = '' }) {
  return <span className={`${ className } relative`}><Link href="/basket"><a><BasketIcon /><Count /></a></Link></span>
}
