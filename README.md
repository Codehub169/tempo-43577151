## Prerequisites

Before you begin, ensure you have the following installed **on your host machine (your main computer, not inside a Docker container)**:

- [Node.js](https://nodejs.org/) (v18 or later recommended) - Primarily for local frontend/backend development if not using Docker for everything.
- [Docker](https://www.docker.com/get-started) - Essential for running the application using the `startup.sh` script.
- [Docker Compose](https://docs.docker.com/compose/install/) - Also essential, usually comes with Docker Desktop.

**Important:** The `startup.sh` script needs to be executed on your host machine where Docker and Docker Compose are installed and accessible in your system's PATH.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Set up environment variables:**
    This project uses two main `.env` files for configuration:
    -   A **root `.env` file**: Located in the project's root directory. It's used by Docker Compose to configure services (like database credentials, ports) and to pass specific environment variables to the application containers.
    -   A **`backend/.env` file**: Located in the `backend/` directory. It's used directly by the NestJS backend application for its configuration, both when running locally (outside Docker) and when running inside a Docker container (due to a volume mount in `docker-compose.yml`).

    Follow these steps:

    a.  **Create and configure the root `.env` file:**
        Ensure you are in the project root directory. Copy the example environment file:
        ```bash
        cp .env.example .env
        ```
        Open this newly created root `.env` file and update the variables as needed. 
        **Crucially, `JWT_SECRET` must be changed to a strong, unique secret.** This secret is used by the backend service when running via Docker.

    b.  **Create and configure the `backend/.env` file:**
        This file is essential for the backend application's runtime configuration.
        ```bash
        # Recommended: Start with values from your root .env, then customize for backend.
        cp .env backend/.env
        # Alternatively, if a backend/.env.example exists and is more specific:
        # cp backend/.env.example backend/.env
        ```
        Open `backend/.env` and customize it:
        -   **For local backend development (without Docker):** Ensure settings like `DB_HOST` (e.g., `localhost`), `DB_PORT`, `API_PORT` (e.g., `3001` if different from Docker's), and `JWT_SECRET` are appropriate for your local setup.
        -   **For Dockerized backend:** This file is mounted into the container. While variables set in `docker-compose.yml` (from root `.env`) generally take precedence for overlapping keys, this file can provide additional backend-specific variables not managed by `docker-compose.yml`'s `environment:` block for the backend service.

    *Understanding Environment Variable Precedence (for Dockerized Backend):*
    When the backend runs in Docker, environment variables are sourced with the following general precedence (higher number takes precedence):
    1.  Variables loaded by the NestJS application from the mounted `backend/.env` file.
    2.  Variables defined in the `environment:` block of the `backend` service in `docker-compose.yml` (these are interpolated using values from the root `.env` file).

3.  **Run the application:**
    Make sure Docker Desktop (or Docker daemon on Linux) is running **on your host machine**.
    From the project root directory, execute the `startup.sh` script **on your host machine's terminal**:
    ```bash
    bash startup.sh
    ```
    **Do NOT run `startup.sh` inside a Docker container.** This script is designed to check for Docker and Docker Compose on your host, then build and manage the necessary Docker containers for the application.

    If you encounter errors like "Docker command not found", please verify your Docker installation on your host machine and ensure its command-line tools are accessible in your system's PATH.

    This script will typically:
    - Check for Docker and Docker Compose on your host machine.
    - Build the frontend static assets (e.g., using `frontend/Dockerfile.frontend`).
    - Build the backend Docker image (e.g., using `Dockerfile.backend`), which may include copying frontend assets.
    - Start services like PostgreSQL database and the backend application using Docker Compose.

    Once the script completes successfully, the application services will be running. The connection error `HTTPConnectionPool... No connection could be made because the target machine actively refused it` usually indicates that the application services did not start correctly. This is often due to issues encountered while running `startup.sh` (such as Docker not being found or other script errors).

    After successful startup, the application will typically be accessible at:
    - **Frontend & API:** [http://localhost:9000](http://localhost:9000) (Adjust URL/port if your application's configuration in the root `.env` file's `APP_PORT` is different)
    - API endpoints are usually prefixed, for example: `http://localhost:9000/api/users` (The prefix is `/api` by default, as set in the backend).