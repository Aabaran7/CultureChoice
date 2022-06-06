# Understanding the deployment steps
 
Smile deployment is **continuous and automatic** by design.  The purpose of continuous deployment is so that new changes to the code are always placed into a live server environment (which is then helpful for [integration testing](/testing)).
The purpose of automating deployment is to make it one less thing you need to think about.  However, if something goes wrong, or you need to customize things, it can be helpful to understand the steps.

Deploying a website involves several steps: triggering the GitHub Actions deployment process, configuring the site, building the site, and uploading the files to a suitable internet-accessible server.

## The Github Actions deployment trigger

GitHub Actions are a feature of GitHub that allows customizable scripts to run on a cloud computer instance whenever certain events happen on a repository.  Examples include running a script when someone leaves a comment on a repo or opens a pull request.  Scripts can also run automatically anytime a push is made to the repository.  In the case of Smile the deployment script is triggers with any push to the repository excluding the documentation folder (`docs/`).  This runs the action located at `.github/workflows/deploy.yml`.  Even without a lot of knowledge about GitHub action you can read this script and understand the basic logic.

## Building the site

The first step of the GitHub action runs a sequence of shell commands on a linux cloud instance hosted by GitHub (`runs-on: ubuntu-latest`).
Next, the current version of the code (after the commit) is checked out using git.  Then relevant software is installed such as Node.js.  The node dependencies are then run using `npm install`.  Then the website is build `npm run build`.  The completed website is located at `dist/`.

You can run most of the steps up to this point locally by just typing `npm run build`.

## Uploading files to an Internet-accessible server

Next, the GitHub action uploads the files to the server using rsync.
The remote host, folder, and other options are set using GitHub Secrets which are encrypted environment variables which you configure on the repository settings.

:::danger To-do
Will need to add information about these 
:::