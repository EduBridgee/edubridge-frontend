import { useEffect, useState } from 'react';
import NotificationBell from './NotificationBell';

const Dashboard = ({ user }) => {
    const [data, setData] = useState(null);
    const [students, setStudents] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const fetchData = async () => {
        try {
            if (user.role === 'docente') {
                const [dashRes, stdRes] = await Promise.all([
                    fetch('https://edubridge-backend-2341.onrender.com/api/students/dashboard'),
                    fetch('https://edubridge-backend-2341.onrender.com/api/students')
                ]);
                setData(await dashRes.json());
                setStudents(await stdRes.json());
            } else {
                const notifRes = await fetch(`https://edubridge-backend-2341.onrender.com/api/notifications/student/${user.id}`);
                const allNotifs = await notifRes.json();
                setNotifications(allNotifs.filter(n => !n.read));
            }
        } catch (err) {
            console.error("Error cargando Dashboard:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const confirmarLectura = async (id) => {
        try {
            const response = await fetch(`https://edubridge-backend-2341.onrender.com/api/notifications/${id}/read`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                setNotifications(prev => prev.filter(n => n.id !== id));
            }
        } catch (err) {
            console.error("Error al confirmar lectura:", err);
        }
    };

    if (!data && user.role === 'docente') return <div className="lg:ml-64 p-10 font-black text-slate-400 animate-pulse">Sincronizando Analítica...</div>;

    return (
        // El margen izquierdo ml-64 solo se aplica en pantallas grandes (lg)
        <main className="flex-1 lg:ml-64 bg-[#F8FAFC] min-h-screen flex flex-col font-['Inter'] text-left">

            {/* HEADER DINÁMICO RESPONSIVE */}
            <header className="bg-white border-b border-slate-200 h-16 lg:h-14 flex items-center px-4 lg:px-8 shrink-0 sticky top-0 z-[60]">
                <div className="relative w-full max-w-xs lg:max-w-md">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="w-full h-8 pl-10 pr-4 bg-slate-100/50 rounded-lg text-xs focus:ring-1 focus:ring-blue-500/20 transition-all border-none outline-none"
                    />
                    <span className="absolute left-3 top-2 opacity-40 text-sm">🔍</span>
                </div>
                <div className="ml-auto flex items-center gap-3 lg:gap-4">
                    <NotificationBell user={user} />
                    <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>
                    <p className="hidden sm:block text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.role}</p>
                </div>
            </header>

            <div className="flex-1 p-4 lg:p-8 space-y-6 overflow-y-auto">
                {/* TITULOS */}
                <div className="space-y-1">
                    <h1 className="text-slate-900 text-xl lg:text-2xl font-black tracking-tight leading-none">
                        Bienvenido, {user.name.split(' ')[0]} 👋
                    </h1>
                    <p className="text-slate-500 text-[11px] lg:text-xs font-medium">
                        {user.role === 'docente'
                            ? 'Monitoreo global de rendimiento académico.'
                            : 'Revisa tus avisos y progreso académico del ciclo.'}
                    </p>
                </div>

                {/* --- VISTA DOCENTE RESPONSIVE --- */}
                {user.role === 'docente' && data && (
                    <>
                        {/* Secciones de 1 col en móvil, 2 en tablet y 4 en desktop */}
                        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <KPICard title="Estudiantes" value={data.totalStudents} trend="+5.2%" color="blue" icon="👥" />
                            <KPICard title="Promedio" value={data.averageGrade.toFixed(1)} trend="+2.4%" color="emerald" icon="📊" />
                            <KPICard title="Aprobación" value="94.2%" trend="+1.1%" color="violet" icon="🎯" />
                            <KPICard title="Alertas" value={data.highRiskCount} trend="Crítico" color="rose" icon="⚠️" isDanger />
                        </section>

                        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm overflow-hidden">
                                <h3 className="font-bold text-slate-800 mb-6 text-sm uppercase tracking-widest">Tendencia de Notas</h3>
                                <div className="h-48 flex items-end justify-between gap-1 sm:gap-3 px-1 sm:px-2">
                                    {[45, 70, 55, 90, 65, 80, 85, 40, 60, 75].map((h, i) => (
                                        <div key={i} className="flex-1 bg-blue-600 rounded-t-lg transition-all duration-1000 hover:bg-blue-400" style={{ height: `${h}%` }}></div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center">
                                <h3 className="font-bold text-slate-800 mb-6 text-sm uppercase tracking-widest text-left">Estado de Riesgo</h3>
                                <div className="space-y-6">
                                    <RiskRow label="Bajo Riesgo" value={data.lowRiskCount} total={data.totalStudents} color="bg-emerald-500" />
                                    <RiskRow label="Riesgo Medio" value={data.totalStudents - data.lowRiskCount - data.highRiskCount} total={data.totalStudents} color="bg-amber-500" />
                                    <RiskRow label="Alto Riesgo" value={data.highRiskCount} total={data.totalStudents} color="bg-rose-500" />
                                </div>
                            </div>
                        </section>
                    </>
                )}

                {/* --- VISTA ESTUDIANTE RESPONSIVE --- */}
                {user.role === 'estudiante' && (
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Avisos del Docente</h3>

                            {notifications.length > 0 ? (
                                notifications.map(notif => (
                                    <div key={notif.id} className="bg-white border border-slate-200 p-4 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] shadow-sm flex flex-col sm:flex-row gap-4 lg:gap-5 items-start animate-in fade-in slide-in-from-bottom-4 hover:border-blue-200 transition-colors">
                                        <div className={`p-3 lg:p-4 rounded-2xl ${notif.type === 'Examen' ? 'bg-rose-50 text-rose-500' : 'bg-orange-50 text-orange-500'}`}>
                                            {notif.type === 'Examen' ? '📝' : '🔔'}
                                        </div>
                                        <div className="flex-1 text-left w-full">
                                            <div className="flex justify-between items-center">
                                                <span className="bg-slate-100 px-2 lg:px-3 py-1 rounded-full text-[8px] lg:text-[9px] font-black text-slate-500 uppercase">{notif.type}</span>
                                                <p className="text-[10px] font-bold text-slate-300 italic">Pendiente</p>
                                            </div>
                                            <p className="font-bold text-slate-800 text-sm lg:text-base mt-2">{notif.message}</p>
                                            <div className="mt-4 lg:mt-5">
                                                <button
                                                    onClick={() => confirmarLectura(notif.id)}
                                                    className="w-full sm:w-auto bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all hover:bg-emerald-600 active:scale-95"
                                                >
                                                    Confirmar Recepción
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-[2rem] p-8 lg:p-12 text-center">
                                    <div className="text-3xl lg:text-4xl mb-4">✨</div>
                                    <p className="text-emerald-700 font-black text-sm uppercase">¡Todo al día!</p>
                                </div>
                            )}
                        </div>

                        {/* Sidebar Adaptable */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[1.5rem] lg:rounded-[2rem] p-6 text-white shadow-xl">
                                <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-1">Mi Promedio</p>
                                <h3 className="text-3xl lg:text-4xl font-black italic">17.2</h3>
                                <div className="mt-4 p-4 bg-white/10 rounded-2xl border border-white/10">
                                    <p className="text-[10px] font-bold leading-relaxed opacity-90">Estás por encima del promedio grupal.</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-[1.5rem] lg:rounded-[2rem] p-6 border border-slate-200 shadow-sm">
                                <h3 className="font-black text-slate-800 text-xs uppercase mb-4">Próximas Tutorías</h3>
                                <div className="flex gap-4 items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="w-1.5 h-10 bg-emerald-500 rounded-full"></div>
                                    <div className="text-left">
                                        <p className="text-xs font-black text-slate-800">Cálculo Diferencial</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Hoy • 4:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
};

// --- COMPONENTES AUXILIARES RESPONSIVE ---

const KPICard = ({ title, value, trend, icon, isDanger }) => (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
        <div className="flex justify-between items-start">
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">{title}</p>
            <span className="text-xl">{icon}</span>
        </div>
        <div className="flex items-baseline gap-2 mt-4">
            <h3 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${isDanger ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>{trend}</span>
        </div>
    </div>
);

const RiskRow = ({ label, value, total, color }) => (
    <div className="space-y-1.5 w-full">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
            <span className="text-slate-500">{label}</span>
            <span className="text-slate-900">{value} alumnos</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className={`${color} h-full transition-all duration-[1.5s]`} style={{ width: `${total > 0 ? (value / total) * 100 : 0}%` }}></div>
        </div>
    </div>
);

export default Dashboard;