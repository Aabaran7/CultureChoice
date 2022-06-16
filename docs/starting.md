# Starting a new project

When you start a new project, there are a few one-time steps you must take.
These include forking the current version
of the Smile project and adjusting the configuration settings for your project.

**Don't worry it is easy!**

You will need to have a (free) [GitHub account](https://github.com/join).

::: info Terminal commands versus GitHub website
You can do some of the steps below by clicking buttons on the GitHub website 
but can be easier in the terminal (and the UI changes from time to time).
If you already have the GitHub command line tool installed and authenticated
skip to step 2.
:::

## 1. Install and authenticate the GitHub Command Line Interface (CLI)

First make sure you have the GitHub Command Line Interface (cli) tool installed:
[download it here](https://cli.github.com) using the installer or homebrew.  
Next allow the cli access to your GitHub account by typing:

```
gh auth login --web
```

Into your terminal program.  This will open your default browser and ask you to log in to GitHub.

## 2. Request access to the shared database resources (gureckislab only)

Later you will want to configure your application, but if you are in the gureckislab you will want to 
simply decrypt the pre-configured files provided in the repository.

::: info Note
You only need to do this the first time you try Smile!
:::


To do this first install the git secret package which includes the relevant dependencies using homebrew: 

```
brew install git-secret
```

Next create a RSA key-pair for your email address:

```
gpg --gen-key
```

There will be a sequence of questions you answer.  Use your preferred email address e.g., the one linked to GitHub.  Send Todd your public key by sending the output of this command to him on slack or via email.

```
gpg --armor --explore your.email@address.com
```

Wait for him to reply and to make a push to the Smile repo giving access to the encrypted files to your email address.


## 3. Fork the repo and check it out.

Set your current working directory to where you would like to place your files.
For example, on Mac this might be your desktop

```
cd ~/Desktop
```

Following the steps below, fork the 🫠 Smile GitHub repo into a new project name and clone it out locally.
We highly recommend you use underscores for spaces and name your project based on 
the science (e.g., `question_asking`) or something.  

In this example command, the new project will be named `my_cool_project` and a copy of the starting
project template will be placed in a new folder with that name:

```
gh repo fork nyuccl/smile --clone=true --fork-name=my_cool_project
```

Next, alter the Github description for your new repo (replace `username/projectname` with your github 
username and the project name from above):

```
gh repo edit username/my_cool_project --description "my new research project"
```

After this you can visit GitHub and you should see a new repo in your personal repositories list.

## 4. Setup the project

Next change into the newly created project directory (assuming you called your project `my_cool_project`) and the `npm run setup_project` command:

```
cd my_cool_project
npm run setup_project
```

This will clean up git history for the base Smile project, remove some files you will not need, and install the required node packages for development.

## 5. Configure your project

Information about configuration is [here](/configuration) but if you are in the gureckislab you will want to simply decrypt the files provided in the repository.

To do this simply type 

```
git secret reveal
```

::: danger 
This will only work if you have first sent Todd your gpg key and waited for him to push a change to the Smile repo.
:::

After all the necessary files are in the `env` folder run:

```
npm run config:upload
```

to configure your deployment process.

## 6. Begin developing

Next you can begin testing and developing your app!

Simply type

```
npm run dev
```

to run the development server and see the current, default setup of the site.

## 7. Test the deployment

If you have properly configured your application then you should be able to deploy your website to your remote site.
Make a change to any file (except in the `docs/` folder) and push that change to your repository.  Your code should be made available according to the deploy settings you provided [NEEDS BETTER INFO HERE]