import { useState, useEffect, Fragment } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js'

import Checkout from '../../components/checkout'
import Image from '../../components/image'
import Dustbin from '../../components/icons/dustbin'
import Loading from '../../components/icons/loading'

export async function getStaticProps() {
  return {
    props: {
      stripeKey: process.env.STRIPE_KEY_PUBLIC
    }
  }
}

export default function Basket({ stripeKey }) {
  const router = useRouter()
  const [error, setError] = useState(null)
  const [stripe, setStripe] = useState(null)
  const [paying, setPaying] = useState(false)
  const [loading, setLoading] = useState(true)

  const { data = {}, mutate } = useSWR('/api/basket', url => fetch(url).then(response => response.json()))
  const { basket = [] } = data


  const [amount, setAmount] = useState((basket.length * 5).toFixed(2))
  const [email, setEmail] = useState('')
  const [accepted, accept] = useState(false)

  const disabled = !basket.length || !accepted

  const paymentAmount = Math.round(100 * parseFloat(amount) || 0)

  const [clientSecret, setClientSecret] = useState('')
  const [paymentIntent, setPaymentIntent] = useState('')

  useEffect(() => {
    loadStripe(stripeKey).then(setStripe);
  }, [])

  useEffect(() => {
    setLoading(true)
    if (!stripe) {
      return
    }
    const clientSecret = router.query.payment_intent_client_secret
    if (clientSecret) {
      return Promise.resolve(stripe)
        .then(stripe => stripe.retrievePaymentIntent(clientSecret))
        .then(async ({ paymentIntent }) => {
          switch (paymentIntent.status) {
              case 'succeeded':
                const response = await fetch('/api/checkout', {
                  method: 'POST',
                  body: JSON.stringify({ amount: paymentIntent.amount, email: paymentIntent.receipt_email }),
                  headers: { 'Content-Type': 'application/json' }
                })
                const result = await response.json()
                mutate('/api/basket', { basket: [] }, false)
                router.replace(`/orders/${result.id}`)
                break
              case 'requires_payment_method':
                setError('Your payment was not successful, please try again.')
                setLoading(false)
                break
              default:
                setError('Something went wrong.')
                setLoading(false)
                break
            }
        });
    }
    setLoading(false)
  }, [stripe, router.query.payment_intent_client_secret])

  useEffect(() => {
    if (!paying) {
      return
    }
    const params = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: paymentAmount, paymentIntent }),
    }
    fetch('/api/create-payment', params)
      .then(res => res.json())
      .then(data => {
        setClientSecret(data.client_secret)
        setPaymentIntent(data.id)
      });
  }, [paying]);

  const validateEmail = () => {
    if (!email) {
      setError('Please enter your email address')
      return false
    }
    if (!email.match(/^(.)+@(.+)$/)) {
      setError('Please enter a valid email address')
      return false
    }
    return true
  }

  const gotoPayment = async () => {
    if (!validateEmail()) {
      return
    }
    setError('')
    setPaying(true)
  }

  const download = async () => {
    if (!validateEmail()) {
      return
    }
    setError('')
    setLoading(true)
    const response = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ amount: 0, email }),
      headers: { 'Content-Type': 'application/json' }
    })
    const result = await response.json()
    setLoading(false)
    if (result.error) {
      return setError(result.error)
    }
    mutate('/api/basket', { basket: [] }, false)
    router.push(`/orders/${result.id}`)
  }

  const remove = async (id) => {
    setPaying(false);
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
          <div className="sticky top-0 rounded-md bg-white border p-4 overflow-hidden">
            {
              error && (
                <p className="-m-4 mb-4 bg-red-500 text-white p-4">{ error }</p>
              )
            }
            <h2>Checkout</h2>
            {
              loading && <p className="text-center"><Loading className="inline-block" size={64} /></p>
            }
            {
              !loading && paying && clientSecret && <Elements stripe={stripe} options={{ clientSecret, appearance: { theme: 'flat' } }}>
                <Checkout amount={paymentAmount} email={email} setError={setError} />
              </Elements>
            }
            {
              !loading && !paying && (
                <>
                  <p className="mb-6">
                    <label htmlFor="amount">Total (pay what you like)</label>
                    <div className="flex items-center">
                      <span className="mr-2">£</span>
                      <input className="p-2 rounded-md border flex-grow text-right" type="text" id="amount" onChange={e => setAmount(e.target.value)} value={amount} />
                    </div>
                  </p>

                  <p className="mb-6">
                    <label htmlFor="email">Email</label>
                    <input className="p-2 rounded-md border w-full" type="text" id="email" name="email" onChange={e => setEmail(e.target.value)} value={email} />
                  </p>

                  <p className="mb-6 flex items-start">
                    <input type="checkbox" id="declaration" name="declaration" className="border border-gray-200 rounded-md w-6 h-6 mr-2" onChange={e => accept(e.target.checked)} />
                    <label htmlFor="declaration">I understand that photos are licensed for personal use only.</label>
                  </p>

                  <p className="text-right">
                    {
                      paymentAmount === 0 && <button className="btn mr-0 disabled:opacity-50 disabled:cursor-not-allowed" disabled={disabled} onClick={download}>Download</button>
                    }
                    {
                      paymentAmount > 0 && <button className="btn mr-0 disabled:opacity-50 disabled:cursor-not-allowed" disabled={disabled} onClick={gotoPayment}>Go to payment</button>
                    }
                  </p>
                </>
              )
            }
          </div>
        </div>
      </div>
    </section>
  )
}
