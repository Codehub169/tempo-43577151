# End-to-End CRM Application

This is a comprehensive CRM application designed for an Indian IT Company, enabling all operations to be performed through a unified platform. It aims to streamline workflows, centralize data, and improve visibility across sales, projects, and support.

## Tech Stack

- **Frontend:** React 18+ with Vite
- **Styling:** Tailwind CSS
- **UI Components:** Headless UI & Radix UI (for building custom components)
- **Backend:** Node.js with NestJS (TypeScript)
- **Database:** PostgreSQL
- **Containerization:** Docker & Docker Compose

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Set up environment variables:**
    Copy the example environment file `.env.example` to a new file named `.env` in the project root:
    ```bash
    cp .env.example .env
    ```
    Open `.env` and update the variables as needed. **Especially `JWT_SECRET` should be changed to a strong, unique secret.**
    The backend also uses a `.env` file located in `backend/.env`. You should copy the root `.env` file to `backend/.env` or create it with the same content, specifically for the backend service to pick up during development if not using Docker overrides directly or for local non-Docker backend development.
    ```bash
    cp .env backend/.env 
    ```

3.  **Run the application:**
    The `startup.sh` script handles building and starting all services using Docker Compose.
    ```bash
    bash startup.sh
    ```
    This script will:
    - Check for Docker and Docker Compose.
    - Build the frontend static assets using `frontend/Dockerfile.frontend` (tagged as `crm-frontend-build-stage`).
    - Build the backend Docker image using `Dockerfile.backend`, which copies the frontend assets from `crm-frontend-build-stage` and serves them.
    - Start the PostgreSQL database service.
    - Start the backend service.

    Once the script completes, the application will be accessible at:
    - **Frontend & API:** [http://localhost:9000](http://localhost:9000)
    - API endpoints are typically prefixed with `/api` (e.g., `http://localhost:9000/api/users`).

## Development

### Backend (`backend/`)

- The backend is a NestJS application.
- Source code is in `backend/src/`.
- To run the backend locally for development (outside Docker, requires local Node.js and PostgreSQL instance or connection to Dockerized DB):
  ```bash
  cd backend
  npm install
  npm run start:dev
  ```
  Ensure your `backend/.env` file has correct database credentials for your local/accessible PostgreSQL instance.

### Frontend (`frontend/`)

- The frontend is a React application built with Vite.
- Source code is in `frontend/src/`.
- To run the frontend locally for development (Vite dev server, connecting to backend API):
  ```bash
  cd frontend
  npm install
  npm run dev
  ```
  This will typically start the frontend on a different port (e.g., `http://localhost:5173`). You'll need to configure it to proxy API requests to your backend service (running via Docker or locally).
  For the integrated Docker setup, the frontend is built into static files and served by the backend.

## Docker Compose Commands

- **View logs:**
  ```bash
  docker-compose logs -f backend
  docker-compose logs -f db
  ```
- **Stop services:**
  ```bash
  docker-compose down
  ```
- **Stop and remove volumes (deletes database data):**
  ```bash
  docker-compose down -v
  ```

## Project Structure

- `startup.sh`: Main script to build and run the application.
- `docker-compose.yml`: Defines services (database, backend with integrated frontend).
- `Dockerfile.backend`: Dockerfile for the NestJS backend (includes serving frontend static assets).
- `Dockerfile.frontend`: Dockerfile for building React frontend static assets.
- `.env.example`: Template for environment variables.
- `backend/`: Contains the NestJS backend application.
- `frontend/`: Contains the React frontend application.
- `.github/workflows/`: Contains CI/CD workflows (e.g., `ci.yml`).

## Contributing

Contributions are welcome! Please follow standard Git practices (fork, feature branch, pull request).
(Further details to be added)

## License

This project is licensed under the MIT License. See the `LICENSE` file for details (if applicable).
