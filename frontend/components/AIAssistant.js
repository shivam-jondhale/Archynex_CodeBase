import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaRobot,
  FaPaperPlane,
  FaSpinner,
  FaLightbulb,
  FaCog,
  FaRocket,
  FaShieldAlt,
  FaCheck,
  FaTrash,
} from "react-icons/fa";
import useStore from "../store";
import aiService from "../lib/ai-service";
import { iconMap } from "../lib/node-types";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";

const AIAssistant = () => {
  const { isAiAssistantOpen, setAiAssistantOpen, currentProject, user, updateCurrentProject, createProject } = useStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isAiAssistantOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAiAssistantOpen]);

  // Load chat history
  useEffect(() => {
    const loadHistory = async () => {
      if (user) {
        const history = await aiService.getChatHistory(user.id);
        // Map history to UI format
        const formattedHistory = history.map(msg => ({
          id: msg._id,
          type: msg.type,
          content: msg.message,
          isActionable: msg.isActionable,
          actionData: msg.actionData,
          isTyping: false
        }));
        setMessages(formattedHistory);
      }
    };

    if (isAiAssistantOpen) {
      loadHistory();
    }
  }, [isAiAssistantOpen, user]);

  const quickActions = [
    {
      id: "generate",
      label: "Generate Design",
      icon: FaLightbulb,
      color: "bg-yellow-500",
      prompt: "Help me design a system for ",
    },
    {
      id: "optimize",
      label: "Optimize Current",
      icon: FaCog,
      color: "bg-blue-500",
      prompt: "How can I optimize my current system design?",
    },
    {
      id: "scale",
      label: "Scaling Strategy",
      icon: FaRocket,
      color: "bg-green-500",
      prompt: "What scaling strategies should I consider for ",
    },
    {
      id: "security",
      label: "Security Review",
      icon: FaShieldAlt,
      color: "bg-red-500",
      prompt: "Review the security aspects of my system design",
    },
  ];

  const handleQuickAction = (action) => {
    setInput(action.prompt);
    inputRef.current?.focus();
  };

  const handleClearChat = async () => {
    if (user) {
      await aiService.clearHistory(user.id);
      setMessages([]);
      toast.success("Chat history cleared");
    }
  };

  const handleApplyChanges = async (actionData) => {
    if (!actionData) return;

    let activeProject = currentProject;

    // If no project is open, create one automatically
    if (!activeProject) {
      let projectName = "AI Generated Project";

      if (actionData.projectName) {
        projectName = actionData.projectName;
      } else {
        const lastUserMessage = [...messages].reverse().find(m => m.type === 'user');
        if (lastUserMessage) {
          // Clean up the prompt to make a better name
          let cleanName = lastUserMessage.content
            .replace(/^(help me |can you |please )?(design|create|generate|make|build) (a |an )?(system |app |application |platform )?(for )?/i, "")
            .trim();

          // Capitalize first letter
          if (cleanName) {
            cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
            // Truncate if still too long
            projectName = cleanName.length > 30 ? cleanName.slice(0, 30) + "..." : cleanName;
          }
        }
      }

      try {
        activeProject = await createProject(projectName, "Created from AI Assistant");
        toast.success(`Created new project: ${projectName}`);
      } catch (error) {
        console.error("Failed to create project:", error);
        toast.error("Failed to create new project");
        return;
      }
    }

    // Handle Full Design Replacement (Optimize / Generate)
    if (actionData.isFullReplacement && actionData.nodes) {
      // Use nodes directly as they contain string icon names which are now supported
      const resolvedNodes = actionData.nodes;

      updateCurrentProject({
        nodes: resolvedNodes,
        edges: actionData.edges || []
      });
      toast.success("Design updated successfully!");
      return;
    }

    // Handle Incremental Changes (Add/Modify)
    if (actionData.actions) {
      const newNodes = [...(activeProject.nodes || [])];

      actionData.actions.forEach(action => {
        if (action.type === 'add_node') {
          const newNode = {
            ...action.node,
            id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            position: {
              x: Math.random() * 500 + 100, // Random position for now
              y: Math.random() * 300 + 100
            }
          };
          newNodes.push(newNode);
        }
      });

      updateCurrentProject({ nodes: newNodes });
      toast.success("Changes applied to project");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isTyping) return;

    if (!aiService.isAvailable()) {
      toast.error("AI service is not available. Please check your API key.");
      return;
    }

    const userMessageContent = input;
    const userMessage = { id: Date.now(), type: "user", content: userMessageContent };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Save user message
    if (user) {
      await aiService.saveMessage(user.id, userMessageContent, 'user');
    }

    try {
      let response;
      let isActionable = false;
      let actionData = null;
      let displayText = "";

      // Determine if this is a request for changes
      const lowerInput = userMessageContent.toLowerCase();
      const actionKeywords = ['add', 'create', 'modify', 'update', 'change', 'insert', 'remove', 'delete', 'put', 'place', 'make'];

      // Helper function to parse AI JSON response
      const parseAIResponse = (raw) => {
        try {
          // 1. Try parsing raw first
          return JSON.parse(raw);
        } catch (e) {
          // 2. Try cleaning markdown
          let clean = raw.replace(/```json\n?|\n?```/g, '').trim();
          try {
            return JSON.parse(clean);
          } catch (e2) {
            // 3. Try extracting from first { to last }
            const first = clean.indexOf('{');
            const last = clean.lastIndexOf('}');
            if (first !== -1 && last !== -1) {
              try {
                return JSON.parse(clean.substring(first, last + 1));
              } catch (e3) {
                return null;
              }
            }
            return null;
          }
        }
      };

      if (actionKeywords.some(keyword => lowerInput.includes(keyword))) {
        const rawResponse = await aiService.generateActionableDesign(userMessageContent, currentProject);

        actionData = parseAIResponse(rawResponse);

        if (actionData) {
          displayText = actionData.explanation || "I've prepared the changes for you.";
          isActionable = true;
        } else {
          displayText = rawResponse;
        }
      } else if ((lowerInput.includes("optimize") || lowerInput.includes("review") || lowerInput.includes("security") || lowerInput.includes("fix") || lowerInput.includes("improve")) && currentProject) {
        if (!currentProject) {
          setIsLoading(false);
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            type: "ai",
            content: "Please open a project first so I can optimize it for you.",
            isTyping: false
          }]);
          return;
        }

        const rawResponse = await aiService.optimizeSystemDesign({
          nodes: currentProject.nodes,
          edges: currentProject.edges,
          name: currentProject.name,
        }, userMessageContent);

        actionData = parseAIResponse(rawResponse);

        if (actionData) {
          displayText = actionData.explanation || "I've optimized your design. Click below to apply.";
          actionData.isFullReplacement = true;
          isActionable = true;
        } else {
          console.warn("Failed to parse AI optimization response", rawResponse);
          displayText = "I analyzed your design but couldn't generate the changes automatically. Here is my analysis:\n\n" + rawResponse;
        }
      } else if (lowerInput.includes("generate") || lowerInput.includes("design a") || lowerInput.includes("create a system")) {
        const rawResponse = await aiService.generateSystemDesign(userMessageContent);

        actionData = parseAIResponse(rawResponse);

        if (actionData) {
          displayText = actionData.explanation || `I've generated a design for "${userMessageContent}". Click below to apply.`;
          actionData.isFullReplacement = true;
          isActionable = true;
        } else {
          displayText = rawResponse;
        }
      } else if (
        lowerInput.includes("explain") ||
        lowerInput.includes("what is")
      ) {
        const componentMatch = lowerInput.match(/explain|what is\s+(\w+)/);
        const component = componentMatch ? componentMatch[1] : "";
        displayText = await aiService.explainComponent(component, userMessageContent);
      } else if (
        lowerInput.includes("load test") ||
        lowerInput.includes("performance")
      ) {
        displayText = await aiService.generateLoadTestingStrategy(currentProject);
      } else {
        const rawResponse = await aiService.generateSystemDesign(userMessageContent);

        actionData = parseAIResponse(rawResponse);

        if (actionData) {
          displayText = actionData.explanation || "Here is the generated design.";
          actionData.isFullReplacement = true;
          isActionable = true;
        } else {
          displayText = rawResponse;
        }
      }

      setIsLoading(false);
      // Removed TypingEffect for simplicity and to fix state issues, just show message
      // setIsTyping(true); 

      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: displayText,
        isActionable,
        actionData,
        isTyping: false,
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Save AI message
      if (user) {
        await aiService.saveMessage(user.id, displayText, 'ai', isActionable, actionData);
      }

    } catch (error) {
      console.error("AI Assistant error:", error);
      setIsLoading(false);
      const errorMessage = {
        id: Date.now() + 1,
        type: "ai",
        content:
          "Sorry, I encountered an error while processing your request. Please try again or check your API configuration.",
        isTyping: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Failed to get AI response");
    }
  };

  if (!isAiAssistantOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col border border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <FaRobot className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  AI Assistant
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get help with your system design
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearChat}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors"
                title="Clear Chat History"
              >
                <FaTrash size={14} />
              </button>
              <button
                onClick={() => setAiAssistantOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          {messages.length === 0 && (
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Quick Actions
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                    >
                      <div
                        className={`w-8 h-8 ${action.color} rounded-md flex items-center justify-center`}
                      >
                        <Icon className="text-white text-sm" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {action.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <FaRobot className="mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  How can I help you with your system design today?
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col ${message.type === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg prose prose-sm dark:prose-invert ${message.type === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                      }`}
                  >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>

                  {/* Action Button */}
                  {message.isActionable && (
                    <button
                      onClick={() => handleApplyChanges(message.actionData)}
                      className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                    >
                      <FaCheck size={12} />
                      Apply Changes
                    </button>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-3 rounded-lg flex items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isLoading
                    ? "AI is thinking..."
                    : "Ask me about system design, optimization, scaling..."
                }
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaPaperPlane />
                )}
                Send
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIAssistant;
