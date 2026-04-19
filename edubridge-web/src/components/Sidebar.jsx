import { useState } from 'react';

const Sidebar = ({ setPage, currentPage, userRole, onLogout, userName }) => {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { name: 'Dashboard', id: 'dashboard', icon: '📊', roles: ['docente', 'estudiante'] },
        { name: 'Estudiantes', id: 'estudiantes', icon: '🎓', roles: ['docente'] },
        { name: 'Tutorías', id: 'tutorias', icon: '📅', roles: ['docente', 'estudiante'] },
        { name: 'Recursos', id: 'recursos', icon: '📖', roles: ['docente', 'estudiante'] },
        { name: 'Gestión Docente', id: 'gestion', icon: '⚙️', roles: ['docente'] },
    ];

    const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

    const getInitials = (name) => {
        if (!name) return '??';
        const parts = name.split(' ');
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return parts[0][0].toUpperCase();
    };

    const handleNavigation = (id) => {
        setPage(id);
        setIsOpen(false);
    };

    return (
        <>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-3 left-4 z-50 p-2 bg-[#0F172A] text-white rounded-lg shadow-lg border border-slate-700"
            >
                {isOpen ? '✕' : '☰'}
            </button>

            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div className={`
                fixed left-0 top-0 h-screen w-64 bg-[#0F172A] text-slate-300 z-40 shadow-2xl flex flex-col transition-transform duration-300
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
                        E
                    </div>
                    <div>
                        <h1 className="font-bold text-white text-lg leading-none tracking-tight">EduBridge</h1>
                        <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-md mt-1 inline-block ${
                            userRole === 'docente' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                            Portal {userRole}
                        </span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
                    {filteredMenu.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleNavigation(item.id)}
                            className={`flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 group ${
                                currentPage === item.id
                                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                                    : 'hover:bg-slate-800/50 hover:text-white'
                            }`}
                        >
                            <span className={`text-lg transition-transform duration-300 ${currentPage === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                                {item.icon}
                            </span>
                            <span className="font-semibold text-sm tracking-tight">{item.name}</span>
                        </div>
                    ))}
                </nav>

                <div className="p-6 bg-slate-900/40 border-t border-slate-800/50 space-y-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-xs font-black border border-white/10 shadow-lg shrink-0">
                            {getInitials(userName)}
                        </div>
                        <div className="overflow-hidden text-left">
                            <p className="text-xs font-bold text-white truncate leading-none mb-1">
                                {userName || 'Cargando...'}
                            </p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic opacity-70">
                                {userRole}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-800/50 hover:bg-rose-500/10 hover:text-rose-500 transition-all text-[10px] font-black uppercase tracking-[0.2em] border border-slate-700/50 hover:border-rose-500/30 group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">Logout</span>
                        <span className="text-sm">🚪</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;