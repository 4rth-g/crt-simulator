# ── Build stage ────────────────────────────────────────────────────────────────
FROM docker.io/library/maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app
COPY pom.xml .
# Baixa dependências em camada separada (cache eficiente)
RUN mvn dependency:go-offline -q

COPY src ./src
RUN mvn package -DskipTests -q

# ── Runtime stage ───────────────────────────────────────────────────────────────
FROM docker.io/library/eclipse-temurin:17-jre-alpine

WORKDIR /app
COPY --from=build /app/target/crt-simulator-*.jar app.jar

EXPOSE 7070

ENTRYPOINT ["java", "-jar", "app.jar"]
