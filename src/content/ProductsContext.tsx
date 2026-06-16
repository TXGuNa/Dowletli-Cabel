import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  type Product, PRODUCTS_EVENT,
  loadProducts, persistProducts, defaultProducts,
} from './productsStore';

interface ProductsContextValue {
  products: Product[];
  setProducts: (next: Product[]) => void;   // replace + persist
  resetProducts: () => void;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProductsState] = useState<Product[]>(() => loadProducts());

  // Keep in sync if another tab / the same store changes
  useEffect(() => {
    const refresh = () => setProductsState(loadProducts());
    window.addEventListener(PRODUCTS_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(PRODUCTS_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const value = useMemo<ProductsContextValue>(
    () => ({
      products,
      setProducts: (next: Product[]) => {
        setProductsState(next);
        persistProducts(next);
      },
      resetProducts: () => {
        const def = defaultProducts();
        setProductsState(def);
        persistProducts(def);
      },
    }),
    [products],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
}
