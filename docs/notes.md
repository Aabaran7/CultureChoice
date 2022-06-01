# 👩‍💻 Install notes

**You never have to do these steps they are just documented so you know how we got to 
the initial project structure.**

## How the project was initialized 


The project starts off with a bunch of files which you might find unfamiliar.  There is no magic there though.
The basic directory structure was automatically created by [Vite](https://vitejs.dev).  

First you need to install Node.js on your computer if you haven't already.  You can download the latest version [here](https://nodejs.org/en/download/).  Verify that you have the `npm` command in your terminal program of choice.


Next, I initialized a default Vite project:

```sh
mkdir smile
cd smile
npm create vite@latest .
```

It asked me for a project name ("smile"), a framework ("vue"), and a variant ("vue" meaning vanilla
javascript not typescript).
Then you just run `npm i` to install all the dependencies.

Next I installed the documentation system, [Vitepress](https://vitepress.vuejs.org).  From inside
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
The documenation on how to configure Vitepress is [here](https://vitepress.vuejs.org).


