FROM openjdk:23-jdk-slim

WORKDIR /app

COPY mvnw mvnw.cmd pom.xml ./

# Copy the .mvn directory
COPY .mvn/ .mvn/

COPY src/ src/

RUN chmod +x mvnw

RUN ./mvnw package -DskipTests

EXPOSE 8080

# Update this line with the correct JAR file name
CMD ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]