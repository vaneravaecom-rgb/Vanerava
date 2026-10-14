
import { useState, useEffect, useCallback } from 'react';
import type { Product, ProductsResponse } from '@/types';

interface UseProductsState {
  products: Product[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const API_URL = '/api/products';
const PAGE_SIZE = 50;
const MAX_FROM = 2500;

export function useProducts(
  from: number = 0,
  _to: number = 99,
): UseProductsState {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchFlag, setRefetchFlag] = useState(0);

  const refetch = useCallback(() => {
    setRefetchFlag((previous) => previous + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);
      setError(null);
      setProducts([]);
      setTotal(0);

      try {
        const allProducts: Product[] = [];
        let reportedTotal = 0;
        let currentFrom = Math.max(0, from);

        while (currentFrom <= MAX_FROM) {
          const currentTo = currentFrom + PAGE_SIZE - 1;

          const response = await fetch(
            `${API_URL}?_from=${currentFrom}&_to=${currentTo}`,
            {
              headers: { Accept: 'application/json' },
            },
          );

          if (!response.ok) {
            throw new Error(
              `Error del servidor (${response.status}) al consultar desde ${currentFrom}.`,
            );
          }

          const data: ProductsResponse = await response.json();
          const batch = Array.isArray(data.products)
            ? data.products
            : [];

          reportedTotal = Number(data.total) || 0;

          if (cancelled) return;

          if (batch.length === 0) break;

          allProducts.push(...batch);
          setProducts([...allProducts]);
          setTotal(reportedTotal);

          currentFrom += batch.length;

          if (
            allProducts.length >= reportedTotal ||
            batch.length < PAGE_SIZE
          ) {
            break;
          }
        }

        if (!cancelled) {
          setProducts(allProducts);
          setTotal(reportedTotal);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'No fue posible cargar el catálogo.',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [from, refetchFlag]);

  return { products, total, loading, error, refetch };
}