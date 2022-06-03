# Configuration Options
<style>
.note {
    font-size: 0.9em;
    text-align: right;
}
</style>

Applications inevitably need configuration options.  The key question is what those are and where they should go and how they should be determined.

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

What we want is for our javascript application to have access to these options.  In most cases, we could just write them in our javascript someplace.  However, there are two issues with this.  First, some of the items we need to generate on the fly using other code that might not be part of our final experiment (running in the browser) itself. For instance, the code running in the browser can't access the file system and thus can't look up the hash value of the last git commit.  Instead, we need to run some other code against the local files to determine these values automatically :robot:.  Second, some of the information is sort of particular to our lab and so we might not want them placed into git.  

Luckily all of these problems are solved by Vite the building and development system we are using.  At its core, Vite preprocesses our javascript/CSS/HTML files and "bundles" them together in more efficient, smaller packages for delivery to our subjects.  As one part of this, it pre-processes the files using some configuration options.


## Example file

Here is an example file that would be a Javascript object


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
and amazing tool.  Vite uses .env files to configure options for your application.
In Smile, these configuration options are located in the `env/` folder.  There
are two files here `.env` and `.env.local`.  All files with `.local` at the end
of them are not traced by git and so are a good place to put "private" information
like urls, certain credentials, etc...  