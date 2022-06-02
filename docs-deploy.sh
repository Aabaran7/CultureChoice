#!/usr/bin/env sh

# abort on errors
set -e

# clean
npm run docs:clean

# build
npm run docs:build

# navigate to the build output directory (which is not tracked by git due to .gitignore)

# have to copy the github workflow over
mkdir docs/.vitepress/dist/.github
mkdir docs/.vitepress/dist/.github/workflows
cp .github/workflows/docs-deploy.yml docs/.vitepress/dist/.github/workflows/

cd docs/.vitepress/dist

git init  # create a new git repo here
git add -A # add all the files
git commit -m "deploying docs" # deploying docs
git show-ref

# push to the docs branch
git push -f git@github.com:NYUCCL/smile.git master:docs