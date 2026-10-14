import type { Plugin } from 'vite';

interface VtexImage {
  imageUrl: string;
  imageText: string;
}

interface VtexSeller {
  sellerId: string;
  sellerName: string;
  commertialOffer: {
    Price: number;
    ListPrice: number;
    AvailableQuantity: number;
    IsAvailable: boolean;
  };
}

interface VtexItem {
  itemId: string;
  name: string;
  images: VtexImage[];
  sellers: VtexSeller[];
  Talla?: string[];
  'Codigo de color'?: string[];
}

interface VtexProduct {
  productId: string;
  productName: string;
  brand: string;
  productTitle: string;
  linkText: string;
  categoryId: string;
  categories: string[];
  description: string;
  releaseDate: string;
  Color?: string[];
  items: VtexItem[];
}

interface NormalizedProduct {
  productId: string;
  itemId: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  listPrice: number;
  status: string;
  imageUrl: string;
  sizes: string[];
  colors: string[];
  description: string;
  stock: number;
  releaseDate: string;
  linkText: string;
  allImages: { url: string; text: string }[];
}

const VTEX_BASE = 'https://offcorss.myvtex.com/api/catalog_system/pub/products/search';

function deriveStatus(item: VtexItem): string {
  const offer = item.sellers?.[0]?.commertialOffer;
  if (!offer) return 'Inactivo';
  if (offer.AvailableQuantity > 0 && offer.IsAvailable) return 'Activo';
  if (offer.Price > 0 && offer.IsAvailable) return 'Activo';
  return 'Agotado';
}

function normalizeProduct(p: VtexProduct): NormalizedProduct | null {
  if (!p.items || p.items.length === 0) return null;

  const firstItem = p.items[0];
  const offer = firstItem.sellers?.[0]?.commertialOffer;

  const imageUrl =
    firstItem.images?.[0]?.imageUrl ||
    'https://offcorss.vteximg.com.br/arquivos/ids/797552/logo-offcorss-producto.jpg';

  const categoryRaw = p.categories?.[0] || '';
  const parts = categoryRaw.split('/').filter(Boolean);
  const category = parts.length > 0 ? parts[parts.length - 1] : 'Sin categoría';

  const sizes = [
    ...new Set(
      p.items.flatMap((item) => item.Talla || []).filter(Boolean),
    ),
  ];

  const colors = p.Color || firstItem['Codigo de color'] || [];

  const allImages = (firstItem.images || []).map((img) => ({
    url: img.imageUrl,
    text: img.imageText || p.productName,
  }));

  return {
    productId: p.productId,
    itemId: firstItem.itemId,
    name: p.productName,
    brand: p.brand || 'OFFCORSS',
    category,
    price: offer?.Price ?? 0,
    listPrice: offer?.ListPrice ?? 0,
    status: deriveStatus(firstItem),
    imageUrl,
    sizes,
    colors,
    description: (p.description || '').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ''),
    stock: offer?.AvailableQuantity ?? 0,
    releaseDate: p.releaseDate || '',
    linkText: p.linkText || '',
    allImages,
  };
}

async function fetchVtexProducts(from: number, to: number) {
  const url = `${VTEX_BASE}?_from=${from}&_to=${to}`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`VTEX API responded with status ${response.status}`);
  }

  const raw: VtexProduct[] = await response.json();
  const products = raw
    .map(normalizeProduct)
    .filter((p): p is NormalizedProduct => p !== null);

  const totalHeader = response.headers.get('resources') || '';
  const totalMatch = totalHeader.match(/\/(\d+)/);
  const total = totalMatch ? parseInt(totalMatch[1]) : products.length;

  return { products, total, range: { from, to } };
}

export function vtexProxyPlugin(): Plugin {
  return {
    name: 'vtex-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next();

        if (req.url === '/api/health') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'ok', service: 'offcorss-vtex-proxy' }));
          return;
        }

        if (req.url.startsWith('/api/products')) {
          try {
            const urlObj = new URL(req.url, 'http://localhost');
            const from = Math.max(0, parseInt(urlObj.searchParams.get('_from') || '0'));
            const to = Math.min(from + 49, parseInt(urlObj.searchParams.get('_to') || String(from + 49)));

            const data = await fetchVtexProducts(from, to);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: `Failed to fetch VTEX products: ${message}` }));
          }
          return;
        }

        next();
      });
    },
  };
}
