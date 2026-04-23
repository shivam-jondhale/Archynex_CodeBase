import React, { useMemo } from 'react';
import { useReactFlow, useStore as useReactFlowStore } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import * as FaIcons from 'react-icons/fa';

// Config-driven rules for suggestions
const suggestionConfig = {
    server: [
        { type: 'database', label: 'Database', icon: 'FaDatabase', color: '#eab308' }, // Yellow
        { type: 'loadBalancer', label: 'Load Balancer', icon: 'FaNetworkWired', color: '#a855f7' }, // Purple
    ],
    frontend: [
        { type: 'api', label: 'API', icon: 'FaCogs', color: '#ef4444' }, // Red
        { type: 'auth', label: 'Auth', icon: 'FaLock', color: '#f97316' }, // Orange
    ],
    database: [
        { type: 'server', label: 'Server', icon: 'FaServer', color: '#22c55e' }, // Green
    ],
    default: [
        { type: 'note', label: 'Note', icon: 'FaStickyNote', color: '#fbbf24' },
        { type: 'text', label: 'Text', icon: 'FaFont', color: '#94a3b8' },
    ],
};

const SmartSuggestions = ({ selectedNode, onAddNode }) => {
    const { project } = useReactFlow();

    // Get zoom level to scale suggestions appropriately
    const zoom = useReactFlowStore((s) => s.transform[2]);

    const suggestions = useMemo(() => {
        if (!selectedNode) return [];

        // Determine node type (assuming data.type or similar, falling back to label for now if type isn't explicit in data)
        // In a real app, you'd use selectedNode.type or selectedNode.data.type
        const nodeType = selectedNode.data?.label?.toLowerCase() || 'default';

        // Simple matching logic
        if (nodeType.includes('server')) return suggestionConfig.server;
        if (nodeType.includes('frontend') || nodeType.includes('client')) return suggestionConfig.frontend;
        if (nodeType.includes('database') || nodeType.includes('db')) return suggestionConfig.database;

        return suggestionConfig.default;
    }, [selectedNode]);

    if (!selectedNode || suggestions.length === 0) return null;

    // Calculate position: Top-Right of the node
    // We project the node's absolute position to screen coordinates if needed, 
    // but since this component will be inside the ReactFlow pane (or a portal), 
    // we might want to position it relative to the node in the canvas coordinate system.
    // Let's assume this is rendered INSIDE the ReactFlow viewport for now, so we use node coordinates.

    const BUTTON_SIZE = 36;
    const OFFSET_X = (selectedNode.width || 150) / 2 + 20;
    const OFFSET_Y = -(selectedNode.height || 80) / 2;

    return (
        <div
            className="absolute pointer-events-none"
            style={{
                transform: `translate(${selectedNode.position.x + selectedNode.width / 2}px, ${selectedNode.position.y}px)`,
                zIndex: 1000,
            }}
        >
            <div className="relative flex flex-col gap-2 pointer-events-auto" style={{ left: 20, top: -20 }}>
                <AnimatePresence>
                    {suggestions.map((item, index) => {
                        const Icon = FaIcons[item.icon] || FaIcons.FaPlus;

                        return (
                            <motion.button
                                key={item.label}
                                initial={{ opacity: 0, x: -10, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
                                whileHover={{ scale: 1.1, x: 5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAddNode(item, selectedNode);
                                }}
                                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 group hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                                title={`Add ${item.label}`}
                            >
                                <div
                                    className="flex items-center justify-center w-6 h-6 rounded-full bg-opacity-20"
                                    style={{ backgroundColor: `${item.color}30`, color: item.color }}
                                >
                                    <Icon size={12} />
                                </div>
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                                    {item.label}
                                </span>
                            </motion.button>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SmartSuggestions;
