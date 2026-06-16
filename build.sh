#!/bin/bash
set -e

echo "[1/3] Buildando frontend..."
npm --prefix frontend ci --silent
npm --prefix frontend run build --silent

echo "[2/3] Copiando frontend para resources..."
mkdir -p backend/src/main/resources/public
cp -r frontend/dist/. backend/src/main/resources/public/

echo "[3/3] Buildando JAR..."
docker run --rm \
  -v "$(pwd)/backend":/app \
  -v maven_cache:/root/.m2 \
  docker.io/library/maven:3.9-eclipse-temurin-17 \
  mvn package -DskipTests -q -f /app/pom.xml

JAR=$(ls backend/target/crt-simulator-*.jar)
echo ""
echo "Pronto! JAR gerado: $JAR"
echo "Para rodar:  java -jar $JAR"
echo "Acesse:      http://localhost:7070"
