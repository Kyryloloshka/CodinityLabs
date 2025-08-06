#!/bin/bash

# Переходимо в директорію з Dockerfile
cd "$(dirname "$0")/code-runner"

# Збираємо Docker образ
echo "Building code-runner Docker image..."
docker build -t code-runner:latest .

if [ $? -eq 0 ]; then
    echo "✅ Code-runner image built successfully"
else
    echo "❌ Failed to build code-runner image"
    exit 1
fi 