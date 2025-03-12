# UniMart - Student Exclusive Marketplace

UniMart is a student-exclusive marketplace where only students with verified .edu email addresses can buy and sell items. This platform is designed to create safe, school-specific marketplaces for students.

## Features

- School email verification (.edu domains only)
- School-specific marketplaces
- User authentication and verification
- Secure buying and selling platform

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
