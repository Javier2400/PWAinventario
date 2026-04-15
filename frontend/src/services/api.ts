const API_URL = import.meta.env.DEV ? "/api" : (import.meta.env.VITE_API_URL || "https://yukisbacend.alwaysdata.net/")

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`)
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export async function createProduct(product: any) {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  })
  if (!res.ok) throw new Error('Failed to create product')
  return res.json()
}

export async function updateProduct(id: number, product: any) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  })
  if (!res.ok) throw new Error('Failed to update product')
  return res.json()
}

export async function deleteProduct(id: number) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE"
  })
  if (!res.ok) throw new Error('Failed to delete product')
  return res.json()
}

export async function sendMessage(message: string) {
  const res = await fetch(`${API_URL}/chatbot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  })
  if (!res.ok) throw new Error('Failed to send message')
  return res.json()
}

export async function createPaymentIntent(amount: number) {
  const res = await fetch(`${API_URL}/payments/create-payment-intent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount })
  })
  if (!res.ok) throw new Error('Failed to create payment intent')
  return res.json()
}

export async function getPayments() {
  const res = await fetch(`${API_URL}/payments`)
  if (!res.ok) throw new Error('Failed to fetch payments')
  return res.json()
}

export async function recordPayment(payment: any) {
  const res = await fetch(`${API_URL}/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payment)
  })
  if (!res.ok) throw new Error('Failed to record payment')
  return res.json()
}
