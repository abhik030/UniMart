#!/bin/bash

echo "===== Testing UniMart Authentication API ====="
echo

# Base URL
BASE_URL="http://localhost:8080/api"

# 1. Test Supported Universities Endpoint
echo "1. Testing GET /api/auth/supported-universities"
curl -s -X GET "$BASE_URL/auth/supported-universities" | json_pp
echo
echo

# 2. Test Email Validation Endpoint
echo "2. Testing POST /api/auth/validate-email"
curl -s -X POST "$BASE_URL/auth/validate-email" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@northeastern.edu"}' | json_pp
echo
echo

# Save the verification code from the console output
echo "3. Check the console output in your Spring Boot app for the verification code"
echo "   Then use that code in the next request"
echo
read -p "Enter the verification code: " CODE

# 3. Test Verification Code Endpoint
echo "4. Testing POST /api/auth/verify-code"
curl -s -X POST "$BASE_URL/auth/verify-code" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"test@northeastern.edu\", \"code\": \"$CODE\"}" | json_pp
echo
echo

# 4. Test Unsupported University Endpoint
echo "5. Testing GET /api/unsupported"
curl -s -X GET "$BASE_URL/unsupported?email=user@unsupported.edu" | json_pp
echo
echo

echo "===== Testing Complete =====" 