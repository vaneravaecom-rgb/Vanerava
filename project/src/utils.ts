import type { Product } from '@/types';

export function exportProductsToCSV(products: Product[]): void {
  if (products.length === 0) return;

  const headers = [
    'productId',
    'itemId',
    'name',
    'brand',
    'category',
    'price',
    'listPrice',
    'status',
    'stock',
    'sizes',
    'colors',
    'releaseDate',
  ];

  const rows = products.map((p) => [
    p.productId,
    p.itemId,
    `"${p.name.replace(/"/g, '""')}"`,
    p.brand,
    p.category,
    p.price.toString(),
    p.listPrice.toString(),
    p.status,
    p.stock.toString(),
    `"${p.sizes.join(', ')}"`,
    `"${p.colors.join(', ')}"`,
    p.releaseDate,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `offcorss_productos_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatDate(iso: string): string {
  if (!iso) return 'N/A';
  try {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
