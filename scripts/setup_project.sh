#!/bin/bash

echo "Adding symbolic link for local post-commit hook"
chmod +x scripts/post-commit
ln -s ../../scripts/post-commit .git/hooks/post-commit


PROJECT_NAME=$(basename $(git remote get-url origin) .git)
OWNER=$(basename $(dirname $(git remote get-url origin)))
if [ "$OWNER" == "NYUCCL" ] && [ "$PROJECT_NAME" == "smile" ] ; then
    echo "Forcing an empty commit to trigger an initial deploy"
    git commit --allow-empty -m "forcing a deploy"
else
    echo "Removing deploy script and generating initial deploy"
    rm .github/workflows/docs-deploy.yml
    git add .github/workflows/docs-deploy.yml
    git commit -m "initial setup: removing docs deploy script"
fi

git push

echo "Installing dependencies"
npm install

echo "Buliding Bulma CSS"
npm run css-build