import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(email, password);
        if (res.success) {
            navigate('/dashboard');
        } else {
            alert(res.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
            {/* Abstract Background Elements */}
            <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-gray-100 to-white -z-10"
            />


            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md p-8 bg-white/80 backdrop-blur-md border border-gray-100 shadow-2xl rounded-2xl"
            >
                <h2 className="text-4xl font-bold mb-2 text-center tracking-tighter">Sign In to Work Tracker</h2>
                <p className="text-center text-gray-500 mb-8">Please enter your credentials to continue.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <motion.input
                            whileFocus={{ scale: 1.01, borderColor: "#000" }}
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none transition-all"
                            placeholder="name@company.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <motion.input
                            whileFocus={{ scale: 1.01, borderColor: "#000" }}
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors shadow-lg"
                    >
                        Sign In
                    </motion.button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account? <Link to="/register" className="text-black font-semibold hover:underline">Register</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
