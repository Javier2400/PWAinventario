import { useEffect, useState } from "react";
import { getProducts } from "../services/api";
import type { Product } from "../types/product";

export const useProducts = (refresh?: any) => {
  const [products, setProducts] = useState<Product[]>([]);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, [refresh]);

  return { products, loadProducts };
};