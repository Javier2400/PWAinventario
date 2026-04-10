import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Product, Section } from '@/types';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/services/api';

const INITIAL_PRODUCTS: Product[] = [];

interface AppContextType {
  currentSection: Section;
  setCurrentSection: (section: Section) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  products: Product[];
  loadProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentSection, setCurrentSection] = useState<Section>('inventory');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  const loadProducts = useCallback(async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }, []);

  const addProduct = useCallback(async (product: Omit<Product, 'id'>) => {
    try {
      const newProduct = await createProduct(product as any);
      setProducts(prev => [newProduct, ...prev]);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  }, []);

  const updateProductCtx = useCallback(async (id: number, product: Partial<Product>) => {
    try {
      const updated = await updateProduct(id, product as any);
      setProducts(prev => prev.map(p => p.id === id ? updated : p));
    } catch (error) {
      console.error('Error updating product:', error);
    }
  }, []);

  const deleteProductCtx = useCallback(async (id: number) => {
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }, []);

  return (
    <AppContext.Provider value={{
      currentSection,
      setCurrentSection,
      isChatOpen,
      setIsChatOpen,
      products,
      loadProducts,
      addProduct,
      updateProduct: updateProductCtx,
      deleteProduct: deleteProductCtx,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
