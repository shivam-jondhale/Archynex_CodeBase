# ArchyNex

**ArchyNex** is an advanced, AI-powered system architecture design tool that allows developers and architects to intuitively build, visualize, and generate software system architectures. Featuring an interactive infinite canvas, smart AI generation capabilities, and a microservices-based backend, ArchyNex streamlines the process of system design from conceptualization to export.

## 🚀 Features

- **Interactive Infinite Canvas:** Drag and drop components to build comprehensive system architectures easily.
- **AI-Powered Architecture Generation:** Describe your system requirements in natural language and let the AI generate the architecture nodes and connections automatically.
- **Smart Suggestions & Repair:** Get AI recommendations to improve your architecture, fix potential bottlenecks, or complete missing components.
- **Rich Component Library:** Utilize various predefined node types (databases, compute, storage, APIs, queues, etc.) with customizable properties.
- **Project Management:** Save, load, and manage your architecture projects securely.
- **Export & Share:** Export your architectures to various formats for documentation or sharing with your team.
- **Modern UI/UX:** Built with Next.js and Tailwind CSS, featuring dark mode, mini-map, and focus modes.

## 🛠️ Technology Stack

ArchyNex is composed of three main services:

### 1. Frontend (`/frontend`)
- **Framework:** Next.js, React
- **Styling:** Tailwind CSS
- **Canvas/UI:** Custom interactive canvas implementation with advanced toolbars, context menus, and property panels.

### 2. Backend (`/backend`)
- **Framework:** Node.js, Express
- **Database:** MongoDB
- **Features:** Authentication (Login/Register), Project saving/loading, and proxying requests to the AI services (Google Gemini API).

### 3. ML Service (`/ml-service`)
- **Framework:** Python, FastAPI
- **Features:** A dedicated, lightweight local ML inference service. It is responsible for parsing system descriptions and returning structured JSON formats for system components and relationships.
- **Models:** Utilizes Hugging Face models for local, CPU-efficient design generation.

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- MongoDB instance (local or Atlas)

### 1. Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```
Start the backend server:
```bash
npm start
```

### 2. Setup ML Service
```bash
cd ml-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```
Start the ML service:
```bash
python main.py
```

### 3. Setup Frontend
```bash
cd frontend
npm install
```
Create a `.env.local` file in the `frontend/` directory (if required) to set the API URLs.
Start the development server:
```bash
npm run dev
```

The application should now be accessible at `http://localhost:3000`.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License

This project is licensed under the MIT License.
