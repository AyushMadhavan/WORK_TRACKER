import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [tasksToSanction, setTasksToSanction] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');

    useEffect(() => {
        fetchUsers();
        fetchTasksToSanction();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (error) {
            console.error('Error fetching users');
        }
    };

    const fetchTasksToSanction = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const pending = res.data.filter(t => t.status === 'completed' && t.adminStatus === 'pending');
            setTasksToSanction(pending);
        } catch (error) {
            console.error('Error fetching tasks');
        }
    };

    const handleSanction = async (taskId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, {
                adminStatus: status
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTasksToSanction();
        } catch (error) {
            alert('Error updating task');
        }
    };

    const handleAssignTask = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_URL}/tasks`, {
                title, description, assignedTo
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Task assigned successfully');
            setTitle('');
            setDescription('');
            setAssignedTo('');
        } catch (error) {
            alert('Failed to assign task');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-16 pt-12 border-t border-gray-200"
        >
            <h2 className="text-3xl font-bold mb-8 tracking-tighter">Administration</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Assign Task Form */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-6">Assign New Task</h3>
                    <form onSubmit={handleAssignTask} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Title</label>
                            <motion.input
                                whileFocus={{ scale: 1.01, borderColor: "#000" }}
                                whileHover={{ scale: 1.01 }}
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                            <motion.textarea
                                whileFocus={{ scale: 1.01, borderColor: "#000" }}
                                whileHover={{ scale: 1.01 }}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none transition-all"
                                rows="3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Assign To</label>
                            <div className="relative">
                                <motion.select
                                    whileFocus={{ scale: 1.01, borderColor: "#000" }}
                                    whileHover={{ scale: 1.01 }}
                                    value={assignedTo}
                                    onChange={(e) => setAssignedTo(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none transition-all appearance-none"
                                    required
                                >
                                    <option value="">Select Employee</option>
                                    {users.map(u => (
                                        <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                                    ))}
                                </motion.select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors shadow-lg"
                        >
                            Assign Task
                        </motion.button>
                    </form>
                </div>

                {/* Sanction Tasks */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-6">Pending Sanctions</h3>
                    {tasksToSanction.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <p>No completed tasks pending approval.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                            {tasksToSanction.map(task => (
                                <motion.div
                                    key={task._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="border border-gray-100 p-5 rounded-xl hover:shadow-md transition-shadow"
                                >
                                    <h4 className="font-bold text-lg mb-1">{task.title}</h4>
                                    <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                                    <div className="flex justify-between items-center mt-4">
                                        <p className="text-xs text-gray-400">
                                            By: <span className="text-gray-600 font-medium">{users.find(u => u._id === task.assignedTo)?.name || 'Unknown'}</span>
                                        </p>
                                        <div className="flex space-x-2">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleSanction(task._id, 'approved')}
                                                className="bg-black text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-800"
                                            >
                                                Approve
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleSanction(task._id, 'rejected')}
                                                className="bg-white border border-gray-200 text-red-500 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-50"
                                            >
                                                Reject
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
