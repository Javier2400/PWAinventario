import { deleteProduct } from "../services/api"
import { useProducts } from "../hooks/useProducts"

export default function ProductList({ refresh }: any) {
  const { products, loadProducts } = useProducts(refresh)

  const handleDelete = async (id: number) => {
    await deleteProduct(id)
    loadProducts()
  }

  return (
    <div className="table-container">
      <table className="table-ms">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>${p.price.toFixed(2)}</td>
              <td>{p.stock}</td>
              <td>
                <button className="button-ms" style={{ backgroundColor: '#dc3545', padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => handleDelete(p.id!)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
