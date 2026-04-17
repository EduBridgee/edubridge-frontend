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
}
export default GestionDocente;