#!/bin/bash

####
# These things need to run from any fresh clone of the repo
###

echo "Installing dependencies"
npm install

echo "Adding symbolic link for local post-commit hook"
chmod +x scripts/post-commit
ln -sf ../../scripts/post-commit .git/hooks/post-commit
bash scripts/post-commit

echo "Buliding Bulma CSS"
npm run css-build