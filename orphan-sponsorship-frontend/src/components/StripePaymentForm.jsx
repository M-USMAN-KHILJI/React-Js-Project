import { useState } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { createPaymentIntent, confirmPayment } from '../services/api'
import Button from './ui/Button'
import Alert from './ui/Alert'

const cardStyle = {
  style: {
    base: {
      fontSize: '16px',
      color: '#131D33',
      fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
      '::placeholder': { color: '#7891B5' },
    },
    invalid: { color: '#dc2626' },
  },
}

export default function StripePaymentForm({ orphanId, amount, onSuccess, onCancel }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setLoading(true)
    setError('')

    try {
      const response = await createPaymentIntent({
        orphan: orphanId,
        amount: amount,
      })

      const { clientSecret, donationId } = response.data

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })

      if (result.error) {
        setError(result.error.message)
        setLoading(false)
        return
      }

      if (result.paymentIntent.status === 'succeeded') {
        await confirmPayment(donationId)
        onSuccess()
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="ui-label">Card details</label>
        <div className="rounded-lg border border-nude-300 bg-white px-3 py-3 focus-within:border-gold-500 focus-within:ring-1 focus-within:ring-gold-500">
          <CardElement options={cardStyle} />
        </div>
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="submit"
          variant="accent"
          loading={loading}
          disabled={!stripe || loading}
          className="flex-1"
        >
          {loading ? 'Processing...' : `Pay PKR ${amount}`}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
