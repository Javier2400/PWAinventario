const API_URL = "http://127.0.0.1:8000"

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`)
  return res.json()
}

export async function createProduct(product: any) {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  })
  return res.json()
}

export async function deleteProduct(id: number) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE"
  })
  return res.json()
}

export async function sendMessage(message: string) {
  const res = await fetch(`${API_URL}/chatbot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  })
  return res.json()
}

export async function createPaymentIntent(amount: number) {
  const res = await fetch(`${API_URL}/payments/create-payment-intent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount })
  })
  return res.json()
}

export async function getPayments() {
  const res = await fetch(`${API_URL}/payments`)
  return res.json()
}