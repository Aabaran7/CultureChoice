# 👩‍🔬Lab Experiment Workflow Manifesto
The lab experiment workflow, particularly psiTurk, has become a burden.  It is complex, it only works with Mechanical Turk, and is nearly 10 years old in terms of its thinking and architecture.  It’s time to move on.

## Key philosophy ⚡️
- We need a new framework for doing experiments based on up-to-date web technologies.
- It needs to accomodate multiple recruitment channels (AMT, prolific, etc…) with the same code.
- Key is to make this a **progressive** framework in that simple and common stuff is done super simply and *extremely fast and error free* but complex stuff is still possible down the line by adding stuff when you need it.  (*progressive frameworks means ones that you only add what you need*)
- I want things so that if you are making a relatively straightforward cognitive psychology type experiment you could do the entire thing start to finish in day or so, for experts, and a week for new lab members.
- Sharability and modularity are critical.  If one lab member makes a great implementation of a psychometric scale (BIS/BAS) another member who wanted to use that in their experiment should spend no more than 15 minutes making that happen.  If one person makes a cool captcha everyone can add it to their experiment in 5-10 minutes.
- A common workflow is more desirable than every—phd student-for-themselves because we push in the same direction but also because aids replicability and reuse.
- If the code we develop for this lasts for 5 years (1/2 as long as psiturk code base) I’ll be happy.
- Work to make it clean/simple when default workflows don’t align with the needs of experimenters
- Mostly want noone to think about backend stuff at all in default cases, and only if you need something custom does the concept of the server-side come into your world view.
- Want making experiments to be fun, exciting, easy, not time consuming.
- Want to use technology to help reduce errors and bugs in our collected datasets.
- Want to simplify the process of getting from data -> data analysis.
- Noone in the lab should ever be tempted to use Qualtrics which is to say things should be about that easy.

##  Terminology 📋
What do I mean by front/back end?  **Front end** means things in the browser.  **Back end** means databases and other things which manage and export data.  The hope is we develop a useful backend which you rarely need to mess with much except for extremely niche type applications, and then focus on modern front end tools and simple deployment systems.

*Note: currently psiturk combines the front end and backend together in a “project.”  This is nice in terms of customization and also respects like the 1 to 1 mapping between versions (front end always linked to backend).  However it also means that “running” your experiment always means also running a backend which means Heroku deployments, etc…. Also in practice very little of the backend changes for normal experiments so it is too flexible for the most common cases leading to extra configuration hassles.* 


## Front-end 🤩
Front end has to do with 
- Development — what modularity system do we want to use to enable more cross-talk and sharing?
- Deployment — after you make your app how do we make it as seamless/zero commands as possible to send it up to the web?
- Testing — how do we start to integrate unit testing and other testing frameworks into the UI of our experiments so they are more reliable?
- Configuration — how do we configure each experiment to customize it’s global settings
- Code version linking: all data records from an experiment should record which version of a code base was run (e.g., github commit hash) for replicability/bug tracking
- Recruitment — how do we make it possible to recruit and run with any arbitrary recruitment platform including Mechanical Turk, Prolific, a custom citizen-science type page, Facebook/Instagram/Twitter/Google ads, etc…
- Documentation — let’s make super easy to understand documentation to get people going

