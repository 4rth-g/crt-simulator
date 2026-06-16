#!/bin/bash
set -e

echo "[1/3] Buildando frontend..."
npm --prefix frontend ci --silent
npm --prefix frontend run build --silent

echo "[2/3] Copiando frontend para resources..."
mkdir -p backend/src/main/resources/public
cp -r frontend/dist/. backend/src/main/resources/public/

echo "[3/3] Buildando JAR..."
mvn -f backend/pom.xml package -DskipTests -q

JAR=$(ls backend/target/crt-simulator-*.jar)
echo ""
echo "Pronto! JAR gerado: $JAR"
echo "Para rodar:  java -jar $JAR"
echo "Acesse:      http://localhost:7070"
