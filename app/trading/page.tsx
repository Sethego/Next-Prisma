"use client"; // IMPORTANTE: Esto permite usar useState y useEffect en Next.js App Router

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, ArrowUpRight, ArrowDownLeft, History, RefreshCcw, TrendingUp, LogOut, Settings } from 'lucide-react';

// Tipos
type TransactionType = 'BUY' | 'SELL';

interface Transaction {
  id: number;
  type: TransactionType;
  coinPrice: number;
  amountUSD: number;
  amountCoinX: number;
  createdAt: string; // Al venir de la API, las fechas suelen venir como string ISO
}

interface Account {
  balanceUSD: number;
  balanceCoinX: number;
}

interface User {
  id: number;
  email: string;
  name: string;
}

const CoinXDashboard = () => {
  const router = useRouter();

  // --- ESTADO ---
  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState<Account>({
    balanceUSD: 10000.00, 
    balanceCoinX: 0.00
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // --- ESTADO DE LA INTERFAZ ---
  const [currentPrice, setCurrentPrice] = useState<number>(150.00);
  const [priceHistory, setPriceHistory] = useState<number[]>(Array(20).fill(150));
  const [tradeAmount, setTradeAmount] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'BUY' | 'SELL'>('BUY');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // --- EFECTO: CARGAR USUARIO AUTENTICADO ---
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          // Si no está autenticado, redirigir al login
          router.push('/');
          return;
        }

        const data = await response.json();
        setUser(data.user);
        setEditName(data.user.name);
        
        if (data.account) {
          setAccount({
            balanceUSD: data.account.balanceUSD,
            balanceCoinX: data.account.balanceCoinX,
          });
        }

        // Cargar el historial de transacciones desde la base de datos
        if (data.transactions && Array.isArray(data.transactions)) {
          setTransactions(data.transactions);
        }
      } catch (error) {
        console.error('Error cargando usuario:', error);
        router.push('/');
      }
    };

    loadUser();
  }, [router]);

  // --- EFECTO: SIMULAR MERCADO EN VIVO (Esto se queda igual, es visual) ---
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * 5; 
        const newPrice = Math.max(10, prev + change); 
        
        setPriceHistory(history => {
          const newHistory = [...history.slice(1), newPrice];
          return newHistory;
        });
        
        return Number(newPrice.toFixed(2));
      });
    }, 5000); 

    return () => clearInterval(interval);
  }, []);

  // --- LÓGICA DE NEGOCIO REAL (CONECTADA A TU API) ---
  const handleTrade = async () => {
    // 1. Validaciones básicas de frontend
    if (!user || !tradeAmount || parseFloat(tradeAmount) <= 0) return;
    
    setIsLoading(true);
    
    try {
      // 2. LLAMADA AL BACKEND
      // Aquí es donde la magia ocurre. Enviamos los datos a tu archivo route.ts
      const response = await fetch('/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id, // Usar el ID del usuario autenticado
          type: activeTab, // 'BUY' o 'SELL'
          amount: parseFloat(tradeAmount),
          currentPrice: currentPrice
        })
      });

      const data = await response.json();

      // 3. Manejo de la respuesta
      if (!response.ok) {
        // Si el servidor devuelve error (ej. fondos insuficientes)
        throw new Error(data.error || 'Error al procesar la transacción');
      }

      // 4. ÉXITO: Actualizamos la interfaz con los datos REALES que devolvió la base de datos
      if (data.success) {
        // Actualizamos la billetera con los nuevos saldos reales
        setAccount({
          balanceUSD: Number(data.newBalance.balanceUSD),
          balanceCoinX: Number(data.newBalance.balanceCoinX)
        });

        // Agregamos la nueva transacción a la lista
        // (Convertimos las fechas si es necesario o las mostramos directo)
        const newTx = {
            ...data.transaction,
            createdAt: data.transaction.createdAt // Usaremos esto tal cual
        };
        
        setTransactions(prev => [newTx, ...prev]);
        
        const successMsg = activeTab === 'BUY' 
            ? `Compra exitosa.` 
            : `Venta exitosa.`;
            
        setNotification({ msg: successMsg, type: 'success' });
        setTradeAmount(''); // Limpiar input
      }

    } catch (error: any) {
      console.error(error);
      setNotification({ msg: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
      // Limpiar notificación después de 3 segundos
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Helper para gráfico simple SVG (Solo visual)
  const renderMiniChart = () => {
    const min = Math.min(...priceHistory);
    const max = Math.max(...priceHistory);
    const height = 60;
    const width = 120;
    
    const points = priceHistory.map((p, i) => {
      const x = (i / (priceHistory.length - 1)) * width;
      const normalizedY = (p - min) / (max - min || 1);
      const y = height - (normalizedY * height);
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={priceHistory[priceHistory.length-1] >= priceHistory[0] ? "#10B981" : "#EF4444"}
          strokeWidth="2"
          points={points}
        />
      </svg>
    );
  };

  // Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setShowLogoutModal(false);
      router.push('/');
    } catch (error) {
      console.error('Error al desconectar:', error);
    }
  };

  const handleSaveName = async () => {
    if (!editName.trim() || !user) return;
    
    try {
      const response = await fetch('/api/auth/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el nombre');
      }

      setUser({ ...user, name: editName });
      setShowSettingsModal(false);
      setNotification({ msg: 'Nombre actualizado correctamente', type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error: any) {
      setNotification({ msg: error.message, type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/auth/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al eliminar la cuenta');
      }

      // Redirigir al login
      router.push('/');
    } catch (error: any) {
      setNotification({ msg: error.message, type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6 fade-in-animation">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <TrendingUp className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold gradient-text">
                Coin-X
              </h1>
              <p className="text-sm text-slate-400 font-light tracking-wide">Exchange • Trading Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-slate-300">En Vivo</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-full backdrop-blur-sm text-sm">
              <span className="text-slate-400">👤</span>
              <span className="font-medium text-slate-300">{user.name}</span>
            </div>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 hover:border-slate-600 px-3 py-2 rounded-full backdrop-blur-sm transition-all duration-200"
              title="Configuración"
            >
              <Settings className="text-slate-400 hover:text-slate-200" size={18} />
            </button>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 hover:border-slate-600 px-3 py-2 rounded-full backdrop-blur-sm transition-all duration-200"
              title="Cerrar sesión"
            >
              <LogOut className="text-slate-400 hover:text-slate-200" size={18} />
            </button>
          </div>
        </header>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUMN 1: MARKET INFO */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* PRICE CARD */}
            <div className="card-base slide-in-animation">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                  <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">Precio Actual</h2>
                  <div className="text-5xl font-bold text-white flex items-baseline gap-2">
                    <span>${currentPrice.toFixed(2)}</span>
                    <span className="text-xl text-slate-500 font-light">USD</span>
                  </div>
                  <div className={`flex items-center gap-2 mt-3 text-sm font-medium ${priceHistory[priceHistory.length-1] >= priceHistory[0] ? 'text-green-400' : 'text-red-400'}`}>
                    {priceHistory[priceHistory.length-1] >= priceHistory[0] ? <ArrowUpRight size={18}/> : <ArrowDownLeft size={18}/>}
                    <span>Variación Reciente</span>
                  </div>
                </div>
                <div className="h-20 w-40 md:w-48 opacity-75 flex-shrink-0">
                  {renderMiniChart()}
                </div>
              </div>
            </div>

            {/* TRANSACTIONS TABLE */}
            <div className="card-base slide-in-animation">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-700/50 rounded-lg">
                  <History className="text-indigo-400" size={20} />
                </div>
                <h3 className="font-semibold text-lg">Historial de Transacciones</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-slate-400 border-b border-slate-700 bg-slate-800/50">
                    <tr>
                      <th className="py-3 px-4">Tipo</th>
                      <th className="py-3 px-4">Precio (CX)</th>
                      <th className="py-3 px-4">Total (USD)</th>
                      <th className="py-3 px-4">Cantidad (CX)</th>
                      <th className="py-3 px-4 text-right">Hora</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">
                          No hay transacciones recientes
                        </td>
                      </tr>
                    ) : (
                      transactions.map((tx, index) => (
                        <tr key={tx.id || index} className="hover:bg-slate-700/30 transition-colors">
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${tx.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                              {tx.type === 'BUY' ? 'COMPRA' : 'VENTA'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-300">${Number(tx.coinPrice).toFixed(2)}</td>
                          <td className="py-3 px-4 font-mono font-medium text-white">${Number(tx.amountUSD).toFixed(2)}</td>
                          <td className="py-3 px-4 font-mono text-slate-300">{Number(tx.amountCoinX).toFixed(4)}</td>
                          <td className="py-3 px-4 text-right text-slate-500">
                            {new Date(tx.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* COLUMN 2: TRADING & WALLET */}
          <div className="space-y-6">
            
            {/* WALLET CARD */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-indigo-500/30 rounded-2xl p-6 shadow-lg shadow-indigo-500/10 backdrop-blur-sm slide-in-animation">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Wallet className="text-indigo-300" size={20} />
                </div>
                <h3 className="font-semibold text-lg text-indigo-100">Mi Billetera</h3>
              </div>
              
              <div className="space-y-3">
                <div className="stat-box border-indigo-400/30">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">Saldo USD</p>
                  <div className="text-3xl font-bold text-white font-mono">
                    ${account.balanceUSD.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </div>
                </div>

                <div className="stat-box border-cyan-400/30">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">Saldo Coin-X</p>
                  <div className="text-3xl font-bold text-cyan-400 font-mono">
                    {account.balanceCoinX.toFixed(4)} <span className="text-lg text-cyan-600">CX</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-mono">
                    ≈ ${(account.balanceCoinX * currentPrice).toLocaleString('en-US', {maximumFractionDigits: 2})} USD
                  </p>
                </div>
              </div>
            </div>

            {/* TRADING FORM */}
            <div className="card-base slide-in-animation">
              {/* TABS */}
              <div className="grid grid-cols-2 gap-2 mb-6 bg-slate-900/50 p-1 rounded-lg border border-slate-700/50">
                <button
                  onClick={() => { setActiveTab('BUY'); setTradeAmount(''); }}
                  className={`py-2 px-4 text-sm font-bold rounded-md transition-all duration-200 ${activeTab === 'BUY' ? 'bg-green-600 text-white shadow-lg shadow-green-900/50' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Comprar
                </button>
                <button
                  onClick={() => { setActiveTab('SELL'); setTradeAmount(''); }}
                  className={`py-2 px-4 text-sm font-bold rounded-md transition-all duration-200 ${activeTab === 'SELL' ? 'bg-red-600 text-white shadow-lg shadow-red-900/50' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Vender
                </button>
              </div>

              {/* INPUTS */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                    {activeTab === 'BUY' ? 'Cantidad a gastar' : 'Cantidad a vender'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(e.target.value)}
                      placeholder="0.00"
                      className="input-base"
                    />
                    <div className="absolute right-4 top-3.5 text-slate-400 text-sm font-bold pointer-events-none">
                      {activeTab === 'BUY' ? 'USD' : 'CX'}
                    </div>
                  </div>
                </div>

                {/* ESTIMATION */}
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Precio actual:</span>
                    <span className="text-slate-200 font-mono font-medium">${currentPrice.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-slate-700/50"></div>
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-500">Recibirás:</span>
                    <span className={`font-mono ${activeTab === 'BUY' ? 'text-green-400' : 'text-cyan-400'}`}>
                      {tradeAmount ? (
                        activeTab === 'BUY' 
                          ? `${(parseFloat(tradeAmount) / currentPrice).toFixed(4)} CX`
                          : `$${(parseFloat(tradeAmount) * currentPrice).toFixed(2)} USD`
                      ) : '-.--'}
                    </span>
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  onClick={handleTrade}
                  disabled={isLoading || !tradeAmount || parseFloat(tradeAmount) <= 0}
                  className={`w-full py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-200 transform disabled:opacity-50 disabled:cursor-not-allowed ${
                    activeTab === 'BUY' 
                      ? 'btn-primary-green' 
                      : 'btn-primary-red'
                  } disabled:hover:bg-opacity-100 hover:shadow-xl`}
                >
                  {isLoading ? (
                    <RefreshCcw className="animate-spin" size={20} />
                  ) : (
                    activeTab === 'BUY' ? '✓ Comprar Coin-X' : '✓ Vender Coin-X'
                  )}
                </button>
              </div>

              {/* NOTIFICATION */}
              {notification && (
                <div className={`mt-4 p-3 rounded-lg text-sm text-center fade-in-animation font-medium ${
                  notification.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {notification.msg}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MODAL DE CONFIRMACIÓN LOGOUT */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm mx-4 shadow-2xl">
              <h2 className="text-xl font-bold text-slate-100 mb-2">Cerrar Sesión</h2>
              <p className="text-slate-400 mb-6">¿Estás seguro de que deseas cerrar la sesión?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE CONFIGURACIÓN */}
        {showSettingsModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm mx-4 shadow-2xl">
              <h2 className="text-xl font-bold text-slate-100 mb-4">Configuración de Perfil</h2>
              
              {/* Nombre */}
              {!showDeleteConfirm && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    pattern="[a-zA-Z\s]+"
                    title="El nombre solo puede contener letras y espacios"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                    placeholder="Tu nombre"
                  />
                </div>
              )}

              {/* Confirmación de eliminación */}
              {showDeleteConfirm && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                  <p className="text-sm text-red-300 text-center mb-4">
                    ¿Estás seguro? Esta acción es <span className="font-bold">irreversible</span> y eliminará tu cuenta y todas tus transacciones.
                  </p>
                </div>
              )}

              {/* Botones */}
              <div className="space-y-3">
                {!showDeleteConfirm ? (
                  <>
                    {/* Botones normales */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditName(user?.name || '');
                          setShowSettingsModal(false);
                        }}
                        className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg font-medium transition-colors duration-200"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSaveName}
                        disabled={!editName.trim() || editName === user?.name}
                        className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Guardar
                      </button>
                    </div>
                    
                    {/* Botón eliminar cuenta */}
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full py-2 px-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/50 rounded-lg font-medium transition-colors duration-200 mt-4"
                    >
                      Eliminar Cuenta
                    </button>
                  </>
                ) : (
                  <>
                    {/* Botones de confirmación */}
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg font-medium transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                      Sí, eliminar mi cuenta
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinXDashboard;