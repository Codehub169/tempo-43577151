#!/bin/bash

################################################################################
#                                                                              #
#                  🔴   !!!   IMPORTANT WARNING   !!!   🔴                     #
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
"It orchestrates Docker containers and needs access to the Docker daemon installed on your computer. Please execute 'bash startup.sh' from your host system's terminal."
fi

echo "Starting End-to-End CRM Application..."

# Check for Docker
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
  echo # Newline for better formatting
  echo "--------------------------------------------------------------------"
  echo "CRM Application services are starting up!"
  echo
  echo "Frontend & API available at: http://localhost:9000"
  echo "(API endpoints will be under http://localhost:9000/api/...)"
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
