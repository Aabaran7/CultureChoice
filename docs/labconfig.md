# Configuring for a new lab

If you would like to use <SmileText/> in a different lab you need to create a fork of the main repository for your lab.  This new "root" repo will be where members go to start their own projects.  This ensures that projects in your lab obtain the correct configuration options for your lab.  If your lab's "root" repo will stil be connected to the base <SmileText/> repo so you can pull down and distribute changes to the code as well as push contributions back to the main project.

![Inheriting between Github repos](/images/labconfig-github-inherit.png)

In the figure above, each node is a github repository. Each lab (Hartley Lab, Lake Lab) forks from the base smile repo and then student projects for that lab fork from the lab's base thus distributing the lab-specific configuration files.


In addition, if you would like to use it in a different lab you need to setup a variety of services for your group (e.g., Google Firebase, Slack, Github, etc...). One tradeoff in using <SmileText/> is that the one-time lab setup can be a little more involved/technical but then things work relatively seamlessly for members of your lab.


The key services are
- **Firebase (required)**: required for storing/saving data from your experiments
- **Slack messaging (required)**: required to be notified when your experiment is posted online for subjects to view
- **SSL signed webserver (required, but several options)**: a service to host your static web files for distribution to subjects



# Setup Firebase

<SmileText/> assumes that you are using Firebase cloud services for your database management.  To create a Firebase account 

Go to https://console.firebase.google.com

Click create project
Enter project name
Turn off google analytics (not needed unless you want it)
Create new web project
Select set up firebase hosting

![Firebase project overview](/images/labconfig-firebase-newproject-1.png)
![Firebase project overview](/images/labconfig-firebase-nameproject-2.png)
![Firebase project overview](/images/labconfig-firebase-analytics-3.png)
![Firebase project overview](/images/labconfig-firebase-console-4.png)
![Firebase project overview](/images/labconfig-firebase-addwebapp-5.png)
![Firebase project overview](/images/labconfig-firebase-credentials-6.png)
![Firebase project overview](/images/labconfig-firebase-firebase-hosting-tools-7.png)
![Firebase project overview](/images/labconfig-firebase-firebase-hosting-tools-7b.png)
![Firebase project overview](/images/labconfig-firebase-project-8.png)

# Clone Smile Github

Fork it from the fork menu and make a new "base" in your lab

Check out a copy locally

- add the .env files
- fill in firebase and deployment info

![Firebase project overview](/images/labconfig-github-fork.png)
![Firebase project overview](/images/labconfig-github-clone.png)
![Firebase project overview](/images/labconfig-github-overview.png)
![Firebase project overview](/images/labconfig-github-clone-commandline.png)
![Firebase project overview](/images/labconfig-github-envdeploy.png)
![Firebase project overview](/images/labconfig-github-envlocalfile.png)
![Firebase project overview](/images/labconfig-github-envlocalfile2.png)

# Encrypt git secret

- install git-secret package
![Firebase project overview](/images/labconfig-gitsecret-brew.png)

- remove `.gitsecret` folder
- run `git secret init`

- create a `gpg` RSA key pair for yourself (e.g., lab manager/pi)
    - https://git-secret.io/#using-gpg
    - `gpg --gen-key`

- add first users `git secret tell you@email.com`
- add the files
    - `git secret add .env/.env.deploy.local`
    - `git secret add .env/.env.docs.local`
    - `git secret add .env/.env.local`
- encrypt the files
    - `git secret hide`

# Adding additional users to your system

- get the user's GPG key (see above on instructions for that)
    `gpg --armor --export their@email.id > public_key.txt`
- import the key into `gpg --import public_key.txt`
- add to your keyring `git secret tell their@email.id`
- reencrypt the files `git secret reveal; git secret hide`

# If you make changes to the env files for your project
- reencrypt the files `git secret hide`
- upload them to the github repo `npm run upload_config`

# Configure your git secrets on github
- `gh auth login` if you haven't already
- upload them to the github repo `npm run upload_config`


# Configure your slack channel (if you want it)
if you don't want slack skip these instructions and go to the bottom:
Tools -> Workflow builder
Add a webhook URL (copy it as the deploy script)
Add a webhook URL for error (copy it as the deploy script)

If you don't want slack messages then comment out this line from



The goal of <SmileText/> is to make it easy and fun to collect behavioral data online.

The project is currently in the development and planning stage. We are taking a "docs first" approach to this project by planning the development within the documentation and then working on implementation. 

The current development is happening at [https://github.com/nyuccl/smile](https://github.com/nyuccl/smile).

Before getting started please install the [required software](/requirements).

--- 

::: warning What we assume
Generally this project assumes you have some familiarity with typing commands in a terminal program, git, [GitHub](https://github.com), and basic concepts about web servers and web design.  Some helpful websites to address deficiencies:

- [The missing semester of your CS education](https://missing.csail.mit.edu) - how to use the shell/terminal program, git, security concepts/encryption
- [Shell.how](https://www.shell.how) - helps you learn and interpret different shell/terminal commands
- [Git for beginners](https://medium.com/dwarsoft/git-for-beginners-part-i-basic-git-concepts-a7beb5a136d)
- [Interneting is hard](https://www.internetingishard.com) - Friendly web development tutorials for complete beginners
- [Learn Vue](https://learnvue.co) - useful website for learning the Vue.js framework
- [Vuejs tutorial](https://vuejs.org/tutorial/#step-1) 
- [Vuejs docs](https://vuejs.org/guide/introduction.html)
:::