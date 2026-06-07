import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearCart } from '@/redux/features/cart-slice'

export default function SuccessPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const orderId = params.get('orderId')
  const method = params.get('method')
  const amount = params.get('amount')

  useEffect(() => {
    dispatch(clearCart())
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
        <div className="text-6xl mb-4">{method === 'cod' ? '📦' : '✅'}</div>
        <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-1">Order #{orderId}</p>
        <p className="text-gray-500 mb-1">Amount: ${Number(amount).toFixed(2)}</p>
        <p className="text-gray-500 mb-6">
          {method === 'cod'
            ? 'Pay cash when your order is delivered.'
            : 'Payment received successfully.'}
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-black text-white px-8 py-3 rounded-lg font-semibold"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )
}
