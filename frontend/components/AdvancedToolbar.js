import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUndo,
  FaRedo,
  FaSearch,
  FaFilter,
  FaLayerGroup,
  FaRuler,
  FaExpand,
  FaCompress,
  FaEye,
  FaEyeSlash,
  FaCopy,
  FaPaste,
  FaMousePointer,
  FaSquare,
  FaCircle,
  FaArrowRight,
  FaFont,
  FaImage,
  FaStickyNote,
  FaMagic,
  FaClone,
  FaAlignCenter,
  FaAlignLeft,
  FaAlignRight,
  FaObjectGroup,
  FaObjectUngroup,
  FaBringForward,
  FaSendBackward,
  FaLock,
  FaUnlock,
  FaBookmark,
  FaMagnet,
  FaPalette,
  FaBolt,
  FaCube,
} from "react-icons/fa";
import useStore from "../store";
import toast from "react-hot-toast";

const AdvancedToolbar = ({
  onZoomIn,
  onZoomOut,
  onFitView,
  onToggleGrid,
  onToggleMinimap,
  showGrid,
  showMinimap,
}) => {
  const {
    currentProject,
    updateCurrentProject,
    selectedNode,
    setSelectedNode,
    componentSearchQuery,
    setComponentSearchQuery,
    toolMode,
    setToolMode,
    undo,
    redo,
    undoStack,
    redoStack,
    sidebarFilters,
    setSidebarFilters,
    isFocusMode,
    toggleFocusMode,
    theme,
    setTheme,
    snapToGrid,
    toggleSnapToGrid,
    magicConnectEnabled,
    toggleMagicConnect,
    tiltEnabled,
    toggleTilt,
  } = useStore();

  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({ category: "", type: "" });
  const [copiedNode, setCopiedNode] = useState(null);

  // Sync local filters with store when panel opens
  React.useEffect(() => {
    if (showFilters) {
      setLocalFilters(sidebarFilters);
    }
  }, [showFilters, sidebarFilters]);

  const handleApplyFilters = () => {
    setSidebarFilters(localFilters);
    toast.success("Filters applied");
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const emptyFilters = { category: "", type: "" };
    setLocalFilters(emptyFilters);
    setSidebarFilters(emptyFilters);
    toast.success("Filters cleared");
    setShowFilters(false);
  };

  // Tool modes
  const toolModes = [
    { id: "select", icon: FaMousePointer, label: "Select", shortcut: "V" },
    { id: "pan", icon: FaMousePointer, label: "Pan", shortcut: "H" }, // Reusing icon for now, could be FaHandPaper
    { id: "rectangle", icon: FaSquare, label: "Rectangle", shortcut: "R" },
    { id: "circle", icon: FaCircle, label: "Circle", shortcut: "C" },
    { id: "arrow", icon: FaArrowRight, label: "Arrow", shortcut: "A" },
    { id: "text", icon: FaFont, label: "Text", shortcut: "T" },
    { id: "note", icon: FaStickyNote, label: "Note", shortcut: "N" },
  ];

  const handleToolSelect = (toolId) => {
    setToolMode(toolId);
    toast.success(
      `${toolModes.find((t) => t.id === toolId)?.label} tool activated`
    );
  };

  const handleCopy = () => {
    if (selectedNode) {
      setCopiedNode(selectedNode);
      toast.success("Component copied");
    } else {
      toast.error("Select a component to copy");
    }
  };

  const handlePaste = () => {
    if (copiedNode && currentProject) {
      const newNode = {
        ...copiedNode,
        id: `${copiedNode.data.id}-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        position: {
          x: copiedNode.position.x + 50,
          y: copiedNode.position.y + 50,
        },
        data: {
          ...copiedNode.data,
          label: `${copiedNode.data.label} Copy`,
        },
      };

      const updatedNodes = [...currentProject.nodes, newNode];
      updateCurrentProject({ nodes: updatedNodes });
      setSelectedNode(newNode);
      toast.success("Component pasted");
    } else {
      toast.error("Nothing to paste");
    }
  };

  const handleDuplicate = () => {
    if (selectedNode && currentProject) {
      const newNode = {
        ...selectedNode,
        id: `${selectedNode.data.id}-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        position: {
          x: selectedNode.position.x + 50,
          y: selectedNode.position.y + 50,
        },
        data: {
          ...selectedNode.data,
          label: `${selectedNode.data.label} Copy`,
        },
      };

      const updatedNodes = [...currentProject.nodes, newNode];
      updateCurrentProject({ nodes: updatedNodes });
      setSelectedNode(newNode);
      toast.success("Component duplicated");
    } else {
      toast.error("Select a component to duplicate");
    }
  };

  const handleAutoLayout = () => {
    if (!currentProject || currentProject.nodes.length === 0) {
      toast.error("No components to arrange");
      return;
    }

    // Simple auto-layout algorithm
    const layoutNodes = currentProject.nodes.map((node, index) => {
      const col = index % 4;
      const row = Math.floor(index / 4);
      return {
        ...node,
        position: {
          x: 100 + col * 200,
          y: 100 + row * 150,
        },
      };
    });

    updateCurrentProject({ nodes: layoutNodes });
    toast.success("Components auto-arranged");
  };

  const handleAlignNodes = (alignment) => {
    if (!currentProject || currentProject.nodes.length < 2) {
      toast.error("Select multiple components to align");
      return;
    }

    // Simple alignment logic
    const nodes = currentProject.nodes;
    let alignedNodes;

    switch (alignment) {
      case "left":
        const leftX = Math.min(...nodes.map((n) => n.position.x));
        alignedNodes = nodes.map((n) => ({
          ...n,
          position: { ...n.position, x: leftX },
        }));
        break;
      case "center":
        const avgX =
          nodes.reduce((sum, n) => sum + n.position.x, 0) / nodes.length;
        alignedNodes = nodes.map((n) => ({
          ...n,
          position: { ...n.position, x: avgX },
        }));
        break;
      case "right":
        const rightX = Math.max(...nodes.map((n) => n.position.x));
        alignedNodes = nodes.map((n) => ({
          ...n,
          position: { ...n.position, x: rightX },
        }));
        break;
      default:
        return;
    }

    updateCurrentProject({ nodes: alignedNodes });
    toast.success(`Components aligned ${alignment}`);
  };

  return (
    <div id="toolbar-main" className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Left Section - Tools */}
        <div className="flex items-center gap-1">
          {/* Undo/Redo */}
          <div className="flex items-center gap-1 mr-4">
            <button
              id="btn-undo"
              onClick={undo}
              disabled={undoStack.length === 0}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 rounded transition-colors disabled:opacity-50"
              title="Undo (Ctrl+Z)"
            >
              <FaUndo size={16} />
            </button>
            <button
              id="btn-redo"
              onClick={redo}
              disabled={redoStack.length === 0}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 rounded transition-colors disabled:opacity-50"
              title="Redo (Ctrl+Y)"
            >
              <FaRedo size={16} />
            </button>
          </div>

          {/* Tool Modes */}
          <div className="flex items-center gap-1 mr-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {toolModes.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  id={`btn-tool-${tool.id}`}
                  onClick={() => handleToolSelect(tool.id)}
                  className={`p-2 rounded transition-all duration-200 ${toolMode === tool.id
                    ? "bg-blue-500 text-white shadow-md"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }`}
                  title={`${tool.label} (${tool.shortcut})`}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 mr-4">
            <button
              onClick={handleCopy}
              disabled={!selectedNode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 rounded transition-colors disabled:opacity-50"
              title="Copy (Ctrl+C)"
            >
              <FaCopy size={16} />
            </button>
            <button
              onClick={handlePaste}
              disabled={!copiedNode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 rounded transition-colors disabled:opacity-50"
              title="Paste (Ctrl+V)"
            >
              <FaPaste size={16} />
            </button>
            <button
              onClick={handleDuplicate}
              disabled={!selectedNode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 rounded transition-colors disabled:opacity-50"
              title="Duplicate (Ctrl+D)"
            >
              <FaClone size={16} />
            </button>
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-1 mr-4">
            <button
              onClick={() => handleAlignNodes("left")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 rounded transition-colors"
              title="Align Left"
            >
              <FaAlignLeft size={16} />
            </button>
            <button
              onClick={() => handleAlignNodes("center")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 rounded transition-colors"
              title="Align Center"
            >
              <FaAlignCenter size={16} />
            </button>
            <button
              onClick={() => handleAlignNodes("right")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 rounded transition-colors"
              title="Align Right"
            >
              <FaAlignRight size={16} />
            </button>
            <button
              onClick={handleAutoLayout}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 rounded transition-colors"
              title="Auto Layout"
            >
              <FaMagic size={16} />
            </button>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <FaSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              type="text"
              placeholder="Search components..."
              value={componentSearchQuery}
              onChange={(e) => setComponentSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded transition-colors ${showFilters
              ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              }`}
            title="Filters"
          >
            <FaFilter size={16} />
          </button>
        </div>

        {/* Right Section - View Controls */}
        <div className="flex items-center gap-1">
          {/* Theme Switcher */}
          <div className="relative group mr-2 pb-2 -mb-2">
            <button id="btn-theme-switch" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 rounded transition-colors" title="Theme">
              <FaPalette size={16} />
            </button>
            <div className="absolute right-0 top-full mt-0 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden hidden group-hover:block z-50">
              <button onClick={() => setTheme('default')} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${theme === 'default' ? 'text-blue-500 font-medium' : 'text-gray-700 dark:text-gray-200'}`}>Default</button>
              <button onClick={() => setTheme('sketch')} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${theme === 'sketch' ? 'text-blue-500 font-medium' : 'text-gray-700 dark:text-gray-200'}`}>Sketch</button>
              <button onClick={() => setTheme('cyberpunk')} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${theme === 'cyberpunk' ? 'text-blue-500 font-medium' : 'text-gray-700 dark:text-gray-200'}`}>Cyberpunk</button>
            </div>
          </div>

          {/* Snap to Grid */}
          <button
            id="btn-snap-grid"
            onClick={toggleSnapToGrid}
            className={`p-2 rounded transition-colors ${snapToGrid
              ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              }`}
            title="Snap to Grid"
          >
            <FaMagnet size={16} />
          </button>

          {/* Magic Connect */}
          <button
            id="btn-magic-connect"
            onClick={toggleMagicConnect}
            className={`p-2 rounded transition-colors ${magicConnectEnabled
              ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              }`}
            title="Magic Connect"
          >
            <FaBolt size={16} />
          </button>

          {/* 3D Tilt */}
          <button
            id="btn-3d-tilt"
            onClick={toggleTilt}
            className={`p-2 rounded transition-colors ${tiltEnabled
              ? "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              }`}
            title="3D Tilt Effect"
          >
            <FaCube size={16} />
          </button>

          {/* Focus Mode */}
          <button
            id="btn-focus-mode"
            onClick={toggleFocusMode}
            className={`p-2 rounded transition-colors ${isFocusMode
              ? "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              }`}
            title="Focus Mode (F)"
          >
            {isFocusMode ? <FaCompress size={16} /> : <FaExpand size={16} />}
          </button>

          {/* View Options */}
          <button
            onClick={onToggleGrid}
            className={`p-2 rounded transition-colors ${showGrid
              ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              }`}
            title="Toggle Grid"
          >
            <FaLayerGroup size={16} />
          </button>
          <button
            id="btn-minimap"
            onClick={onToggleMinimap}
            className={`p-2 rounded transition-colors ${showMinimap
              ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              }`}
            title="Toggle Minimap"
          >
            {showMinimap ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 ml-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <button
              onClick={onZoomOut}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded transition-colors"
              title="Zoom Out (-)"
            >
              <FaCompress size={16} />
            </button>
            <button
              onClick={onFitView}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded transition-colors"
              title="Fit View (0)"
            >
              <FaExpand size={16} />
            </button>
            <button
              onClick={onZoomIn}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded transition-colors"
              title="Zoom In (+)"
            >
              <FaRuler size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Category:
                </label>
                <select
                  value={localFilters.category}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, category: e.target.value })
                  }
                  className="ml-2 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                >
                  <option value="">All</option>
                  <option value="compute">Compute</option>
                  <option value="storage">Storage</option>
                  <option value="network">Network</option>
                  <option value="security">Security</option>
                  <option value="client">Client</option>
                  <option value="service">Service</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Type:
                </label>
                <select
                  value={localFilters.type}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, type: e.target.value })
                  }
                  className="ml-2 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                >
                  <option value="">All</option>
                  <option value="custom">Custom</option>
                  <option value="service">Service</option>
                  <option value="database">Database</option>
                  <option value="server">Server</option>
                </select>
              </div>
              <button
                onClick={handleApplyFilters}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Apply
              </button>
              <button
                onClick={handleClearFilters}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedToolbar;
