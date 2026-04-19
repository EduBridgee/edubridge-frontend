import { useEffect, useState } from 'react';

const Recursos = () => {
    const [recursos, setRecursos] = useState([]);
    const [filteredRecursos, setFilteredRecursos] = useState([]);
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [favoritos, setFavoritos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [nuevoRecurso, setNuevoRecurso] = useState({
        title: '',
        subject: 'Matemáticas',
        type: 'PDF',
        meta: 'Material académico',
        img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
        stats: '0 descargas • 1.0 MB',
        rating: 5.0
    });

    const cargarDatos = () => {
        fetch('https://edubridge-backend-2341.onrender.com/api/resources')
            .then(res => res.json())
            .then(data => {
                setRecursos(data);
                setFilteredRecursos(data);
            })
            .catch(err => console.error("Error cargando recursos:", err));
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    useEffect(() => {
        if (activeFilter === 'Todos') {
            setFilteredRecursos(recursos);
        } else {
            const typeMap = { 'Documentos': 'PDF', 'Videos': 'Video', 'Quizzes': 'Quiz' };
            const filterValue = typeMap[activeFilter] || activeFilter;
            setFilteredRecursos(recursos.filter(r => r.type === filterValue));
        }
    }, [activeFilter, recursos]);

    const buscarRecursos = (termino) => {
        const busqueda = termino.toLowerCase();
        setFilteredRecursos(
            recursos.filter(r =>
                r.title.toLowerCase().includes(busqueda) ||
                r.subject.toLowerCase().includes(busqueda)
            )
        );
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://edubridge-backend-2341.onrender.com/api/resources', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoRecurso)
            });
            if (response.ok) {
                setShowModal(false);
                cargarDatos();
            }
        } catch (err) {
            console.error("Error al subir:", err);
        }
    };

    const manejarAccion = (recurso) => {
        window.open(recurso.type === 'Video' ? `https://www.youtube.com/results?search_query=${recurso.title}` : recurso.img, '_blank');
    };

    const toggleFavorito = (id) => {
        setFavoritos(favoritos.includes(id) ? favoritos.filter(favId => favId !== id) : [...favoritos, id]);
    };

    return (
        <main className="flex-1 md:ml-64 bg-[#F8FAFC] min-h-screen flex flex-col font-['Inter'] relative transition-all">
            <header className="bg-white border-b border-slate-200 h-14 flex items-center px-6 md:px-10 shrink-0 sticky top-0 z-20">
                <div className="relative w-full max-w-lg hidden sm:block">
                    <input
                        type="text"
                        placeholder="Buscar recursos..."
                        className="w-full h-9 pl-10 pr-4 bg-slate-50 rounded-lg text-xs border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none"
                        onChange={(e) => buscarRecursos(e.target.value)}
                    />
                    <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
                </div>
                <div className="sm:hidden font-black text-blue-600 italic tracking-tighter">EduBridge</div>
            </header>

            <div className="p-4 md:p-8 flex flex-col lg:flex-row gap-6 md:gap-8">
                <section className="flex-1 space-y-6 md:space-y-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-none">Gestión de Recursos</h2>
                            <p className="text-slate-500 text-xs md:text-sm mt-2 font-medium">Repositorio inteligente de materiales académicos.</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex justify-center items-center gap-2"
                        >
                            <span>📤</span> Subir Recurso
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        <ResourceKPI title="Total" value={recursos.length} color="text-blue-600" bg="bg-blue-50" icon="📂" />
                        <ResourceKPI title="Descargas" value="1.8k" color="text-emerald-600" bg="bg-emerald-50" icon="📥" />
                        <ResourceKPI title="Vídeos" value={recursos.filter(r => r.type === 'Video').length} color="text-purple-600" bg="bg-purple-50" icon="🎬" />
                        <ResourceKPI title="Rating" value="4.7" color="text-amber-600" bg="bg-amber-50" icon="⭐" />
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {['Todos', 'Documentos', 'Videos', 'Quizzes'].map(f => (
                                <button key={f} onClick={() => setActiveFilter(f)} className={`px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold transition-all border shrink-0 ${activeFilter === f ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'}`}>
                                    {f}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pb-10">
                            {filteredRecursos.length > 0 ? (
                                filteredRecursos.map((item) => (
                                    <div key={item.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all group">
                                        <div className="h-40 md:h-44 relative overflow-hidden">
                                            <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute top-4 left-4">
                                                <span className="px-3 py-1 bg-white rounded-lg text-[9px] font-black uppercase shadow-sm">
                                                    {item.type === 'PDF' ? '📄 PDF' : item.type === 'Video' ? '🎬 VIDEO' : '📝 QUIZ'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-5 md:p-6 space-y-3">
                                            <div className="h-16 md:h-20">
                                                <span className="text-blue-600 text-[9px] font-black uppercase tracking-widest">{item.subject}</span>
                                                <h4 className="font-bold text-slate-900 text-sm md:text-base leading-tight mt-1 line-clamp-2">{item.title}</h4>
                                                <p className="text-slate-500 text-[10px] mt-1 line-clamp-1">{item.meta}</p>
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                                <button onClick={() => manejarAccion(item)} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-bold text-xs md:text-sm hover:bg-blue-700 transition-colors">
                                                    {item.type === 'Video' ? 'Ver' : 'Descargar'}
                                                </button>
                                                <button onClick={() => toggleFavorito(item.id)} className={`w-12 h-10 border rounded-xl transition-all flex items-center justify-center ${favoritos.includes(item.id) ? 'text-amber-500 bg-amber-50 border-amber-200' : 'text-slate-300'}`}>★</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="col-span-full text-center py-10 text-slate-400 font-medium italic text-sm">No se encontraron recursos.</p>
                            )}
                        </div>
                    </div>
                </section>

                <aside className="w-full lg:w-80 space-y-6">
                    <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-6 text-[10px] uppercase tracking-widest">Actividad Reciente</h3>
                        <div className="space-y-5 md:space-y-6">
                            <ActivityItem name="Arless" action="descargó Cálculo" time="Ahora" color="bg-blue-500" />
                            <ActivityItem name="Ana S." action="completó Quiz" time="12 min" color="bg-purple-500" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-600/20">
                        <h3 className="font-bold mb-2 text-sm md:text-base">Contribuye</h3>
                        <p className="text-[10px] md:text-[11px] text-blue-100 mb-6 font-medium">Comparte tus materiales con la comunidad.</p>
                        <button onClick={() => setShowModal(true)} className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold text-xs active:scale-95 transition-transform">Subir ahora</button>
                    </div>
                </aside>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-end sm:items-center p-0 sm:p-4">
                    <div className="bg-white w-full max-w-md rounded-t-[2rem] sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-black text-slate-900 text-lg">Nuevo Recurso</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 text-2xl font-light px-2">×</button>
                        </div>
                        <form onSubmit={manejarEnvio} className="p-6 space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Título</label>
                                <input required type="text" className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                                       onChange={(e) => setNuevoRecurso({ ...nuevoRecurso, title: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Tipo</label>
                                    <select className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-white"
                                            onChange={(e) => setNuevoRecurso({ ...nuevoRecurso, type: e.target.value })}>
                                        <option value="PDF">PDF</option>
                                        <option value="Video">Video Clase</option>
                                        <option value="Quiz">Quiz</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Materia</label>
                                    <select className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-white"
                                            onChange={(e) => setNuevoRecurso({ ...nuevoRecurso, subject: e.target.value })}>
                                        <option value="Matemáticas">Matemáticas</option>
                                        <option value="Física">Física</option>
                                        <option value="Informática">Informática</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-700 mt-4">
                                Guardar en Repositorio
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

const ResourceKPI = ({ title, value, color, bg, icon }) => (
    <div className="bg-white p-3 md:p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="text-left">
            <p className="text-slate-400 text-[8px] md:text-[9px] font-bold uppercase tracking-widest">{title}</p>
            <p className={`text-base md:text-xl font-black ${color}`}>{value}</p>
        </div>
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-sm md:text-lg ${bg} ${color}`}>{icon}</div>
    </div>
);

const ActivityItem = ({ name, action, time, color }) => (
    <div className="flex gap-3 items-center text-left">
        <div className={`w-8 h-8 rounded-full ${color} shrink-0 flex items-center justify-center text-white text-[10px] font-bold`}>{name[0]}</div>
        <div className="min-w-0">
            <p className="text-[10px] md:text-[11px] font-bold text-slate-800 leading-tight truncate"><span className="text-blue-600">{name}</span> {action}</p>
            <p className="text-[9px] md:text-[10px] text-slate-400 font-medium">{time}</p>
        </div>
    </div>
);

export default Recursos;