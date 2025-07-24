#!/bin/bash
set -e

# Get the account ID from the caller identity.
# This command assumes the AWS CLI is configured and authenticated.
ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
if [ -z "$ACCOUNT_ID" ]; then
  echo "Error: Could not determine AWS Account ID. Make sure you are authenticated with AWS." >&2
  exit 1
fi

PROVIDER_URL="token.actions.githubusercontent.com"
PROVIDER_ARN="arn:aws:iam::${ACCOUNT_ID}:oidc-provider/${PROVIDER_URL}"

# Check if the OIDC provider exists by attempting to fetch it.
# We redirect stderr to /dev/null to suppress the "not found" error message.
if aws iam get-open-id-connect-provider --open-id-connect-provider-arn "$PROVIDER_ARN" >/dev/null 2>&1; then
  # If the command succeeds, the provider exists.
  echo "{\"exists\": \"true\"}"
else
  # If the command fails, the provider does not exist.
  echo "{\"exists\": \"false\"}"
fi
