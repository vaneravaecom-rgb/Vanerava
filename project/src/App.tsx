
import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import type { ViewKey } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { Dashboard } from '@/views/Dashboard';
import { Products } from '@/views/Products';
import { ProductDetail } from '@/views/ProductDetail';
import { Profile } from '@/views/Profile';
import { Login } from '@/Login';
import { getCurrentUser, logout, type User } from '@/graphql';
import type { Product } from '@/types';

const TITLES: Record<ViewKey, string> = {
  dashboard: 'Dashboard',
  products: 'Catálogo de Productos',
  profile: 'Mi Perfil',
};

function App() {
  const [view, setView] = useState<ViewKey>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [sessionError, setSessionError] = useState('');

  useEffect(() => {
    let active = true;

    getCurrentUser()
      .then((currentUser) => {
        if (active) setUser(currentUser);
      })
      .catch((error: unknown) => {
        if (active) {
          setSessionError(
            error instanceof Error
              ? error.message
              : 'No fue posible comprobar la sesión.',
          );
        }
      })
      .finally(() => {
        if (active) setCheckingSession(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleNavigate = (nextView: ViewKey) => {
    setView(nextView);
    setSelectedProduct(null);
    setMobileNavOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setUser(null);
      setView('dashboard');
      setSelectedProduct(null);
      setSessionError('');
    }
  };

  const renderContent = () => {
    if (view === 'products' && selectedProduct) {
      return (
        <ProductDetail
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
        />
      );
    }

    switch (view) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'products':
        return <Products onSelectProduct={setSelectedProduct} />;
      case 'profile':
        return <Profile />;
    }
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7FC]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFE500]">
            <span className="text-xl font-extrabold text-black">O</span>
          </div>
          <p className="text-sm font-medium text-gray-600">
            Cargando OFFCORSS...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F7FC]">
        {sessionError && (
          <p className="px-4 pt-3 text-center text-sm text-red-600">
            No se pudo comprobar la sesión. Puedes intentar iniciar sesión.
          </p>
        )}

        <Login
          onLogin={() => {
            setSessionError('');

            getCurrentUser()
              .then((currentUser) => {
                if (currentUser) {
                  setUser(currentUser);
                  setView('dashboard');
                } else {
                  setSessionError(
                    'El acceso fue procesado, pero no se encontró una sesión activa. Intenta nuevamente.',
                  );
                }
              })
              .catch(() => {
                setSessionError(
                  'No fue posible verificar la sesión. Intenta nuevamente.',
                );
              });
          }}
        />
      </div>
    );
  }

  const title =
    view === 'products' && selectedProduct
      ? 'Detalle del Producto'
      : TITLES[view];

  return (
    <div className="flex min-h-screen bg-[#F5F7FC] text-gray-900">
      <Sidebar
        current={view}
        onNavigate={handleNavigate}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar
          title={title}
          onOpenMobile={() => setMobileNavOpen(true)}
          onNavigate={handleNavigate}
        />

        <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-600">
              Sesión iniciada como{' '}
              <strong className="font-semibold text-gray-900">
                {user.name || user.username}
              </strong>
            </p>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#FFE500] hover:bg-[#FFFDE6] hover:text-black focus:outline-none focus:ring-2 focus:ring-[#FFE500]"
            >
              Cerrar sesión
            </button>
          </div>

          <div className="min-w-0">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}

export default App;