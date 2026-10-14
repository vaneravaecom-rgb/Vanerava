
export interface User {
  id: string;
  username: string;
  name: string;
  lastName: string;
  email: string;
  userType: string;
  createDate: string;
}

const GRAPHQL_URL =
  import.meta.env.VITE_GRAPHQL_URL || '/graphql';

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });
  } catch {
    throw new Error(
      'No se pudo conectar con el servidor. Comprueba que el backend esté activo.',
    );
  }

  const contentType = response.headers.get('content-type') || '';
  const responseText = await response.text();

  if (!contentType.includes('application/json')) {
    throw new Error(
      `El servidor respondió con contenido no JSON (HTTP ${response.status}). Revisa la dirección de GraphQL y el proxy.`,
    );
  }

  let result: GraphQLResponse<T>;

  try {
    result = JSON.parse(responseText) as GraphQLResponse<T>;
  } catch {
    throw new Error(
      `No se pudo interpretar la respuesta del servidor (HTTP ${response.status}).`,
    );
  }

  if (!response.ok || result.errors?.length) {
    throw new Error(
      result.errors?.[0]?.message ||
        `Error de comunicación con el servidor (HTTP ${response.status}).`,
    );
  }

  if (!result.data) {
    throw new Error('El servidor no devolvió los datos esperados.');
  }

  return result.data;
}

export async function getCurrentUser(): Promise<User | null> {
  const result = await graphqlRequest<{ me: User | null }>(`
    query GetCurrentUser {
      me {
        id
        username
        name
        lastName
        email
        userType
        createDate
      }
    }
  `);

  return result.me;
}

export async function updateCurrentUser(input: {
  username: string;
  name: string;
  lastName: string;
  email: string;
}): Promise<User> {
  const result = await graphqlRequest<{ updateProfile: User }>(
    `
      mutation UpdateProfile(
        $username: String!
        $name: String!
        $lastName: String!
        $email: String!
      ) {
        updateProfile(
          username: $username
          name: $name
          lastName: $lastName
          email: $email
        ) {
          id
          username
          name
          lastName
          email
          userType
          createDate
        }
      }
    `,
    input,
  );

  return result.updateProfile;
}

export async function login(
  email: string,
  password: string,
): Promise<User> {
  const result = await graphqlRequest<{ login: User }>(
    `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          id
          username
          name
          lastName
          email
          userType
          createDate
        }
      }
    `,
    { email, password },
  );

  return result.login;
}

export async function logout(): Promise<boolean> {
  const result = await graphqlRequest<{ logout: boolean }>(`
    mutation Logout {
      logout
    }
  `);

  return result.logout;
}