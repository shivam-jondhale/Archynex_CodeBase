const express = require('express');
const { GoogleGenAI } = require("@google/genai");
const router = express.Router();

// Normalization function for system designs
function normalizeDesign(design) {
    if (!design) return design;
    
    const validTypes = ['service', 'database', 'gateway', 'queue', 'cache', 'storage', 'analytics', 'security', 'client'];
    
    const styleMap = {
        service: { color: "#3b82f6", icon: "FaServer" },
        database: { color: "#8b5cf6", icon: "FaDatabase" },
        gateway: { color: "#f97316", icon: "FaKey" },
        queue: { color: "#ef4444", icon: "FaBolt" },
        cache: { color: "#ef4444", icon: "FaBolt" },
        storage: { color: "#6b7280", icon: "FaHdd" },
        analytics: { color: "#0f766e", icon: "FaChartLine" },
        security: { color: "#dc2626", icon: "FaShieldAlt" },
        client: { color: "#0ea5e9", icon: "FaDesktop" }
    };

    function normalizeNode(node, index) {
        if (!node.id) node.id = `node-${Date.now()}-${index || Math.floor(Math.random()*1000)}`;
        if (!node.type) node.type = "custom";
        if (!node.data) node.data = {};
        
        let nodeType = (node.data.type || '').toLowerCase();
        
        // Canonicalize type mappings
        if (['api', 'microservice', 'backend'].includes(nodeType)) nodeType = 'service';
        if (['db', 'sql', 'nosql', 'postgres', 'mongo'].includes(nodeType)) nodeType = 'database';
        if (['auth', 'firewall', 'waf'].includes(nodeType)) nodeType = 'security';
        if (['frontend', 'ui', 'web', 'app', 'mobile'].includes(nodeType)) nodeType = 'client';
        if (['broker', 'kafka', 'rabbitmq', 'pubsub'].includes(nodeType)) nodeType = 'queue';
        if (['redis', 'memcached'].includes(nodeType)) nodeType = 'cache';
        if (['s3', 'blob', 'bucket'].includes(nodeType)) nodeType = 'storage';
        if (['metrics', 'monitoring', 'dashboard'].includes(nodeType)) nodeType = 'analytics';
        
        if (!validTypes.includes(nodeType)) {
            nodeType = 'service'; // fallback
        }
        
        node.data.type = nodeType;
        
        // Inject styles based on canonical type
        const style = styleMap[nodeType];
        if (!node.data.icon) node.data.icon = style.icon;
        if (!node.data.color) node.data.color = style.color;
        
        return node;
    }

    if (design.nodes) {
        design.nodes = design.nodes.map(normalizeNode);
    }

    if (design.edges) {
        design.edges = design.edges.map((edge, index) => {
            if (!edge.id) edge.id = `edge-${Date.now()}-${index}`;
            if (!edge.style) edge.style = { stroke: "#3b82f6", strokeWidth: 2 };
            edge.animated = true; // enforce animated
            return edge;
        });
        
        // Reject broken edges pointing to non-existent nodes
        if (design.nodes) {
            const nodeIds = new Set(design.nodes.map(n => n.id));
            design.edges = design.edges.filter(edge => nodeIds.has(edge.source) && nodeIds.has(edge.target));
        }
    }

    // Normalize delta actions
    if (design.actions) {
        design.actions = design.actions.map((action, index) => {
            if (action.node) {
                action.node = normalizeNode(action.node, index);
            }
            return action;
        });
    }

    return design;
}

async function handleGeminiGeneration(prompt, model, res) {
    if (!prompt) {
        console.error("Prompt is missing");
        return res.status(400).json({ message: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("API key not configured");
        return res.status(500).json({ message: 'API key not configured' });
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        const text = response.text;
        return res.status(200).json({ text });
    } catch (error) {
        console.error("AI Generation Error Details:", error);
        return res.status(500).json({
            message: 'Failed to generate content',
            error: error.message
        });
    }
}

router.post('/generate', async (req, res) => {
    console.log("Received AI generation request");
    
    const { prompt, model = "gemini-3-flash-preview", taskType, input, context } = req.body;

    // Route based on taskType
    if (taskType && ['generate_full_design', 'optimize_full_design', 'generate_delta_actions'].includes(taskType)) {
        console.log(`Routing ${taskType} to local ML service...`);
        try {
            // Local Python API uses fetch (Node 18+)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

            const response = await fetch('http://127.0.0.1:8000/generate-json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskType, input, context }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Local ML service returned status ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success && result.data) {
                console.log("Normalizing local ML response...");
                const normalizedData = normalizeDesign(result.data);
                // Return as text stringified json so frontend's parser handles it smoothly
                return res.status(200).json({ text: JSON.stringify(normalizedData) });
            } else {
                throw new Error("Local ML service failed to return structured data");
            }
        } catch (error) {
            console.error("Local ML routing failed:", error.message);
            console.log("Falling back to Gemini for safety...");
            
            // Build a fallback prompt
            let fallbackPrompt = prompt;
            if (!fallbackPrompt && input && input.requirements) {
                fallbackPrompt = `Generate a system design for: ${input.requirements}. Please return a JSON format with nodes and edges.`;
            }
            return handleGeminiGeneration(fallbackPrompt, model, res);
        }
    }

    // Default: route to Gemini (explanations, chat, load testing)
    return handleGeminiGeneration(prompt, model, res);
});

// Chat History Routes (Unchanged)
router.get('/chat', async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    try {
        const client = await require('../lib/db');
        const db = client.db("Archynex");
        const chats = await db.collection("chats").find({ userId }).sort({ timestamp: 1 }).toArray();
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch chat history', error: error.message });
    }
});

router.post('/chat', async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    try {
        const { message, type, isActionable, actionData } = req.body;
        if (!message || !type) return res.status(400).json({ message: 'Message and type are required' });

        const newChat = {
            userId, message, type,
            timestamp: new Date(),
            isActionable: isActionable || false,
            actionData: actionData || null
        };

        const client = await require('../lib/db');
        const db = client.db("Archynex");
        const result = await db.collection("chats").insertOne(newChat);
        res.status(201).json({ ...newChat, _id: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Failed to save message', error: error.message });
    }
});

router.delete('/chat', async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    try {
        const client = await require('../lib/db');
        const db = client.db("Archynex");
        await db.collection("chats").deleteMany({ userId });
        res.status(200).json({ message: 'Chat history cleared' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to clear chat history', error: error.message });
    }
});

module.exports = router;
