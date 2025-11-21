# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/4545b0de-c520-41dd-acc7-dcf3da7168f8

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/4545b0de-c520-41dd-acc7-dcf3da7168f8) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/4545b0de-c520-41dd-acc7-dcf3da7168f8) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Docker Deployment

This project can be easily deployed using Docker and Docker Compose for easier migration and deployment.

### Prerequisites

- Docker (version 20.10 or later)
- Docker Compose (version 2.0 or later)

### Quick Start

1. **Build and start all services:**
   ```bash
   docker-compose up -d
   ```

2. **Access the application:**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Environment Variables

Create a `.env` file in the project root (optional) to customize settings:

```env
# Backend API URL (used when building frontend)
VITE_API_URL=http://localhost:8000

# Backend environment variables
DISABLE_AUTH=false
CLERK_SECRET_KEY=your_clerk_secret_key_here
```

### Docker Commands

- **Start services:** `docker-compose up -d`
- **Stop services:** `docker-compose down`
- **View logs:** `docker-compose logs -f`
- **Rebuild after changes:** `docker-compose up -d --build`
- **Stop and remove volumes:** `docker-compose down -v`

### Database Persistence

The SQLite database (`leakguard.db`) is persisted in the `backend/` directory via a volume mount. This ensures your data survives container restarts.

### Development with Docker

For development, you can still run services locally:

- **Frontend (local):** `npm run dev`
- **Backend (local):** `cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000`

Or use Docker for a consistent environment across different machines.
