# Configuration Options
<style>
.note {
    font-size: 0.9em;
    text-align: right;
}
</style>

Applications inevitably need configuration options.  The key question is where they should go, what those are, and how they should be determined.

## Where should they go

Generally, configuration options can be divided into two groups based on security/privacy concerns.  One set of options can be publically exposed (e.g., published in a public Github repo).  Examples of these might be options related to data collection like "Does the experiment allow repeat participation?"  The second set of options typically needs to be shielded from public GitHub repos because it contains passwords, access keys, or other sensitive URLs that might be best left secure.  

:::warning
Because Smile runs as a Single-Page App, most of the configuration options available to the app will also, in theory, be available in the source code of the application.  Thus, it is still not safe to configure the app with sensitive passwords.  Services like Google Cloud/Firebase provide access tokens to web apps that can be exposed to the open web and the security configuration takes place on the server-side.  
:::

Some wisdom about these things is available on the [12 Factor App](https://12factor.net) site, particularly the section on [config](https://12factor.net/config).  In this document, it is argued that environment variables are the safest way to configure sensitive information (this way they are never mentioned in files that could be accidentally committed.)  This is, incidentally, [the approach that has been taken more recently with psiTurk](https://psiturk.readthedocs.io/en/stable/configuration-overview.html#which-go-where-consider-security-and-privacy-as-well-as-science-replicability).

Another issue is making environment variables accessible inside the web application/Single Page App.  To do this the build system can come in handy.  [Vite](https://vitejs.dev) uses the [dotenv Node.js package](https://vitejs.dev/guide/env-and-mode.html) to read in `.env` files and make them accessible in your javascript.  This is done by doing a static string replacement operation on all the files prior to building them (and it also done as a step in the development server).  The variables become available in your code as `import.meta.env.VITE_XXXX` where `XXX` is the name of the environment variable.

When you are relying on Github to manage deployments for you then the way to set environment variables is through ["Secrets"](https://docs.github.com/en/actions/security-guides/encrypted-secrets).  These are variables that you define in the settings section of the repository which can then be accessed by script at run time using Github Actions.

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

The ideal situation is to keep the number of configuration options to a minimum by making reasonable choices for most things.  Also the web experiment itself may have fewer options than the services (e.g., Mechanical Turk, Prolific).  In cases where there are likely to be different choices for different experiments in the lab (e.g., should mobile devices or tablets be allowed to take the experiment?) then we want to fill in sensible defaults and then let people configure them easily in one place.

Finally, some of the items we need to generate on the fly using other code that might not be part of our final experiment (running in the browser) itself. For instance, the code running in the browser can't access the file system and thus can't look up information about the latest git commit.  Instead, we need to run some other code against the local files to determine these values automatically :robot:.  

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
VITE_FIREBASE_APIKEY             = AIzaSyCFaXN8JwrUgJviKZ8toXob_I1ysslvOeQ
VITE_FIREBASE_AUTHDOMAIN         = smile-db-test.firebaseapp.com
VITE_FIREBASE_PROJECTID          = smile-db-test
VITE_FIREBASE_STORAGEBUCKET      = smile-db-test.appspot.com
VITE_FIREBASE_MESSAGINGSENDERID  = 947316438062
VITE_FIREBASE_APPID              = 1:947316438062:web:19974ca8a24ffe671f5bbf

```

---

## Configuration

The build and development server for Smile is Vite which is a really fast
and amazing tool.  Vite uses .env files to configure options for your application.  In Smile, these configuration options are located in the `env/` folder.  There are two files here `.env` and `.env.local`.  All files with `.local` at the end of them are not traced by git and so are a good place to put "private" information like urls, certain credentials, etc...  