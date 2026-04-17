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

}
export default GestionDocente;