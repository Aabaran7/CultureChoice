# Deploying your experiment

Deploying (or hosting) your experiment involves building the web application and then transferring a copy of the files to a suitable public website where participants can access it.

Consistent with the principle of ["don't sweat the small stuff"](/principles.html#don-t-sweat-the-dumb-stuff) the process of deployment has been mostly automated in **🫠 Smile**. 

The steps to deploy are simply to push changes to the `main` branch of the repo for your project.  In response, GitHub will build your project and upload your files to the [configured](/configuration) server location.

:::danger Comment
Need to add... where is it hosted?  It should be a config option but maybe nice if there was like a message posted somewhere or emailed to let you know it was successful and where it is located.
:::

That's really it. 

(If you want more details on the process the [this page](/advanced/deploysteps) provides an overview).

## :bulb:? Dealing with multiple versions

One unsolved question is dealing with multiple versions of the same experiment. 

> Consider this typical research project evolution.  First you develop an experiment and maybe collect some pilot data.  Next, you refine the experiment based on the pilot and run a full pre-registered design.  Next, you have followup questions and run several subsequent versions.  The key question is which versions should we keep around on the deployment server?  All versions?  Just the latest?

One reason for keeping all versions is if you later want to share links to the different experiments to reviewers or readers of the paper.  

How do we deal with small changes though?  Like you deploy "experiment 2" run 5 subjects and then realize there was a small bug which you fix and then re-deploy.  How do we keep track of which one is the "real" experiment 2 and help experimenters keep track of things?



One idea is to use an experiment appropriate adaptation of [semantic versioning](https://semver.org).  You've probably seen software with versions like 1.0.1 or 2.3.12.  This is known as semantic versioning and has the general format `MAJOR.MINOR.PATCH`.  Major versions are one that make incompatible API changes.  Minor version are incremented when you add functionality/features in a backward-compatible manner.  And patch is incremented when you make backward-compatible bug features.

The notion of backwards compatibility isn't quite as useful for experiments so one proposal is to use those numbers in a new way.  `PROJECT.EXPERIMENT.PATCH` where project is incremented for different projects from the same code base, experiment is incremented for new experiments, and patch indexes but and other smaller feature changes.  An alternative proposal is `EXPERIMENT.PROJECT.PATCH`.




---

:::tip Notes from lab meeting

- (not mentioned by adding now), smile itself can use semantic versioning because it just presumably gets better or has bug fixes.  this discussion about versions is downstream from smile (e.g., projects that build up on it, etc...)
- not every push needs to increment a counter, some are just daily code-check ins and fixing minor typos
- maybe keep copies of files around for old versions for replicability
- git branches might be a useful organizing structure for different experiments (respecting the parallel development that sometimes happens).  one version of that is that files are uploaded to a url like `http://smile.gureckislab.org/exps/my_cool_exp/branchname-v1.0.1/`
- every push could make a new version of the code but some clean up code could run every 30 days deleting any project folders which resulted in no data
:::

:::tip Useful links
- [semantic versioning](https://semver.org) - what is it?
- [semantic release](https://semantic-release.gitbook.io/semantic-release/) - automates determining the next version number, generating the release notes, and publishing the package.
    - see also [automating versioning and releases using semantic release](https://medium.com/agoda-engineering/automating-versioning-and-releases-using-semantic-release-6ed355ede742)
- [git flow](https://levelup.gitconnected.com/semantic-versioning-with-git-flow-and-the-marvelous-way-to-go-there-b9f97b90455c) - semantic versioning with branches
- [commitlint](https://github.com/conventional-changelog/commitlint) - makes sure your commit messages conform to certain patterns which are useful for semantic release
- [commitizen](https://github.com/commitizen/cz-cli): cool tool for formatting git commit messages
:::