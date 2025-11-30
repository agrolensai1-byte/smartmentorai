#!/bin/bash

# SmartMentorAI Docker Build Script
set -e

PROJECT_NAME="smartmentorai"
IMAGE_NAME="${PROJECT_NAME}:latest"
REGISTRY="${REGISTRY:-}"
VERSION="${VERSION:-1.0.0}"

echo "🐳 Building SmartMentorAI Docker Image..."
echo "📦 Image: $IMAGE_NAME"
echo "📌 Version: $VERSION"

# Build the image
docker build \
    --tag "$IMAGE_NAME" \
    --tag "${PROJECT_NAME}:${VERSION}" \
    --build-arg VERSION=$VERSION \
    --label "version=$VERSION" \
    --label "project=$PROJECT_NAME" \
    .

echo "✅ Docker image built successfully!"
echo ""
echo "📋 Available images:"
docker images | grep $PROJECT_NAME

echo ""
echo "🚀 To run the container:"
echo "   docker-compose up -d"
echo ""
echo "🌐 To access the application:"
echo "   http://localhost:3000"
echo ""
echo "📊 To view logs:"
echo "   docker-compose logs -f smartmentorai"
