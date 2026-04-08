# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# 1. Copy pom first (This is the "Pro" move for caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# 2. Copy the actual source code
COPY src ./src

# 3. Build the jar
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Use a wildcard to find the jar, but rename it to 'app.jar' for the entrypoint
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8081

# Recommended: Add a non-root user for security (The 'Human' touch)
RUN useradd -m myuser
USER myuser

ENTRYPOINT ["java", "-jar", "app.jar"]