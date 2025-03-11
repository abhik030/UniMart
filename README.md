# UniMart - Student Exclusive Marketplace

UniMart is a student-exclusive marketplace where only students with verified .edu email addresses can buy and sell items. This platform is designed to create safe, school-specific marketplaces for students.

## Features

- School email verification (.edu domains only)
- School-specific marketplaces
- User authentication and verification
- Secure buying and selling platform

## Project Structure

- `backend/`: Spring Boot backend API
- `frontend/`: (Coming soon) React/Next.js frontend application
- `database-scripts/`: Database initialization scripts

## Getting Started

### Prerequisites

- Java 21
- Maven
- Docker and Docker Compose
- MySQL

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=unimart
MYSQL_USER=unimart_user
MYSQL_PASSWORD=your_password

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

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

## License

This project is licensed under the MIT License - see the LICENSE file for details.