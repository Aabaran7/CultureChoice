# Starting a new project

When you start a new project, there are a few one-time steps you must take.
Conceptually, you simply fork the current version
of the Smile project and adjust the configuration settings for your project.
Don't worry it is easy!

You will need to have a (free) [GitHub account](https://github.com/join), and if you are in the gureckislab you need to have that account added as a member of our lab organization (contact Todd).

You can do some of the steps below by clicking buttons on the GitHub website 
but can be easier in the terminal (and the UI changes from time to time).
If you already have the GitHub command line tool installed skip to step 2.

## 1. Install and authenticate the GitHub Command Line Interface (CLI)

First make sure you have the GitHub Command Line Interface (cli) tool installed:
[download it here](https://cli.github.com) using the installer or homebrew.  
Next allow the cli access to your GitHub account by typing:

```
gh auth login --web
```

Into your terminal program.  This will open your default browser and ask you to log in to GitHub.


## 2. Fork the repo and check it out.

Set your current working directory to where you would like to place your files.
For example, on Mac this might be your desktop

```
cd ~/Desktop
```

Next fork the 🫠 Smile GitHub repo into a new project and clone it out locally:

```
gh repo fork nyuccl/smile --clone=true --fork-name=my_cool_project
```

In this example, the project will be named `my_cool_project` and a copy of the starting
project template will be placed in a new folder with that name. We highly recommend you 
use underscores for spaces and name your project based on 
the science (e.g., `question_asking`) or something.  

Next, alter the Github description for your new repo (replace `username/projectname` with your github 
username and the project name from above):

```
gh repo edit username/my_cool_project --description "my new research project"
```

## 3. Setup the project

Next change into the newly created project directory (assuming you called your project `my_cool_project`) and the `npm run setup_project` command:

```
cd my_cool_project
npm run setup_project
npm install
```

This will clean up git history for the base Smile project, remove some files you will not need, and install the required node packages for development.

## 4. Configure your project

Next you need to configure your app, especially for where it will be hosted when you deploy it.  Information about configuration is [here](/configuration) but if you are in the gureckislab you should simply download the latest version of our configuration settings from the lab slack.

After all the necessary files are in the `env` folder run:

```
npm run config:upload
```

to configure your deployment process.

## 5. Begin developing

Next you can begin testing and developing your app!

Simply type

```
npm run dev
```

to run the development server and see the current, default setup of the site.

## 5. Test the deployment

If you have properly configured your application then you should be able to deploy your website to your remote site.
Make a change to any file (except in the `docs/` folder) and push that change to your repository.  Your code should be made available according to the deploy settings you provided [NEEDS BETTER INFO HERE]