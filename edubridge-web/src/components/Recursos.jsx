import { useEffect, useState } from 'react';

const Recursos = () => {
    const [recursos, setRecursos] = useState([]);
    const [filteredRecursos, setFilteredRecursos] = useState([]);
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [favoritos, setFavoritos] = useState([]);

    // Estados para el Modal
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

    // Lógica de Filtrado por Categoría
    useEffect(() => {
        if (activeFilter === 'Todos') {
            setFilteredRecursos(recursos);
        } else {
            const typeMap = { 'Documentos': 'PDF', 'Videos': 'Video', 'Quizzes': 'Quiz' };
            const filterValue = typeMap[activeFilter] || activeFilter;
            setFilteredRecursos(recursos.filter(r => r.type === filterValue));
        }
    }, [activeFilter, recursos]);

    // Función de búsqueda en el Header
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
        <main className="flex-1 ml-64 bg-[#F8FAFC] min-h-screen flex flex-col font-['Inter'] relative">

            <header className="bg-white border-b border-slate-200 h-14 flex items-center px-10 shrink-0 sticky top-0 z-20">
                <div className="relative w-full max-w-lg">
                    <input
                        type="text"
                        placeholder="Buscar recursos..."
                        className="w-full h-9 pl-10 pr-4 bg-slate-50 rounded-lg text-xs border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none"
                        onChange={(e) => buscarRecursos(e.target.value)}
                    />
                    <span className="absolute left-3 top-2 text-slate-400">🔍</span>
                </div>
            </header>

            <div className="p-8 flex gap-8">
                <section className="flex-1 space-y-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 leading-none">Gestión de Recursos</h2>
                            <p className="text-slate-500 text-sm mt-2 font-medium">Repositorio inteligente de materiales académicos.</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center gap-2"
                        >
                            <span>📤</span> Subir Recurso
                        </button>
                    </div>

                    {/* KPIs DINÁMICOS */}
                    <div className="grid grid-cols-4 gap-4">
                        <ResourceKPI title="Recursos Totales" value={recursos.length} color="text-blue-600" bg="bg-blue-50" icon="📂" />
                        <ResourceKPI title="Descargas (mes)" value="1.847" color="text-emerald-600" bg="bg-emerald-50" icon="📥" />
                        <ResourceKPI title="Vídeos" value={recursos.filter(r => r.type === 'Video').length} color="text-purple-600" bg="bg-purple-50" icon="🎬" />
                        <ResourceKPI title="Calificación" value="4.7" color="text-amber-600" bg="bg-amber-50" icon="⭐" />
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-2">
                            {['Todos', 'Documentos', 'Videos', 'Quizzes'].map(f => (
                                <button key={f} onClick={() => setActiveFilter(f)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${activeFilter === f ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
                                    {f}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-6 pb-10">
                            {filteredRecursos.length > 0 ? (
                                filteredRecursos.map((item) => (
                                    <div key={item.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all group">
                                        <div className="h-44 relative overflow-hidden">
                                            <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute top-4 left-4">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 shadow-sm ${item.type === 'PDF' ? 'bg-white text-rose-600' : 'bg-white text-blue-600'}`}>
                                                    {item.type === 'PDF' ? '📄 PDF' : item.type === 'Video' ? '🎬 VIDEO' : '📝 QUIZ'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6 space-y-3">
                                            <div className="h-20">
                                                <span className="text-blue-600 text-[10px] font-black uppercase tracking-widest">{item.subject}</span>
                                                <h4 className="font-bold text-slate-900 text-lg leading-tight mt-1">{item.title}</h4>
                                                <p className="text-slate-500 text-[10px] mt-1 line-clamp-1">{item.meta}</p>
                                            </div>

                                            <div className="flex gap-2 pt-2">
                                                <button onClick={() => manejarAccion(item)} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 shadow-md">
                                                    {item.type === 'Video' ? 'Ver ahora' : 'Descargar'}
                                                </button>
                                                <button onClick={() => toggleFavorito(item.id)} className={`w-12 h-10 border rounded-xl transition-all ${favoritos.includes(item.id) ? 'text-amber-500 bg-amber-50' : 'text-slate-300'}`}>★</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="col-span-2 text-center py-10 text-slate-400 font-medium italic">No se encontraron recursos disponibles.</p>
                            )}
                        </div>
                    </div>
                </section>

                <aside className="w-80 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-6 text-xs uppercase tracking-widest">Actividad Reciente</h3>
                        <div className="space-y-6">
                            <ActivityItem name="Arless" action="descargó Guía de Cálculo" time="Ahora" color="bg-blue-500" />
                            <ActivityItem name="Ana S." action="completó Quiz de Álgebra" time="Hace 12 min" color="bg-purple-500" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-600/20">
                        <h3 className="font-bold mb-2">Contribuye</h3>
                        <p className="text-[11px] text-blue-100 mb-6 font-medium">Comparte tus materiales con la comunidad de EduBridge.</p>
                        <button onClick={() => setShowModal(true)} className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold text-xs hover:bg-blue-50">Subir ahora</button>
                    </div>
                </aside>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-black text-slate-900 text-lg">Nuevo Recurso Académico</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl font-bold">×</button>
                        </div>

                        <form onSubmit={manejarEnvio} className="p-6 space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Título del Material</label>
                                <input required type="text" className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                                       onChange={(e) => setNuevoRecurso({ ...nuevoRecurso, title: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Tipo</label>
                                    <select className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-white"
                                            onChange={(e) => setNuevoRecurso({ ...nuevoRecurso, type: e.target.value })}>
                                        <option value="PDF">Documento PDF</option>
                                        <option value="Video">Video Clase</option>
                                        <option value="Quiz">Cuestionario</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Materia</label>
                                    <select className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-white"
                                            onChange={(e) => setNuevoRecurso({ ...nuevoRecurso, subject: e.target.value })}>
                                        <option value="Matemáticas">Matemáticas</option>
                                        <option value="Física">Física</option>
                                        <option value="Informática">Informática</option>
                                        <option value="Química">Química</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all mt-4">
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
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">{title}</p>
            <p className={`text-xl font-black ${color}`}>{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${bg} ${color}`}>{icon}</div>
    </div>
);

const ActivityItem = ({ name, action, time, color }) => (
    <div className="flex gap-3 items-center">
        <div className={`w-8 h-8 rounded-full ${color} shrink-0 flex items-center justify-center text-white text-[10px] font-bold`}>{name[0]}</div>
        <div>
            <p className="text-[11px] font-bold text-slate-800 leading-tight"><span className="text-blue-600">{name}</span> {action}</p>
            <p className="text-[10px] text-slate-400 font-medium">{time}</p>
        </div>
    </div>
);

export default Recursos;
