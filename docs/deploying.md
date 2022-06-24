

# :cloud: Deploying your experiment

Deploying (or hosting) your experiment involves building the web application and then transferring a copy of the files to a suitable public website where participants can access them.

The steps to deploy are... 
1. **Use `git` to push changes to a branch of the repo for your project**


In response, GitHub will automatically
1. **Build your project**
1. **Upload your files** to the [configured](/configuration) server location
1. **Notify a bot** in the gureckislab slack (`#smile-deploy`) about the final URL of your project (or if there is an error)


![steps for building](/images/deploy-steps.png)


This process provides you with nearly instant feedback on putting your code in the cloud.

**That's really it!** :sweat_smile:

For most people this is all you need to do.  But there is more:
- If you have a more complex project with multiple experiments read the section on [organizing multiple versions of your experiment](#organizing-versions-of-your-experiment).  
- If you run into problems try [debugging deployment issues](#debugging-deployment-issues).  
- If you want to go back in your development history and deploy some older version of your code check out [this section](#deploying-a-specific-version-of-your-experiment). 
- If you just want to understand how this magic works jump to [understanding the deployment steps](#understanding-the-deployment-steps).


## What type of commits trigger an automatic deployment?

By default, any commit on any branch that modifies a file in your project will generate a deployment.  The concept here is "[continuous deployment](https://en.wikipedia.org/wiki/Continuous_deployment)" where things just are always synced with the online website.  The exceptions are: 
- Changes that only affect files in the `docs/` directory do not generate a deployment.
- Additionally, pushes to branches name either `analysis`, `models`, or `docs` will not generate a deployment with the assumption is this is where you can track code for these purposes and are not relevant to the deployment logic.

If you would like the deployment workflow to ignore add additional files, folders, or branches see the starting section of `.github/workflows/deploy.yml`.



## Organizing versions of your experiment

Once you start committing changes to your project, one key challenge becomes dealing with multiple versions of the same experiment:

> Consider this typical research project evolution: First you develop an experiment and maybe collect some pilot data.  Next, you refine the experiment based on the pilot and run a full pre-registered design.  Next, you have followup questions and run several subsequent versions.  The key question is which versions should we keep around on the deployment server? 

The idea in **🫠 Smile** is to use the structure of GitHub repos to help organize the versions of your files as well as keep the data linked to the code that generated it.  To do this we use an adapation of [semantic versioning](https://semver.org).  You've probably seen software with versions like 1.0.1 or 2.3.12.  This is known as semantic versioning and has the general format `MAJOR.MINOR.PATCH`.  Major versions make incompatible API changes.  Minor versions are incremented when you add functionality/features in a backward-compatible manner.  And patches increment when you make backward-compatible bug features.

The sequential, number-based system makes sense for simple software projects where there is one "product".  However, in behavioral research, we often have multiple development paths (experiments) and they have conceptual meanings that are not well served by a numbering system.

![branching nature of experiments](./images/branchingexps.png)

Instead, **🫠 Smile** uses GitHub as a project organizing tool.


### Using GitHub as a project organizing tool


At the top level of GitHub is the **user account**.  For example, my username is `gureckis`.  Within my user account, there are several repositories for different projects.  The idea in **🫠 Smile** is each new research project gets its own **repository** (repo). Within each repo there are any number of **branches**.  Branches are offshoots of an original code base which can be used for parallel development on a project.  Branches can be merged into one another and shuffled around.  However, we will primarily use them as parallel pipelines capturing different **experiments**.  So conceptually, branches = experiments.  


```
gureckis                 <--- github username
├── another_project      <--- repository
│   └── exp1
    └── pilot      
└── my_cool_project      <--- repository
    ├── exp1             <--- branches for experiments
    ├── exp2
    ├── exp2b
    └── pilot
```


Next within a branch, we will often make a sequence of commits as we implement features, adjust bugs, and so forth.  Generally, these advance forward in a sequence automatically but sometimes it is helpful to reference some particular moment in the development of an experiment.  For this, we use git tags as a final organizing element.  At this final level we adopt the semantic versioning format but with only two values: MAJOR.PATCH.  The MAJOR counter starts at 0 and is incremented for each major release/change to the experiment that you wish to "mark".  PATCH is automatically incremented starting at 0 each time a commit is made to a given branch.


For each of these paths we can create a unique deploy path
`gureckis/another_project/pilot/0.0/` or `gureckis/my_cool_project/exp2b/1.0/`.






## Deploying a specific version of your experiment

Sometimes it can be helpful to re-deploy an older version of the code (e.g., sharing with a reviewer or collaborator).  Using GitHub hashes (which index individual commits) this is possible.  Go to your repository on github: `https://github.com/user/repo/commits/main` (replacing user/repo with your username and the name of your project repo).  This will present you with a list of past commits you can navigate which looks like this:  

![github commit history](./images/githubcommithistory.png)




Find the commit you want to deploy publically and click the button with two boxes to copy the full hash value for that commit to your clickboard.  Then run the following command:

```
gh workflow run deploy-hash.yml -f github_sha=XXXXX 
```

replacing `XXXXX` with the hash you have in your clipboard (it is a long sequence of letters and numbers).  This will deploy that version of the code to a special 
deploy path `hashes/user/project/SHORTHASH/` where `SHORTHASH` is replaced with the first 7 characters of that hash value you requested.  This way you can share a live link to any arbitrary and specific version of the code with people.


## Debugging deployment issues

Sometimes a deployment can fail due to an error in your code or your setup.  When possible an error message will be posted to `#smile-deploy` by the slack bot.  However, sometimes even this fails.  In any case, if you don't get a notification that your app deployed here are some useful hints for fixing things.

First, check the `#smile-deploy` slack channel and see if there are any relevant messages.

Second, make sure you have a set of `.env.*.local` files in the `env/` folder (created using `git secret reveal` for gureckislab) and have run the `npm run config:upload` command (refer back to the [initial setup instructions](starting)).  This latter command uploads some specific configuration options to GitHub which are needed for your deployment to run.  You can verify these have been set by going to your repository on the GitHub website, clicking Settings, then "Secrets".  There should be several repository secrets including `SECRET_APP_CONFIG` and `EXP_DEPLOY_PATH`, etc...

Third, run the `npm run build` and `npm run serve` commands and verify that these steps complete without error on your local machine.  If there are errors this maybe preventing GitHub from building your site.  Fix the errors locally and push the changes.

Finally, go to the GitHub repo for your project on the github.com website and click the "Actions" tab.  This will show a history of recent "workflow" runs.  Runs that fail will have a red :x: next to them.  Clicking on this will lead to a "transcript" of the run which can provide some debugging hints.

![debugging github actions](./images/githubactions.png)


## Understanding the deployment steps
 
Smile deployment is **continuous and automatic** by design.  The purpose of continuous deployment is so that new changes to the code are always placed into a live server environment (which is then helpful for [integration testing](/testing)).
The purpose of automating deployment is to make it one less thing you need to think about.  However, if something goes wrong, or you need to customize things, it can be helpful to understand the steps.

Deploying a website involves several steps: triggering the GitHub Actions deployment process, configuring the site, building the site, and uploading the files to a suitable internet-accessible server.

### The Github Actions deployment trigger

GitHub Actions are a feature of GitHub that allows customizable scripts to run on a cloud computer instance whenever certain events happen on a repository.  Examples include running a script when someone leaves a comment on a repo or opens a pull request.  Scripts can also run automatically anytime a push is made to the repository.  In the case of Smile the deployment script is triggers with any push to the repository excluding the documentation folder (`docs/`).  This runs the action located at `.github/workflows/deploy.yml`.  Even without a lot of knowledge about GitHub action you can read this script and understand the basic logic.

### Building the site

The first step of the GitHub action runs a sequence of shell commands on a linux cloud instance hosted by GitHub (`runs-on: ubuntu-latest`).
Next, the current version of the code (after the commit) is checked out using git.  
Next several scripts run to optimize the environment for the app and configure it.  Then relevant software is installed such as Node.js.  The node dependencies are then run using `npm install`.  Then the website is build `npm run build`.  The completed website is located at `dist/`.

You can run most of the steps up to this point locally by just typing `npm run build`.

### Uploading files to an Internet-accessible server

Next, the GitHub action uploads the files to the server using rsync.
The remote host, folder, and other options are set using GitHub Secrets which are encrypted environment variables which you configure on the repository settings.  Generally in the gureckislab these will be set for you, but read more about [configuration options](configuration) to customize or adjust.

### Notifying the Slack bot
In the gureckislab the final step is to sent a notification about the deployment to a Slack [Worflow Builder](https://slack.com/help/articles/360035692513-Guide-to-Workflow-Builder) bot.  This lets you verify the code was deployed and provides you with an up-to-date URL to share with participants.

If the deployment script fails, GitHub will attempt to notify the slack bot about the error.  However, it requires that the GitHub secrets have been properly uploaded with `npm run config:upload` so the absence of an error notification isn't proof things did work.

