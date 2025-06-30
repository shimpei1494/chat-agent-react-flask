# AI Chat Agent - React + Flask

A modern chat application with React TypeScript frontend and Flask Python backend, powered by OpenAI API.

## Quick Start

### Prerequisites

- Node.js v22 (managed with Volta)
- Python 3.11
- uv (Python package manager)

### Setup

1. **Clone and navigate to the project:**
   ```bash
   cd chat-agent-react-flask
   ```

2. **Backend setup:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env and add your OPENAI_API_KEY
   uv sync
   ```

3. **Frontend setup:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend (Terminal 1):**
   ```bash
   cd backend
   uv run python app.py
   ```
   Backend runs on http://localhost:5000

2. **Start the frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on http://localhost:5173

## Features

- **AI Chat Interface**: Clean, responsive chat UI with message history
- **Multiple AI Models**: Support for GPT-4o, GPT-4o-mini, and demo mode
- **Advanced Settings**: Customizable system prompts and temperature control
- **Real-time Communication**: Seamless frontend-backend integration
- **Modern Tech Stack**: React 18, TypeScript, Mantine UI, Flask, Pydantic

## Project Structure

```
chat-agent-react-flask/
├── frontend/          # React TypeScript frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/      # Page components
│   │   └── api/        # API communication
│   └── package.json
├── backend/           # Flask Python backend
│   ├── app/
│   │   ├── controller/ # Request handlers
│   │   ├── service/    # Business logic
│   │   ├── models/     # OpenAI integration
│   │   ├── core/       # Message processing
│   │   └── types/      # Type definitions
│   └── pyproject.toml
└── README.md
```

## Development

- **Frontend linting**: `npm run lint`
- **Frontend formatting**: `npm run format`
- **Backend linting**: `uv run ruff check`
- **Backend formatting**: `uv run ruff format`
- **Type checking**: `uv run mypy app/`

## Environment Variables

Create `backend/.env` with:
```
OPENAI_API_KEY=your_openai_api_key_here
FLASK_ENV=development
FLASK_DEBUG=True
```