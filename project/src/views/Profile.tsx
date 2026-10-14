
import { useEffect, useState } from 'react';
import {
  Mail,
  UserRound,
  ShieldCheck,
  CheckCircle2,
  Edit2,
  Save,
  X,
  Loader2,
  CalendarDays,
  AtSign,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';
import {
  getCurrentUser,
  updateCurrentUser,
  type User,
} from '@/graphql';

export function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    username: '',
    name: '',
    lastName: '',
    email: '',
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const currentUser = await getCurrentUser();

        if (!mounted) return;

        if (!currentUser) {
          setError(
            'No hay una sesión activa. Inicia sesión para consultar tu perfil.',
          );
          return;
        }

        setUser(currentUser);
        setForm({
          username: currentUser.username ?? '',
          name: currentUser.name ?? '',
          lastName: currentUser.lastName ?? '',
          email: currentUser.email ?? '',
        });
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'No fue posible cargar el perfil.',
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      const updatedUser = await updateCurrentUser({
        username: form.username.trim(),
        name: form.name.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
      });

      setUser(updatedUser);
      setForm({
        username: updatedUser.username ?? '',
        name: updatedUser.name ?? '',
        lastName: updatedUser.lastName ?? '',
        email: updatedUser.email ?? '',
      });

      setEditing(false);
      setSaved(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible guardar los cambios.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setForm({
        username: user.username ?? '',
        name: user.name ?? '',
        lastName: user.lastName ?? '',
        email: user.email ?? '',
      });
    }

    setError('');
    setSaved(false);
    setEditing(false);
  };

  const fields = [
    {
      key: 'username' as const,
      label: 'Nombre de usuario',
      icon: AtSign,
      type: 'text',
    },
    {
      key: 'name' as const,
      label: 'Nombre',
      icon: UserRound,
      type: 'text',
    },
    {
      key: 'lastName' as const,
      label: 'Apellido',
      icon: UserRound,
      type: 'text',
    },
    {
      key: 'email' as const,
      label: 'Correo electrónico',
      icon: Mail,
      type: 'email',
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100">
          <Loader2 className="h-7 w-7 animate-spin text-black" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-800">
            Cargando tu perfil
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Estamos consultando la información de tu cuenta.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-red-50 p-3 text-red-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              No se pudo cargar tu perfil
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              {error || 'Comprueba tu sesión y la conexión con el servidor.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const fullName =
    `${user.name ?? ''} ${user.lastName ?? ''}`.trim() ||
    user.username;

  const initials =
    `${user.name?.charAt(0) ?? ''}${user.lastName?.charAt(0) ?? ''}`
      .trim()
      .toUpperCase() ||
    user.username?.slice(0, 2).toUpperCase() ||
    'U';

  const creationDate = user.createDate
    ? new Date(user.createDate).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'No disponible';

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 pb-8 pt-4 animate-fade-in">
      {/* Encabezado de la página */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-yellow-400" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
              OFFCORSS / Cuenta
            </p>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Mi perfil<span className="text-black">.</span>
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Administra tus datos personales y la información de tu cuenta.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:self-auto">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              Cuenta activa
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              {user.userType || 'Usuario'}
            </p>
          </div>
          <CheckCircle2 className="ml-1 h-4 w-4 text-green-600" />
        </div>
      </section>

      {/* Tarjeta principal del usuario */}
      <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="relative overflow-hidden bg-gradient-to-r from-black via-gray-950 to-black px-6 py-5 sm:px-8">
          <div className="absolute -right-10 -top-24 h-56 w-56 rounded-full border-[30px] border-white/10" />
          <div className="absolute right-32 top-8 h-24 w-24 rounded-full bg-yellow-400/10" />

          <div className="relative flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">
                Mi cuenta OFFCORSS
              </p>
              <p className="mt-1 text-sm text-gray-300">
                Tu información, en un solo lugar.
              </p>
            </div>

            <div className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 sm:flex">
              <UserRound className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
          <div className="flex min-w-0 items-center gap-4">
            <div className="-mt-10 flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-yellow-400 text-2xl font-black text-black shadow-md sm:-mt-12 sm:h-24 sm:w-24">
              {initials}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                {fullName}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {user.userType || 'Usuario'}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-green-700">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Perfil disponible
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            {!editing ? (
              <button
                type="button"
                onClick={() => {
                  setEditing(true);
                  setSaved(false);
                  setError('');
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-200"
              >
                <Edit2 className="h-4 w-4" />
                Editar perfil
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Mensajes de estado */}
      {saved && (
        <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          Los cambios se guardaron correctamente en el servidor.
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Información personal */}
      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-black">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Información personal
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Consulta y actualiza los datos de tu cuenta.
              </p>
            </div>
          </div>

          {!editing && (
            <div className="flex items-center gap-2 self-start rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
              <ShieldCheck className="h-3.5 w-3.5" />
              Solo datos de tu cuenta
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
          {fields.map((field) => {
            const Icon = field.icon;

            return (
              <div key={field.key} className="min-w-0">
                <label
                  htmlFor={`profile-${field.key}`}
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <Icon className="h-4 w-4 text-black" />
                  {field.label}
                </label>

                <input
                  id={`profile-${field.key}`}
                  type={field.type}
                  value={form[field.key]}
                  disabled={!editing || saving}
                  required
                  onChange={(event) => {
                    setForm((previous) => ({
                      ...previous,
                      [field.key]: event.target.value,
                    }));
                  }}
                  className={`w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition-all ${
                    editing
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-black focus:ring-4 focus:ring-gray-200'
                      : 'border-gray-200 bg-gray-50 text-gray-600'
                  } disabled:cursor-default`}
                />

                {editing && field.key === 'email' && (
                  <p className="mt-2 text-xs text-gray-400">
                    Usa una dirección de correo válida.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {editing && (
          <div className="mt-7 flex items-start gap-3 rounded-2xl bg-yellow-50 p-4">
            <div className="rounded-lg bg-yellow-400 p-2 text-black">
              <AlertCircle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Estás editando tu información
              </p>
              <p className="mt-1 text-xs leading-5 text-gray-600">
                Recuerda guardar los cambios para que se envíen al servidor.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Información complementaria */}
      <section>
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            Datos de la cuenta
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Información complementaria de tu usuario.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-400 hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Permisos
              </p>
              <p className="mt-1 font-bold text-gray-900">
                Tipo de usuario
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {user.userType || 'No especificado'}
              </p>
            </div>

            <ArrowUpRight className="h-4 w-4 text-gray-300 transition group-hover:text-black" />
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-yellow-300 hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-50 text-yellow-700">
              <CalendarDays className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Registro
              </p>
              <p className="mt-1 font-bold text-gray-900">
                Fecha de creación
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {creationDate}
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="flex flex-col gap-2 border-t border-gray-200 pt-5 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
        <p>OFFCORSS · Panel administrativo</p>
        <p>Información de tu cuenta</p>
      </footer>
    </div>
  );
}
