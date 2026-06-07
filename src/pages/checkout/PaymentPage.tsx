import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Elements } from '@stripe/react-stripe-js'
import { stripePromise } from '@/lib/stripe'
import StripeCheckoutForm from '@/components/StripeCheckoutForm'
import { getApiBaseUrl } from '@/config/env'

const apiBase = () => getApiBaseUrl().replace(/\/+$/, '')

export default function PaymentPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const orderId = Number(params.get('orderId'))
  const amount = Number(params.get('amount'))

  const [tab, setTab] = useState<'card' | 'cod'>('card')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [codLoading, setCodLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (tab !== 'card' || clientSecret) return
    fetch(`${apiBase()}/payment/stripe/create-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, amount }),
    })
      .then((r) => r.json())
      .then((data) => {
        setClientSecret(data.data.clientSecret)
        setPaymentIntentId(data.data.paymentIntentId)
      })
      .catch(() => setError('Failed to initialize payment. Please try again.'))
  }, [tab, orderId, amount])

  async function handleCod() {
    setCodLoading(true)
    setError(null)
    try {
      const res = await fetch(`${apiBase()}/payment/cod`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amount }),
      })
      if (!res.ok) throw new Error()
      navigate(`/checkout/success?orderId=${orderId}&method=cod&amount=${amount}`)
    } catch {
      setError('Failed to place order. Please try again.')
      setCodLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-1">Complete Your Order</h1>
        <p className="text-gray-500 mb-6">Order #{orderId} &middot; Total: ${amount.toFixed(2)}</p>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setTab('card')}
            className={`flex-1 py-3 rounded-xl border-2 font-medium transition ${
              tab === 'card' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600'
            }`}
          >
            Pay by Card
          </button>
          <button
            onClick={() => setTab('cod')}
            className={`flex-1 py-3 rounded-xl border-2 font-medium transition ${
              tab === 'cod' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600'
            }`}
          >
            Cash on Delivery
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {tab === 'card' && (
          <>
            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripeCheckoutForm
                  orderId={orderId}
                  paymentIntentId={paymentIntentId!}
                  onSuccess={() =>
                    navigate(`/checkout/success?orderId=${orderId}&method=card&amount=${amount}`)
                  }
                />
              </Elements>
            ) : error ? null : (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <p className="text-xs text-gray-400 mt-4 text-center">
              Test card: 4242 4242 4242 4242 &middot; Any future date &middot; Any CVC
            </p>
          </>
        )}

        {tab === 'cod' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              Pay in cash when your order arrives at your door. No card required.
            </div>
            <button
              onClick={handleCod}
              disabled={codLoading}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {codLoading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
