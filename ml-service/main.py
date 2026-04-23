from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Any
from schemas import FullDesignResponse, DeltaActionsResponse
from repair import extract_json
from generator import generate_text, get_llm
import time
import json

app = FastAPI(title="ArchyNex Local ML Service")

class GenerateRequest(BaseModel):
    taskType: str
    input: dict
    context: Optional[dict] = None

@app.on_event("startup")
def startup_event():
    # Warm up the model by loading it into memory
    try:
        print("Loading local model on startup...")
        get_llm()
        print("Model loaded successfully.")
    except Exception as e:
        print(f"Warning: Failed to load model on startup: {e}")

@app.get("/health")
def health():
    try:
        get_llm()
        return {"status": "ok", "model_loaded": True}
    except Exception as e:
        return {"status": "error", "message": str(e), "model_loaded": False}

@app.post("/generate-json")
def generate_json(req: GenerateRequest):
    start_time = time.time()
    
    if req.taskType == "generate_full_design":
        requirements = req.input.get("requirements", "")
        
        prompt = f"""You are a senior system architect. Create a comprehensive system design for: "{requirements}".
You MUST return ONLY a valid JSON object. Do not include any explanations outside the JSON.

The JSON MUST follow this exact schema:
{{
  "explanation": "A brief explanation of your design choices",
  "projectName": "Name of the project",
  "nodes": [
    {{ "id": "unique-id", "type": "custom", "position": {{ "x": 0, "y": 0 }}, "data": {{ "label": "Node Name", "type": "service" }} }}
  ],
  "edges": [
    {{ "id": "e1-e2", "source": "node-1-id", "target": "node-2-id" }}
  ]
}}

Allowed values for node data.type: service, database, gateway, queue, cache, storage, analytics, security, client.
Layout the nodes logically (give them different x,y positions like x: 100, y: 200).
"""
        try:
            raw_output = generate_text(prompt)
            parsed_json = extract_json(raw_output)
            validated_response = FullDesignResponse(**parsed_json)
            return {
                "success": True,
                "data": validated_response.model_dump(),
                "metrics": {"latency_sec": round(time.time() - start_time, 2)}
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to extract or validate JSON. Error: {str(e)}")
            
    elif req.taskType == "optimize_full_design":
        requirements = req.input.get("requirements", "")
        # The frontend/backend should pass a compressed context, we serialize it
        current_design = json.dumps(req.context) if req.context else "{}"
        
        prompt = f"""You are a senior system architect. Optimize or modify this system design based on: "{requirements}".
Current Design Context:
{current_design}

You MUST return ONLY a valid JSON object representing the FULL OPTIMIZED design. Do not include explanations outside the JSON.
The JSON MUST follow this exact schema:
{{
  "explanation": "Explanation of your optimizations",
  "projectName": "Optimized Project",
  "nodes": [
    {{ "id": "id", "type": "custom", "position": {{ "x": 0, "y": 0 }}, "data": {{ "label": "Node", "type": "service" }} }}
  ],
  "edges": [
    {{ "id": "e1", "source": "n1", "target": "n2" }}
  ]
}}
"""
        try:
            raw_output = generate_text(prompt)
            parsed_json = extract_json(raw_output)
            validated_response = FullDesignResponse(**parsed_json)
            return {
                "success": True,
                "data": validated_response.model_dump(),
                "metrics": {"latency_sec": round(time.time() - start_time, 2)}
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to extract or validate JSON. Error: {str(e)}")

    elif req.taskType == "generate_delta_actions":
        requirements = req.input.get("requirements", "")
        current_design = json.dumps(req.context) if req.context else "{}"
        
        prompt = f"""You are a system architect. The user wants to add or modify specific components: "{requirements}".
Current Design Context:
{current_design}

You MUST return ONLY a valid JSON object containing a list of actions to perform.
The JSON MUST follow this exact schema:
{{
  "explanation": "Brief explanation of actions",
  "actions": [
    {{
      "type": "add_node",
      "node": {{ "id": "new-node", "type": "custom", "position": {{ "x": 0, "y": 0 }}, "data": {{ "label": "New Node", "type": "database" }} }}
    }}
  ]
}}
"""
        try:
            raw_output = generate_text(prompt)
            parsed_json = extract_json(raw_output)
            validated_response = DeltaActionsResponse(**parsed_json)
            return {
                "success": True,
                "data": validated_response.model_dump(),
                "metrics": {"latency_sec": round(time.time() - start_time, 2)}
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to extract or validate JSON. Error: {str(e)}")

    else:
        raise HTTPException(status_code=400, detail=f"Unsupported taskType: {req.taskType}")
