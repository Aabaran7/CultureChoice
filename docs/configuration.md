# :gear: Configuration Options
<style>
.note {
    font-size: 0.9em;
    text-align: right;
}
</style>

Applications inevitably need configuration options.  

Configuration options in **🫠 Smile** are stored in various [dotenv](https://dotenv.org) files in the `env` folder of the project.
[dotenv](https://dotenv.org) files are simply plain text files that typically define lists of configuration options in all caps along with values separated by an equals sign.  For example:

```
MY_CONFIG_OPTION = 'hi'
ANOTHER_OPTION = 33
```

You usually need to configure your application once when you first create your project.  This guide gives you the minimum information you need to get started as well as details on adding new configuration options specific for your project.

[toc]

## Getting started quickly



## How configuration files are organized

Configuration files go in the `env` folder.  Here is a typical listing of this folder.

```
env
├── .env
├── .env.deploy.local
├── .env.docs.local
└── .env.local
```

You may not see all these files to begin with and so may need to create them.  

All the filenames begin with `.env` which is the convention used by the [dotenv](https://dotenv.org) package.

Notice that some files end in `.local` as the file extension.  These files are by default
ignored by git (via the `.gitignore` file) and so are not version tracked.  This is necessary because some
configuration options which go in those files are considered "secret" and we don't want them easily searched
in GitHub when/if your project repository becomes publically shared.


### Types of config options: Normal, Automatic, and Secret

Let's consider the files one by one. 

#### Normal Options

`.env.local` contains **normal** configuration options.  Here is a typical file with fake entries for the values (adjust for your situation):

```
# configure your experiment here
VITE_BUG_REPORTS                 = "http://something.com/bugs"
VITE_BROWSER_EXCLUDE             = ie
VITE_ALLOW_REPEATS               = yes
VITE_SERVICES_ALLOWED            = amt,prolific,sona,web

# enter firebase database credentials
VITE_FIREBASE_APIKEY             = apikey
VITE_FIREBASE_AUTHDOMAIN         = project.firebaseapp.com
VITE_FIREBASE_PROJECTID          = project
VITE_FIREBASE_STORAGEBUCKET      = project.appspot.com
VITE_FIREBASE_MESSAGINGSENDERID  = msgid
VITE_FIREBASE_APPID              = appid
```

Notice that the configuration options in this file begin with `VITE_`.  This means they are made 
available to the web application.  `VITE_BUG_REPORTS` is a url you want participants to go to 
report a problem with your experiment.  `VITE_BROWESER_EXCLUDE` is a string that configures which 
types of browsers can take your experiment.  `VITE_ALLOW_REPEATS` attempts to prevent participants
from taking your task more than once.  `VITE_SERVICES_ALLOWED` configures which recruitment gateways
you want to enable for your experiment (e.g., amt - Mechanical Turk, prolific - Prolific.ac, etc...).

Normal configuration options also include several `VITE_FIREBASE_` options for configuring Google's
Firestore backend.  These options should just be pasted from when you setup Firestore for your project.
In the gureckislab you can get a copy of these from our password protected lab docs.


#### Automatic Options

The `.env` file contains automatically determined configuration options.  **🫠 Smile** 


[^secret]: Secret information is information that we don't want easily searchable in GitHub but does **not**.  However because Smile runs as a Single-Page App, most of the configuration options available to the app will also, in theory, be available in the source code of the application.  Thus, it is still not safe to configure the app with sensitive passwords.  Services like Google Cloud/Firebase provide access tokens to web apps that can be exposed to the open web and the security configuration takes place on the server-side. Some of the secret options in Smile are not shared with the web application.

There are several different configuration files.  The reason is that some configuration variables are considered "sensitive" and shouldn't be stored in public GitHub repositories.  Even if you start out developing your experiment in a private GitHub repo

Generally, configuration options can be divided into two groups based on security/privacy concerns.  One set of options can be publically exposed (e.g., published in a public Github repo).  Examples of these might be options related to data collection like "Does the experiment allow repeat participation?"  The second set of options typically needs to be shielded from public GitHub repos because it contains passwords, access keys, or other sensitive URLs that might be best left secure.  



Some wisdom about these things is available on the [12 Factor App](https://12factor.net) site, particularly the section on [config](https://12factor.net/config).  In this document, it is argued that environment variables are the safest way to configure sensitive information (this way they are never mentioned in files that could be accidentally committed.)  This is, incidentally, [the approach that has been taken more recently with psiTurk](https://psiturk.readthedocs.io/en/stable/configuration-overview.html#which-go-where-consider-security-and-privacy-as-well-as-science-replicability).

Another issue is making environment variables accessible inside the web application/Single Page App.  To do this the build system can come in handy.  [Vite](https://vitejs.dev) uses the [dotenv Node.js package](https://vitejs.dev/guide/env-and-mode.html) to read in `.env` files and make them accessible in your javascript.  This is done by doing a static string replacement operation on all the files before building them (and is also done as a step in the development server).  The variables become available in your code as `import.meta.env.VITE_XXXX` where `XXX` is the name of the environment variable.

When you are relying on Github to manage deployments for you then the way to set environment variables is through ["Secrets"](https://docs.github.com/en/actions/security-guides/encrypted-secrets).  These are variables that you define in the settings section of the repository which can then be accessed by a script at run time using Github Actions.

See the discussion [here](https://stackoverflow.com/questions/60176044/how-do-i-use-an-env-file-with-github-actions) for some helpful tips.


## What are the relevant options for Smile?

Here's a possible list (which can be added to):

- **Experiment Name**: a short name, might be set random to ensure uniqueness? :robot:
- **Experiment version**: version info (can use automatic semversioning) :robot:
- **Git commit hash**: git information that can be stored with data :robot:
- **Git commit message**: the message that went with the last git commit
- **Git status**: is the current working directory clean or are there changes?
- **Browser exclude rule**: rules for which types of browsers/devices can be used :cowboy_hat_face:
- **Allow repeats**: do we allow people to do the task multiple times? :cowboy_hat_face:
- **URL to file bug reports**: provide a URL people can go to report problems :cloud:
- **Final deployment url**: what is the final url we share with participants? :robot: + :cloud:
- **Services allowed**: do we let amt, prolific or what :cowboy_hat_face:
- **Database parameters**: probably the firestore info :cloud:

<div class="note">
    🤖 = should be set automatically<br>
    🤠 = should have reasonable defaults<br>
    ☁️ = has to be copied from cloud provider
</div>


## How are they set

The ideal situation is to keep the number of configuration options to a minimum by making reasonable choices for most things.  Also, the web experiment itself may have fewer options than the services (e.g., Mechanical Turk, Prolific).  In cases where there are likely to be different choices for different experiments in the lab (e.g., should mobile devices or tablets be allowed to take the experiment?) then we want to fill in sensible defaults and then let people configure them easily in one place.

Finally, some of the items we need to generate on the fly using other code that might not be part of our final experiment (running in the browser) itself. For instance, the code running in the browser can't access the file system and thus can't look up information about the latest git commit.  Instead, we need to run some other code against the local files to determine these values automatically :robot:.  The purpose of storing the git commit hash in the javascript app is so it can also be entered into the resulting data files (One key principle of **🫠 Smile** is that [data must always be linked to the code that created it](principles.html#data-must-always-be-linked-to-the-code-that-created-it).)

This will likely require an extra build step.

## Example file

Here is an example `.env` file:


```
# this file is not tracked by github and contains
# semi-sensitive information
# note these variables are complied in the final javascript
# source so don't add very high security stuff to them

# configure your experiment here
VITE_BROWSER_EXCLUDE             = ie
VITE_ALLOW_REPEATS               = yes
VITE_SERVICES_ALLOWED            = amt,prolific,sona,web
VITE_BUG_REPORTS                 = http://smile.gureckislab.org/bugs
VITE_DEPLOY_URL_BASE             = http://smile.gurecislab.org/exps/


# enter firebase database credentials
VITE_FIREBASE_APIKEY             = xxxx
VITE_FIREBASE_AUTHDOMAIN         = xxxx.firebaseapp.com
VITE_FIREBASE_PROJECTID          = xxxx
VITE_FIREBASE_STORAGEBUCKET      = xxxx.appspot.com
VITE_FIREBASE_MESSAGINGSENDERID  = xxxx
VITE_FIREBASE_APPID              = xxxx

```

---

## Configuration

The build and development server for Smile is Vite which is a really fast
and amazing tool.  Vite uses .env files to configure options for your application.  In Smile, these configuration options are located in the `env/` folder.  There are two files here `.env` and `.env.local`.  All files with `.local` at the end of them are not traced by git and so are a good place to put "private" information like urls, certain credentials, etc...  