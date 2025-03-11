# Authentication API Testing Guide

## Prerequisites
- Ensure the Spring Boot application is running
- Install Postman or use cURL for testing

## 1. Test Email Validation Endpoint

### Request
```
POST http://localhost:8080/api/auth/validate-email
Content-Type: application/json

{
  "email": "test@northeastern.edu"
}
```

### Expected Response
```json
{
  "universityName": "Northeastern University",
  "marketplaceUrl": "/huskymart",
  "marketplaceName": "HuskyMart"
}
```

## 2. Test Verification Code Endpoint

### Request
```
POST http://localhost:8080/api/auth/verify-code
Content-Type: application/json

{
  "email": "test@northeastern.edu",
  "code": "123456"  // Use the code from console logs or your email
}
```

### Expected Response
```json
{
  "email": "test@northeastern.edu",
  "username": "test",
  "university": "Northeastern University",
  "redirectUrl": "/huskymart"
}
```

## 3. Test Supported Universities Endpoint

### Request
```
GET http://localhost:8080/api/auth/supported-universities
```

### Expected Response
```json
[
  {
    "id": 1,
    "name": "Northeastern University",
    "domain": "northeastern.edu",
    "marketplaceUrl": "/huskymart",
    "marketplaceName": "HuskyMart"
  }
]
```

## 4. Test Unsupported University Endpoint

### Request
```
GET http://localhost:8080/api/unsupported?email=user@unsupported.edu
```

### Expected Response
```json
{
  "message": "Sorry, UniMart hasn't gotten around to supporting a university marketplace for your college yet. You can select from one of our supported universities below.",
  "supportedUniversities": [
    {
      "id": 1,
      "name": "Northeastern University",
      "domain": "northeastern.edu",
      "marketplaceUrl": "/huskymart",
      "marketplaceName": "HuskyMart"
    }
  ]
}
``` 