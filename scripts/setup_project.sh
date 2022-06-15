git reset $(git commit-tree HEAD^{tree} -m "Initial import")
rm .github/workflows/docs-deploy.yml
git add .github/workflows/docs-deploy.yml
git commit -m "removing deploy script"
git push --force