import { Search, Menu, Bell, ChevronDown } from 'lucide-react';
import type { ViewKey } from '@/components/Sidebar';
import { useEffect, useState } from 'react';
import { getCurrentUser, type User } from '@/graphql';

interface TopbarProps {
  title: string;
  onOpenMobile: () => void;
  onNavigate: (view: ViewKey) => void;
}

export function Topbar({
  title,
  onOpenMobile,
  onNavigate,
}: TopbarProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let active = true;

    getCurrentUser()
      .then((currentUser) => {
        if (active) {
          setUser(currentUser);
        }
      })
      .catch((error) => {
        console.error(
          'No se pudo cargar el usuario del encabezado:',
          error,
        );
      });

    return () => {
      active = false;
    };
  }, []);

  const fullName = user
    ? `${user.name || ''} ${user.lastName || ''}`.trim() ||
      user.username
    : 'Cargando usuario...';

  const initials = user?.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <header className="sticky top-0 z-20 flex min-h-[84px] items-center gap-4 border-b border-gray-200/80 bg-white px-4 py-4 sm:px-6 lg:px-8">
      {/* Menú móvil */}

      <button
        type="button"
        onClick={onOpenMobile}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#1746D1]/30 lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Título */}

      <div className="min-w-0 flex-1">
        <div className="mb-1 hidden items-center gap-2 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFE500]" />
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-gray-400">
            OFFCORSS
          </span>
        </div>

        <h1 className="truncate text-lg font-bold tracking-tight text-gray-950 sm:text-xl">
          {title}
        </h1>
      </div>

      {/* Buscador */}

      <div className="hidden h-11 w-56 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/70 px-3.5 transition focus-within:border-[#1746D1] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1746D1]/10 md:flex lg:w-72">
        <Search className="h-[18px] w-[18px] shrink-0 text-gray-400" />

        <input
          type="search"
          placeholder="Buscar..."
          aria-label="Buscar"
          className="w-full min-w-0 border-0 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-0"
        />

        <span className="hidden rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] text-gray-400 lg:inline">
          /
        </span>
      </div>

      {/* Notificaciones */}

      <button
        type="button"
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-950 focus:outline-none focus:ring-2 focus:ring-[#1746D1]/30"
        aria-label="Notificaciones"
      >
        <Bell className="h-5 w-5" strokeWidth={1.8} />

        <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#1746D1]" />
      </button>

      {/* Separador */}

      <div className="hidden h-9 w-px bg-gray-200 sm:block" />

      {/* Perfil */}

      <button
        type="button"
        onClick={() => onNavigate('profile')}
        className="flex min-w-0 shrink-0 items-center gap-2.5 rounded-xl py-1 pl-1 pr-1.5 text-left transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1746D1]/30 sm:gap-3 sm:pr-2"
        aria-label="Abrir mi perfil"
      >
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#FFE500] bg-black text-sm font-bold text-[#FFE500]">
          {initials}
          <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
        </div>

        <div className="hidden min-w-0 sm:block">
          <p className="max-w-36 truncate text-sm font-semibold leading-5 text-gray-900">
            {fullName}
          </p>

          <p className="mt-0.5 max-w-36 truncate text-xs text-gray-500">
            {user?.userType || 'Usuario'}
          </p>
        </div>

        <ChevronDown className="hidden h-4 w-4 text-gray-400 sm:block" />
      </button>
    </header>
  );
}