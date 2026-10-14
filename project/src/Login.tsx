
import { useState, type FormEvent } from 'react';
import { login } from '@/graphql';
import {
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email.trim(), password);
      onLogin();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible iniciar sesión.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F7F7F5] px-4 py-8 sm:px-6">
      {/* Fondo decorativo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#FFE500]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-gray-300/30 blur-3xl"
      />

      <section className="relative w-full max-w-[440px] overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.10)]">
        {/* Encabezado de marca */}
        <header className="relative overflow-hidden bg-black px-8 py-9 text-white sm:px-10 sm:py-10">
          <div
            aria-hidden="true"
            className="absolute -right-10 -top-16 h-44 w-44 rounded-full border-[24px] border-white/[0.06]"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-16 right-24 h-32 w-32 rounded-full bg-[#FFE500]/10"
          />

          <div className="relative">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFE500] text-3xl font-black text-black shadow-lg">
                O
              </div>
              <div>
                <p className="text-2xl font-black tracking-[0.08em]">
                  OFFCORSS
                </p>
                <p className="mt-1 text-xs font-medium tracking-wide text-gray-300">
                  PANEL ADMINISTRATIVO
                </p>
              </div>
            </div>

            <div className="h-1 w-14 rounded-full bg-[#FFE500]" />

            <p className="mt-5 text-sm text-gray-300">
              Administración de catálogo
            </p>
          </div>
        </header>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-8 sm:px-10 sm:py-9">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
              Acceso a la plataforma
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
              Bienvenido<span className="text-[#C9B400]">.</span>
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Ingresa tus credenciales para continuar al panel.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-800"
            >
              Correo electrónico
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 transition focus-within:border-black focus-within:bg-white focus-within:ring-4 focus-within:ring-gray-100">
              <Mail className="h-5 w-5 shrink-0 text-gray-400" />

              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Tu correo electrónico"
                className="min-w-0 w-full bg-transparent py-3.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-800"
            >
              Contraseña
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 transition focus-within:border-black focus-within:bg-white focus-within:ring-4 focus-within:ring-gray-100">
              <LockKeyhole className="h-5 w-5 shrink-0 text-gray-400" />

              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Ingresa tu contraseña"
                className="min-w-0 w-full bg-transparent py-3.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                className="shrink-0 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#FFE500]"
                aria-label={
                  showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                }
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#FFE500] px-5 py-4 text-sm font-bold text-black shadow-sm transition hover:bg-[#F2D900] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-yellow-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Verificando acceso...
              </>
            ) : (
              <>
                Iniciar sesión
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 border-t border-gray-100 pt-5">
            <ShieldCheck className="h-4 w-4 text-gray-400" />
            <p className="text-xs text-gray-500">
              Acceso al panel administrativo
            </p>
          </div>
        </form>

        <footer className="border-t border-gray-100 bg-gray-50/80 px-6 py-4 text-center">
          <p className="text-[11px] font-medium tracking-wide text-gray-400">
            OFFCORSS · ADMINISTRACIÓN DE CATÁLOGO
          </p>
        </footer>
      </section>
    </main>
  );
}
