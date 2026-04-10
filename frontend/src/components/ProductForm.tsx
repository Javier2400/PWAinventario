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

  const styles = {
    form: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '8px',
      border: '1px solid #e4e4e7',
      marginBottom: '24px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px'
    },
    field: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px'
    },
    label: {
      fontSize: '14px',
      fontWeight: 500,
      color: '#3f3f46'
    },
    input: {
      padding: '8px 12px',
      borderRadius: '6px',
      border: '1px solid #e4e4e7',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    button: {
      marginTop: '24px',
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      width: '100%'
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.grid}>
        <div style={styles.field}>
          <label style={styles.label}>Nombre:</label>
          <input 
            style={styles.input} 
            name="name" 
            placeholder="Nombre" 
            value={form.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Descripción:</label>
          <input 
            style={styles.input} 
            name="description" 
            placeholder="Descripción" 
            value={form.description} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Precio:</label>
          <input 
            style={styles.input} 
            name="price" 
            type="number" 
            placeholder="Precio" 
            value={form.price} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Stock:</label>
          <input 
            style={styles.input} 
            name="stock" 
            type="number" 
            placeholder="Stock" 
            value={form.stock} 
            onChange={handleChange} 
            required 
          />
        </div>
      </div>

      <button style={styles.button} type="submit">
        Guardar Producto
      </button>
    </form>
  )
}
