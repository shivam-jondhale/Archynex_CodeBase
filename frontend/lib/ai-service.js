class AIService {
  constructor() {
    // No initialization needed for client-side fetch wrapper
  }

  API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  async generateContent(prompt, model = "gemini-3-flash-preview", context = null, taskType = null, input = null) {
    try {
      let finalPrompt = prompt;

      // Inject project context if available and not using a structured task
      if (context && !taskType) {
        finalPrompt = `
        Context - Current System Design:
        ${JSON.stringify(context, null, 2)}

        User Request:
        ${prompt}
        `;
      }

      const bodyPayload = { prompt: finalPrompt, model };
      if (taskType) {
          bodyPayload.taskType = taskType;
          bodyPayload.input = input;
          bodyPayload.context = context;
      }

      const response = await fetch(`${this.API_URL}/api/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate content');
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error("AI Service Error:", error);
      throw error;
    }
  }

  // Chat History Methods
  async getChatHistory(userId) {
    try {
      const response = await fetch(`${this.API_URL}/api/ai/chat?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch history');
      return await response.json();
    } catch (error) {
      console.error("Failed to get chat history:", error);
      return [];
    }
  }

  async saveMessage(userId, message, type, isActionable = false, actionData = null) {
    try {
      await fetch(`${this.API_URL}/api/ai/chat?userId=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, type, isActionable, actionData }),
      });
    } catch (error) {
      console.error("Failed to save message:", error);
    }
  }

  async clearHistory(userId) {
    try {
      await fetch(`${this.API_URL}/api/ai/chat?userId=${userId}`, { method: 'DELETE' });
    } catch (error) {
      console.error("Failed to clear history:", error);
    }
  }

  compressDesign(design) {
    if (!design) return {};
    return {
      name: design.name || "System Design",
      nodes: (design.nodes || []).map(n => ({
        id: n.id,
        type: n.data?.type || 'service',
        label: n.data?.label || 'Node'
      })),
      edges: (design.edges || []).map(e => ({
        source: e.source,
        target: e.target
      }))
    };
  }

  // Actionable Design Generation
  async generateActionableDesign(prompt, currentProject) {
    const systemPrompt = `
    You are an expert system architect assistant.
    The user wants to modify their system design.
    
    Current Design Context:
    ${JSON.stringify(this.compressDesign(currentProject), null, 2)}

    User Request: ${prompt}

    If the user's request implies adding, removing, or modifying components, you MUST return a JSON object with the following structure:
    {
      "explanation": "Brief explanation of changes...",
      "actions": [
        {
          "type": "add_node",
          "node": { "type": "custom", "data": { "label": "Name", "type": "service" }, "position": { "x": 0, "y": 0 } }
        }
      ]
    }
    `;

    return this.generateContent(systemPrompt, "gemini-3-flash-preview", this.compressDesign(currentProject), "generate_delta_actions", { requirements: prompt });
  }

  async generateSystemDesign(requirements) {
    // We keep a basic prompt for Gemini fallback, but the primary routing is via taskType
    const prompt = `
    You are an expert system architect. Create a complete system architecture for: "${requirements}".
    
    You MUST return a JSON object representing the system design.
    The JSON structure MUST be:
    {
      "explanation": "Brief explanation of the architecture...",
      "projectName": "Suggested Project Name (e.g., E-Commerce System)",
      "nodes": [
        { "id": "unique_id", "type": "custom", "position": { "x": 0, "y": 0 }, "data": { "label": "Name", "type": "service" } }
      ],
      "edges": [
        { "id": "e1-2", "source": "id1", "target": "id2" }
      ]
    }

    Allowed Node Types (data.type):
    - service, database, gateway, queue, cache, storage, analytics, security, client
    `;

    return this.generateContent(prompt, "gemini-3-flash-preview", null, "generate_full_design", { requirements });
  }

  async optimizeSystemDesign(currentDesign, userRequest = "Optimize for performance, scalability, and reliability") {
    const prompt = `
    Act as a Senior System Architect. 
    User Request: "${userRequest}"
    
    Based on the request, optimize/modify the following system design.

    Current Design:
    ${JSON.stringify(this.compressDesign(currentDesign), null, 2)}

    You MUST return a JSON object representing the FULL OPTIMIZED design (replacing the old one).
    The JSON structure MUST be:
    {
      "explanation": "Explanation of changes and findings...",
      "projectName": "Suggested Project Name (e.g., Optimized E-Commerce System)",
      "nodes": [ ... ],
      "edges": [ ... ]
    }
    `;

    return this.generateContent(prompt, "gemini-3-flash-preview", this.compressDesign(currentDesign), "optimize_full_design", { requirements: userRequest });
  }

  async explainComponent(componentType, context = "") {
    const prompt = `
    Explain the ${componentType} component in system design:
    
    Context: ${context}
    
    Please provide:
    1. What this component does
    2. When to use it
    3. Common configurations
    4. Integration considerations
    5. Alternatives to consider
    
    Keep the explanation concise but comprehensive.
    `;

    return this.generateContent(prompt, "gemini-2.5-flash");
  }

  async generateLoadTestingStrategy(systemDesign) {
    const prompt = `
    Create a load testing strategy for this system design:
    
    System Design: ${JSON.stringify(systemDesign, null, 2)}
    
    Please provide:
    1. Key performance metrics to monitor
    2. Test scenarios to implement
    3. Load testing tools recommendations
    4. Expected bottlenecks to watch for
    5. Scalability testing approach
    
    Make it practical and actionable for implementation. Keep the response structured.
    `;

    return this.generateContent(prompt, "gemini-2.5-flash");
  }

  isAvailable() {
    return true; // Always available as it uses the backend API
  }
}

export default new AIService();
