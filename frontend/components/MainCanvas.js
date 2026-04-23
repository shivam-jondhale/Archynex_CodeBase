import React, { useCallback, useRef, forwardRef, useImperativeHandle, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ConnectionLineType,
  Panel,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import CustomNode from "./CustomNode";
import NodePropertiesPanel from "./NodePropertiesPanel";
import { createNode } from "../lib/node-types";
import useStore from "../store";
import toast from "react-hot-toast";
import ContextMenu from "./ContextMenu";
import SmartSuggestions from "./SmartSuggestions";

// Properly define node types
const nodeTypes = {
  custom: CustomNode,
};

const defaultEdgeOptions = {
  animated: true,
  type: "smoothstep",
};

const connectionLineStyle = {
  strokeWidth: 2,
  stroke: "#3b82f6",
};

const MainCanvas = forwardRef(({ showGrid = true, showMinimap = true }, ref) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  const {
    currentProject,
    updateNodes,
    updateEdges,
    updateCurrentProject,
    selectedNode,
    setSelectedNode,
    toolMode,
    setToolMode,
    theme,
    snapToGrid,
    magicConnectEnabled,
    tiltEnabled,
  } = useStore();

  const [nodes, setNodes, onNodesChange] = useNodesState(
    currentProject?.nodes || []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    currentProject?.edges || []
  );

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      reactFlowInstance?.zoomIn();
    },
    zoomOut: () => {
      reactFlowInstance?.zoomOut();
    },
    fitView: () => {
      reactFlowInstance?.fitView();
    }
  }), [reactFlowInstance]);

  // Magic Connect State
  const [ghostEdge, setGhostEdge] = useState(null);

  // Helper to calculate distance
  const getDistance = (n1, n2) => {
    const dx = n1.position.x - n2.position.x;
    const dy = n1.position.y - n2.position.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const onNodeDrag = useCallback(
    (event, node) => {
      if (!magicConnectEnabled) {
        setGhostEdge(null);
        return;
      }

      // Find closest node
      let closestNode = null;
      let minDistance = Infinity;
      const THRESHOLD = 150; // Distance to trigger magic connect

      nodes.forEach((n) => {
        if (n.id === node.id) return;
        const d = getDistance(node, n);
        if (d < minDistance && d < THRESHOLD) {
          minDistance = d;
          closestNode = n;
        }
      });

      if (closestNode) {
        setGhostEdge({
          source: node.id,
          target: closestNode.id,
        });
      } else {
        setGhostEdge(null);
      }
    },
    [nodes, magicConnectEnabled]
  );

  // Update store when nodes or edges change
  const onNodeDragStop = useCallback(
    (event, node) => {
      if (ghostEdge) {
        const newEdge = {
          id: `edge-${Date.now()}`,
          source: ghostEdge.source,
          target: ghostEdge.target,
          animated: true,
          style: theme === 'cyberpunk'
            ? { stroke: "#22d3ee", strokeWidth: 2, filter: "drop-shadow(0 0 3px #22d3ee)" }
            : theme === 'sketch'
              ? { stroke: "#000", strokeWidth: 2, strokeDasharray: "5 5" }
              : { stroke: "#3b82f6", strokeWidth: 2 },
        };
        setEdges((eds) => {
          // Check if edge already exists
          const exists = eds.some(e =>
            (e.source === newEdge.source && e.target === newEdge.target) ||
            (e.source === newEdge.target && e.target === newEdge.source)
          );
          if (exists) return eds;

          const newEdges = addEdge(newEdge, eds);
          updateEdges(newEdges);
          return newEdges;
        });
        toast.success("Magic Connect linked!");
        setGhostEdge(null);
      }
      updateNodes(nodes);
    },
    [nodes, updateNodes, ghostEdge, setEdges, updateEdges, theme]
  );

  // Smart Suggestions Handler
  const handleAddSuggestedNode = useCallback((suggestion, sourceNode) => {
    const offset = 250; // Distance for new node
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position: {
        x: sourceNode.position.x + offset,
        y: sourceNode.position.y,
      },
      data: {
        label: suggestion.label,
        description: `A new ${suggestion.label}`,
        icon: suggestion.icon,
        color: suggestion.color,
      },
    };

    const newEdge = {
      id: `edge-${sourceNode.id}-${newNode.id}`,
      source: sourceNode.id,
      target: newNode.id,
      animated: true,
      style: theme === 'cyberpunk'
        ? { stroke: "#22d3ee", strokeWidth: 2, filter: "drop-shadow(0 0 3px #22d3ee)" }
        : theme === 'sketch'
          ? { stroke: "#000", strokeWidth: 2, strokeDasharray: "5 5" }
          : { stroke: "#3b82f6", strokeWidth: 2 },
    };

    setNodes((nds) => nds.concat(newNode));
    setEdges((eds) => addEdge(newEdge, eds));

    // Update store
    updateCurrentProject({
      nodes: [...nodes, newNode],
      edges: [...edges, newEdge]
    });

    toast.success(`Added ${suggestion.label}`);
  }, [nodes, edges, theme, setNodes, setEdges, updateCurrentProject]);

  // Update local state when project changes
  React.useEffect(() => {
    if (currentProject) {
      setNodes(currentProject.nodes || []);
      setEdges(currentProject.edges || []);
    }
  }, [currentProject, setNodes, setEdges]);

  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        animated: true,
        style: theme === 'cyberpunk'
          ? { stroke: "#22d3ee", strokeWidth: 2, filter: "drop-shadow(0 0 3px #22d3ee)" }
          : theme === 'sketch'
            ? { stroke: "#000", strokeWidth: 2, strokeDasharray: "5 5" }
            : { stroke: "#3b82f6", strokeWidth: 2 },
      };
      setEdges((eds) => {
        const newEdges = addEdge(newEdge, eds);
        updateEdges(newEdges);
        return newEdges;
      });
    },
    [setEdges, updateEdges, theme]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const nodeType = event.dataTransfer.getData("application/reactflow");

      if (typeof nodeType === "undefined" || !nodeType) {
        return;
      }

      const position = {
        x: event.clientX - reactFlowBounds.left - 60,
        y: event.clientY - reactFlowBounds.top - 60,
      };

      try {
        const newNode = createNode(nodeType, position);
        setNodes((nds) => {
          const newNodes = nds.concat(newNode);
          updateNodes(newNodes);
          return newNodes;
        });
        toast.success("Component added to canvas");
      } catch (error) {
        console.error("Error creating node:", error);
        toast.error("Failed to add component");
      }
    },
    [setNodes, updateNodes]
  );

  const onNodeClick = useCallback(
    (event, node) => {
      setSelectedNode(node);
    },
    [setSelectedNode]
  );

  const onNodeContextMenu = useCallback(
    (event, node) => {
      event.preventDefault();
      setContextMenu({
        position: { x: event.clientX, y: event.clientY },
        type: "node",
        data: node,
      });
    },
    []
  );

  const onPaneContextMenu = useCallback(
    (event) => {
      event.preventDefault();
      setContextMenu({
        position: { x: event.clientX, y: event.clientY },
        type: "canvas",
      });
    },
    []
  );

  const handleContextMenuAction = useCallback(
    (action) => {
      if (!contextMenu) return;

      switch (action) {
        case "delete":
          if (contextMenu.type === "node" && contextMenu.data) {
            const nodeToDelete = contextMenu.data;
            setNodes((nds) => nds.filter((n) => n.id !== nodeToDelete.id));
            setEdges((eds) =>
              eds.filter(
                (e) =>
                  e.source !== nodeToDelete.id && e.target !== nodeToDelete.id
              )
            );
            toast.success("Component deleted");
          }
          break;
        case "duplicate":
          if (contextMenu.type === "node" && contextMenu.data) {
            const nodeToDuplicate = contextMenu.data;
            const position = {
              x: nodeToDuplicate.position.x + 50,
              y: nodeToDuplicate.position.y + 50,
            };
            const newNode = {
              ...nodeToDuplicate,
              id: `node-${Date.now()}`,
              position,
              selected: false,
              data: { ...nodeToDuplicate.data } // Deep copy data
            };
            setNodes((nds) => nds.concat(newNode));
            toast.success("Component duplicated");
          }
          break;
        case "color":
          if (contextMenu.type === "node" && contextMenu.data) {
            // For now, just cycle through some colors or set a random one
            // In a real app, this would open a color picker
            const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            setNodes((nds) =>
              nds.map((n) => {
                if (n.id === contextMenu.data.id) {
                  return {
                    ...n,
                    data: { ...n.data, color: randomColor },
                    style: { ...n.style, borderColor: randomColor }
                  };
                }
                return n;
              })
            );
            toast.success("Color changed");
          }
          break;
        case "add-note":
          // Add note logic similar to onPaneClick
          const noteNode = {
            id: `node-${Date.now()}`,
            type: "custom",
            position: reactFlowInstance.screenToFlowPosition({
              x: contextMenu.position.x,
              y: contextMenu.position.y,
            }),
            data: { label: "Note", type: "note", icon: "FaStickyNote" },
            style: { width: 150, height: 150, background: "#fef3c7", border: "1px solid #f59e0b" },
          };
          setNodes((nds) => nds.concat(noteNode));
          toast.success("Note added");
          break;
        case "add-text":
          const textNode = {
            id: `node-${Date.now()}`,
            type: "custom",
            position: reactFlowInstance.screenToFlowPosition({
              x: contextMenu.position.x,
              y: contextMenu.position.y,
            }),
            data: { label: "Text Block", type: "note", icon: "FaFont" },
            style: { width: 150, height: 50, border: "none", background: "transparent" },
          };
          setNodes((nds) => nds.concat(textNode));
          toast.success("Text added");
          break;
      }
      setContextMenu(null);
    },
    [contextMenu, setNodes, setEdges, reactFlowInstance]
  );

  const onPaneClick = useCallback(
    (event) => {
      setContextMenu(null); // Close context menu on click
      // Handle tool modes
      if (toolMode !== "select" && toolMode !== "pan") {
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        // Use reactFlowInstance.project to convert screen coordinates to flow coordinates if available
        // For now, simple offset calculation
        const position = reactFlowInstance ? reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        }) : {
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        };

        let newNode = null;
        const id = `node-${Date.now()}`;

        switch (toolMode) {
          case "rectangle":
            newNode = {
              id,
              type: "custom",
              position,
              data: { label: "Rectangle", type: "service", icon: "FaSquare" },
              style: { width: 100, height: 100, border: "2px solid #333", borderRadius: "4px" },
            };
            break;
          case "circle":
            newNode = {
              id,
              type: "custom",
              position,
              data: { label: "Circle", type: "service", icon: "FaCircle" },
              style: { width: 100, height: 100, border: "2px solid #333", borderRadius: "50%" },
            };
            break;
          case "text":
            newNode = {
              id,
              type: "custom",
              position,
              data: { label: "Text Block", type: "note", icon: "FaFont" },
              style: { width: 150, height: 50, border: "none", background: "transparent" },
            };
            break;
          case "note":
            newNode = {
              id,
              type: "custom",
              position,
              data: { label: "Note", type: "note", icon: "FaStickyNote" },
              style: { width: 150, height: 150, background: "#fef3c7", border: "1px solid #f59e0b" },
            };
            break;
        }

        if (newNode) {
          setNodes((nds) => {
            const newNodes = nds.concat(newNode);
            updateNodes(newNodes);
            return newNodes;
          });
          setToolMode("select"); // Reset to select mode after adding
          toast.success(`${toolMode} added`);
        }
      } else {
        setSelectedNode(null);
      }
    },
    [toolMode, setToolMode, setNodes, updateNodes, setSelectedNode, reactFlowInstance]
  );

  const handleDeleteSelected = useCallback(() => {
    if (selectedNode) {
      const newNodes = nodes.filter((n) => n.id !== selectedNode.id);
      const newEdges = edges.filter(
        (e) => e.source !== selectedNode.id && e.target !== selectedNode.id
      );

      setNodes(newNodes);
      setEdges(newEdges);
      updateCurrentProject({ nodes: newNodes, edges: newEdges });
      setSelectedNode(null);
      toast.success("Component deleted");
    }
  }, [
    selectedNode,
    nodes,
    edges,
    setNodes,
    setEdges,
    setSelectedNode,
    updateCurrentProject,
  ]);

  const handleClearCanvas = useCallback(() => {
    if (nodes.length === 0) return;

    if (window.confirm("Are you sure you want to clear the entire canvas?")) {
      setNodes([]);
      setEdges([]);
      updateCurrentProject({ nodes: [], edges: [] });
      setSelectedNode(null);
      toast.success("Canvas cleared");
    }
  }, [
    nodes.length,
    setNodes,
    setEdges,
    setSelectedNode,
    updateCurrentProject,
  ]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        if (
          selectedNode &&
          document.activeElement.tagName !== "INPUT" &&
          document.activeElement.tagName !== "TEXTAREA"
        ) {
          handleDeleteSelected();
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [selectedNode, handleDeleteSelected]);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring animation
  const springConfig = { damping: 20, stiffness: 100 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [3, -3]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-3, 3]), springConfig);

  const handleMouseMove = useCallback((e) => {
    if (!tiltEnabled) return;

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const normalizedX = (clientX / innerWidth) - 0.5;
    const normalizedY = (clientY / innerHeight) - 0.5;

    x.set(normalizedX);
    y.set(normalizedY);
  }, [tiltEnabled, x, y]);

  // Reset tilt when disabled
  React.useEffect(() => {
    if (!tiltEnabled) {
      x.set(0);
      y.set(0);
    }
  }, [tiltEnabled, x, y]);

  if (!currentProject) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Welcome to ArchyNex
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
            Create a new project or select an existing one to start building
            your system architecture
          </p>
          <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <p>• Drag components from the sidebar to the canvas</p>
            <p>• Connect components to show data flow</p>
            <p>• Use AI assistant for design suggestions</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 relative bg-gray-50 dark:bg-gray-900"
      onMouseMove={handleMouseMove}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="w-full h-full"
        ref={reactFlowWrapper} // Moved ref here
        style={{
          rotateX: tiltEnabled ? rotateX : 0,
          rotateY: tiltEnabled ? rotateY : 0,
          transformStyle: "preserve-3d"
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onNodeContextMenu={onNodeContextMenu}
          onPaneContextMenu={onPaneContextMenu}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          connectionLineType={ConnectionLineType.SmoothStep}
          connectionLineStyle={
            theme === 'cyberpunk' ? { stroke: "#22d3ee", strokeWidth: 2 } :
              theme === 'sketch' ? { stroke: "#000", strokeWidth: 2, strokeDasharray: "5 5" } :
                connectionLineStyle
          }
          fitView
          snapToGrid={snapToGrid}
          snapGrid={[20, 20]}
          attributionPosition="bottom-left"
          className={theme === 'cyberpunk' ? 'bg-gray-900' : theme === 'sketch' ? 'bg-white' : ''}
        >
          {showGrid && (
            <Background
              color={theme === 'cyberpunk' ? '#334155' : theme === 'sketch' ? '#e5e7eb' : '#f1f5f9'}
              gap={20}
              variant={theme === 'sketch' ? 'lines' : 'dots'}
            />
          )}

          <Controls
            position="bottom-right"
            className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg"
          />

          {showMinimap && (
            <MiniMap
              position="bottom-left"
              className={`shadow-lg border rounded-lg ${theme === 'cyberpunk' ? 'bg-gray-900 border-cyan-900' :
                theme === 'sketch' ? 'bg-white border-black border-2' :
                  'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              nodeColor={(node) => {
                if (theme === 'cyberpunk') return '#22d3ee';
                if (theme === 'sketch') return '#000';
                return node.data.color || '#eee';
              }}
              maskColor={theme === 'cyberpunk' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(240, 240, 240, 0.6)'}
            />
          )}

          {/* Smart Suggestions */}
          {selectedNode && nodes.find(n => n.id === selectedNode.id) && (
            <SmartSuggestions
              selectedNode={nodes.find(n => n.id === selectedNode.id)}
              onAddNode={handleAddSuggestedNode}
            />
          )}

          {/* Canvas Controls Panel */}
          <Panel position="top-right" className="space-y-2">
            {/* Show canvas stats */}
            {nodes.length > 0 && (
              <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {nodes.length} components • {edges.length} connections
                </div>
                <button
                  onClick={handleClearCanvas}
                  className="w-full px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                >
                  Clear Canvas
                </button>
              </div>
            )}
          </Panel>

          {/* Instructions Overlay */}
          {nodes.length === 0 && (
            <Panel position="top-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-md"
              >
                <div className="text-center">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Get Started
                  </h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                    Drag components from the sidebar to start building your system
                    design
                  </p>
                  <p className="text-xs text-blue-500 dark:text-blue-400">
                    💡 Click on components to edit their names and descriptions
                  </p>
                </div>
              </motion.div>
            </Panel>
          )}
        </ReactFlow>

        {/* Node Properties Panel */}
        <NodePropertiesPanel />

        {/* Context Menu */}
        {contextMenu && (
          <ContextMenu
            {...contextMenu}
            onAction={handleContextMenuAction}
            onClose={() => setContextMenu(null)}
          />
        )}
      </motion.div>
    </div>
  );
});

MainCanvas.displayName = "MainCanvas";

export default MainCanvas;
