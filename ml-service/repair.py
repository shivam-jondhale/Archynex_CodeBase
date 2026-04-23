import json
import re

def extract_json(text: str) -> dict:
    """
    Extracts JSON from a string that might contain markdown fences or leading/trailing text.
    """
    # 1. Try to find a markdown JSON block
    match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL | re.IGNORECASE)
    if match:
        text_to_parse = match.group(1)
    else:
        # 2. Fallback to finding the first { and last }
        start = text.find('{')
        end = text.rfind('}')
        if start != -1 and end != -1:
            text_to_parse = text[start:end+1]
        else:
            text_to_parse = text
            
    try:
        return json.loads(text_to_parse)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse JSON. Error: {e}\nRaw output: {text}")
