#!/bin/bash

################################################################################
#                                                                              #
#                  ud83dudd34   !!!   IMPORTANT WARNING   !!!   ud83dudd34                     #
#                                                                              #
#   This script MUST be executed on your HOST MACHINE, not inside a Docker     #
#   container or any environment without direct Docker daemon access.          #
#                                                                              #
#   It orchestrates Docker containers and requires Docker to be installed      #
#   and running on the system executing this script.                           #
#                                                                              #
################################################################################
echo "" # Newline for visual separation after the warning box

# This script automates the setup and launch of the CRM application.

# Exit immediately if a command exits with a non-zero status.
# Treat unset variables as an error when substituting.
# Prevent errors in a pipeline from being masked.
set -euo pipefail

# Function to print error messages to stderr and exit
error_exit() {
  echo "Error: $1" >&2
  # Print the second argument (details) if provided and not empty
  if [ -n "${2:-}" ]; then 
    echo -e "\n$2" >&2 # -e enables interpretation of backslash escapes like \n
  fi
  exit 1
}

# Check if running inside a standard Docker container
if [ -f /.dockerenv ]; then
  error_exit "This script must be run on your host machine, not inside a Docker container." \
"DETAILS:\n- Running this script inside a container will prevent the application services (like the web server and database) from starting correctly.\n- This, in turn, will lead to connection errors (e.g., HTTPConnectionPool, 'connection refused') when you try to access the application.\n- The script requires direct access to the Docker daemon on your computer to manage these services.\n\nSOLUTION:\n- Ensure you are in the project's root directory on your HOST MACHINE.\n- Run 'bash startup.sh' from your host system's terminal.\n- Do NOT run this script from within a Docker container environment."
fi

echo "Starting End-to-End CRM Application..."

# Check for Docker command
if ! command -v docker &>/dev/null; then
  error_exit "Docker command not found in your PATH." \
"Please ensure Docker is correctly installed and accessible.\nRefer to the README.md file for detailed prerequisites or download Docker from: https://www.docker.com/get-started"
fi

# Ensure Docker command is executable
DOCKER_PATH="$(command -v docker)"
if ! [ -x "$DOCKER_PATH" ]; then
    error_exit "Docker command '$DOCKER_PATH' was found, but it is not executable." \
"Please check your Docker installation, PATH, and file permissions."
fi

# Check if Docker daemon is running
if ! docker info &>/dev/null; then
  error_exit "Docker daemon is not running or not accessible." \
"Please ensure the Docker daemon is started and functioning correctly. On systems like macOS or Windows with Docker Desktop, ensure Docker Desktop is running.\nOn Linux, check the Docker service status (e.g., 'systemctl status docker')."
fi

# Determine Docker Compose command (v1 or v2)
COMPOSE_COMMAND=""
if command -v docker-compose &>/dev/null && [ -x "$(command -v docker-compose)" ]; then
  COMPOSE_COMMAND="docker-compose"
  echo "Using Docker Compose v1 (docker-compose)"
elif docker compose version &>/dev/null; then # This implies 'docker' is working and 'compose' is a valid subcommand
  COMPOSE_COMMAND="docker compose"
  echo "Using Docker Compose v2 (docker compose)"
else
  error_exit "Docker Compose (v1: docker-compose, or v2: docker compose) is not installed, not found in PATH, or not executable." \
"Please ensure Docker Compose is correctly installed. It usually comes with Docker Desktop.\nFor Docker Compose installation instructions, see: https://docs.docker.com/compose/install/\nRefer to the README.md file for detailed prerequisites."
fi

# Navigate to the script's directory to ensure docker-compose.yml is found
# This is critical for docker-compose to find its configuration file.
# Using -P to resolve physical path, handles symlinks better.
script_dir="$(cd -P "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
cd "$script_dir" || error_exit "Could not change directory to script location: $script_dir"

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
  error_exit "docker-compose.yml not found in the script directory: $script_dir" \
"The docker-compose.yml file is essential for defining and running the application services. Please ensure it is present in the project's root directory alongside this startup.sh script."
fi

# Optional: Stop and remove existing containers, networks, and volumes to ensure a clean start
# Use with caution if you have important data in volumes not meant to be reset.
# echo "Stopping and removing existing containers, networks, and orphaned containers..."
# $COMPOSE_COMMAND down --remove-orphans # Add -v to remove volumes if a full reset is desired

# Build images and start services in detached mode
# The --remove-orphans flag cleans up containers for services no longer defined in the compose file.
echo "Building images and starting services... (This may take a few minutes on the first run)"

# We handle the success/failure of this command explicitly for better UX,
# so `set -e` won't immediately halt if it fails.
if $COMPOSE_COMMAND up --build -d --remove-orphans; then
  # Determine the application port for display
  APP_PORT_TO_DISPLAY="9000" # Default port
  ENV_FILE_PATH="${script_dir}/.env" # .env file should be in the same directory as startup.sh

  if [ -f "$ENV_FILE_PATH" ]; then
    # Read APP_PORT, remove comments, trim whitespace, get value after '='.
    # Handles APP_PORT=8000, APP_PORT = 8000, APP_PORT="8000", APP_PORT='8000'.
    # Uses tail -n 1 to get the last definition if APP_PORT is defined multiple times.
    RAW_PORT_FROM_ENV=$(grep -E '^\s*APP_PORT\s*=' "$ENV_FILE_PATH" | tail -n 1)
    
    if [ -n "$RAW_PORT_FROM_ENV" ]; then
        # Extract value: remove 'APP_PORT=' part and potential quotes/spaces
        PORT_VALUE=$(echo "$RAW_PORT_FROM_ENV" | sed -e 's/^\s*APP_PORT\s*=\s*//' -e 's/\s*$//' -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//'")
        # Validate if it's a number (basic check)
        if [[ "$PORT_VALUE" =~ ^[0-9]+$ ]] && [ "$PORT_VALUE" -gt 0 ] && [ "$PORT_VALUE" -lt 65536 ]; then
            APP_PORT_TO_DISPLAY="$PORT_VALUE"
        else
            echo "Warning: Invalid APP_PORT value '$PORT_VALUE' found in $ENV_FILE_PATH. Using default port 9000 for display guidance." >&2
        fi    
    fi
  fi

  echo # Newline
  echo "--------------------------------------------------------------------"
  echo "CRM Application services are starting up!"
  echo
  echo "Frontend & API available at: http://localhost:${APP_PORT_TO_DISPLAY}"
  echo "(API endpoints will be under http://localhost:${APP_PORT_TO_DISPLAY}/api/...)"
  echo
  echo "Database (PostgreSQL) is running in a container."
  echo "  - Access credentials and port can be found in your .env file or docker-compose.yml."
  echo "  - Default DB Port (if exposed): 5432 (check docker-compose.yml)"
  echo
  echo "Useful commands:"
  echo "  - To view logs for all services: $COMPOSE_COMMAND logs -f"
  echo "  - To view logs for a specific service (e.g., backend): $COMPOSE_COMMAND logs -f backend"
  echo "  - To stop the application: $COMPOSE_COMMAND down"
  echo "  - To stop and remove volumes (data reset): $COMPOSE_COMMAND down -v"
  echo "--------------------------------------------------------------------"
else
  # The $COMPOSE_COMMAND failed. $? will be non-zero.
  echo # Newline
  error_exit "Failed to start the CRM application services." \
"Please check the logs for more details: $COMPOSE_COMMAND logs"
fi

exit 0
