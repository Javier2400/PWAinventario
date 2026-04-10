import { deleteProduct } from "../services/api"
import { useProducts } from "../hooks/useProducts"

export default function ProductList({ refresh }: any) {
  const { products, loadProducts } = useProducts(refresh)

  const handleDelete = async (id: number) => {
    await deleteProduct(id)
    loadProducts()
  }

  const styles = {
    container: {
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e4e4e7',
      overflow: 'hidden'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const
    },
    th: {
      textAlign: 'left' as const,
      padding: '12px 16px',
      fontSize: '12px',
      fontWeight: 600,
      textTransform: 'uppercase' as const,
      color: '#71717a',
      backgroundColor: '#f9fafb',
      borderBottom: '2px solid #e4e4e7'
    },
    td: {
      padding: '12px 16px',
      fontSize: '14px',
      borderBottom: '1px solid #f4f4f5',
      color: '#3f3f46'
    },
    button: {
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      padding: '6px 12px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 600
    }
  }

  return (
    <div style={styles.container}>
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Descripción</th>
              <th style={styles.th}>Precio</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={styles.td}>{p.id}</td>
                <td style={{ ...styles.td, fontWeight: 500 }}>{p.name}</td>
                <td style={styles.td}>{p.description}</td>
                <td style={styles.td}>${p.price.toFixed(2)}</td>
                <td style={{ ...styles.td, fontWeight: 700 }}>{p.stock}</td>
                <td style={styles.td}>
                  <button style={styles.button} onClick={() => handleDelete(p.id!)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
