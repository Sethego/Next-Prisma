"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Mail, User, AlertCircle, CheckCircle } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin ? { email } : { email, name };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en la autenticación');
      }

      setNotification({
        msg: isLogin ? '✓ Bienvenido!' : '✓ Cuenta creada exitosamente!',
        type: 'success',
      });

      // Redirigir después de 1 segundo
      setTimeout(() => {
        if (isLogin) {
          // Si es login, ir a trading
          router.push('/trading');
        } else {
          // Si es registro, ir al login
          setIsLogin(true);
          setEmail('');
          setName('');
          setNotification(null);
        }
      }, 1000);
    } catch (error: any) {
      setNotification({
        msg: error.message,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* LOGO & HEADER */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <TrendingUp className="text-white" size={32} />
          </div>
        </div>

        <h1 className="text-4xl font-bold gradient-text text-center mb-2">
          Coin-X
        </h1>
        <p className="text-slate-400 text-center mb-8 font-light">
          Plataforma de Trading de Criptomonedas
        </p>

        {/* FORM CARD */}
        <div className="card-base">
          {/* TABS */}
          <div className="grid grid-cols-2 gap-2 mb-6 bg-slate-900/50 p-1 rounded-lg border border-slate-700/50">
            <button
              onClick={() => {
                setIsLogin(true);
                setName('');
                setNotification(null);
              }}
              className={`py-2 text-sm font-bold rounded-md transition-all duration-200 ${
                isLogin
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setNotification(null);
              }}
              className={`py-2 text-sm font-bold rounded-md transition-all duration-200 ${
                !isLogin
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Nombre Completo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Juan Perez"
                    className="input-base"
                    pattern="[a-zA-Z\s]+"
                    title="El nombre solo puede contener letras y espacios"
                    required={!isLogin}
                  />
                  <User className="absolute right-4 top-3.5 text-slate-500 pointer-events-none" size={18} />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ej: trader@example.com"
                  className="input-base"
                  required
                />
                <Mail className="absolute right-4 top-3.5 text-slate-500 pointer-events-none" size={18} />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading || !email || (!isLogin && !name)}
              className="w-full py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-200 transform disabled:opacity-50 disabled:cursor-not-allowed btn-primary-green hover:shadow-xl mt-6"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin">⟳</div>
                  {isLogin ? 'Ingresando...' : 'Registrando...'}
                </>
              ) : isLogin ? (
                '✓ Iniciar Sesión'
              ) : (
                '✓ Crear Cuenta'
              )}
            </button>
          </form>

          {/* NOTIFICATION */}
          {notification && (
            <div
              className={`mt-4 p-3 rounded-lg text-sm text-center fade-in-animation font-medium flex items-center justify-center gap-2 ${
                notification.type === 'success'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
              {notification.msg}
            </div>
          )}
        </div>

        {/* DEMO INFO */}
        <div className="mt-8 p-4 bg-slate-800/30 border border-slate-700/30 rounded-lg">
          <p className="text-xs text-slate-400 font-light text-center">
            💡 <span className="font-semibold text-slate-300">Prueba Demo:</span> Usa cualquier email para crear una cuenta y comenzar a hacer trading con $10,000 USD iniciales.
          </p>
        </div>
      </div>
    </div>
  );
}
