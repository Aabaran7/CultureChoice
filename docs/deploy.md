# Deploying your experiment

Deploying (or hosting) your experiment involves building the web application and then transferring a copy of the files to a suitable public website where participants can access it.

Consistent with the principle of ["don't sweat the small stuff"](/principles.html#don-t-sweat-the-dumb-stuff) the process of deployment has been mostly automated in 🫠 Smile. 

The steps to deploy are simply to push changes to the `main` branch of the repo for your project.  In response, GitHub will build your project and upload your files to the [configured](/configuration) server location.

:::info Comment
Need to add... where is it hosted?  It should be a config option but maybe nice if there was like a message posted somewhere or emailed to let you know it was successful and where it is located.
:::

That's really it.  In most cases you can stop reading here.  If you want more details on the process the rest of this page provides some insight.


## Understanding the deployment steps
 
Smile deployment is **continuous and automatic** by design.  The purpose of continuous deployment is 
The purpose of automating deployment is to make it one less thing you need to think about.  However, if something goes wrong, or you need to customize things, it can be helpful to understand the steps in case something goes wrong.  

Deploying a website involves two main steps: building the site, and uploading the files to a suitable internet-accessible server.

### Building the site

The Smile webapp is built using Vite.  Vite is a build tool for web projects that consists of a dev server and a build command.  


### Uploading files to an Internet-accessible server


Generally, things are set up so that your experiment is automatically deployed when you push new changes to GitHub.  This lowers the number of steps you need to think about.  Also usually long periods of development happen between times you need to deploy and that means you forget the commands and stuff.  Instead, continuous deployment means you just always are deploying to a live site without thinking.

Generally this is configured with Github Actions which are scripts than can run on a remote computer hosted by Github following certain commits.  These can be configured in many ways worth discussion.  For instance a new deployment could go with each commit, or each commit to certain files, or even with certain other git specific things happen like a new tag or release is created.


## Dealing with multiple versions

Generally the biggest question is dealing with multiple versions of the same experiment. 

Consider this typical research project evolution.  First you develop an experiment and maybe collect some pilot data.  Next, you refine the experiment based on the pilot and run a full pre-registered design.  Next, you have followup questions and run several subsequent versions.

The key question is which versions should we keep around on the deployment server?  All versions?  Just the latest?

One reason for keeping all versions is if you later want to share links to the different experiments to reviewers or readers of the paper.  

How do we deal with small changes though?  Like you deploy "experiment 2" run 5 subjects and then realize there was a small bug which you fix and then re-deploy.  How do we keep track of which one is the "real" experiment 2 and help experimenters keep track of things?

One key principle of Smile

One idea is to use an experiment appropriate version of [semantic versioning](https://semver.org).  You've probably seen software with versions like 1.0.1 or 2.3.12.  This is known as semantic versioning and has the general format `MAJOR.MINOR.PATCH`.  Major versions are one that make incompatible API changes.  Minor version are incremented when you add functionality/features in a backward-compatible manner.  And patch is incremented when you make backward-compatible bug features.

The notion of backwards compatibility isn't quite as useful for experiments so one proposal is to use those numbers in a new way.  `PROJECT.EXPERIMENT.PATCH` where project is incremented for different projects from the same code base, experiment is incremented for new experiments, and patch indexes but and other smaller feature changes.  

An alternative proposal is `EXPERIMENT.PROJECT.PATCH`.
