import os
from huggingface_hub import hf_hub_download

def download_phi3():
    model_dir = os.path.join(os.path.dirname(__file__), "models")
    os.makedirs(model_dir, exist_ok=True)
    
    print("Downloading Phi-3-mini-4k-instruct-q4.gguf... This may take a few minutes (approx 2.3GB).")
    model_path = hf_hub_download(
        repo_id="microsoft/Phi-3-mini-4k-instruct-gguf",
        filename="Phi-3-mini-4k-instruct-q4.gguf",
        local_dir=model_dir,
        local_dir_use_symlinks=False
    )
    print(f"Model downloaded successfully to: {model_path}")

if __name__ == "__main__":
    download_phi3()
