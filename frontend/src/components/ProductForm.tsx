import { useState } from "react"
import { createProduct } from "../services/api"

export default function ProductForm({ onProductCreated }: any) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0
  })

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    await createProduct({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock)
    })

    onProductCreated()
    setForm({ name: "", description: "", price: 0, stock: 0 })
  }

  return (
    <form onSubmit={handleSubmit} className="form-ms">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label>Nombre:</label>
          <input className="input-ms" name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Descripción:</label>
          <input className="input-ms" name="description" placeholder="Descripción" value={form.description} onChange={handleChange} required />
        </div>
        <div>
          <label>Precio:</label>
          <input className="input-ms" name="price" type="number" placeholder="Precio" value={form.price} onChange={handleChange} required />
        </div>
        <div>
          <label>Stock:</label>
          <input className="input-ms" name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
        </div>
      </div>

      <button className="button-ms" type="submit" style={{ marginTop: '10px' }}>Guardar Producto</button>
    </form>
  )
}
