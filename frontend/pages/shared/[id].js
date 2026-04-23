import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import MainCanvas from "../../components/MainCanvas";
import useStore from "../../store";

export default function SharedProject() {
    const router = useRouter();
    const { id } = router.query;
    const { loadProject, currentProject } = useStore();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetchProject(id);
        }
    }, [id]);

    const fetchProject = async (projectId) => {
        try {
            setIsLoading(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/projects/${projectId}`);
            if (!response.ok) {
                throw new Error("Project not found");
            }
            const project = await response.json();

            // Load project into store but maybe we should have a read-only mode?
            // For now, loading it is fine, but we might want to disable saving/editing in UI
            loadProject(project);
            setIsLoading(false);
        } catch (err) {
            console.error("Error loading shared project:", err);
            setError(err.message);
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                        Oops!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => router.push("/")}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Head>
                <title>{currentProject?.name || "Shared Project"} - ArchyNex</title>
            </Head>

            {/* Read-only Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        A
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                            {currentProject?.name}
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Shared View • Read Only
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push("/")}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                    >
                        Create Your Own
                    </button>
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 relative overflow-hidden flex flex-col">
                {currentProject && (currentProject._id === id || currentProject.id === id) ? (
                    <div className="w-full h-full flex flex-col">
                        <MainCanvas showGrid={true} showMinimap={true} />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {/* Overlay to prevent interaction if desired, or just let them explore read-only */}
                {/* For now, we allow exploration (panning/zooming) but editing is controlled by UI components which are absent here */}
            </div>

            <Toaster position="bottom-right" />
        </div>
    );
}
