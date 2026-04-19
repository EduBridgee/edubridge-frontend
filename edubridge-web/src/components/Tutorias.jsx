import { useEffect, useState } from 'react';

const Tutorias = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://edubridge-backend-2341.onrender.com/api/tutoring')
            .then(res => res.json())
            .then(data => {
                setSessions(data);
                setLoading(false);
            })
            .catch(err => console.error("Error cargando tutorías:", err));
    }, []);

    const abrirPizarra = (curso) => {
        const roomName = curso.toLowerCase().replace(/\s+/g, '-');
        const encryptionKey = "EduBridgeKey2026React!";
        const meetingUrl = `https://excalidraw.com/#room=edubridge-${roomName},${encryptionKey}`;
        window.open(meetingUrl, '_blank');
    };

    const unirseASesion = (curso) => {
        const roomName = curso.toLowerCase().replace(/\s+/g, '-');
        const meetingUrl = `https://meet.jit.si/EduBridge-${roomName}`;
        window.open(meetingUrl, '_blank');
    };

    if (loading) return <div className="md:ml-64 p-10 font-black text-slate-400 italic animate-pulse">Sincronizando sesiones de tutoría...</div>;

    return (
        <main className="flex-1 md:ml-64 bg-[#F8FAFC] min-h-screen flex flex-col font-['Inter'] transition-all">
            <header className="bg-white border-b border-slate-200 h-14 flex items-center px-4 md:px-8 shrink-0 sticky top-0 z-20">
                <div className="relative w-full max-w-lg hidden sm:block">
                    <input type="text" placeholder="Buscar tutorías..." className="w-full h-9 pl-10 pr-4 bg-slate-50 rounded-lg text-xs border border-slate-200 outline-none focus:ring-1 focus:ring-blue-500" />
                    <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
                </div>
                <div className="sm:hidden font-black text-blue-600 italic tracking-tighter">EduBridge</div>
            </header>

            <div className="p-4 md:p-8 flex flex-col lg:flex-row gap-6 md:gap-8">
                <section className="flex-1 space-y-6 md:space-y-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-none tracking-tight">Sistema de Tutorías</h2>
                            <p className="text-slate-500 text-xs md:text-sm mt-2 font-medium">Gestión de sesiones sincrónicas y refuerzo académico</p>
                        </div>
                        <button className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 transition-all">+ Nueva Tutoría</button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        <KPICompact title="Hoy" value="4" icon="📅" color="bg-blue-50 text-blue-600" />
                        <KPICompact title="Activos" value="29" icon="👥" color="bg-emerald-50 text-emerald-600" />
                        <KPICompact title="Horas" value="147" icon="🕒" color="bg-purple-50 text-purple-600" />
                        <KPICompact title="Rating" value="4.8" icon="⭐" color="bg-amber-50 text-amber-600" />
                    </div>

                    <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                        <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar">
                            <button className="px-6 md:px-8 py-4 text-[10px] md:text-xs font-black uppercase tracking-widest text-blue-600 border-b-2 border-blue-600 whitespace-nowrap">Próximas Sesiones</button>
                            <button className="px-6 md:px-8 py-4 text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Historial</button>
                        </div>

                        <div className="p-4 md:p-6 space-y-4">
                            {sessions.map((session) => (
                                <div key={session.id} className="border border-slate-100 rounded-2xl p-4 md:p-6 hover:border-blue-200 transition-all bg-white group shadow-sm">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                                                {session.courseName[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm md:text-base">{session.courseName}</h4>
                                                <p className="text-[10px] md:text-xs text-slate-500 font-medium uppercase">{session.teacherName}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${session.status === 'Confirmada' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                            {session.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-[10px] md:text-xs text-slate-600 mb-6 font-medium">
                                        <div className="flex items-center gap-2">📅 Hoy, {new Date().toLocaleDateString()}</div>
                                        <div className="flex items-center gap-2">🕒 {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        <div className="flex items-center gap-2">👥 {session.studentCount}/12 alumnos</div>
                                        <div className="flex items-center gap-2">💻 Sesión Remota</div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={() => unirseASesion(session.courseName)}
                                            className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                                        >
                                            Unirse ahora
                                        </button>
                                        <button className="flex-1 sm:flex-none px-6 py-3 border border-slate-200 rounded-xl text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-colors">
                                            Detalles
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-slate-200 p-6 md:p-8 shadow-sm">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div>
                                <h3 className="font-black text-slate-900 text-base md:text-lg tracking-tight">Pizarra Virtual</h3>
                                <p className="text-slate-500 text-xs mt-1 font-medium">Herramienta colaborativa en tiempo real</p>
                            </div>
                            <button onClick={() => abrirPizarra('General')} className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-600/10">Abrir pizarra</button>
                        </div>
                        <div className="h-40 md:h-48 bg-slate-50 rounded-[2rem] border border-dashed border-slate-300 flex flex-col items-center justify-center text-center px-6">
                            <span className="text-3xl md:text-4xl mb-3">📖</span>
                            <p className="text-xs md:text-sm font-black text-slate-600 uppercase tracking-tighter">Comparte diagramas y ecuaciones</p>
                            <p className="text-[9px] md:text-[10px] mt-1 font-medium text-slate-400 italic">Activo para todas las sesiones sincrónicas</p>
                        </div>
                    </div>
                </section>

                <aside className="w-full lg:w-80 space-y-6">
                    <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
                        <h3 className="font-black text-slate-900 mb-6 text-[10px] uppercase tracking-widest">Consultas Frecuentes</h3>
                        <div className="space-y-3">
                            <FAQItem title="¿Cómo resolver ecuaciones diferenciales?" tag="Matemáticas" />
                            <FAQItem title="Diferencia entre enlace iónico y covalente" tag="Química" />
                            <FAQItem title="Cálculo de velocidad en MRU" tag="Física" />
                        </div>
                        <button className="w-full mt-6 bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95">Nueva Consulta</button>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-600/20">
                        <h3 className="font-black text-sm md:text-base tracking-tight mb-2">Asistencia Express</h3>
                        <p className="text-[10px] md:text-[11px] text-blue-100 mb-6 font-medium leading-relaxed">¿Necesitas ayuda urgente? Solicita una tutoría express con un profesor disponible ahora.</p>
                        <button className="w-full bg-white text-blue-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-all shadow-lg active:scale-95">Solicitar ahora</button>
                    </div>
                </aside>
            </div>
        </main>
    );
};

const KPICompact = ({ title, value, icon, color }) => (
    <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
        <div className="text-left">
            <p className="text-slate-400 text-[8px] md:text-[9px] font-black uppercase tracking-widest">{title}</p>
            <p className="text-base md:text-xl font-black text-slate-900">{value}</p>
        </div>
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-sm md:text-xl ${color}`}>{icon}</div>
    </div>
);

const FAQItem = ({ title, tag }) => (
    <div className="p-4 border border-slate-50 rounded-2xl hover:bg-slate-50 cursor-pointer group transition-all text-left">
        <p className="text-[11px] font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">{title}</p>
        <div className="flex justify-between items-center mt-3">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-lg">{tag}</span>
            <span className="text-xs opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all">→</span>
        </div>
    </div>
);

export default Tutorias;