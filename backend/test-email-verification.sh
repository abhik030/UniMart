#!/bin/bash

# Define the API base URL
API_URL="http://localhost:8081/api"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting email verification flow test...${NC}"

# Test 1: Health check
echo -e "\n${YELLOW}Testing API health...${NC}"
health_response=$(curl -s -X GET "${API_URL}/auth/health")
if [[ "$health_response" == *"UP"* ]]; then
  echo -e "${GREEN}API is healthy!${NC}"
else
  echo -e "${RED}API health check failed: $health_response${NC}"
  exit 1
fi

# Test 2: Email validation
echo -e "\n${YELLOW}Testing email validation...${NC}"
email="studentunimart@gmail.com"
validation_response=$(curl -s -X POST "${API_URL}/auth/validate-email" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$email\"}")
echo "Response: $validation_response"

# Test 3: Code verification
echo -e "\n${YELLOW}Testing verification code (using test code 123456)...${NC}"
verify_response=$(curl -s -X POST "${API_URL}/auth/verify-code" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$email\",\"code\":\"123456\",\"rememberMe\":true}")
echo "Response: $verify_response"

# Extract the token for future requests
token=$(echo $verify_response | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
if [[ -z "$token" ]]; then
  echo -e "${RED}Failed to extract token from response${NC}"
  exit 1
else
  echo -e "${GREEN}Successfully extracted token: $token${NC}"
fi

trusted_token=$(echo $verify_response | grep -o '"trustedDeviceToken":"[^"]*"' | cut -d'"' -f4)
if [[ -z "$trusted_token" ]]; then
  echo -e "${RED}Failed to extract trusted token from response${NC}"
  exit 1
else
  echo -e "${GREEN}Successfully extracted trusted token: $trusted_token${NC}"
fi

# Test 4: Trusted device token verification
echo -e "\n${YELLOW}Testing trusted device token verification...${NC}"
trusted_response=$(curl -s -X POST "${API_URL}/auth/verify-trusted-token" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$email\",\"token\":\"$trusted_token\"}")
echo "Response: $trusted_response"

echo -e "\n${GREEN}Email verification flow test completed!${NC}" 