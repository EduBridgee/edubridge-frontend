import { useEffect, useState } from 'react';

const GestionDocente = () => {
    const [tasks, setTasks] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showReportModal, setShowReportModal] = useState(false);
    const [showAsistenciaModal, setShowAsistenciaModal] = useState(false);
    const [showStatsModal, setShowStatsModal] = useState(false);
    const [showNotifyModal, setShowNotifyModal] = useState(false); 

    const [selectedTask, setSelectedTask] = useState(null);
    const [asistencia, setAsistencia] = useState({});

    const [nuevaNotif, setNuevaNotif] = useState({
        studentId: '',
        type: 'Examen',
        message: ''
    });

    const cargarDatos = () => {
        Promise.all([
            fetch('https://edubridge-backend-2341.onrender.com/api/teacher-tasks').then(res => res.json()),
            fetch('https://edubridge-backend-2341.onrender.com/api/students').then(res => res.json())
        ]).then(([tasksData, studentsData]) => {
            setTasks(tasksData);
            setEstudiantes(studentsData);
            const init = {};
            studentsData.forEach(s => init[s.id] = true);
            setAsistencia(init);
            setLoading(false);
        }).catch(err => {
            console.error("Error sincronizando datos:", err);
            setLoading(false);
        });
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const abrirGenerador = (task) => {
        setSelectedTask(task);
        setShowReportModal(true);
    };

    const toggleCheck = (id) => {
        setAsistencia(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const guardarAsistencia = () => {
        alert("¡Asistencia sincronizada!");
        setShowAsistenciaModal(false);
    };

    const manejarEnvioNotificacion = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://edubridge-backend-2341.onrender.com/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevaNotif)
            });
            if (response.ok) {
                alert(`🔔 Notificación enviada correctamente.`);
                setShowNotifyModal(false);
                setNuevaNotif({ studentId: '', type: 'Examen', message: '' });
            }
        } catch (err) {
            console.error("Error al enviar notificación:", err);
        }
    };

    if (loading) return (
        <div className="md:ml-64 p-10 font-black text-slate-400 italic animate-pulse tracking-widest uppercase text-xs">
            Sincronizando con Servidor EduBridge...
        </div>
    );

    return (
        <main className="flex-1 md:ml-64 bg-[#F8FAFC] min-h-screen flex flex-col font-['Inter'] relative transition-all">
            <header className="bg-white border-b border-slate-200 h-14 flex items-center px-6 md:px-10 shrink-0 sticky top-0 z-20">
                <div className="relative w-full max-w-lg hidden sm:block">
                    <input type="text" placeholder="Buscar procesos..." className="w-full h-9 pl-10 pr-4 bg-slate-50 rounded-lg text-xs border border-slate-200 outline-none" />
                    <span className="absolute left-3 top-2 text-slate-400">🔍</span>
                </div>
                <div className="sm:hidden font-black text-blue-600 italic tracking-tighter">EduBridge</div>
            </header>

            <div className="p-4 md:p-8 flex flex-col lg:flex-row gap-6 md:gap-8 text-left">
                <section className="flex-1 space-y-6 md:space-y-8">
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-none uppercase tracking-tighter italic">Gestión Docente</h2>
                        <p className="text-slate-500 text-xs md:text-sm mt-2 font-medium">Control administrativo de EduBridge</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        <DocenteKPI title="Asistencia" value="98%" sub="+2.3%" color="text-emerald-600" bg="bg-emerald-50" icon="👥" />
                        <DocenteKPI title="Reportes" value={tasks.filter(t => t.status === 'Pendiente').length} sub="Espera" color="text-orange-600" bg="bg-orange-50" icon="📝" />
                        <DocenteKPI title="Clases" value="5" sub="Hoy" color="text-blue-600" bg="bg-blue-50" icon="📅" />
                        <DocenteKPI title="Ahorro" value="24h" sub="Auto" color="text-purple-600" bg="bg-purple-50" icon="🕒" />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                        <QuickAction title="Reporte" icon="📄" color="bg-blue-50 text-blue-600" onClick={() => abrirGenerador(tasks[0])} />
                        <QuickAction title="Lista" icon="👤" color="bg-emerald-50 text-emerald-600" onClick={() => setShowAsistenciaModal(true)} />
                        <QuickAction title="Stats" icon="📊" color="bg-purple-50 text-purple-600" onClick={() => setShowStatsModal(true)} />
                        <QuickAction title="Notificar" icon="🔔" color="bg-orange-50 text-orange-600" onClick={() => setShowNotifyModal(true)} />
                    </div>

                    <div className="bg-white rounded-[2rem] border border-slate-200 p-5 md:p-8 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-base md:text-lg mb-6 tracking-tight">Reportes Pendientes</h3>
                        <div className="space-y-6 md:space-y-8">
                            {tasks.map((task) => (
                                <ReportItem key={task.id} task={task} onClick={() => abrirGenerador(task)} />
                            ))}
                        </div>
                    </div>
                </section>

                <aside className="w-full lg:w-80 shrink-0 space-y-6">
                    <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-6 uppercase text-[10px] tracking-widest text-center">Horario de Hoy</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                            <ScheduleItem time="08:00 - 09:00" course="Matemáticas" room="Aula 201" completed />
                            <ScheduleItem time="10:00 - 11:00" course="Física" room="Lab 301" completed />
                        </div>
                    </div>
                    <div className="bg-blue-600 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-600/20">
                        <button onClick={() => window.print()} className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg active:scale-95 transition-transform">📥 Exportar PDF</button>
                    </div>
                </aside>
            </div>

            {showNotifyModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex justify-center items-end sm:items-center p-0 sm:p-4 text-left">
                    <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300">
                        <div className="p-6 md:p-8 border-b border-slate-100 bg-orange-50/30 flex justify-between items-center">
                            <div>
                                <h3 className="font-black text-slate-900 text-lg md:text-xl uppercase tracking-tighter italic">Notificar</h3>
                                <p className="text-[9px] font-bold text-orange-600 uppercase tracking-widest mt-1">Alerta directa al portal</p>
                            </div>
                            <button onClick={() => setShowNotifyModal(false)} className="text-slate-400 text-3xl font-light px-2">&times;</button>
                        </div>
                        <form onSubmit={manejarEnvioNotificacion} className="p-6 md:p-8 space-y-5">
                            <select required className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm" onChange={(e) => setNuevaNotif({ ...nuevaNotif, studentId: e.target.value })}>
                                <option value="">Elegir alumno...</option>
                                {estudiantes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            <div className="grid grid-cols-2 gap-2">
                                {['Examen', 'Tarea', 'Riesgo', 'Urgente'].map(tipo => (
                                    <button key={tipo} type="button" onClick={() => setNuevaNotif({ ...nuevaNotif, type: tipo })}
                                        className={`p-3 rounded-xl text-[10px] font-bold border ${nuevaNotif.type === tipo ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-slate-500'}`}>
                                        {tipo}
                                    </button>
                                ))}
                            </div>
                            <textarea required placeholder="Escribe el aviso..." className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm h-28 resize-none" onChange={(e) => setNuevaNotif({ ...nuevaNotif, message: e.target.value })}></textarea>
                            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Enviar Notificación 🚀</button>
                        </form>
                    </div>
                </div>
            )}

            {showAsistenciaModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex justify-center items-end sm:items-center p-0 sm:p-4">
                    <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-black text-xl uppercase tracking-tighter italic">Pase de Lista</h3>
                            <button onClick={() => setShowAsistenciaModal(false)} className="text-3xl px-2">&times;</button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
                            {estudiantes.map((alumno) => (
                                <div key={alumno.id} className={`flex items-center justify-between p-4 rounded-2xl border-2 ${asistencia[alumno.id] ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100 opacity-80'}`}>
                                    <span className="font-bold text-sm text-slate-800">{alumno.name.split(' ')[0]}</span>
                                    <button onClick={() => toggleCheck(alumno.id)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase ${asistencia[alumno.id] ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        {asistencia[alumno.id] ? 'Presente' : 'Falta'}
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 border-t"><button onClick={guardarAsistencia} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-xl">Confirmar Lista</button></div>
                    </div>
                </div>
            )}
        </main>
    );
};

const DocenteKPI = ({ title, value, sub, color, bg, icon }) => (
    <div className="bg-white p-3 md:p-5 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
        <div className="text-left">
            <p className="text-slate-400 text-[8px] md:text-[9px] font-bold uppercase tracking-widest">{title}</p>
            <p className="text-base md:text-xl font-black text-slate-900">{value}</p>
            <p className={`hidden md:block text-[10px] font-bold mt-1 ${color}`}>{sub}</p>
        </div>
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-sm md:text-lg ${bg} ${color}`}>{icon}</div>
    </div>
);

const QuickAction = ({ title, icon, color, onClick }) => (
    <div onClick={onClick} className={`p-4 md:p-6 rounded-2xl md:rounded-[28px] ${color} flex flex-col items-center justify-center gap-2 md:gap-4 cursor-pointer hover:scale-105 transition-all shadow-sm active:scale-95`}>
        <span className="text-2xl md:text-3xl">{icon}</span>
        <span className="text-[9px] md:text-[10px] font-black uppercase text-center leading-tight">{title}</span>
    </div>
);

const ReportItem = ({ task, onClick }) => (
    <div className="space-y-3 group">
        <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
                <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{task.title}</p>
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{task.tag}</p>
            </div>
            <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${task.status === 'Pendiente' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>{task.status}</span>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full" style={{ width: `${task.progress}%` }}></div>
            </div>
            <span className="text-[10px] font-black text-slate-700">{task.progress}%</span>
        </div>
        <button onClick={onClick} className="w-full bg-slate-50 text-slate-600 py-2.5 rounded-xl text-[9px] hover:bg-blue-600 hover:text-white transition-all font-black uppercase">Generar</button>
    </div>
);

const ScheduleItem = ({ time, course, room, completed }) => (
    <div className={`p-4 rounded-2xl border transition-all text-left ${completed ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-blue-100 shadow-sm'}`}>
        <p className="text-[9px] font-bold text-blue-600 mb-1">{time}</p>
        <p className="text-xs font-black text-slate-900 leading-none">{course}</p>
        <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">{room}</p>
    </div>
);

export default GestionDocente;