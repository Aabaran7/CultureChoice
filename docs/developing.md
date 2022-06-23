# Developing your experiments

When developing and debugging your experiment it is useful to interact with a webserver running on your local computer (i.e., your laptop or desktop).  This is much faster than waiting for the changes to be uploaded to the cloud and then having your browser download the files again.



In **🫠 Smile** this is all handled by [Vite](https://vitejs.dev).  Vite is a development tool that is heavily optimized for (developer experience (DX).  There is a lot to say about the features of Vite but more directly to test your application locally simple type:

`npm run dev`

in the project folder.  You should see something like this:

```
  vite v2.9.9 dev server running at:

  > Local: http://localhost:3000/
  > Network: use `--host` to expose

  ready in 283ms.
```

If you open `http://localhost:3000/` in your browser[^mac] it will show you a live demo of your web experiment.  This website will automatically refresh and change as you make modifications to your code.  That's all you need to get started.

[^mac]: On Mac if you press the Command (⌘)  key while clicking the link it will open in a new tab.

:::tip Translating from psiTurk
If you have experience with psiTurk you will be familiar with the commands `psiturk server`
and `psiturk debug` which created a local webserver for testing.  `npm run dev` provides the same basic purpose with additional features.
:::

## Vite development features

One of the most useful features of Vite in development mode is that it automatically reloads the webpage anytime changes are made to any project files.  This prevents you from having to go back and forth between your editor and the browser and pressing shift-reload.

[Some](https://marketplace.visualstudio.com/items?itemName=ziishaned.livereload) [tools](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) provide this automatic updating by forcing the entire browser webpage to reload anytime a file changes.  

However, the downside of reloading the site page each time there is a change is that the "state" of the page is reset.  For example, if you were testing your experiment and were on trial 10 of the experiment, paused, and then changed the color of one of the fonts, most live-reloaders will completely reload the page taking you back to the first trial of the experiment (i.e., the state is reset).

Instead, Vite can reload modules for parts of a page without reloading the *entire* page.   This can be **very powerful** for developing experiments because it can prevent a lot of mindless clicking just to get back to a particular state and trigger an error, etc...  Once you understand this difference you'll wonder how you every programmed for the web without it.  This feature is known as [Hot Module Replacement](https://vitejs.dev/guide/features.html#hot-module-replacement).  


A second key feature of Vite is that it acts as a bundler.  When you use complex libraries in your project there may be lots of dependencies both within and between packages.  As one example, the popular [lodash](https://lodash.com) library organizes all the functions into individual modules so importing the lodash library in Node.js technically may load as many as 600 other files at once.  If this was running on a real webserver the number of separate requests might overload the server.  As a result modern website "bundle" the required code into a single, optimized file so that only one file is imported.  Vite does this behind the scenes for you both in development and building mode.

(There are several other features of Vite including a process called [Tree-Shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) which removes functions from the bundle which are not used in the current app to reduce the file size and [Code Splitting](https://developer.mozilla.org/en-US/docs/Glossary/Code_splitting) which organizes files into "chunks" the reflect common dependencies across different pages of a site.)



