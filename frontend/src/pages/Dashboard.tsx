import { useState } from "react"
import ProductForm from "../components/ProductForm"
import ProductList from "../components/ProductList"
import Chatbot from "../components/Chatbot"

export default function Dashboard() {
  const [refresh, setRefresh] = useState(false)

  const reload = () => {
    setRefresh(!refresh)
  }

  return (
    <div className="dashboard">
      <div className="card">
        <h2>Catálogo de Productos</h2>
        <ProductForm onProductCreated={reload} />
      </div>

      <div className="card">
        <h2>Inventario Actual</h2>
        <ProductList refresh={refresh} />
      </div>

      <Chatbot />
    </div>
  )
}
