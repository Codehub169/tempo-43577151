#!/bin/bash
# This script automates the setup and launch of the CRM application.

echo "Starting End-to-End CRM Application..."

# Check for Docker
if ! [ -x "$(command -v docker)" ]; then
  echo 'Error: docker is not installed. Please install Docker and try again.' >&2
  exit 1
fi

# Check for Docker Compose (v1 or v2)
if ! [ -x "$(command -v docker-compose)" ]; then
  if ! docker compose version &> /dev/null; then
    echo 'Error: docker-compose (or docker compose v2) is not installed. Please install Docker Compose and try again.' >&2
    exit 1
  fi
  COMPOSE_COMMAND="docker compose"
echo "Using Docker Compose v2 (docker compose)"
else
  COMPOSE_COMMAND="docker-compose"
echo "Using Docker Compose v1 (docker-compose)"
fi

# Navigate to the script's directory to ensure docker-compose.yml is found
cd "$(dirname "$0")"

# Optional: Stop and remove existing containers, networks, and volumes to ensure a clean start
# Use with caution if you have important data in volumes not meant to be reset.
# echo "Stopping and removing existing containers, networks, and orphaned containers..."
# $COMPOSE_COMMAND down --remove-orphans # Add -v to remove volumes if a full reset is desired

# Build images and start services in detached mode
# The --remove-orphans flag cleans up containers for services no longer defined in the compose file.
echo "Building images and starting services... (This may take a few minutes on the first run)"
$COMPOSE_COMMAND up --build -d --remove-orphans

# Check if the command was successful
if [ $? -eq 0 ]; then
  echo ""
  echo "--------------------------------------------------------------------"
  echo "CRM Application services are starting up!"
  echo ""
  echo "Frontend & API available at: http://localhost:9000"
  echo "(API endpoints will be under http://localhost:9000/api/...)"
  echo ""
  echo "Database (PostgreSQL) is running in a container."
  echo "  - Access credentials and port can be found in your .env file or docker-compose.yml."
  echo "  - Default DB Port (if exposed): 5432 (check docker-compose.yml)"
  echo ""
  echo "Useful commands:"
  echo "  - To view logs for all services: $COMPOSE_COMMAND logs -f"
  echo "  - To view logs for a specific service (e.g., backend): $COMPOSE_COMMAND logs -f backend"
  echo "  - To stop the application: $COMPOSE_COMMAND down"
  echo "  - To stop and remove volumes (data reset): $COMPOSE_COMMAND down -v"
  echo "--------------------------------------------------------------------"
else
  echo ""
  echo "Error starting the CRM application services." >&2
  echo "Please check the logs for more details: $COMPOSE_COMMAND logs" >&2
  exit 1
fi

exit 0
