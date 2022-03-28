import { useState, useEffect, Fragment } from 'react'
import { useRouter } from 'next/router'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'

export default function Checkout({ amount, email, setError }) {

  const [loading, setLoading] = useState(false)
  const elements = useElements()
  const stripe = useStripe()

  const makePayment = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_HOSTNAME}/basket`,
        receipt_email: email
      }
    })

    setLoading(false)

    setError(error.message)
  }

  return <form onSubmit={makePayment}>
    <PaymentElement />
    <p><button className="btn my-6 disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>Make payment for £{(amount / 100).toFixed(2)}</button></p>
  </form>

}
