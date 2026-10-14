import { ArrowLeft, Printer, Package, Tag, Palette, Ruler, Boxes, Calendar } from 'lucide-react';
import type { Product } from '@/types';
import { formatCurrency, formatDate } from '@/utils';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export function ProductDetail({ product, onBack }: ProductDetailProps) {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-3 no-print">
        <button onClick={onBack} className="btn-ghost">
          <ArrowLeft className="w-4 h-4" />
          Volver al catálogo
        </button>
        <button onClick={() => window.print()} className="btn-primary ml-auto">
          <Printer className="w-4 h-4" />
          Imprimir
        </button>
      </div>

      <div className="card overflow-hidden print-area">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative bg-brand-50/30 p-6 lg:p-10 flex items-center justify-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full max-w-md rounded-2xl object-cover shadow-float"
            />
            <span className={`absolute top-6 left-6 text-sm px-3 py-1.5 rounded-full font-500 ${
              product.status === 'Activo' ? 'bg-mint-100 text-mint-700' :
              product.status === 'Agotado' ? 'bg-accent-100 text-accent-700' :
              'bg-gray-100 text-gray-500'
            }`}>
              {product.status}
            </span>
          </div>

          <div className="p-6 lg:p-10 space-y-5">
            <div>
              <p className="text-sm text-brand-500 font-600">{product.brand}</p>
              <h2 className="font-display font-700 text-2xl text-gray-800 mt-1">{product.name}</h2>
            </div>

            <div className="flex items-baseline gap-3">
              <p className="text-2xl font-display font-700 text-brand-600">{formatCurrency(product.price)}</p>
              {product.listPrice > product.price && (
                <p className="text-base text-gray-300 line-through">{formatCurrency(product.listPrice)}</p>
              )}
            </div>

            <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{product.description}</p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <InfoRow icon={Tag} label="productId" value={product.productId} />
              <InfoRow icon={Package} label="itemId" value={product.itemId} />
              <InfoRow icon={Boxes} label="Categoría" value={product.category} />
              <InfoRow icon={Calendar} label="Lanzamiento" value={formatDate(product.releaseDate)} />
            </div>

            {product.sizes.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <Ruler className="w-4 h-4" />
                  <span className="text-sm font-500">Tallas disponibles</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <span key={s} className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-sm font-500 text-gray-600">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.colors.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-400">
                  <Palette className="w-4 h-4" />
                  <span className="text-sm font-500">Colores</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <span key={c} className="px-3 py-1.5 rounded-xl bg-brand-50 border border-brand-100 text-sm font-500 text-brand-700">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.allImages.length > 1 && (
              <div className="space-y-3 pt-2">
                <p className="text-sm font-500 text-gray-400">Galería de imágenes</p>
                <div className="flex flex-wrap gap-2">
                  {product.allImages.slice(0, 6).map((img, i) => (
                    <img
                      key={i}
                      src={img.url}
                      alt={img.text}
                      className={`w-16 h-16 rounded-xl object-cover ring-1 ring-gray-100 cursor-pointer transition-all ${
                        img.url === product.imageUrl ? 'ring-2 ring-brand-400' : 'hover:ring-brand-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
              <div className="flex-1">
                <p className="text-sm text-gray-400">Stock disponible</p>
                <p className={`text-xl font-display font-700 ${product.stock > 0 ? 'text-mint-600' : 'text-accent-600'}`}>
                  {product.stock} {product.stock === 1 ? 'unidad' : 'unidades'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Tag; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-brand-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-600 text-gray-700 truncate">{value}</p>
      </div>
    </div>
  );
}
