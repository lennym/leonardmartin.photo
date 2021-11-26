import { useState, useEffect } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { useRouter } from 'next/router'
import StripeCheckout from 'react-stripe-checkout'

import Image from '../../components/image'
import Dustbin from '../../components/icons/dustbin'

export async function getServerSideProps() {
  return {
    props: {
      stripeKey: process.env.STRIPE_KEY_PUBLIC
    }
  }
}

export default function Basket({ stripeKey }) {

  const [error, setError] = useState(null)
  const [accepted, accept] = useState(false)
  const { data = {}, mutate } = useSWR('/api/basket', url => fetch(url).then(response => response.json()))
  const { basket = [] } = data
  const [amount, setAmount] = useState((basket.length * 5).toFixed(2))
  const [email, setEmail] = useState('')
  const paymentAmount = Math.round(100 * parseFloat(amount))
  const router = useRouter();

  const onToken = async (token) => {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({token, amount: paymentAmount}),
      headers: { 'Content-Type': 'application/json' }
    })
    const result = await response.json()
    if (response.error) {
      return setError(result.error)
    }
    mutate('/api/basket', { basket: [] }, false)
    router.push(`/orders/${result.id}`)
  }

  const download = async () => {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ amount: 0, email }),
      headers: { 'Content-Type': 'application/json' }
    })
    const result = await response.json()
    if (response.error) {
      return setError(result.error)
    }
    mutate('/api/basket', { basket: [] }, false)
    router.push(`/orders/${result.id}`)
  }

  const remove = async (id) => {
    const request = await fetch(`/api/basket`, {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' }
    })
    mutate('/api/basket', request.json(), false)
  }

  useEffect(() => {
    setAmount((basket.length * 5).toFixed(2))
  }, [basket])

  return (
    <section>
      <h1>Basket</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-md bg-white border p-4">
          <h2>{basket.length} items selected for download</h2>
          {
            basket.map(image => (
              <div key={image.id} className="flex items-center">
                <div className="w-24 lg:w-32 m-1 mr-2 lg:mr-4">
                  <Image src={`/preview/${image.gallery_id}/${image.id}?size=small`} />
                </div>
                <p className="mb-0 flex-grow">{ image.title }</p>
                <span className="cursor-pointer"><a onClick={() => remove(image.id)} className="text-gray-500 hover:text-red-500"><Dustbin size={24} /></a></span>
              </div>
            ))
          }
          {
            !basket.length && (
              <Link href="/galleries"><a className="btn">Browse galleries</a></Link>
            )
          }
        </div>
        <div className="relative">
          <div className="sticky top-0 rounded-md bg-white border p-4">
            <h2>Checkout</h2>
            <p className="mb-6">
              <label htmlFor="amount">Total</label>
              <div className="flex items-center">
                <span className="mr-2">£</span>
                <input className="p-2 rounded-md border flex-grow text-right" type="text" id="amount" onChange={e => setAmount(e.target.value)} value={amount} />
              </div>
            </p>
            {
              paymentAmount === 0 && (
                <p className="mb-6">
                  <label htmlFor="email">Email</label>
                  <input className="p-2 rounded-md border w-full" type="text" id="email" onChange={e => setEmail(e.target.value)} value={email} />
                </p>
              )
            }
            <p className="mb-6 flex items-start">
              <input type="checkbox" id="declaration" className="border border-gray-200 rounded-md w-6 h-6 mr-2" onChange={e => accept(e.target.checked)} />
              <label htmlFor="declaration">I understand that photos are licensed for personal use only.</label>
            </p>
            <p className="text-right">
              {
                paymentAmount === 0 ?
                  <button className="btn mr-0 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!basket.length || !accepted} onClick={download}>Download</button> :
                  <StripeCheckout
                    token={onToken}
                    amount={paymentAmount}
                    currency="GBP"
                    locale="en"
                    name="Pay with Stripe"
                    stripeKey={stripeKey}
                    >
                    <button className="btn mr-0 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!basket.length || !accepted}>Make payment</button>
                  </StripeCheckout>
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
