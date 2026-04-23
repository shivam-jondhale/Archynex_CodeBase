import React from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaProjectDiagram, FaCalendarAlt, FaSignOutAlt, FaEnvelope } from 'react-icons/fa';
import useStore from '../store';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

export default function Profile() {
    const { user, projects, logout } = useStore();
    const router = useRouter();

    if (!user) {
        if (typeof window !== 'undefined') {
            router.push('/login');
        }
        return null;
    }

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        router.push('/');
    };

    // Generate a consistent avatar color based on username
    const getAvatarColor = (name) => {
        const colors = [
            'bg-red-500', 'bg-orange-500', 'bg-amber-500',
            'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
            'bg-cyan-500', 'bg-blue-500', 'bg-indigo-500',
            'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500',
            'bg-pink-500', 'bg-rose-500'
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const avatarColor = getAvatarColor(user.username);
    const initials = user.username.substring(0, 2).toUpperCase();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar
                onOpenProjectManager={() => router.push('/')}
                onOpenTemplates={() => router.push('/')}
                onOpenExport={() => router.push('/')}
            />

            <div className="max-w-4xl mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                    {/* Header Banner */}
                    <div className={`h-32 ${avatarColor} opacity-80`}></div>

                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <div className={`w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 ${avatarColor} flex items-center justify-center shadow-lg`}>
                                <span className="text-3xl font-bold text-white">{initials}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors font-medium"
                            >
                                <FaSignOutAlt />
                                Logout
                            </button>
                        </div>

                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{user.username}</h1>
                            <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                <FaUser className="text-xs" /> System Architect
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Stats Card 1 */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                        <FaProjectDiagram className="text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Projects</p>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{projects.length}</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Card 2 */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                                        <FaCalendarAlt className="text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Dec 2025</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Card 3 */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                                        <FaEnvelope className="text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Account Type</p>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Free Plan</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Projects</h2>
                            {projects.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {projects.slice(0, 4).map(project => (
                                        <div key={project.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer" onClick={() => router.push('/')}>
                                            <h3 className="font-medium text-gray-900 dark:text-white mb-1">{project.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{project.description || "No description"}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 italic">No projects created yet.</p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
