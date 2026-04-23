import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFolder,
  FaSave,
  FaRobot,
  FaUser,
  FaCog,
  FaBars,
  FaTimes,
  FaShare,
  FaEye,
  FaMoon,
  FaSun,
  FaPlay,
  FaHome,
} from "react-icons/fa";
import useStore from "../store";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const Navbar = ({ onOpenProjectManager, onOpenTemplates, onOpenExport }) => {
  const {
    currentProject,
    updateCurrentProject,
    setAiAssistantOpen,
    user,
    logout,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    }
  }, []);

  // Apply theme to html tag and save to localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const router = useRouter();

  const handleSaveProject = () => {
    if (!user) {
      toast.error("Please login to save your project");
      router.push("/login");
      return;
    }

    if (!currentProject) {
      toast.error("No project to save");
      return;
    }
    updateCurrentProject({ updatedAt: new Date().toISOString() });
    toast.success("Project saved!");
  };

  const navItems = [
    {
      id: "projects",
      elementId: "nav-projects",
      label: "Projects",
      icon: FaFolder,
      onClick: onOpenProjectManager,
    },
    {
      id: "templates",
      elementId: "nav-templates",
      label: "Templates",
      icon: FaEye,
      onClick: onOpenTemplates,
    },
    {
      id: "save",
      elementId: "nav-save",
      label: "Save",
      icon: FaSave,
      onClick: handleSaveProject,
      disabled: !currentProject,
      shortcut: "Ctrl+S",
    },
    {
      id: "export",
      elementId: "nav-export",
      label: "Export & Share",
      icon: FaShare,
      onClick: onOpenExport,
      disabled: !currentProject,
    },
    {
      id: "ai",
      elementId: "nav-ai",
      label: "AI Assistant",
      icon: FaRobot,
      onClick: () => setAiAssistantOpen(true),
      className:
        "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-md hover:shadow-lg",
      shortcut: "Ctrl+K",
    },
  ];

  // Add Home button if not on home page
  if (router.pathname !== "/") {
    navItems.unshift({
      id: "home",
      label: "Home",
      icon: FaHome,
      onClick: () => router.push("/"),
    });
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              ArchyNex
            </h1>
            {currentProject && (
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[200px] md:max-w-none">
                {currentProject.name}
              </p>
            )}
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                id={item.elementId}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={item.onClick}
                disabled={item.disabled}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${item.className || "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"}
                  ${item.disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}
                `}
                title={item.shortcut ? `${item.label} (${item.shortcut})` : item.label}
              >
                <Icon className="text-sm" />
                <span className="hidden lg:inline">{item.label}</span>
              </motion.button>
            );
          })}

          {/* Dark Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full transition-colors ${darkMode
              ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </motion.button>

          {/* User Profile or Auth Buttons */}
          <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {user.username.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:block">
                    {user.username}
                  </span>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.username}</p>
                      </div>

                      <Link href="/profile">
                        <button
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <FaUser className="text-gray-400" />
                          Your Profile
                        </button>
                      </Link>

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          localStorage.setItem('showOnboarding', 'true');
                          localStorage.setItem('onboardingStep', '0');
                          window.location.reload();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <FaPlay className="text-gray-400" />
                        Replay Demo
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                          toast.success("Logged out successfully");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                      >
                        <FaTimes className="text-red-500" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    Login
                  </button>
                </Link>
                <Link href="/register">
                  <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.onClick();
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={item.disabled}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-left
                    ${item.className || "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"}
                    ${item.disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}
                  `}
                >
                  <Icon className="text-sm" />
                  {item.label}
                  {item.shortcut && (
                    <span className="ml-auto text-xs text-gray-400">
                      {item.shortcut}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Dark Mode Toggle Mobile */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${darkMode
                ? "text-yellow-400 hover:bg-gray-800"
                : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
              {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>

            {/* Mobile User Actions */}
            <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-700">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-left">
                <FaUser className="text-sm" />
                Profile
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-left">
                <FaCog className="text-sm" />
                Settings
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
