import {
  Package,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Tag,
  Activity,
  Loader2,
  RefreshCw,
  Cloud,
  ArrowRight,
  Sparkles,
  Boxes,
  Shirt,
  ArrowUpRight,
  Layers3,
  BarChart3,
} from 'lucide-react';

import { useProducts } from '@/hooks/useProducts';
import { formatCurrency, formatDate } from '@/utils';
import type { ViewKey } from '@/components/Sidebar';
import type { Product } from '@/types';

interface DashboardProps {
  onNavigate: (view: ViewKey) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { products, total, loading, error, refetch } = useProducts(0, 99);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFE500]">
          <Loader2 className="h-7 w-7 animate-spin text-black" />
        </div>

        <h2 className="mt-5 text-xl font-bold text-gray-900">
          Preparando tu catálogo
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Consultando los productos de OFFCORSS...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF9CC]">
          <AlertCircle className="h-7 w-7 text-black" />
        </div>

        <h2 className="mt-4 text-xl font-bold text-gray-900">
          No pudimos cargar los productos
        </h2>

        <p className="mt-2 text-sm text-gray-500">{error}</p>

        <button onClick={refetch} className="btn-primary mt-5">
          <RefreshCw className="h-4 w-4" />
          Reintentar
        </button>
      </div>
    );
  }

  const active = products.filter((p) => p.status === 'Activo').length;
  const outOfStock = products.filter((p) => p.status === 'Agotado').length;
  const inactive = products.filter((p) => p.status === 'Inactivo').length;

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  const categories = [...new Set(products.map((p) => p.category))];

  const stats = [
    {
      label: 'Productos totales',
      value: total.toLocaleString(),
      note: 'Productos en el catálogo',
      icon: Package,
      accent: '#1746D1',
      iconBackground: 'bg-blue-50',
      iconColor: 'text-[#1746D1]',
    },
    {
      label: 'Productos activos',
      value: active.toLocaleString(),
      note: 'Activos en la consulta',
      icon: CheckCircle2,
      accent: '#16A34A',
      iconBackground: 'bg-green-50',
      iconColor: 'text-green-700',
    },
    {
      label: 'Sin stock',
      value: outOfStock.toLocaleString(),
      note: 'Productos agotados',
      icon: AlertCircle,
      accent: '#FFE500',
      iconBackground: 'bg-[#FFF9CC]',
      iconColor: 'text-gray-900',
    },
    {
      label: 'Productos inactivos',
      value: inactive.toLocaleString(),
      note: 'Inactivos en la consulta',
      icon: Tag,
      accent: '#111827',
      iconBackground: 'bg-gray-100',
      iconColor: 'text-gray-800',
    },
  ];

  const recent = [...products]
    .sort((a, b) =>
      (b.releaseDate || '').localeCompare(a.releaseDate || ''),
    )
    .slice(0, 5);

  const categoryColors = [
    '#1746D1',
    '#FFE500',
    '#111827',
    '#60A5FA',
    '#9CA3AF',
    '#16A34A',
  ];

  const categorySummary = categories
    .map((category) => ({
      category,
      count: products.filter((p) => p.category === category).length,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="animate-fade-in space-y-6 pb-8">
      {/* BANNER PRINCIPAL OFFCORSS */}

      <section className="relative isolate overflow-hidden rounded-2xl bg-black text-white shadow-lg">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border-[40px] border-white/[0.04]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 right-44 h-64 w-64 rounded-full bg-[#FFE500]/10 blur-3xl"
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Texto */}

          <div className="flex flex-col items-start justify-center p-6 sm:p-8 lg:p-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/90">
              <Sparkles className="h-4 w-4 text-[#FFE500]" />
              Tu catálogo OFFCORSS
            </div>

            <h1 className="max-w-xl text-3xl font-extrabold leading-[1.12] tracking-tight sm:text-4xl xl:text-[3.15rem]">
              Todo tu catálogo
              <span className="mt-1 block text-[#FFE500]">
                en un solo lugar.
              </span>
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-6 text-white/70 sm:text-base">
              Consulta productos, revisa existencias, gestiona categorías
              y explora la información de tu inventario.
            </p>

            <button
              type="button"
              onClick={() => onNavigate('products')}
              className="mt-6 inline-flex items-center gap-3 rounded-xl bg-[#FFE500] px-5 py-3.5 text-sm font-bold text-black transition duration-200 hover:-translate-y-0.5 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-[#FFE500] focus:ring-offset-2 focus:ring-offset-black"
            >
              Explorar productos
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/10 pt-4 text-xs text-white/60">
              <Cloud className="h-4 w-4 text-[#FFE500]" />
              <span>Fuente de datos: VTEX</span>
              <span className="text-white/30">/</span>
              <span>Catálogo conectado</span>
            </div>
          </div>

          {/* Bloque visual */}

          <div className="relative hidden min-h-[300px] items-center justify-center overflow-hidden lg:flex">
            <div
              aria-hidden="true"
              className="absolute right-10 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-[#FFE500]"
            />

            <div
              aria-hidden="true"
              className="absolute right-20 top-10 h-20 w-20 rounded-full border border-black/20"
            />

            <div className="relative z-10 flex h-48 w-48 items-center justify-center rounded-[1.75rem] border border-white/10 bg-white/[0.06] shadow-2xl backdrop-blur-sm">
              <Shirt
                className="h-32 w-32 text-white drop-shadow-lg"
                strokeWidth={1.1}
              />

              <div className="absolute -bottom-4 -left-7 flex items-center gap-2 rounded-xl border border-white/10 bg-[#181818] px-3 py-2.5 shadow-xl">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFE500]">
                  <Package className="h-5 w-5 text-black" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-white">
                    Catálogo
                  </p>
                  <p className="text-[10px] text-white/50">
                    Administración
                  </p>
                </div>
              </div>

              <div className="absolute -right-5 -top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-lg">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>

            <div className="absolute bottom-6 right-7 text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFE500]">
                OFFCORSS
              </p>
              <p className="mt-1 text-[10px] text-white/40">
                Panel de catálogo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ESTADO DE LA CONEXIÓN */}

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
            <Cloud className="h-5 w-5 text-green-700" />
          </div>

          <div>
            <p className="text-sm font-bold text-gray-900">
              Catálogo conectado
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              Datos consultados desde offcorss.myvtex.com
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-2 text-xs font-semibold text-green-800">
          <span className="h-2 w-2 rounded-full bg-green-600" />
          API VTEX
        </span>
      </section>

      {/* RESUMEN DEL CATÁLOGO */}

      <section className="space-y-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="h-1 w-7 rounded-full bg-[#FFE500]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                OFFCORSS · Análisis de catálogo
              </p>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
              Resumen de tu catálogo
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Una visión clara del estado de tus productos.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-500 shadow-sm">
            <Activity className="h-4 w-4 text-[#1746D1]" />
            Consulta actual
          </div>
        </div>

        {/* INDICADORES PRINCIPALES */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundColor: stat.accent }}
                />

                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBackground}`}
                  >
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>

                  <span className="rounded-md bg-gray-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    VTEX
                  </span>
                </div>

                <p className="mt-5 text-3xl font-bold tracking-tight text-gray-950">
                  {stat.value}
                </p>

                <p className="mt-2 text-sm font-semibold text-gray-800">
                  {stat.label}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {stat.note}
                </p>

                <div className="mt-5 h-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full w-1/3 rounded-full"
                    style={{ backgroundColor: stat.accent }}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* MÉTRICAS COMPLEMENTARIAS */}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <TrendingUp className="h-5 w-5 text-[#1746D1]" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500">
              Valor estimado del inventario
            </p>
            <p className="mt-1 break-words text-xl font-bold tracking-tight text-gray-950">
              {formatCurrency(totalValue)}
            </p>
          </div>
        </article>

        <article className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF9CC]">
            <Boxes className="h-5 w-5 text-black" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500">
              Unidades en stock
            </p>
            <p className="mt-1 text-xl font-bold tracking-tight text-gray-950">
              {totalStock.toLocaleString()}
            </p>
          </div>
        </article>

        <article className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
            <Layers3 className="h-5 w-5 text-gray-900" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500">
              Categorías identificadas
            </p>
            <p className="mt-1 text-xl font-bold tracking-tight text-gray-950">
              {categories.length}
            </p>
          </div>
        </article>
      </section>

      {/* PRODUCTOS RECIENTES Y CATEGORÍAS */}

      <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
        {/* PRODUCTOS RECIENTES */}

        <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Activity className="h-5 w-5 text-[#1746D1]" />
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-950">
                  Productos recientes
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Últimos productos de la consulta
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('products')}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-[#1746D1] transition hover:bg-blue-50"
            >
              Ver catálogo
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          {recent.length > 0 ? (
            <div className="divide-y divide-gray-100 px-5 sm:px-6">
              {recent.map((product: Product) => (
                <button
                  key={product.productId}
                  type="button"
                  onClick={() => onNavigate('products')}
                  className="group flex w-full items-center gap-3 py-4 text-left transition hover:bg-gray-50"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Shirt className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold leading-5 text-gray-800 transition group-hover:text-[#1746D1]">
                      {product.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      ID {product.productId} · {formatDate(product.releaseDate)}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                      product.status === 'Activo'
                        ? 'bg-green-50 text-green-800'
                        : product.status === 'Agotado'
                          ? 'bg-[#FFF9CC] text-gray-900'
                          : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {product.status}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <Package className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">
                No hay productos para mostrar.
              </p>
            </div>
          )}

          <div className="border-t border-gray-100 bg-gray-50/70 px-6 py-3">
            <p className="text-xs text-gray-500">
              Mostrando {recent.length} productos de la consulta actual.
            </p>
          </div>
        </article>

        {/* DISTRIBUCIÓN POR CATEGORÍAS */}

        <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-5 sm:px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF9CC]">
              <Tag className="h-5 w-5 text-black" />
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-950">
                Productos por categoría
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Distribución de los productos consultados
              </p>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            {categorySummary.length > 0 ? (
              categorySummary.map(({ category, count }, index) => {
                const percentage =
                  products.length > 0
                    ? Math.round((count / products.length) * 100)
                    : 0;

                const color =
                  categoryColors[index % categoryColors.length];

                return (
                  <div key={category}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: color }}
                        />

                        <span className="truncate text-sm font-medium text-gray-700">
                          {category}
                        </span>
                      </div>

                      <span className="shrink-0 text-xs font-semibold text-gray-600">
                        {count.toLocaleString()}
                      </span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>

                    <p className="mt-1.5 text-right text-[10px] text-gray-400">
                      {percentage}% de la consulta
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center">
                <Tag className="mx-auto h-8 w-8 text-gray-300" />
                <p className="mt-3 text-sm text-gray-500">
                  No hay categorías disponibles.
                </p>
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