### Possibilities:
- Custom javascript (ala psiturk.js)
- raw [jQuery](https://jquery.com)
- [d3.js](https://d3js.org)
- [jsPsych](https://www.jspsych.org/7.2/)
- [Vue](https://vuejs.org)
- [React](https://reactjs.org)
- [Angular](https://angular.io), etc…
- gaming libraries like [Phaser](https://phaser.io) (pam!), [Unity](https://unity.com/pages/unity-pro-buy-now?gclsrc=aw.ds&gclid=CjwKCAjw7IeUBhBbEiwADhiEMZ_9Fmbg4yKNAO_c1TU6kpAGm8Ufkn_OXML91pG_WWKpUtaLsNEW3BoCBuYQAvD_BwE) (Ili! Guy!), etc…
- something else?

*One comment about frontend: It is likely that in 1-5 years python will become a more viable front end language due to recent advances in WebAssembly possibly leading to a shift away from Javascript.  However, Javascript is so big that will be a slow evolution and so I’m still comfortable with going Javascript here.*

## Back-end 🧟‍♂️
Minimally the back end needs to store data in a database of some kind (low tech: simple .json text files, medium tech: mysql, high tech: realtime databases).
- Do you need a different backend server for each experiment or can we make one server for entire lab?  Discuss.
- What datastorage technology?  Key concerns are cost of storage, types of queries you can perfom on it, etc…  (e.g., .json text files hard to query, some real time NoSQL databases also limit queries)
- What about server side computations (these are computations we don’t want to be user-editable in the experiment javascript).  Examples:
	- Computing bonus from an experiment
	- Verifying if the user id on AMT or prolific has done this specific experiment or this _type_ of experiment before
	- Blocking known bots or bad actors from participating based on ip addresses, AMT workeriDs, etc…
	- Running server-side python code that determines something about experiment (e.g., using OpenAI gym to define and response to actions by a user in a browser), or possibly fitting a model to a users data and then using the fitted model to adapt future trials
	- Ability to yoke subjects (like query database and find a previous person and use their data as input for current designs — relates to markov monte carlo with people type chaining)
	- Multi-player support for group behavior experiments (ala Pam)
- Documentation — let’s make super easy to understand documentation to get people going

### Possibilities:
Various cominations of:
- [Flask](https://flask.palletsprojects.com/en/2.1.x/) (python based web application)
- [Firebase](https://www.googleadservices.com/pagead/aclk?sa=L&ai=DChcSEwjp3eGU4eX3AhUfwsIEHYQfCIkYABABGgJwdg&ae=2&ohost=www.google.com&cid=CAESa-D2WJIj2nkfENc79DvRv3JhOgNgTLR_M5wXx6ConwD6KQjsaOn1lvQ6BTWDlq-h48Hap7Tq46rsKVLwq81-1HgZBRdkEu-tzi4ESYEb2XHotNk7E6OFMvrWlNPdOjWOLuoPph8Umn6Ll2Dl&sig=AOD64_0y1U4kGniFArjaV7dE4szVdNp3Dg&q&adurl&ved=2ahUKEwiM2teU4eX3AhXSkGoFHVBQBeIQ0Qx6BAgDEAE&nis=2&dct=1)
- [Express.js](https://expressjs.com) (node)
- [Laraval](https://laravel.com) (php)
- others? (there are literally hundreds)


## Expected use cases

What are the types of web experiment things we are doing as a lab generally?  I guess we might want to see if there's a solution that covers some or most of what people wanted.  Let’s take a look at some recent papers and proposed projects…

- Angela’s attention RL task - sort of a bandit style task pretty well suited to something like jsPsych (in fact, written in jsPsych)
- Emily’s question asking experiment - pretty complex. Subject have several complex mouse-guided interactions with a battleship grid then ask questions and rank order them using some list sorting widgets.  This was based on d3js code written by Anselm but this code and the imperative coding style was super complex and hard to maintain.  Also it had many bugs we never could figure out exactly.
- Guy’s VR experiments - well to some degree this bypassed the issue by requiring interactions that were in Unity but the surrounding stuff was in React
- Pam’s multi-player helping task.  Used Phaser and I don’t think anything like jQuery/jsPsych could have managed that.  Just needed a video game specific tool with support for sprites and other add ons.
- Ill’s canadian traveler thing - written in c# using unity, i think used psiturk for recruitment.
- Anna’s causal learning experiments - These were elaborate and hard to maintain d3 code.  It was messy but worked.  I believe that Kate Nuss, Ali Cohen, Zach Davis, et al. reimplemented the experiments for kids using something along the lines of jsPsych but not sure how it worked in the end.
- Alex rich learning traps stuff was all psiturk/Jquery/d3 type stuff.  Seemed ok but development was somewhat involved.
- Pam’s categorization task - this was based on very old, boilerplate type psiTurk code primilarly using d3/jquery type calls.  Bug continued and never resolved adequately.  Development of new versions/features took months particularly designing instructions which were the most important part of the study.
- David’s long term memory encoding experiments.   The task was just like study a list of words and then get tested on them after a delay.  jsPsych for the front end but the rest was some more complex custom psiturk/flask backend for firing off reminder emails and stuff.  Development time for front end was very easy with jsPsych.
- Pat physics experiments: overlay videos with custom interaction elements.  Did it in regular javascript/jQuery for the most part.  Seemed not so bad and complexities had more to do with the video itself.
- Ethan physics stuff.  Mostly unity rendered videos into a qualtrics form.  Real lack of control including of randomization and stuff.  Not recommended.
- ARC task - this was quite complex javascript with a very involved interface borrowed from chollet and then adapted for our purposes. 

### Future designs
- Emily has been planning experiments were subjects might design video game levels to each another person some concepts in a game.  I assume these would be more similar to the Battleship stuff in terms of complex, dynamic interactions, and possibly similar to Pam’s Phaser stuff too needing sprites and stuff
- Baba is you - obviously a sprite based game so would be helped in that space although different technical trade offs could be considered for sure
- Further modifications of Pam’s experiment for computational helping type stuff, multi player, player-bot interactions with a game context (possibly add on modules like real time payer communication and chat between players)
- Additional experimentation with bandit/RL type problems
- Physics things involving video and manipulations or ratings of videos
- Human-machine interaction things where humans interact with machine learning algorithms in some ways
- More stuff in the line of Guy with complex 3d environments involving interaction with multiple types of controls, complex data streams, and text/language type stuff
