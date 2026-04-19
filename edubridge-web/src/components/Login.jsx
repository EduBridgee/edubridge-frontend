import { useState } from 'react';
import { ReactComponent as LogoEduBridge } from '../assets/favicon.svg';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('https://edubridge-backend-2341.onrender.com/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const userData = await response.json();
                localStorage.setItem('user', JSON.stringify(userData));
                onLogin(userData);
            } else {
                const error = await response.json();
                alert(error.message || "Credenciales incorrectas");
            }
        } catch (err) {
            console.error("Error en la conexión:", err);
            alert("No se pudo conectar con el servidor. Verifica que Spring Boot esté corriendo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-['Inter'] p-4 relative overflow-hidden">
            {/* Círculos decorativos animado */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[120px] animate-pulse"></div>

            <div className="bg-white/80 backdrop-blur-2xl w-full max-w-md rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white p-12 relative z-10 transition-all">
                <div className="text-center mb-12">

                    {/* --- ESTA ES LA PARTE QUE CORREGIMOS --- */}
                    <div className="inline-flex p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[24px] shadow-2xl shadow-blue-200 mb-6 group transition-transform hover:scale-110 items-center justify-center">
                        {/* 1. Usamos un componente SVG para controlar el color fácilmente */}
                        <LogoEduBridge
                            className="w-24 h-24 text-white fill-current" // Aumentamos tamaño y ponemos color blanco
                            aria-label="EduBridge Logo"
                        />
                    </div>
                    {/* --------------------------------------- */}

                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">EduBridge</h2>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">Sincronización Académica</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ... (resto del formulario sin cambios) ... */}
                    <div className="space-y-4">
                        <div className="group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-blue-600 transition-colors">Institucional Email</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">✉️</span>
                                <input
                                    required
                                    type="email"
                                    placeholder="u2023... @upc.edu.pe"
                                    className="w-full bg-slate-100/50 border border-transparent p-4 pl-12 rounded-2xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-blue-600 transition-colors">Password</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔒</span>
                                <input
                                    required
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-slate-100/50 border border-transparent p-4 pl-12 rounded-2xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 flex justify-center items-center gap-2 ${loading
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-900 text-white shadow-slate-900/20 hover:bg-blue-600 hover:shadow-blue-500/30'
                            }`}
                    >
                        {loading ? 'Validando...' : 'Iniciar Sesión 🚀'}
                    </button>
                </form>

                <div className="mt-10 pt-10 border-t border-slate-100 text-center">
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">
                        Desarrollado para UPC • v1.0
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;