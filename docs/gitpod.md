# <img src="images/gitpodlogo.png" width="40" align='left' style="padding-right: 5px;"> Pre-configured development environment using Gitpod

Installation of the required software for most recent computers should be straight foward.  However, <SmileText /> also has been configured to run on [Gitpod](https://gitpod.io), a development environment that runs in the cloud.  Using Gitpod doesn't require any software to be installed on your local computer and everything is set up for you (in fact you can run and interact with Gitpod with an iPad!).

The downside of this approach is that Gitpod costs money if you exceed the 50 hours of run time for any of your development projects.  That is why it usually makes sense to install things locally.

However, it can be really helpful to collaborators/students or when you are away from your main computer to use the cloud based editor which provides almost all the features you need for local development with zero configuration.

Getting started is exceptionally easy: 


## 1. Navigate to your <SmileText /> repository on github.com

Go to the webpage of your repository (e.g., `https://github.com/gh_user/my_smile_project`).  

Next, edit the URL of the page in your browser to prefix with `gitpod.io/#` and press Enter (e.g., `gitpod.io/#https://github.com/gh_user/my_smile_project`).  

This will require you to login to github and may ask for certain permissions but will spin up a cloud based environment with VSCode already installed and configured.

## Caveats

- The first time you clone your repository from the core <SmileText /> repository you will need to decrypt the secret environment files and configure your Github repo by running `npm run upload_config`.

- To develop locally you need to decrypt the secret environment files (INSTRUCTIONS TBD)

- In order for automatted deployment to work correctly you need to, at least once, run `npm run upload_config` in your project repo.  It doesn't have to be specifically on the Gitpod instance but who ever first configured/cloned the repository should configure the deployment settings.
