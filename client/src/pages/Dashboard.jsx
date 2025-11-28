import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import AdminDashboard from './AdminDashboard';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTask, setActiveTask] = useState(null);

    useEffect(() => {
        if (user) {
            fetchData();
        }
        const storedTask = localStorage.getItem('activeTask');
        if (storedTask) {
            setActiveTask(JSON.parse(storedTask));
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const attendanceRes = await axios.get(`${API_URL}/attendance/status`, config);
            setAttendance(attendanceRes.data);

            const tasksRes = await axios.get(`${API_URL}/tasks`, config);
            setTasks(tasksRes.data);
        } catch (error) {
            console.error('Error fetching data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.post(`${API_URL}/attendance/checkin`, {}, config);
            setAttendance(res.data);
        } catch (error) {
            alert(error.response?.data?.message || 'Check-in failed');
        }
    };

    const handleCheckOut = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.post(`${API_URL}/attendance/checkout`, {}, config);
            setAttendance(res.data);
        } catch (error) {
            alert(error.response?.data?.message || 'Check-out failed');
        }
    };

    const handleStartTask = async (taskId) => {
        if (activeTask) {
            alert('Please stop the current task first.');
            return;
        }

        // If reworking, update status on backend immediately to reflect "in-progress" and reset adminStatus
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${API_URL}/tasks/${taskId}`, {
                status: 'in-progress'
            }, config);

            const startTime = new Date().toISOString();
            const task = { taskId, startTime };
            setActiveTask(task);
            localStorage.setItem('activeTask', JSON.stringify(task));
            fetchData();
        } catch (error) {
            console.error('Error starting task', error);
            alert('Failed to start task');
        }
    };

    const handleStopTask = async (taskId) => {
        if (!activeTask || activeTask.taskId !== taskId) return;

        const endTime = new Date().toISOString();
        const startTime = activeTask.startTime;
        const duration = (new Date(endTime) - new Date(startTime)) / 60000; // minutes

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.put(`${API_URL}/tasks/${taskId}`, {
                timeLog: { startTime, endTime, duration },
                status: 'in-progress'
            }, config);

            setActiveTask(null);
            localStorage.removeItem('activeTask');
            fetchData(); // Refresh tasks
        } catch (error) {
            console.error('Error stopping task', error);
            alert('Failed to save time log');
        }
    };

    const handleCompleteTask = async (taskId) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${API_URL}/tasks/${taskId}`, {
                status: 'completed'
            }, config);
            fetchData();
        } catch (error) {
            alert('Failed to complete task');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#f8f8f8] text-[#111] font-sans overflow-x-hidden">
            {/* Parallax Header Background */}
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="fixed top-0 left-0 w-full h-64 bg-gradient-to-b from-gray-200 to-transparent -z-10"
            />

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <motion.h1
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="text-5xl font-bold tracking-tighter mb-2"
                        >
                            Work Tracker Dashboard
                        </motion.h1>
                        <motion.p
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-500 text-lg"
                        >
                            Welcome back, <span className="text-black font-semibold">{user?.name}</span>
                        </motion.p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors shadow-lg"
                    >
                        Logout
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Attendance Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-8"
                    >
                        <h2 className="text-2xl font-bold mb-6 tracking-tight">Attendance</h2>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <span className="text-gray-500">Date</span>
                                <span className="font-medium">{new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <span className="text-gray-500">Status</span>
                                <span className={`px-3 py-1 rounded-full text-sm ${attendance?.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {attendance?.status || 'Absent'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Check In</p>
                                    <p className="font-mono text-lg">{attendance?.checkInTime ? new Date(attendance.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Check Out</p>
                                    <p className="font-mono text-lg">{attendance?.checkOutTime ? new Date(attendance.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</p>
                                </div>
                            </div>

                            <div className="pt-4">
                                {!attendance?.checkInTime ? (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleCheckIn}
                                        className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-all font-medium"
                                    >
                                        Check In
                                    </motion.button>
                                ) : !attendance?.checkOutTime ? (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleCheckOut}
                                        className="w-full py-3 bg-white border-2 border-black text-black rounded-xl hover:bg-gray-50 transition-all font-medium"
                                    >
                                        Check Out
                                    </motion.button>
                                ) : (
                                    <div className="w-full py-3 bg-gray-100 text-gray-500 rounded-xl text-center font-medium">
                                        Day Completed
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Tasks Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl font-bold tracking-tight"
                        >
                            My Tasks
                        </motion.h2>

                        {tasks.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white p-12 rounded-2xl border border-gray-100 text-center text-gray-400"
                            >
                                No tasks assigned yet.
                            </motion.div>
                        ) : (
                            <div className="space-y-4">
                                {tasks.map((task, index) => (
                                    <motion.div
                                        key={task._id}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        whileHover={{ scale: 1.02, boxShadow: "0 10px 20px -10px rgba(0,0,0,0.05)" }}
                                        transition={{ delay: 0.1 * index }}
                                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all group"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-3">
                                                    <h3 className="font-bold text-xl group-hover:text-gray-700 transition-colors">{task.title}</h3>
                                                    <span className={`px-2 py-0.5 text-xs rounded-full border ${task.status === 'completed' ? 'border-green-200 text-green-700 bg-green-50' :
                                                        task.status === 'in-progress' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                                                            'border-gray-200 text-gray-600 bg-gray-50'
                                                        }`}>
                                                        {task.status}
                                                    </span>
                                                    {task.status === 'completed' && (
                                                        <span className={`px-2 py-0.5 text-xs rounded-full border ${task.adminStatus === 'approved' ? 'border-green-500 bg-green-500 text-white' :
                                                            task.adminStatus === 'rejected' ? 'border-red-500 bg-red-500 text-white' :
                                                                'border-yellow-500 bg-yellow-500 text-white'
                                                            }`}>
                                                            {task.adminStatus === 'approved' ? 'Sanctioned' :
                                                                task.adminStatus === 'rejected' ? 'Rejected' : 'Pending Approval'}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-500 leading-relaxed">{task.description}</p>
                                            </div>

                                            {user?.role !== 'admin' && (
                                                <div className="flex flex-col space-y-2 min-w-[120px]">
                                                    {activeTask?.taskId === task._id ? (
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => handleStopTask(task._id)}
                                                            className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 font-medium shadow-sm"
                                                        >
                                                            Stop Timer
                                                        </motion.button>
                                                    ) : (
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => handleStartTask(task._id)}
                                                            disabled={!!activeTask || (task.status === 'completed' && task.adminStatus !== 'rejected')}
                                                            className={`px-4 py-2 text-sm rounded-lg font-medium shadow-sm transition-all ${!!activeTask || (task.status === 'completed' && task.adminStatus !== 'rejected')
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                : 'bg-black text-white hover:bg-gray-800'
                                                                }`}
                                                        >
                                                            {task.adminStatus === 'rejected' ? 'Rework' : 'Start Timer'}
                                                        </motion.button>
                                                    )}

                                                    {task.status !== 'completed' && (
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => handleCompleteTask(task._id)}
                                                            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 font-medium"
                                                        >
                                                            Mark Done
                                                        </motion.button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {user?.role === 'admin' && <AdminDashboard />}
            </div>
        </div>
    );
};

export default Dashboard;
