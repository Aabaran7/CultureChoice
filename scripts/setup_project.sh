#!/bin/bash

chmod +x scripts/post-commit
ln -s ../../scripts/post-commit .git/hooks/post-commit
rm .github/workflows/docs-deploy.yml
git add .github/workflows/docs-deploy.yml
git commit -m "initial setup: removing docs deploy script"
git push
npm install