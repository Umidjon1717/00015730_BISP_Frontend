const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID

export async function sendOrderNotification(
  orderId: string | null,
  amount: string | null,
  method: string | null
): Promise<void> {
  if (!BOT_TOKEN || !CHAT_ID) return

  const methodLabel = method === 'cod' ? 'Cash on Delivery' : 'Card Payment'
  const text =
    `🛒 <b>New Order Confirmed!</b>\n` +
    `Order ID: <b>#${orderId}</b>\n` +
    `Amount: <b>$${Number(amount).toFixed(2)}</b>\n` +
    `Payment: <b>${methodLabel}</b>`

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' }),
  }).catch(() => {})
}
