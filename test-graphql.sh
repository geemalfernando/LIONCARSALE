#!/bin/bash

# Test GraphQL endpoint on Vercel

echo "🧪 Testing GraphQL Endpoint..."
echo ""

# Test 1: Simple introspection query
echo "1️⃣  Testing basic query..."
curl --request POST \
  --header 'content-type: application/json' \
  --url 'https://lioncarsa.vercel.app/graphql' \
  --data '{"query":"query { __typename }"}'

echo ""
echo ""
echo "2️⃣  Testing vehicles query..."
curl --request POST \
  --header 'content-type: application/json' \
  --url 'https://lioncarsa.vercel.app/graphql' \
  --data '{"query":"query { vehicles { id title make model year price } }"}'

echo ""
echo ""
echo "3️⃣  Testing health endpoint..."
curl 'https://lioncarsa.vercel.app/api/health'

echo ""
echo ""
echo "✅ Tests complete!"

