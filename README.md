# UniMart - Student Marketplace

A marketplace application for university students to buy and sell items within their university community.

## Development Setup

### Prerequisites

- Node.js (v18 or later)
- Java 17 or later
- Maven
- MySQL
- Docker and Docker Compose (optional, for containerized setup)

### Running the Application Locally

#### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Start the Spring Boot application:
   ```
   ./mvnw spring-boot:run
   ```
   
   The backend will be available at http://localhost:8081

#### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the React application:
   ```
   npm start
   ```
   
   The frontend will be available at http://localhost:3000

### Shutting Down

To shut down the application:

1. Stop the frontend server by pressing `Ctrl+C` in the terminal where it's running
2. Stop the backend server by pressing `Ctrl+C` in its terminal
3. If you're using a local MySQL database, you may want to stop that as well

### Running with Docker Compose

If you prefer to use Docker Compose:

1. Build and start all services:
   ```
   docker-compose up -d
   ```

2. To shut down:
   ```
   docker-compose down
   ```

## Environment Variables

The application uses environment variables for configuration. These can be set in:

- `.env` files for local development
- Docker Compose environment variables
- System environment variables for production

### Frontend Environment Variables

- `REACT_APP_API_URL`: URL for the backend API

### Backend Environment Variables

- `MYSQL_USER`: MySQL username
- `MYSQL_PASSWORD`: MySQL password
- `MAIL_HOST`: SMTP host for email
- `MAIL_PORT`: SMTP port
- `MAIL_USERNAME`: Email username
- `MAIL_PASSWORD`: Email password
- `CORS_ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS

## Features

- Email verification for university students
- University-specific marketplaces
- User profiles
- Item listings with images
- Search and filter functionality
- Messaging between users

*Still developing a lot of these features as we speak. Will update as each feature is pushed*


## License

This project is licensed under the MIT License - see the LICENSE file for details.
Hello,

This is my project UniMart. A better description will be on Github

But here are some basic facts:
1. Student exclusive marketplace
2. Made For Students, By Students
3. Tech Stack:
    - Backend:
        - MySQL
        - Java Spring
        - Docker
    - Front-end
        - TypeScript
        - Node.JS
        - HTML/CSS 
    - Cloud (AWS Most likely)
    - Diagram: Lucid Charts
        - https://lucid.app/lucidchart/be0482db-c922-436e-b261-9007d8736752/edit?page=0_0&invitationId=inv_aa66d6e8-6829-4ee1-ba72-37001e6e493e#

5. First store will be HuskyMart, a Northeastern Marketplace




### Running the Application

1. Build the backend:

```bash
cd backend
./mvnw clean package -DskipTests
```

2. Start the application using Docker Compose:

```bash
docker-compose up -d
```

3. The API will be available at http://localhost:8080

## API Endpoints

### Authentication

- `POST /api/auth/validate-email`: Validate a school email and send verification code
  - Request: `{ "email": "student@northeastern.edu" }`
  - Response: `{ "schoolName": "Northeastern University", "marketplaceUrl": "northeastern.unimart.com" }`

- `POST /api/auth/verify-code`: Verify the authentication code
  - Request: `{ "email": "student@northeastern.edu", "code": "123456" }`
  - Response: User information with school details

## Development

### Adding a New School

To add support for a new school, add the school details to the `DataInitializer.java` file:

```java
if (!schoolRepository.existsByDomainSuffix("newschool.edu")) {
    School newSchool = new School();
    newSchool.setName("New University");
    newSchool.setDomainSuffix("newschool.edu");
    newSchool.setMarketplaceUrl("newschool.unimart.com");
    newSchool.setActive(true);
    
    schoolRepository.save(newSchool);
}
```

**Will come back to this**
