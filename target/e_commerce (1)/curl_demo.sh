#!/bin/bash

# 1. Public endpoint (no JWT required)
curl -i http://localhost:8080/api/users/public

echo -e "\n---\n"

# 2. Login to get JWT (replace with actual credentials)
JWT=$(curl -s -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"password"}' | jq -r .token)
echo "JWT: $JWT"

echo -e "\n---\n"

# 3. User endpoint (requires USER or ADMIN role)
curl -i http://localhost:8080/api/users/user \
  -H "Authorization: Bearer $JWT"

echo -e "\n---\n"

# 4. Admin endpoint (requires ADMIN role)
curl -i http://localhost:8080/api/users/admin \
  -H "Authorization: Bearer $JWT"

echo -e "\n---\n"

# 5. Create user (POST)
curl -i -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","password":"newpass","roles":["USER"]}'

echo -e "\n---\n"

# 6. Update user (PUT)
curl -i -X PUT http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT" \
  -d '{"username":"updateduser","password":"updatedpass","roles":["USER"]}'

echo -e "\n---\n"

# 7. Delete user (DELETE)
curl -i -X DELETE http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer $JWT" 