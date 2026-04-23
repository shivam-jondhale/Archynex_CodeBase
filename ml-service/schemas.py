from pydantic import BaseModel, Field
from typing import List, Optional

class Position(BaseModel):
    x: float
    y: float

class NodeData(BaseModel):
    label: str
    type: str  # e.g., 'service', 'database', etc. We normalize in Node backend.
    
    # We allow extra fields but don't strictly require them, as Node will inject defaults
    model_config = {
        "extra": "allow"
    }

class Node(BaseModel):
    id: str
    type: str = "custom"
    position: Position
    data: NodeData

class Edge(BaseModel):
    id: str
    source: str
    target: str
    
    model_config = {
        "extra": "allow"
    }

class FullDesignResponse(BaseModel):
    explanation: str
    projectName: str
    nodes: List[Node]
    edges: List[Edge]

class Action(BaseModel):
    type: str  # e.g., 'add_node', 'remove_node', 'update_node', etc.
    node: Optional[Node] = None

class DeltaActionsResponse(BaseModel):
    explanation: str
    actions: List[Action]
