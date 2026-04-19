import { useEffect, useState } from 'react';

const Student = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showList, setShowList] = useState(true);

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

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    if (window.innerWidth < 1024) setShowList(false);
  };

  if (loading) return <div className="md:ml-64 p-10 font-black text-slate-400 italic animate-pulse">Sincronizando base de datos...</div>;

  return (
    <main className="flex-1 md:ml-64 bg-[#F8FAFC] min-h-screen flex flex-col font-['Inter']">
      <header className="bg-white border-b border-slate-200 h-14 flex items-center px-4 md:px-8 shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          {!showList && (
            <button onClick={() => setShowList(true)} className="lg:hidden text-blue-600 font-bold text-sm pr-2">← Volver</button>
          )}
          <div className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-widest">Gestión / Perfil Alumno</div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <aside className={`
          absolute inset-0 z-10 lg:relative lg:translate-x-0 transition-transform duration-300
          w-full lg:w-80 bg-white border-r border-slate-200 flex flex-col shrink-0
          ${showList ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-4 space-y-3">
            <h2 className="text-xl font-black text-slate-900 tracking-tighter italic">Estudiantes</h2>
            <div className="relative">
              <input type="text" placeholder="Buscar alumno..." className="w-full h-9 pl-9 pr-4 bg-slate-50 rounded-lg text-xs border border-slate-200 outline-none focus:ring-1 focus:ring-blue-500" />
              <span className="absolute left-3 top-2.5 opacity-30 text-xs">🔍</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
            {students.map((s) => (
              <div 
                key={s.id} 
                onClick={() => handleSelectStudent(s)}
                className={`p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3 border ${
                  selectedStudent?.id === s.id 
                  ? 'bg-blue-50 border-blue-200 shadow-sm' 
                  : 'bg-white border-transparent hover:bg-slate-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${
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
                  <p className="text-[8px] text-slate-400 font-bold uppercase">Nota</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <section className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 bg-slate-50/50">
          {selectedStudent && (
            <>
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-emerald-500/20 shrink-0">
                  {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{selectedStudent.name}</h3>
                  <div className="text-slate-500 font-medium text-xs md:text-sm flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-1">
                    <span>Grado: {selectedStudent.grade}</span>
                    <span className="hidden md:block opacity-30">|</span>
                    <span className="truncate">✉️ {selectedStudent.email}</span>
                  </div>
                </div>
                <button className="w-full md:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all">Editar</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                <MiniCard title="Promedio" value={selectedStudent.averageGrade} icon="📚" color="blue" label="General" />
                <MiniCard title="Asistencia" value={`${selectedStudent.attendance}%`} icon="📅" color="emerald" label="Consistencia" />
                <MiniCard title="Estado" value={selectedStudent.riskLevel === "Bajo Riesgo" ? "Óptimo" : "Alerta"} icon="✅" color="violet" label="Académico" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span> Materias
                  </h4>
                  <div className="space-y-6">
                    <SubjectBar name="Matemáticas" value={95} color="bg-blue-500" />
                    <SubjectBar name="Física" value={90} color="bg-indigo-500" />
                    <SubjectBar name="Química" value={91} color="bg-emerald-500" />
                  </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-6">Actividad</h4>
                  <div className="space-y-4">
                     <ActivityItem text="Examen Matemáticas" date="2 días" score="95/100" color="bg-emerald-500" />
                     <ActivityItem text="Tutoría Física" date="5 días" score="Pendiente" color="bg-blue-500" />
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
};

const MiniCard = ({ title, value, icon, color, label }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
    <div className="flex justify-between items-start mb-2">
      <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">{title}</p>
      <span className="text-xl opacity-30">{icon}</span>
    </div>
    <h4 className="text-2xl font-black text-slate-900 tracking-tighter">{value}</h4>
    <p className="text-[9px] text-emerald-500 font-black mt-1 uppercase leading-none italic">● {label}</p>
  </div>
);

const SubjectBar = ({ name, value, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs font-black uppercase tracking-tighter">
      <span className="text-slate-700">{name}</span>
      <span className="text-slate-900">{value}%</span>
    </div>
    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
      <div className={`${color} h-full transition-all duration-1000`} style={{width: `${value}%`}}></div>
    </div>
  </div>
);

const ActivityItem = ({ text, date, score, color }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
    <div className={`w-2 h-2 rounded-full shrink-0 ${color}`}></div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-bold text-slate-900 truncate">{text}</p>
      <p className="text-[10px] text-slate-400 font-medium">{date}</p>
    </div>
    <p className="text-[10px] font-black text-slate-700 uppercase shrink-0">{score}</p>
  </div>
);

export default Student;