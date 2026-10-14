
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import bcrypt from 'bcryptjs';
import { MongoClient, ObjectId } from 'mongodb';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 4000);
const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

if (!MONGODB_URI || !SESSION_SECRET) {
  throw new Error('Faltan MONGODB_URI o SESSION_SECRET en server/.env');
}

const client = new MongoClient(MONGODB_URI);
let db;

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

app.use(session({
  name: 'offcorss.sid',
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGODB_URI,
    collectionName: 'sessions',
  }),
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 8,
  },
}));

const VTEX_BASE =
  'https://offcorss.myvtex.com/api/catalog_system/pub/products/search';

function normalizeProduct(p) {
  if (!p.items?.length) return null;

  const item = p.items[0];
  const offer = item.sellers?.[0]?.commertialOffer;
  const categoryPath = p.categories?.[0] || '';
  const categoryParts = categoryPath.split('/').filter(Boolean);

  return {
    productId: p.productId,
    itemId: item.itemId,
    name: p.productName,
    brand: p.brand || 'OFFCORSS',
    category: categoryParts.at(-1) || 'Sin categoría',
    price: offer?.Price ?? 0,
    listPrice: offer?.ListPrice ?? 0,
    status: offer?.IsAvailable ? 'Activo' : 'Agotado',
    imageUrl: item.images?.[0]?.imageUrl || '',
    sizes: [...new Set(p.items.flatMap((i) => i.Talla || []))],
    colors: p.Color || item['Codigo de color'] || [],
    description: (p.description || '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, ''),
    stock: offer?.AvailableQuantity ?? 0,
    releaseDate: p.releaseDate || '',
    linkText: p.linkText || '',
    allImages: (item.images || []).map((image) => ({
      url: image.imageUrl,
      text: image.imageText || p.productName,
    })),
  };
}

async function fetchProducts(from = 0, to = 49) {
  const safeFrom = Math.max(0, Number(from) || 0);
  const safeTo = Math.min(
    safeFrom + 49,
    Math.max(safeFrom, Number(to) || safeFrom + 49),
  );

  const response = await fetch(
    `${VTEX_BASE}?_from=${safeFrom}&_to=${safeTo}`,
    { headers: { Accept: 'application/json' } },
  );

  if (!response.ok) {
    throw new Error(`VTEX respondió con estado ${response.status}`);
  }

  const raw = await response.json();
  const products = raw.map(normalizeProduct).filter(Boolean);
  const resources = response.headers.get('resources') || '';
  const match = resources.match(/\/(\d+)\s*$/);

  return {
    products,
    total: match ? Number(match[1]) : products.length,
    range: { from: safeFrom, to: safeTo },
  };
}

// Se conserva esta ruta para la pantalla de productos existente.
app.get('/api/products', async (req, res) => {
  try {
    const result = await fetchProducts(req.query._from, req.query._to);
    res.json(result);
  } catch (error) {
    console.error('Error consultando VTEX:', error.message);
    res.status(502).json({ error: 'No fue posible consultar el catálogo VTEX.' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', database: Boolean(db) });
});

const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    name: String!
    lastName: String!
    email: String!
    userType: String!
    createDate: String!
  }

  type Image {
    url: String!
    text: String!
  }

  type Product {
    productId: ID!
    itemId: String!
    name: String!
    brand: String!
    category: String!
    price: Float!
    listPrice: Float!
    status: String!
    imageUrl: String!
    sizes: [String!]!
    colors: [String!]!
    description: String!
    stock: Int!
    releaseDate: String!
    linkText: String!
    allImages: [Image!]!
  }

  type ProductsResult {
    products: [Product!]!
    total: Int!
  }

  type Query {
    me: User
    products(from: Int, to: Int): ProductsResult!
  }

  type Mutation {
    login(email: String!, password: String!): User!
    logout: Boolean!
    updateProfile(
      username: String!
      name: String!
      lastName: String!
      email: String!
    ): User!
  }
`;

function publicUser(user) {
  if (!user) return null;
  return {
    id: user._id.toString(),
    username: user.username,
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    userType: user.userType,
    createDate: user.createDate,
  };
}

const resolvers = {
  Query: {
    me: async (_parent, _args, { req }) => {
      if (!req.session.userId) return null;

      const user = await db.collection('users').findOne({
        _id: new ObjectId(req.session.userId),
      });

      return publicUser(user);
    },

    products: async (_parent, args) => {
      const result = await fetchProducts(args.from ?? 0, args.to ?? 49);
      return { products: result.products, total: result.total };
    },
  },

  Mutation: {
    login: async (_parent, { email, password }, { req }) => {
      const user = await db.collection('users').findOne({
        email: email.trim().toLowerCase(),
      });

      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        throw new Error('Correo o contraseña incorrectos.');
      }

      await new Promise((resolve, reject) => {
        req.session.regenerate((error) => error ? reject(error) : resolve());
      });

      req.session.userId = user._id.toString();
      return publicUser(user);
    },

    logout: async (_parent, _args, { req }) => {
      await new Promise((resolve, reject) => {
        req.session.destroy((error) => error ? reject(error) : resolve());
      });

      return true;
    },

    updateProfile: async (_parent, input, { req }) => {
      if (!req.session.userId) {
        throw new Error('Debes iniciar sesión.');
      }

      const username = input.username.trim();
      const name = input.name.trim();
      const lastName = input.lastName.trim();
      const email = input.email.trim().toLowerCase();

      if (!username || !name || !lastName || !email) {
        throw new Error('Todos los campos son obligatorios.');
      }

      const userId = new ObjectId(req.session.userId);
      const duplicate = await db.collection('users').findOne({
        email,
        _id: { $ne: userId },
      });

      if (duplicate) {
        throw new Error('Ese correo ya está registrado.');
      }

      await db.collection('users').updateOne(
        { _id: userId },
        { $set: { username, name, lastName, email } },
      );

      return publicUser(await db.collection('users').findOne({ _id: userId }));
    },
  },
};

async function start() {
  await client.connect();
  db = client.db('offcorss');

  await db.collection('users').createIndex({ email: 1 }, { unique: true });

  const apollo = new ApolloServer({ typeDefs, resolvers });
  await apollo.start();

  app.use('/graphql', expressMiddleware(apollo, {
    context: async ({ req, res }) => ({ req, res }),
  }));

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OFFCORSS backend disponible en el puerto ${PORT}`);
  });
}

start().catch((error) => {
  console.error('No se pudo iniciar el servidor:', error);
  process.exit(1);
});
