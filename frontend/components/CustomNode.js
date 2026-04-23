import React, { memo, useState, useRef, useEffect } from "react";
import { Handle, Position } from "reactflow";
import { motion } from "framer-motion";
import * as FaIcons from "react-icons/fa";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import useStore from "../store";

const CustomNode = ({ id, data, selected }) => {
  // Handle both component and string icon names
  let Icon = data.icon;
  if (typeof Icon === "string") {
    Icon = FaIcons[Icon] || FaIcons.FaQuestion;
  }

  const { updateCurrentProject, currentProject, theme } = useStore();

  // Edit states
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempLabel, setTempLabel] = useState(data.label);
  const [tempDescription, setTempDescription] = useState(data.description);

  // Refs for input fields
  const labelInputRef = useRef(null);
  const descriptionInputRef = useRef(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingLabel && labelInputRef.current) {
      labelInputRef.current.focus();
      labelInputRef.current.select();
    }
  }, [isEditingLabel]);

  useEffect(() => {
    if (isEditingDescription && descriptionInputRef.current) {
      descriptionInputRef.current.focus();
      descriptionInputRef.current.select();
    }
  }, [isEditingDescription]);

  // Fallback icon if icon is undefined
  const FallbackIcon = () => (
    <div className="w-6 h-6 bg-gray-400 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">?</span>
    </div>
  );

  // Update node in the store
  const updateNodeData = (newData) => {
    if (!currentProject) return;

    const updatedNodes = currentProject.nodes.map((node) =>
      node.id === id ? { ...node, data: { ...node.data, ...newData } } : node
    );

    updateCurrentProject({ nodes: updatedNodes });
  };

  // Handle label save
  const handleLabelSave = () => {
    if (tempLabel.trim() && tempLabel !== data.label) {
      updateNodeData({ label: tempLabel.trim() });
    } else {
      setTempLabel(data.label); // Reset if empty or same
    }
    setIsEditingLabel(false);
  };

  // Handle description save
  const handleDescriptionSave = () => {
    if (tempDescription.trim() !== data.description) {
      updateNodeData({ description: tempDescription.trim() });
    } else {
      setTempDescription(data.description); // Reset if same
    }
    setIsEditingDescription(false);
  };

  // Handle label cancel
  const handleLabelCancel = () => {
    setTempLabel(data.label);
    setIsEditingLabel(false);
  };

  // Handle description cancel
  const handleDescriptionCancel = () => {
    setTempDescription(data.description);
    setIsEditingDescription(false);
  };

  // Handle keyboard events
  const handleLabelKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLabelSave();
    } else if (e.key === "Escape") {
      handleLabelCancel();
    }
  };

  const handleDescriptionKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleDescriptionSave();
    } else if (e.key === "Escape") {
      handleDescriptionCancel();
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`
        relative rounded-xl transition-all duration-200 group
        ${theme === 'sketch' ? 'border-2 border-black font-serif rounded-sm shadow-sm bg-white' : ''}
        ${theme === 'cyberpunk' ? 'border-2 bg-black/90' : ''}
        ${theme === 'default' ? 'bg-white dark:bg-gray-800 shadow-lg border-2' : ''}
        ${selected
          ? theme === 'cyberpunk'
            ? "ring-2 ring-white shadow-[0_0_30px_rgba(255,255,255,0.5)]"
            : "border-blue-500 shadow-xl ring-2 ring-blue-200 dark:ring-blue-900"
          : theme === 'default'
            ? "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            : ""
        }
      `}
      style={theme === 'cyberpunk' ? {
        borderColor: data.color || '#22d3ee',
        boxShadow: `0 0 15px ${data.color || '#22d3ee'}40`,
        color: data.color || '#22d3ee'
      } : {}}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-white dark:border-gray-800 bg-gray-400 dark:bg-gray-500 hover:bg-blue-500 transition-colors"
      />

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 border-white dark:border-gray-800 bg-gray-400 dark:bg-gray-500 hover:bg-blue-500 transition-colors"
      />

      {/* Node Content */}
      <div className="p-4 min-w-[140px] text-center">
        {/* Icon */}
        <div
          className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-lg"
          style={{ backgroundColor: `${data.color}20` }}
        >
          {Icon ? (
            <Icon size={24} style={{ color: theme === 'cyberpunk' ? (data.color || '#22d3ee') : data.color }} />
          ) : (
            <FallbackIcon />
          )}
        </div>

        {/* Label - Editable */}
        <div className="mb-1 relative group/label">
          {isEditingLabel ? (
            <div className="flex items-center gap-1">
              <input
                ref={labelInputRef}
                type="text"
                value={tempLabel}
                onChange={(e) => setTempLabel(e.target.value)}
                onKeyDown={handleLabelKeyDown}
                onBlur={handleLabelSave}
                className={`text-sm font-semibold border rounded px-2 py-1 text-center min-w-0 flex-1 focus:outline-none 
                  ${theme === 'cyberpunk' ? 'bg-black' : 'text-gray-800 dark:text-white bg-white dark:bg-gray-700 border-blue-300 dark:border-blue-500'}
                `}
                style={theme === 'cyberpunk' ? {
                  color: data.color || '#22d3ee',
                  borderColor: data.color || '#22d3ee'
                } : {}}
                maxLength={30}
              />
              <button
                onClick={handleLabelSave}
                className="p-1 text-green-600 hover:bg-green-100 rounded text-xs"
                title="Save"
              >
                <FaCheck />
              </button>
              <button
                onClick={handleLabelCancel}
                className="p-1 text-red-600 hover:bg-red-100 rounded text-xs"
                title="Cancel"
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <div
              className="flex items-center justify-center gap-1 cursor-pointer"
              onClick={() => setIsEditingLabel(true)}
            >
              <span
                className={`text-sm font-semibold truncate max-w-[100px] ${theme === 'cyberpunk' ? '' : 'text-gray-800 dark:text-gray-100'}`}
                style={theme === 'cyberpunk' ? { color: data.color || '#22d3ee' } : {}}
              >
                {data.label}
              </span>
              <FaEdit
                className="text-gray-400 hover:text-blue-500 opacity-0 group-hover/label:opacity-100 transition-opacity text-xs"
                title="Edit name"
              />
            </div>
          )}
        </div>

        {/* Description - Editable */}
        <div className="relative group/description">
          {isEditingDescription ? (
            <div className="space-y-1">
              <textarea
                ref={descriptionInputRef}
                value={tempDescription}
                onChange={(e) => setTempDescription(e.target.value)}
                onKeyDown={handleDescriptionKeyDown}
                onBlur={handleDescriptionSave}
                className={`text-xs border rounded px-2 py-1 w-full resize-none focus:outline-none
                  ${theme === 'cyberpunk' ? 'bg-black' : 'text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border-blue-300 dark:border-blue-500'}
                `}
                style={theme === 'cyberpunk' ? {
                  color: data.color || '#22d3ee',
                  borderColor: data.color || '#22d3ee'
                } : {}}
                rows={2}
                maxLength={100}
                placeholder="Enter description..."
              />
              <div className="flex items-center justify-center gap-1">
                <button
                  onClick={handleDescriptionSave}
                  className="p-1 text-green-600 hover:bg-green-100 rounded text-xs"
                  title="Save"
                >
                  <FaCheck />
                </button>
                <button
                  onClick={handleDescriptionCancel}
                  className="p-1 text-red-600 hover:bg-red-100 rounded text-xs"
                  title="Cancel"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          ) : (
            <div
              className="flex items-center justify-center gap-1 cursor-pointer"
              onClick={() => setIsEditingDescription(true)}
            >
              <span
                className={`text-xs leading-tight line-clamp-2 max-w-[120px] ${theme === 'cyberpunk' ? '' : 'text-gray-600 dark:text-gray-400'}`}
                style={theme === 'cyberpunk' ? { color: (data.color || '#22d3ee') + 'CC' } : {}}
              >
                {data.description}
              </span>
              <FaEdit
                className="text-gray-400 hover:text-blue-500 opacity-0 group-hover/description:opacity-100 transition-opacity text-xs"
                title="Edit description"
              />
            </div>
          )}
        </div>
      </div>

      {/* Selection indicator */}
      {
        selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"
          />
        )
      }

      {/* Edit hint overlay - shown on hover when not editing */}
      {
        !isEditingLabel && !isEditingDescription && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-0 hover:bg-opacity-5 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100 pointer-events-none">
            <div className="absolute top-2 right-2 text-xs text-blue-600 bg-white bg-opacity-90 px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity delay-500">
              Click to edit
            </div>
          </div>
        )
      }
    </motion.div >
  );
};

export default memo(CustomNode);
