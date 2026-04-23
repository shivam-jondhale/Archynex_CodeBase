import os

try:
    from llama_cpp import Llama
except ImportError:
    Llama = None

model_path = os.path.join(os.path.dirname(__file__), "models", "Phi-3-mini-4k-instruct-q4.gguf")
llm_instance = None

def get_llm():
    global llm_instance
    if Llama is None:
        raise ImportError("llama-cpp-python is not installed.")
        
    if llm_instance is None:
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model not found at {model_path}. Please run download_model.py")
        
        # Initialize model
        # n_ctx is the context window size. 4096 is good for Phi-3-mini-4k.
        # n_threads=6 assumes 6 cores on i5 11400H
        llm_instance = Llama(model_path=model_path, n_ctx=4096, n_threads=6, verbose=False)
    
    return llm_instance

def generate_text(prompt: str, max_tokens: int = 1500) -> str:
    llm = get_llm()
    
    # Phi-3 instruct format
    formatted_prompt = f"<|user|>\n{prompt}<|end|>\n<|assistant|>\n"
    
    response = llm(
        formatted_prompt,
        max_tokens=max_tokens,
        stop=["<|end|>", "<|user|>"],
        temperature=0.1,  # Low temperature for more deterministic output
    )
    
    return response["choices"][0]["text"].strip()
