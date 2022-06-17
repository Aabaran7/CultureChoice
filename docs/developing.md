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

[Keep reading](/advanced/notes.html#vite-development-features) if you would like more details.



