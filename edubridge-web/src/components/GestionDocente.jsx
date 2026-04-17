import { useEffect, useState } from 'react';

const GestionDocente = () => {
    const [tasks, setTasks] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para los Modales
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

    // 1. CARGA DE DATOS (Tareas y Alumnos)
    const cargarDatos = () => {
        Promise.all([
            fetch('http://localhost:8081/api/teacher-tasks').then(res => res.json()),
            fetch('http://localhost:8081/api/students').then(res => res.json())
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

    // 2. FUNCIONES DE LÓGICA
    const abrirGenerador = (task) => {
        setSelectedTask(task);
        setShowReportModal(true);
    };

    const toggleCheck = (id) => {
        setAsistencia(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const guardarAsistencia = () => {
        alert("¡Asistencia sincronizada con la base de datos!");
        setShowAsistenciaModal(false);
    };

    // FUNCIÓN PARA ENVIAR NOTIFICACIÓN REAL AL BACKEND
    const manejarEnvioNotificacion = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8081/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevaNotif)
            });

            if (response.ok) {
                alert(`🔔 Notificación enviada correctamente al alumno.`);
                setShowNotifyModal(false);
                setNuevaNotif({ studentId: '', type: 'Examen', message: '' });
            }
        } catch (err) {
            console.error("Error al enviar notificación:", err);
        }
    };

    if (loading) return (
        <div className="ml-64 p-10 font-black text-slate-400 italic animate-pulse tracking-widest uppercase text-xs">
            Sincronizando con Servidor EduBridge...
        </div>
    );

    return (
        <main className="flex-1 ml-64 bg-[#F8FAFC] min-h-screen flex flex-col font-['Inter'] relative">

            <header className="bg-white border-b border-slate-200 h-14 flex items-center px-10 shrink-0 sticky top-0 z-20">
                <div className="relative w-full max-w-lg">
                    <input type="text" placeholder="Buscar procesos, tareas..." className="w-full h-9 pl-10 pr-4 bg-slate-50 rounded-lg text-xs border border-slate-200 outline-none" />
                    <span className="absolute left-3 top-2 text-slate-400">🔍</span>
                </div>
            </header>

            <div className="p-8 flex gap-8 text-left">
                <section className="flex-1 space-y-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 leading-none uppercase tracking-tighter italic">Gestión Docente</h2>
                            <p className="text-slate-500 text-sm mt-2 font-medium">Control de tareas administrativas y reportes de ciclo</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        <DocenteKPI title="Asistencia Hoy" value="98.4%" sub="+2.3% vs ayer" color="text-emerald-600" bg="bg-emerald-50" icon="👥" />
                        <DocenteKPI title="Reportes" value={tasks.filter(t => t.status === 'Pendiente').length} sub="En espera" color="text-orange-600" bg="bg-orange-50" icon="📝" />
                        <DocenteKPI title="Clases Hoy" value="5" sub="Sincrónicas" color="text-blue-600" bg="bg-blue-50" icon="📅" />
                        <DocenteKPI title="Horas Ahorro" value="24h" sub="Automatización" color="text-purple-600" bg="bg-purple-50" icon="🕒" />
                    </div>

                    {/* ACCIONES RÁPIDAS */}
                    <div className="grid grid-cols-4 gap-4">
                        <QuickAction title="Generar Reporte" icon="📄" color="bg-blue-50 text-blue-600" onClick={() => abrirGenerador(tasks[0])} />
                        <QuickAction title="Tomar Asistencia" icon="👤" color="bg-emerald-50 text-emerald-600" onClick={() => setShowAsistenciaModal(true)} />
                        <QuickAction title="Ver Estadísticas" icon="📊" color="bg-purple-50 text-purple-600" onClick={() => setShowStatsModal(true)} />

                        {/* BOTÓN NOTIFICAR */}
                        <QuickAction title="Notificar" icon="🔔" color="bg-orange-50 text-orange-600" onClick={() => setShowNotifyModal(true)} />
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-lg mb-6">Reportes Pendientes en Servidor</h3>
                        <div className="space-y-8">
                            {tasks.map((task) => (
                                <ReportItem key={task.id} task={task} onClick={() => abrirGenerador(task)} />
                            ))}
                        </div>
                    </div>
                </section>

                <aside className="w-80 shrink-0 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-6 uppercase text-[11px] tracking-widest text-center">Horario de Hoy</h3>
                        <div className="space-y-3">
                            <ScheduleItem time="08:00 - 09:00" course="Matemáticas" room="Aula 201" completed />
                            <ScheduleItem time="10:00 - 11:00" course="Física" room="Lab 301" completed />
                        </div>
                    </div>
                    <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-600/30">
                        <h3 className="font-bold mb-2 uppercase text-[11px]">Exportar</h3>
                        <button onClick={() => window.print()} className="w-full bg-white text-blue-600 py-3 rounded-xl font-black text-[10px] uppercase shadow-lg">📥 PDF</button>
                    </div>
                </aside>
            </div>

            {/* MODAL 4: NOTIFICAR ALUMNO */}
            {showNotifyModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex justify-center items-center p-4 text-left">
                    <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-slate-100 bg-orange-50/30 flex justify-between items-center">
                            <div>
                                <h3 className="font-black text-slate-900 text-xl uppercase tracking-tighter italic">Lanzar Notificación</h3>
                                <p className="text-[9px] font-bold text-orange-600 uppercase tracking-widest mt-1">Alerta directa al portal del estudiante</p>
                            </div>
                            <button onClick={() => setShowNotifyModal(false)} className="text-slate-400 hover:text-rose-500 text-2xl font-light">×</button>
                        </div>

                        <form onSubmit={manejarEnvioNotificacion} className="p-8 space-y-5">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Seleccionar Estudiante</label>
                                <select
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-200 transition-all bg-white"
                                    onChange={(e) => setNuevaNotif({ ...nuevaNotif, studentId: e.target.value })}
                                >
                                    <option value="">Elegir alumno...</option>
                                    {estudiantes.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Tipo de Alerta</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Examen', 'Tarea', 'Riesgo Académico', 'Urgente'].map(tipo => (
                                        <button
                                            key={tipo}
                                            type="button"
                                            onClick={() => setNuevaNotif({ ...nuevaNotif, type: tipo })}
                                            className={`p-3 rounded-xl text-[10px] font-bold border transition-all ${nuevaNotif.type === tipo ? 'bg-orange-500 text-white border-orange-500 shadow-lg' : 'bg-white text-slate-500 border-slate-200'}`}
                                        >
                                            {tipo}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Mensaje</label>
                                <textarea
                                    required
                                    placeholder="Escribe el aviso..."
                                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm outline-none h-32 focus:ring-2 focus:ring-orange-200 transition-all resize-none"
                                    onChange={(e) => setNuevaNotif({ ...nuevaNotif, message: e.target.value })}
                                ></textarea>
                            </div>

                            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-orange-600 transition-all">
                                Enviar Notificación 🚀
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 1: REPORTE */}
            {showReportModal && selectedTask && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-10 space-y-8 text-left">
                            <div className="flex justify-between items-start border-b border-slate-100 pb-6">
                                <h2 className="text-2xl font-black text-blue-600 italic tracking-tighter">EduBridge Report</h2>
                                <div className="text-right text-[10px] font-bold text-slate-400 uppercase">
                                    <p>REF: #UPC-{selectedTask.id}X</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-xl font-black text-slate-800">{selectedTask.title}</h4>
                                <p className="text-sm text-slate-600 leading-relaxed font-medium">Documento generado desde PostgreSQL.</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100"><p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Estado</p><p className="font-black text-slate-700">{selectedTask.status}</p></div>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100"><p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Avance</p><p className="font-black text-slate-700">{selectedTask.progress}%</p></div>
                                </div>
                            </div>
                            <div className="pt-6 flex gap-4">
                                <button onClick={() => window.print()} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg">Imprimir</button>
                                <button onClick={() => setShowReportModal(false)} className="px-8 bg-slate-100 text-slate-400 py-4 rounded-2xl font-bold text-[10px] uppercase">Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 2: ASISTENCIA */}
            {showAsistenciaModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex justify-center items-center p-4">
                    <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-black text-xl uppercase tracking-tighter italic">Pase de Lista</h3>
                            <button onClick={() => setShowAsistenciaModal(false)} className="text-2xl">×</button>
                        </div>
                        <div className="p-8 max-h-[400px] overflow-y-auto space-y-3">
                            {estudiantes.map((alumno) => (
                                <div key={alumno.id} className={`flex items-center justify-between p-4 rounded-2xl transition-all border-2 ${asistencia[alumno.id] ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100 grayscale-[0.5] opacity-80'}`}>
                                    <span className="font-bold text-sm text-slate-800">{alumno.name}</span>
                                    <button onClick={() => toggleCheck(alumno.id)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase ${asistencia[alumno.id] ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        {asistencia[alumno.id] ? 'Asistió' : 'Faltó'}
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="p-8 border-t"><button onClick={guardarAsistencia} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-xl shadow-blue-600/20">Confirmar Cambios</button></div>
                    </div>
                </div>
            )}

            {/* MODAL 3: ESTADÍSTICAS */}
            {showStatsModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex justify-center items-center p-4 text-left">
                    <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-10 space-y-6">
                            <h3 className="text-xl font-black uppercase italic border-b pb-4 text-slate-800">Analítica Académica</h3>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="p-4 bg-blue-50 rounded-2xl"><p className="text-[10px] font-black text-blue-600 uppercase">Promedio</p><p className="text-2xl font-black">16.4</p></div>
                                <div className="p-4 bg-emerald-50 rounded-2xl"><p className="text-[10px] font-black text-emerald-600 uppercase">Aprobados</p><p className="text-2xl font-black">92%</p></div>
                                <div className="p-4 bg-orange-50 rounded-2xl"><p className="text-[10px] font-black text-orange-600 uppercase">Riesgo</p><p className="text-2xl font-black">8%</p></div>
                            </div>
                            <div className="space-y-4">
                                <StatBar label="Pensamiento Crítico" value={85} color="bg-blue-500" />
                                <StatBar label="Razonamiento Cuantitativo" value={72} color="bg-purple-500" />
                                <StatBar label="Comunicación Escrita" value={94} color="bg-emerald-500" />
                            </div>
                            <button onClick={() => setShowStatsModal(false)} className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold uppercase text-xs mt-6">Cerrar Dashboard</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};
export default GestionDocente;