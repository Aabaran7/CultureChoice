# 👩‍💻 Setup notes

**You never have to do these steps they are just documented so you know how we got to 
the initial project structure.  Also include some useful notes about things.**

## How the project was initialized 


The project starts off with a bunch of files which you might find unfamiliar.  There is no magic there though.
The basic directory structure was automatically created by [Vite](https://vitejs.dev). 

First, you need to install Node.js on your computer if you haven't already.  You can download the latest version [here](https://nodejs.org/en/download/).  Verify that you have the `npm` command in your terminal program of choice.


Next, I initialized a default Vite project:

```sh
mkdir smile
cd smile
npm create vite@latest .
```

It asked me for a project name ("smile"), a framework ("vue"), and a variant ("vue" meaning vanilla javascript, not typescript).
Then you just run `npm i` to install all the dependencies.

Next, I installed the documentation system, [Vitepress](https://vitepress.vuejs.org).  From inside
the smile folder:

```sh
npm add vitepress --save-dev
mkdir docs && echo `# Smile` > docs/index.md
```

Then I added these commands to the `package.json` file:

```json
{
  ...
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:serve": "vitepress serve docs"
  },
  ...
}
```

To run the documentation locally then I just type `npm run doc:dev` and open the provided localhost link.
The documentation on how to configure Vitepress is [here](https://vitepress.vuejs.org).


## Vite development features

One of the most useful features of Vite in development mode is that it automatically reloads the webpage anytime changes are made to any project files.  This prevents you from having to go back and forth between your editor and the browser and pressing shift-reload.

[Some](https://marketplace.visualstudio.com/items?itemName=ziishaned.livereload) [tools](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) provide this automatic updating by forcing the entire browser webpage to reload anytime a file changes.  

However, the downside of reloading the site page each time there is a change is that the "state" of the page is reset.  For example, if you were testing your experiment and were on trial 10 of the experiment, paused, and then changed the color of one of the fonts, most live-reloaders will completely reload the page taking you back to the first trial of the experiment (i.e., the state is reset).

Instead, Vite can reload modules for parts of a page without reloading the *entire* page.   This can be **very powerful** for developing experiments because it can prevent a lot of mindless clicking just to get back to a particular state and trigger an error, etc...  Once you understand this difference you'll wonder how you every programmed for the web without it.  This feature is known as [Hot Module Replacement](https://vitejs.dev/guide/features.html#hot-module-replacement).  


A second key feature of Vite is that it acts as a bundler.  When you use complex libraries in your project there may be lots of dependencies both within and between packages.  As one example, the popular [lodash](https://lodash.com) library organizes all the functions into individual modules so importing the lodash library in Node.js technically may load as many as 600 other files at once.  If this was running on a real webserver the number of separate requests might overload the server.  As a result modern website "bundle" the required code into a single, optimized file so that only one file is imported.  Vite does this behind the scenes for you both in development and building mode.

(There are several other features of Vite including a process called [Tree-Shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) which removes functions from the bundle which are not used in the current app to reduce the file size and [Code Splitting](https://developer.mozilla.org/en-US/docs/Glossary/Code_splitting) which organizes files into "chunks" the reflect common dependencies across different pages of a site.)