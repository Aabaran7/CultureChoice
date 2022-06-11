#!/bin/bash

# update the app configs using a base64 encoding of 
# all the variables
ENC=$(cat env/.env.local | base64)
gh secret set SECRET_APP_CONFIG --body "$ENC"

# update doc secrets (these go one variable at a time)
gh secret set -f env/.env.docs.local

# update deploy secrets (these go one variable at a time)
gh secret set -f env/.env.deploy.local