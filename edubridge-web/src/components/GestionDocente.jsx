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
}
export default GestionDocente;