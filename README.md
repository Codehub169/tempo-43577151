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
    
    **CRITICAL NOTE:** The `startup.sh` script **must** be executed directly on your **host machine's terminal**, not from within a Docker container. The script requires access to the Docker CLI installed on your host to build and manage containers. Running it elsewhere will lead to errors like "Docker command not found".

    From the project root directory, execute the script:
    ```bash
    bash startup.sh
    ```
    If you still encounter errors like "Docker command not found" after ensuring you are on the host, please verify your Docker installation and PATH settings as detailed in the [Troubleshooting](#troubleshooting) section.

    This script will typically:
    - Check for Docker and Docker Compose on your host machine.
    - Build the frontend static assets (e.g., using `frontend/Dockerfile.frontend`).
    - Build the backend Docker image (e.g., using `Dockerfile.backend`), which may include copying frontend assets.
    - Start services like PostgreSQL database and the backend application using Docker Compose.

    Once the script completes successfully, the application services will be running. The connection error `HTTPConnectionPool... No connection could be made because the target machine actively refused it` usually indicates that the application services did not start correctly. This is often due to issues encountered while running `startup.sh` (such as Docker not being found or other script errors). See the [Troubleshooting](#troubleshooting) section for more guidance.

    After successful startup, the application will typically be accessible at:
    - **Frontend & API:** [http://localhost:9000](http://localhost:9000) (Adjust URL/port if your application's configuration in the root `.env` file's `APP_PORT` is different)
    - API endpoints are usually prefixed, for example: `http://localhost:9000/api/users` (The prefix is `/api` by default, as set in the backend).

## Troubleshooting

This section addresses common issues you might encounter while setting up or running the application.

### 1. 'Docker command not found' or 'Docker Compose not found'

**Symptom:**
You see an error message similar to:
- `Error: Docker command not found in your PATH.`
- `Error: Docker Compose (v1: docker-compose, or v2: docker compose) is not installed, not found in PATH, or not executable.`

**Cause:**
This means that Docker or Docker Compose is either not installed on your host machine, or their command-line tools are not accessible in your system's PATH.

**Solution:**
1.  **Verify Installation:** Ensure Docker and Docker Compose are correctly installed on your **host machine**. Refer to the [Prerequisites](#prerequisites) section for installation links.
2.  **Check PATH:** Make sure the directories containing `docker` and `docker-compose` (or `docker compose`) executables are included in your system's PATH environment variable.
3.  **Run `startup.sh` on Host:** Crucially, the `startup.sh` script **must be executed directly on your host machine's terminal**, not inside a Docker container or a virtual machine that doesn't have Docker configured. The script itself performs these checks and provides detailed error messages if Docker or Docker Compose are not found or not executable.

### 2. HTTPConnectionPool / Connection Refused Errors

**Symptom:**
When trying to access the application in your browser (e.g., `http://localhost:9000`), you encounter errors like:
- `requests.exceptions.ConnectionError: HTTPConnectionPool(...) Max retries exceeded with url: /api/... (Caused by NewConnectionError('<urllib3.connection.HTTPConnection object at ...>: Failed to establish a new connection: [Errno 111] Connection refused'))`
- "This site can	 be reached" or "localhost refused to connect."

**Cause:**
These errors typically indicate that the backend application services (which run inside Docker containers) are not running, not accessible, or did not start up correctly. This is often a consequence of issues during the `startup.sh` script execution.

**Solution:**
1.  **Verify `startup.sh` Execution:**
    *   Confirm that you ran the `startup.sh` script **on your host machine**.
    *   Check the output of the `startup.sh` script for any errors reported during the Docker build or startup process. Address any errors reported there first.
2.  **Check Docker Container Status:**
    *   Open a terminal on your host machine and run `docker ps` (or `docker compose ps` if you used `docker compose`) to see if the application containers (e.g., `crm_backend`, `crm_db`) are running.
    *   If containers are not running or are continuously restarting, check their logs.
3.  **Check Docker Logs:**
    *   The `startup.sh` script will provide the command to view logs if it fails (e.g., `docker-compose logs` or `docker compose logs`).
    *   To view logs for all services at any time: `docker-compose logs -f` (or `docker compose logs -f`).
    *   To view logs for a specific service (e.g., backend): `docker-compose logs -f backend` (or `docker compose logs -f backend`).
    *   Look for error messages in the logs that might indicate why a service failed to start (e.g., database connection issues, port conflicts, application errors).
4.  **Ensure Host Machine Resources:** Ensure your host machine has sufficient resources (CPU, RAM) for Docker to run the containers.
5.  **Firewall/VPN:** In some cases, local firewall software or VPNs might interfere with `localhost` connections or Docker's networking. Try temporarily disabling them to see if it resolves the issue.

### 3. General Advice: Running `startup.sh`

-   The `startup.sh` script is the **primary way to start the application**. It handles Docker checks, image builds, and container orchestration.
-   **Always run `startup.sh` from the project's root directory on your host machine.**
-   **Do NOT run `startup.sh` from within a Docker container.** It is designed to manage containers from the host.

If you continue to experience issues, please check the detailed error messages and consult the `docker-compose.yml` file for service configurations.