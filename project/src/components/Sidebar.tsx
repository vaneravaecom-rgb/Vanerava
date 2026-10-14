
import {
  LayoutDashboard,
  Package,
  User,
  ChevronRight,
  Cloud,
} from 'lucide-react';

export type ViewKey = 'dashboard' | 'products' | 'profile';

interface SidebarProps {
  current: ViewKey;
  onNavigate: (view: ViewKey) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const navItems: {
  key: ViewKey;
  label: string;
  icon: typeof LayoutDashboard;
  description: string;
}[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Resumen del catálogo',
  },
  {
    key: 'products',
    label: 'Productos',
    icon: Package,
    description: 'Administrar productos',
  },
  {
    key: 'profile',
    label: 'Mi perfil',
    icon: User,
    description: 'Datos de la cuenta',
  },
];

export function Sidebar({
  current,
  onNavigate,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      {/* Fondo para cerrar el menú en móviles */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          className="fixed inset-0 z-30 cursor-default bg-black/60 backdrop-blur-[2px] lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Barra lateral OFFCORSS */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-white/10 bg-black text-white transition-transform duration-300 lg:sticky lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-[104px] shrink-0 items-center justify-center border-b border-white/10 px-5">
          <div className="flex h-[76px] w-full items-center justify-center overflow-hidden rounded-2xl bg-black">
            <img
              src="/src/assets/offcorss-logo.png"
              alt="OFFCORSS"
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        {/* Título del menú */}
        <div className="px-6 pb-3 pt-8">
          <div className="flex items-center gap-2">
            <span className="h-1 w-5 rounded-full bg-[#FFE500]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              Menú principal
            </p>
          </div>
        </div>

        {/* Navegación */}
        <nav
          aria-label="Navegación principal"
          className="flex-1 space-y-2 px-4 py-3"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = current === item.key;

            return (
              <button
                key={item.key}
                type="button"
                aria-current={active ? 'page' : undefined}
                onClick={() => {
                  onNavigate(item.key);
                  onCloseMobile();
                }}
                className={`group relative flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFE500]/50 ${
                  active
                    ? 'border-[#FFE500] bg-[#FFE500] text-black shadow-[0_4px_18px_rgba(255,229,0,0.10)]'
                    : 'border-transparent bg-transparent text-gray-300 hover:border-white/10 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    active
                      ? 'bg-black text-[#FFE500]'
                      : 'bg-white/[0.08] text-gray-300 group-hover:bg-white/[0.12] group-hover:text-[#FFE500]'
                  }`}
                >
                  <Icon
                    className="h-[19px] w-[19px]"
                    strokeWidth={1.8}
                  />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">
                    {item.label}
                  </span>

                  <span
                    className={`mt-0.5 block text-[10px] ${
                      active ? 'text-gray-700' : 'text-gray-500'
                    }`}
                  >
                    {item.description}
                  </span>
                </span>

                {active && (
                  <ChevronRight
                    className="h-4 w-4 shrink-0 text-black"
                    strokeWidth={2}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Conexión con VTEX: versión compacta */}
        <div className="mt-auto border-t border-white/10 p-4">
          <div className="rounded-xl border border-white/10 bg-[#111111] p-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FFE500]">
                <Cloud className="h-5 w-5 text-black" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">
                  Catálogo VTEX
                </p>

                <div className="mt-1 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span className="text-[11px] text-gray-400">
                    Conexión activa
                  </span>
                </div>
              </div>

              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.06]">
                <span className="h-2 w-2 rounded-full bg-green-500" />
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">
                Fuente de datos
              </span>

              <span className="rounded-md border border-white/10 bg-white/[0.05] px-2 py-1 text-[10px] font-semibold text-[#FFE500]">
                VTEX API
              </span>
            </div>
          </div>

          {/* Pie del menú */}
          <div className="mt-4 flex items-center justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFE500]" />

            <p className="text-center text-[10px] text-gray-500">
              OFFCORSS · Panel administrativo
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}