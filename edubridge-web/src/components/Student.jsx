import { useEffect, useState } from 'react';

const Student = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://edubridge-backend-2341.onrender.com/api/students')
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        if (data.length > 0) setSelectedStudent(data[0]); 
        setLoading(false);
      })
      .catch(err => console.error("Error:", err));
  }, []);

  if (loading) return <div className="ml-64 p-10 font-bold text-slate-400">Cargando base de datos de alumnos...</div>;

  return (
    <main className="flex-1 ml-64 bg-[#F8FAFC] h-screen overflow-hidden flex flex-col font-['Inter']">
      
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 h-14 flex items-center px-8 shrink-0">
        <div className="text-sm font-bold text-slate-400">Gestión de Estudiantes / Perfil Detallado</div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* LISTA DE ESTUDIANTES */}
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-4 space-y-3">
            <h2 className="text-xl font-black text-slate-900">Estudiantes</h2>
            <div className="relative">
              <input type="text" placeholder="Buscar por nombre..." className="w-full h-9 pl-9 pr-4 bg-slate-50 rounded-lg text-xs border border-slate-200" />
              <span className="absolute left-3 top-2.5 opacity-30 text-xs">🔍</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
            {students.map((s) => (
              <div 
                key={s.id} 
                onClick={() => setSelectedStudent(s)}
                className={`p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3 border ${
                  selectedStudent?.id === s.id 
                  ? 'bg-blue-50 border-blue-200 shadow-sm' 
                  : 'bg-white border-transparent hover:bg-slate-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                  s.riskLevel === 'Alto Riesgo' ? 'bg-rose-500' : s.riskLevel === 'Riesgo Medio' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}>
                  {s.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">{s.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium uppercase">{s.grade}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-black ${s.averageGrade >= 85 ? 'text-emerald-600' : s.averageGrade < 60 ? 'text-rose-600' : 'text-slate-600'}`}>
                    {s.averageGrade.toFixed(0)}
                  </p>
                  <p className="text-[8px] text-slate-400 font-bold uppercase">Promedio</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* DETALLE DEL ESTUDIANTE */}
        <section className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/50">
          {selectedStudent && (
            <>
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
                <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-emerald-500/20">
                  {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-black text-slate-900">{selectedStudent.name}</h3>
                  <p className="text-slate-500 font-medium flex items-center gap-4 mt-1">
                    <span>Grado: {selectedStudent.grade}</span>
                    <span className="opacity-30">|</span>
                    <span>✉️ {selectedStudent.email}</span>
                  </p>
                </div>
                <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-all">Editar Perfil</button>
              </div>

              {/* KPIs INDIVIDUALES */}
              <div className="grid grid-cols-3 gap-6">
                <MiniCard title="Promedio General" value={selectedStudent.averageGrade} icon="📚" color="blue" label="Rendimiento Actual" />
                <MiniCard title="Asistencia" value={`${selectedStudent.attendance}%`} icon="📅" color="emerald" label="Consistencia" />
                <MiniCard title="Estado Académico" value={selectedStudent.riskLevel === "Bajo Riesgo" ? "Excelente" : "En Observación"} icon="✅" color="violet" label="Estatus Final" />
              </div>

              {/* RENDIMIENTO POR MATERIA */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span> Rendimiento por Materia
                </h4>
                <div className="space-y-6">
                  <SubjectBar name="Matemáticas" value={95} color="bg-blue-500" />
                  <SubjectBar name="Física" value={90} color="bg-indigo-500" />
                  <SubjectBar name="Química" value={91} color="bg-emerald-500" />
                </div>
              </div>

              {/* ACTIVIDAD RECIENTE */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-6">Actividad Reciente</h4>
                <div className="space-y-4">
                   <ActivityItem text="Examen de Matemáticas - Aprobado" date="Hace 2 días" score="95/100" color="bg-emerald-500" />
                   <ActivityItem text="Sesión de tutoría completada" date="Hace 5 días" score="Mecánica Cuántica" color="bg-blue-500" />
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
};

// COMPONENTES AUXILIARES
const MiniCard = ({ title, value, icon, color, label }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
    <div className="flex justify-between items-start mb-2">
      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{title}</p>
      <span className="text-xl opacity-50">{icon}</span>
    </div>
    <h4 className="text-3xl font-black text-slate-900">{value}</h4>
    <p className="text-[10px] text-emerald-500 font-bold mt-1 uppercase">● {label}</p>
  </div>
);

const SubjectBar = ({ name, value, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm font-bold">
      <span className="text-slate-700">{name}</span>
      <span className="text-slate-900">{value}%</span>
    </div>
    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
      <div className={`${color} h-full transition-all duration-1000 shadow-inner`} style={{width: `${value}%`}}></div>
    </div>
  </div>
);

const ActivityItem = ({ text, date, score, color }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 bg-slate-50/30">
    <div className={`w-2 h-2 rounded-full ${color}`}></div>
    <div className="flex-1">
      <p className="text-sm font-bold text-slate-900">{text}</p>
      <p className="text-xs text-slate-500 font-medium">{date}</p>
    </div>
    <div className="text-right">
      <p className="text-xs font-black text-slate-700 uppercase">{score}</p>
    </div>
  </div>
);

export default Student;
