import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Student from './components/Student';
import Tutorias from './components/Tutorias';
import Recursos from './components/Recursos';
import GestionDocente from './components/GestionDocente';
import Login from './components/Login';

function App() {
  const [page, setPage] = useState('dashboard');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setPage('dashboard');
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen relative">
      <Sidebar
        setPage={setPage}
        currentPage={page}
        userRole={user.role}
        userName={user.name} 
        onLogout={handleLogout}
      />

      <div className="flex-1 w-full transition-all duration-300">
        {page === 'dashboard' && <Dashboard user={user} />}

        {user.role === 'docente' && (
          <>
            {page === 'estudiantes' && <Student />}
            {page === 'gestion' && <GestionDocente />}
          </>
        )}

        {page === 'tutorias' && <Tutorias user={user} />}
        {page === 'recursos' && <Recursos user={user} />}

        {user.role === 'estudiante' && (page === 'estudiantes' || page === 'gestion') && (
          <div className="md:ml-64 p-6 md:p-20 flex flex-col items-center justify-center min-h-screen text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-rose-50 text-rose-500 rounded-2xl md:rounded-3xl flex items-center justify-center text-2xl md:text-3xl mb-6 shadow-sm">
              🚫
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tighter italic">Acceso Restringido</h2>
            <p className="text-slate-400 text-xs md:text-sm mt-2 font-medium max-w-xs">
              Esta sección está reservada exclusivamente para el personal docente de EduBridge.
            </p>
            <button
              onClick={() => setPage('dashboard')}
              className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95"
            >
              Volver al Inicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;