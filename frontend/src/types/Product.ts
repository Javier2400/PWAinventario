export interface Product {
  id: number;
  name: string;
  sku: string;
  category: 'Electrónica' | 'Ropa' | 'Alimentos' | 'Hogar' | 'Juguetes';
  stock: number;
  minStock: number;
  price: number;
  description?: string;
  status?: 'activo' | 'agotado' | 'bajo stock';
}
