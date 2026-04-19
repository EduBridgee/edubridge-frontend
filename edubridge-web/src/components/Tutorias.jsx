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

    if (loading) return <div className="ml-64 p-10 font-bold text-slate-400 text-sm">Sincronizando sesiones de tutoría...</div>;

    return (
        <main className="flex-1 ml-64 bg-[#F8FAFC] min-h-screen flex flex-col font-['Inter']">

            {/* HEADER */}
            <header className="bg-white border-b border-slate-200 h-14 flex items-center px-8 shrink-0 sticky top-0 z-20">
                <div className="relative w-full max-w-lg">
                    <input type="text" placeholder="Buscar tutorías, profesores..." className="w-full h-9 pl-10 pr-4 bg-slate-50 rounded-lg text-xs border border-slate-200" />
                    <span className="absolute left-3 top-2 text-slate-400">🔍</span>
                </div>
            </header>

            <div className="p-8 flex gap-8">

                {/* COLUMNA PRINCIPAL */}
                <section className="flex-1 space-y-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 leading-none">Sistema de Tutorías en Línea</h2>
                            <p className="text-slate-500 text-sm mt-2 font-medium">Gestión de sesiones sincrónicas y asincrónicas de refuerzo académico</p>
                        </div>
                        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-all">+ Nueva Tutoría</button>
                    </div>

                    {/* KPI CARDS TUTORIAS */}
                    <div className="grid grid-cols-4 gap-4">
                        <KPICompact title="Sesiones Hoy" value="4" icon="📅" color="bg-blue-50 text-blue-600" />
                        <KPICompact title="Estudiantes Activos" value="29" icon="👥" color="bg-emerald-50 text-emerald-600" />
                        <KPICompact title="Horas Totales" value="147" icon="🕒" color="bg-purple-50 text-purple-600" />
                        <KPICompact title="Satisfacción" value="4.8" icon="⭐" color="bg-amber-50 text-amber-600" />
                    </div>

                    {/* LISTADO DE SESIONES*/}
                    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="flex border-b border-slate-100">
                            <button className="px-8 py-4 text-sm font-bold text-blue-600 border-b-2 border-blue-600">Próximas Sesiones</button>
                            <button className="px-8 py-4 text-sm font-bold text-slate-400 hover:text-slate-600">Historial</button>
                        </div>

                        <div className="p-6 space-y-4">
                            {sessions.map((session) => (
                                <div key={session.id} className="border border-slate-100 rounded-2xl p-6 hover:border-blue-200 transition-all bg-white">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/20">
                                                {session.courseName[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{session.courseName}</h4>
                                                <p className="text-xs text-slate-500 font-medium">{session.teacherName}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${session.status === 'Confirmada' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                            {session.status.toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-3 text-xs text-slate-600 mb-6">
                                        <div className="flex items-center gap-2">📅 Hoy</div>
                                        <div className="flex items-center gap-2">🕒 {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} - 15:00</div>
                                        <div className="flex items-center gap-2">👥 {session.studentCount}/12 estudiantes</div>
                                        <div className="flex items-center gap-2">💻 Sesión sincrónica</div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => unirseASesion(session.courseName)}
                                            className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-600/10"
                                        >
                                            Unirse a sesión
                                        </button>
                                        <button className="px-6 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">
                                            Ver detalles
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* PIZARRA VIRTUAL */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">Pizarra Virtual</h3>
                                <p className="text-slate-500 text-xs mt-1 font-medium">Herramienta colaborativa para sesiones en vivo</p>
                            </div>
                            <button onClick={() => abrirPizarra('General')} className="bg-blue-600 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-600/10">Abrir pizarra</button>
                        </div>
                        <div className="h-48 bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-center px-10">
                            <span className="text-4xl mb-3">📖</span>
                            <p className="text-sm font-bold text-slate-600">Comparte diagramas, ecuaciones y conceptos en tiempo real</p>
                            <p className="text-[10px] mt-1 font-medium text-slate-400 italic">Disponible para todas las sesiones sincrónicas activas</p>
                        </div>
                    </div>
                </section>

                {/* COLUMNA DERECHA */}
                <aside className="w-80 shrink-0 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-widest">Consultas Frecuentes</h3>
                        <div className="relative mb-4">
                            <input type="text" placeholder="Buscar preguntas..." className="w-full h-9 pl-4 pr-4 bg-slate-50 rounded-lg text-[10px] border-none focus:ring-1 focus:ring-blue-100" />
                        </div>

                        <div className="space-y-3">
                            <FAQItem title="¿Cómo resolver ecuaciones diferenciales de segundo orden?" tag="Matemáticas" />
                            <FAQItem title="Diferencia entre enlace iónico y covalente" tag="Química" />
                            <FAQItem title="Cálculo de velocidad en MRU" tag="Física" />
                        </div>
                        <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-bold text-xs hover:bg-blue-700 transition-all">+ Nueva Consulta</button>
                    </div>

                    <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-600/30">
                        <h3 className="font-bold mb-2">Asistencia Inmediata</h3>
                        <p className="text-[11px] text-blue-100 mb-6 font-medium leading-relaxed">¿Necesitas ayuda urgente? Solicita una tutoría express con un profesor disponible ahora mismo.</p>
                        <button className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold text-xs hover:bg-blue-50 transition-colors shadow-lg">Solicitar tutoría express</button>
                    </div>
                </aside>
            </div>
        </main>
    );
};

const KPICompact = ({ title, value, icon, color }) => (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
        <div>
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">{title}</p>
            <p className="text-xl font-black text-slate-900">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${color}`}>{icon}</div>
    </div>
);

const FAQItem = ({ title, tag }) => (
    <div className="p-4 border border-slate-50 rounded-xl hover:bg-slate-50 cursor-pointer group transition-all">
        <p className="text-[11px] font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{title}</p>
        <div className="flex justify-between items-center mt-3">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">{tag}</span>
            <span className="text-xs opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all">→</span>
        </div>
    </div>
);

export default Tutorias;
