export type ProductCategory =
  | 'Camisetas'
  | 'Pantalones'
  | 'Vestidos'
  | 'Chaquetas'
  | 'Calzado'
  | 'Accesorios';

export type ProductStatus = 'Activo' | 'Inactivo' | 'Agotado';

export interface Product {
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

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
  store: string;
  phone: string;
  location: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  range: { from: number; to: number };
}

export const DEMO_USER: UserProfile = {
  name: 'Valentina Rodríguez',
  email: 'valentina.rodriguez@offcorss.com',
  role: 'Administradora de Catálogo',
  avatarUrl: 'https://images.pexels.com/photos/8084066/pexels-photo-8084066.jpeg?auto=compress&cs=tinysrgb&h=150&w=150',
  store: 'OFFCORSS — Tienda Online',
  phone: '+57 300 123 4567',
  location: 'Medellín, Colombia',
};

export const STATUSES: ProductStatus[] = ['Activo', 'Inactivo', 'Agotado'];
