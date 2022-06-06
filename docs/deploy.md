# Deploying your experiment

Generally things are set up so that your experiment is automatically deployed when you push new changes to GitHub.  This lowers the number of steps you need to think about.  Also usually long periods of development happen between times you need to deploy and that means you forget the commands and stuff.  Instead, continuous deployment means you just always are deploying to a live site without thinking.

Generally this is configured with Github Actions which are scripts than can run on a remote computer hosted by Github following certain commits.  These can be configured in many ways worth discussion.  For instance a new deployment could go with each commit, or each commit to certain files, or even with certain other git specific things happen like a new tag or release is created.

## Dealing with multiple versions

Generally the biggest question is dealing with multiple versions of the same experiment. 

Consider this typical research project evolution.  First you develop an experiment and maybe collect some pilot data.  Next, you refine the experiment based on the pilot and run a full pre-registered design.  Next, you have followup questions and run several subsequent versions.

The key question is which versions should we keep around on the deployment server?  All versions?  Just the latest?

One reason for keeping all versions is if you later want to share links to the different experiments to reviewers or readers of the paper.  

How do we deal with small changes though?  Like you deploy "experiment 2" run 5 subjects and then realize there was a small bug which you fix and then re-deploy.  How do we keep track of which one is the "real" experiment 2 and help experimenters keep track of things?
