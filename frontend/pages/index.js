import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MainCanvas from "../components/MainCanvas";
import ProjectManager from "../components/ProjectManager";
import AIAssistant from "../components/AIAssistant";
import TemplateManager from "../components/TemplateManager";
import ExportManager from "../components/ExportManager";
import AdvancedToolbar from "../components/AdvancedToolbar";
import OnboardingDemo from "../components/OnboardingDemo";
import useStore from "../store";

import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { initialize, user, isFocusMode, toggleFocusMode } = useStore();
  const [isProjectManagerOpen, setIsProjectManagerOpen] = useState(false);
  const [isTemplateManagerOpen, setIsTemplateManagerOpen] = useState(false);
  const [isExportManagerOpen, setIsExportManagerOpen] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Canvas view state
  const [showGrid, setShowGrid] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);
  const [canvasRef, setCanvasRef] = useState(null);

  // Initialize store on component mount
  useEffect(() => {
    console.log("Home mounted, initializing...");
    initialize();

    // Check for onboarding demo
    const shouldShowDemo = localStorage.getItem('showOnboarding') === 'true';
    if (shouldShowDemo) {
      setShowDemo(true);
    }

    // Simulate loading for smooth animation
    const timer = setTimeout(() => {
      console.log("Loading finished");
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [initialize]);

  // Auth Redirect
  useEffect(() => {
    console.log("Auth check:", { isLoading, user });
    if (!isLoading && !user) {
      console.log("Redirecting to register...");
      router.push('/register');
    }
  }, [isLoading, user, router]);

  // Canvas control functions
  const handleZoomIn = () => {
    if (canvasRef?.zoomIn) {
      canvasRef.zoomIn();
    } else {
      toast("Canvas zoom controls will be available when a project is loaded", {
        icon: "🔍",
      });
    }
  };

  const handleZoomOut = () => {
    if (canvasRef?.zoomOut) {
      canvasRef.zoomOut();
    } else {
      toast("Canvas zoom controls will be available when a project is loaded", {
        icon: "🔍",
      });
    }
  };

  const handleFitView = () => {
    if (canvasRef?.fitView) {
      canvasRef.fitView();
    } else {
      toast("Canvas fit view will be available when a project is loaded", {
        icon: "📐",
      });
    }
  };

  const handleToggleGrid = () => {
    setShowGrid(!showGrid);
    toast.success(`Grid ${!showGrid ? "enabled" : "disabled"}`);
  };

  const handleToggleMinimap = () => {
    setShowMinimap(!showMinimap);
    toast.success(`Minimap ${!showMinimap ? "enabled" : "disabled"}`);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Check if user is typing in an input field
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "k":
            event.preventDefault();
            // Open AI Assistant - handled by store
            break;
          case "s":
            event.preventDefault();
            // Save project - handled by navbar
            break;
          case "n":
            event.preventDefault();
            setIsProjectManagerOpen(true);
            break;
          case "e":
            event.preventDefault();
            setIsExportManagerOpen(true);
            break;
          case "t":
            event.preventDefault();
            setIsTemplateManagerOpen(true);
            break;
        }
      } else {
        if (event.key === "f" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
          toggleFocusMode();
        }
        if (event.key === "Escape" && isFocusMode) {
          toggleFocusMode();
        }
      }

      // Canvas shortcuts
      switch (event.key) {
        case "+":
        case "=":
          event.preventDefault();
          handleZoomIn();
          break;
        case "-":
          event.preventDefault();
          handleZoomOut();
          break;
        case "0":
          event.preventDefault();
          handleFitView();
          break;
        case "g":
          event.preventDefault();
          handleToggleGrid();
          break;
        case "m":
          event.preventDefault();
          handleToggleMinimap();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [canvasRef, showGrid, showMinimap]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            ArchyNex
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Loading your workspace...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>
          {"ArchyNex"}
        </title>
        <meta
          name="description"
          content="Build and visualize system architecture diagrams with AI assistance"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph */}
        <meta property="og:title" content="ArchyNex" />
        <meta
          property="og:description"
          content="Professional system architecture diagramming tool with AI assistance"
        />
        <meta property="og:type" content="website" />

        {/* Additional Meta Tags */}
        <meta
          name="keywords"
          content="system design, architecture, diagrams, microservices, cloud, AI"
        />
        <meta name="author" content="ArchyNex" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col h-screen"
      >
        {/* Navigation Bar */}
        <AnimatePresence>
          {!isFocusMode && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              <Navbar
                onOpenProjectManager={() => setIsProjectManagerOpen(true)}
                onOpenTemplates={() => setIsTemplateManagerOpen(true)}
                onOpenExport={() => setIsExportManagerOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Advanced Toolbar */}
        <AnimatePresence>
          {!isFocusMode && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AdvancedToolbar
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onFitView={handleFitView}
                onToggleGrid={handleToggleGrid}
                onToggleMinimap={handleToggleMinimap}
                showGrid={showGrid}
                showMinimap={showMinimap}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <AnimatePresence>
            {!isFocusMode && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="hidden lg:block"
              >
                <Sidebar />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Sidebar Toggle */}
          <div className="lg:hidden">
            {/* This could be implemented as a slide-out drawer for mobile */}
          </div>

          {/* Canvas Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex-1 flex flex-col"
          >
            <MainCanvas
              ref={setCanvasRef}
              showGrid={showGrid}
              showMinimap={showMinimap}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Modals and Overlays */}
      <ProjectManager
        isOpen={isProjectManagerOpen}
        onClose={() => setIsProjectManagerOpen(false)}
      />

      <TemplateManager
        isOpen={isTemplateManagerOpen}
        onClose={() => setIsTemplateManagerOpen(false)}
      />

      <ExportManager
        isOpen={isExportManagerOpen}
        onClose={() => setIsExportManagerOpen(false)}
      />

      <AIAssistant />

      {/* Onboarding Demo */}
      <AnimatePresence>
        {showDemo && (
          <OnboardingDemo onClose={() => setShowDemo(false)} />
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#374151",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            border: "1px solid #e5e7eb",
            borderRadius: "0.75rem",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      {/* Keyboard Shortcuts Help */}


      {/* Exit Focus Mode Button */}
      <AnimatePresence>
        {isFocusMode && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={toggleFocusMode}
            className="fixed bottom-6 right-6 px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-full shadow-lg border border-gray-200 dark:border-gray-700 z-50 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-sm font-medium">Exit Focus Mode</span>
            <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded">Esc</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Version Info */}
      {!isFocusMode && (
        <div className="fixed bottom-4 right-4 text-xs text-gray-400">
          v{process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0"}
        </div>
      )}
    </div>
  );
}
