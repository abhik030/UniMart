# Build stage
FROM maven:latest AS build

WORKDIR /app

# Copy the Maven POM file
COPY pom.xml .

# Add mvn clean to ensure a clean build directory
RUN mvn dependency:go-offline || true

# Copy the source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port
EXPOSE 8080

# Run the application with Docker profile
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=docker", "app.jar"]