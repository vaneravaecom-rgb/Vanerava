
import { useMemo, useState } from 'react';
import {
  Search,
  Package,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  AlertCircle,
} from 'lucide-react';
import type { Product } from '@/types';
import { useProducts } from '@/hooks/useProducts';

interface ProductsProps {
  onSelectProduct: (product: Product) => void;
}

const PAGE_SIZE = 50;

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(price || 0);

export function Products({ onSelectProduct }: ProductsProps) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('Todos');

  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { products, total, loading, error, refetch } = useProducts(from, to);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name?.toLowerCase().includes(query) ||
        product.productId?.toLowerCase().includes(query) ||
        product.itemId?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query);

      const matchesStatus =
        status === 'Todos' ||
        product.status?.toLowerCase() === status.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [products, search, status]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 pb-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            OFFCORSS / Inventario
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Catálogo de productos.
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Consulta los productos y accede a su información detallada.
          </p>
        </div>

        <button
          type="button"
          onClick={refetch}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFE500] px-4 py-3 text-sm font-bold text-black transition hover:bg-yellow-300 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar catálogo
        </button>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Productos registrados</p>
            <Package className="h-5 w-5 text-gray-500" />
          </div>
          <p className="mt-3 text-3xl font-bold text-gray-950">
            {loading && total === 0 ? '…' : total.toLocaleString('es-CO')}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Productos en esta página</p>
          <p className="mt-3 text-3xl font-bold text-gray-950">
            {filteredProducts.length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Página actual</p>
          <p className="mt-3 text-3xl font-bold text-gray-950">
            {page + 1} <span className="text-lg text-gray-400">/ {totalPages}</span>
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre, referencia o marca..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-black focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-gray-500" />
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-black"
            >
              <option value="Todos">Todos los estados</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Agotado">Agotado</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="m-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">No se pudo cargar el catálogo</p>
              <p className="mt-1">{error}</p>
              <button
                type="button"
                onClick={refetch}
                className="mt-2 font-bold underline"
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-3 p-12 text-sm text-gray-500">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Cargando productos...
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="p-12 text-center">
            <Package className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 font-semibold text-gray-800">
              No se encontraron productos
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Prueba con otro término o cambia el filtro de estado.
            </p>
          </div>
        )}

        {!loading && filteredProducts.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Producto</th>
                  <th className="px-5 py-4 font-semibold">Referencia</th>
                  <th className="px-5 py-4 font-semibold">Categoría</th>
                  <th className="px-5 py-4 font-semibold">Precio</th>
                  <th className="px-5 py-4 font-semibold">Stock</th>
                  <th className="px-5 py-4 font-semibold">Estado</th>
                  <th className="px-5 py-4 text-right font-semibold">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product, index) => {
                  const active = product.status?.toLowerCase() === 'activo';
                  const outOfStock =
                    product.status?.toLowerCase() === 'agotado';

                  return (
                    <tr
                      key={`${product.productId}-${product.itemId}-${index}`}
                      className="transition hover:bg-yellow-50/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              loading="lazy"
                              className="h-12 w-12 rounded-xl border border-gray-100 bg-gray-50 object-contain"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                              <Package className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="max-w-xs truncate font-semibold text-gray-900">
                              {product.name || 'Sin nombre'}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {product.brand || 'Sin marca'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {product.productId || product.itemId || '—'}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {product.category || '—'}
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-900">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {product.stock ?? 0}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            active
                              ? 'bg-green-100 text-green-800'
                              : outOfStock
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {product.status || 'Sin estado'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => onSelectProduct(product)}
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-[#FFE500] hover:bg-[#FFE500] hover:text-black"
                        >
                          <Eye className="h-4 w-4" />
                          Ver
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-500">
            Mostrando {total === 0 ? 0 : from + 1}–{Math.min(from + PAGE_SIZE, total)} de{' '}
            {total.toLocaleString('es-CO')} productos
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(0, current - 1))}
              disabled={page === 0 || loading}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>
            <button
              type="button"
              onClick={() =>
                setPage((current) => Math.min(totalPages - 1, current + 1))
              }
              disabled={loading || from + PAGE_SIZE >= total}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
