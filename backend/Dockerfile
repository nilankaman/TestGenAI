# Use official Java 17 image
FROM eclipse-temurin:17-jdk-alpine

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies first (better caching)
COPY pom.xml .
RUN apk add --no-cache maven
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the jar
RUN mvn clean package -DskipTests

# Expose port (Render injects PORT env variable)
EXPOSE 8080

# Run app
CMD ["sh", "-c", "java -jar target/testgen-ai-1.0.0.jar"]