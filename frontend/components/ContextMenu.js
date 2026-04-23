import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaTrash,
    FaCopy,
    FaPalette,
    FaStickyNote,
    FaFont,
    FaProjectDiagram,
    FaTimes
} from 'react-icons/fa';

const ContextMenu = ({ position, type, onAction, onClose }) => {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    // Adjust position to keep menu within viewport
    const adjustedPosition = { ...position };
    if (typeof window !== 'undefined') {
        if (position.x + 200 > window.innerWidth) {
            adjustedPosition.x = window.innerWidth - 220;
        }
        if (position.y + 300 > window.innerHeight) {
            adjustedPosition.y = window.innerHeight - 320;
        }
    }

    const canvasActions = [
        { label: 'Add Note', icon: FaStickyNote, action: 'add-note', color: 'text-yellow-500' },
        { label: 'Add Text', icon: FaFont, action: 'add-text', color: 'text-blue-500' },
        { label: 'Paste', icon: FaCopy, action: 'paste', color: 'text-gray-500' },
    ];

    const nodeActions = [
        { label: 'Change Color', icon: FaPalette, action: 'color', color: 'text-purple-500' },
        { label: 'Duplicate', icon: FaCopy, action: 'duplicate', color: 'text-blue-500' },
        { label: 'Delete', icon: FaTrash, action: 'delete', color: 'text-red-500' },
    ];

    const actions = type === 'node' ? nodeActions : canvasActions;

    return (
        <AnimatePresence>
            <motion.div
                ref={menuRef}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.1 }}
                style={{
                    position: 'fixed',
                    top: adjustedPosition.y,
                    left: adjustedPosition.x,
                    zIndex: 1000,
                }}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-2 min-w-[180px] overflow-hidden"
            >
                <div className="flex flex-col space-y-1">
                    {actions.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                onAction(item.action);
                                onClose();
                            }}
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-200 w-full text-left group"
                        >
                            <item.icon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ContextMenu;
