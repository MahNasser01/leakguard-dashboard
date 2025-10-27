# Lakera Backend API

FastAPI backend with SQLite database and SQLAlchemy ORM.

## Setup

1. **Install Python 3.8+**

2. **Create virtual environment**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
Create a `.env` file in the backend directory:
```bash
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
```

5. **Run the server**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

## API Endpoints

### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects/{id}` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Policies
- `GET /api/policies` - List all policies
- `GET /api/policies/{id}` - Get policy by ID
- `POST /api/policies` - Create new policy
- `PUT /api/policies/{id}` - Update policy
- `DELETE /api/policies/{id}` - Delete policy

### API Keys
- `GET /api/api-keys` - List all API keys
- `POST /api/api-keys` - Generate new API key
- `DELETE /api/api-keys/{id}` - Delete API key

### Logs
- `GET /api/logs` - List all log entries
- `POST /api/logs` - Create new log entry

## Database

SQLite database file: `lakera.db` (automatically created on first run)

## Development

The database tables are automatically created when you start the server for the first time.
