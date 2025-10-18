#!/bin/bash


set -e

if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <header> <payload> <signature>"
    echo "Example: $0 'eyJ...' 'eyJ...' '0x...'"
    exit 1
fi

HEADER="$1"
PAYLOAD="$2"
SIGNATURE="$3"
PROJECT_ID="prj_TBeuwtZMCSC1LqZMsdrdBHP226b6"
VERCEL_TOKEN="lcEMfh0YD9lv1GBJOG2KKcLW"

echo "Updating Farcaster credentials in Vercel..."

HEADER_ID=$(curl -s "https://api.vercel.com/v9/projects/${PROJECT_ID}/env" \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" | \
  jq -r '.envs[] | select(.key=="NEXT_PUBLIC_FARCASTER_HEADER") | .id')

PAYLOAD_ID=$(curl -s "https://api.vercel.com/v9/projects/${PROJECT_ID}/env" \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" | \
  jq -r '.envs[] | select(.key=="NEXT_PUBLIC_FARCASTER_PAYLOAD") | .id')

SIGNATURE_ID=$(curl -s "https://api.vercel.com/v9/projects/${PROJECT_ID}/env" \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" | \
  jq -r '.envs[] | select(.key=="NEXT_PUBLIC_FARCASTER_SIGNATURE") | .id')

echo "Found environment variable IDs:"
echo "  HEADER_ID: ${HEADER_ID}"
echo "  PAYLOAD_ID: ${PAYLOAD_ID}"
echo "  SIGNATURE_ID: ${SIGNATURE_ID}"

echo "Updating NEXT_PUBLIC_FARCASTER_HEADER..."
curl -X PATCH "https://api.vercel.com/v9/projects/${PROJECT_ID}/env/${HEADER_ID}" \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"value\":\"${HEADER}\",\"target\":[\"production\",\"preview\",\"development\"]}" \
  > /dev/null

echo "Updating NEXT_PUBLIC_FARCASTER_PAYLOAD..."
curl -X PATCH "https://api.vercel.com/v9/projects/${PROJECT_ID}/env/${PAYLOAD_ID}" \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"value\":\"${PAYLOAD}\",\"target\":[\"production\",\"preview\",\"development\"]}" \
  > /dev/null

echo "Updating NEXT_PUBLIC_FARCASTER_SIGNATURE..."
curl -X PATCH "https://api.vercel.com/v9/projects/${PROJECT_ID}/env/${SIGNATURE_ID}" \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"value\":\"${SIGNATURE}\",\"target\":[\"production\",\"preview\",\"development\"]}" \
  > /dev/null

echo "✅ Farcaster credentials updated successfully!"
echo ""
echo "Next step: Redeploy the application without build cache"
echo "Run: cd /home/ubuntu/repos/crypto-brokerage-miniapp && vercel --token ${VERCEL_TOKEN} --prod --yes --force"
