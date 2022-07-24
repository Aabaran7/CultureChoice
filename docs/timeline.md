# :stopwatch: Timeline

We can think of experiments being composed of several general phases.  For example, first, we might show a welcome page :arrow_right: informed consent :arrow_right: instructions :arrow_right: main experiment :arrow_right: debrief :arrow_right: thank you/payment page.
<SmileText /> provides a central "sequencing" or timeline feature which makes it easy to configure, customize, and move through different stages of an experiment sequentially.

Sequencing of major sections of an experiment is accomplished in <SmileText /> using a piece of Javascript software known as a router (specifically [Vue Router](https://router.vuejs.org)).  In this guide, you will learn what a router is, how to configure <SmileText />'s implementation, and how to customize it with more complex behaviors. 

**TLDR**: Sequencing sections of your experiment is super simple and all the action happens in a single file called `src/router.js` file in the <SmileText /> project directory.  It is pretty self-explanatory, short, and well-commented so you can jump there if you feel up to it.

## Single-page Applications and Routing

In web development a **route** is a sub-URL on a website like `http://mywebsite.com/login` and `http://mywebsite.com/settings`.  In the early days of the web, requesting such a URL would simply ask the webserver to return the contents of an HTML file at that location (i.e., `/login/index.html` or `/settings/index.html`).  

More recently web developers have adopted a new model where most of the logic for the application runs in the browser using Javascript.  There are various reasons for this but one of the most important is that the applications generally run faster and are more responsive because the application doesn't have to make network requests each time the URL changes.

These more modern frameworks, known as **Single-page Applications (SPAs)**, use Javascript for most of the dynamic interactions of the page including showing and hiding different elements.  However, it is still quite useful to be able to directly access different content using URLs.  For example, users might want to bookmark the login or settings page and so they need a distinct URL that will pull each of these views up.

The solution to this for SPAs is known as a router.  A router is a piece of software running in the browser which interprets URL requests and programmatically changes the visible content on the webpage.  In <SmileText />, routing is handled by the [Vue Router](https://router.vuejs.org) which is an open-source project built for routing in [Vue](https://vuejs.org) applications.

The basic format of using the Vue router is visible here (excepted from the Vue Router [documentation](https://router.vuejs.org/guide/#javascript)):


``` js
// 1. Define route components.
// These can be imported from other files
const Home = { template: '<div>Home</div>' }
const About = { template: '<div>About</div>' }

// 2. Define some routes
// Each route should map to a component.
const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = VueRouter.createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: VueRouter.createWebHashHistory(),
  routes, // short for `routes: routes`
})
```

First, we define two Vue [components](/components), then we create a variable called `routes` which configures each route.  Routes are in effect a mapping between a particular URL and a component.  For example, in this code snippet,
`/` on the base server is mapped to the `Home` component and `/about` to the `About` component).  You can read this as saying "when the user request the `/` route on this application display the `Home` component".

## URLs and Routes

A quick note about URLs and routes.  We will often mention a base path or base URL for a project.  This is the full url to your experiment.  For example `http://exps.gureckislab.org/` might be the base path.  Routes are configured beneath this base URL so `/` means the original URL but `/about` means `http://exps.gureckislab.org/#/about`.  The base URL can also include subfolders so for instance the base route could just as easily be `https://exps.gureckislab.org/myproject/version2/#/about`.  The base folder is where you `index.html` for the SPA is located.


The `#` character in these URLs is not a typo.  When you access a URL with slashes on it typically it is interpreted by the browser as a new network request for a particular file on the webserver.  An exception is for content which follows `#` character which traditionally indicated the link was to different content on the **same page** (e.g., read about the `<a name>` tag in HTML).

The easiest way to think about it is like this:

![how route URLS are processed](/images/routing.png)

words separate by slashes appearing before the `#` (or if there are no `#`s) are sent by the browser to the webserver, which triggers a page reload from the server.  Things that appear after the `#` do _not_ trigger a page reload.  The Vue Router interprets and parses the content appearing after the `#` and uses it to determine what Vue components to load.  The `VueRouter.createWebHashHistory()` call in the code snippet above is what tells the router to use the `#` navigation strategy.

## Timelines

As just described, the Vue Router is a mapping between different URLs and Vue components to load.  However, in experiments we often want to step through content sequentially.  For this purpose <SmileText /> implements a simple Timeline class (see `src/timeline.js`) which acts as a wrapper around the basic Vue Router.


The timeline class allows you to configure a sequence of routes as well as allow for routes that are not part of the sequence:

<img src="/images/timeline.png" width="500" alt="timeline example" style="margin: auto;">

Sequential routes are accessed in a chain/timeline.  Non-sequential routes are not part of that timeline.


A timeline is created like this:

```js
import { Timeline } from '@/timeline'  // @ resolves to /src in Smile
const timeline = new Timeline()
```

Then there are three methods available on the timeline object.

### `pushSeqRoute(route_obj)`

Pushes a new route (specified in `route_obj`) into the sequential timeline.
The first call to this function will make the configured route the first route in the sequence.  The second call will make it the second route in the sequence and so forth.

### `pushNonSeqRoute(route_obj)`

This pushes a new route (specified in `route_obj`) into a nonsequential timeline.
This route will exist in the Vue router but will not be in the timeline sequence.  This is useful for configuration and debugging routes as well as routes you want to define and even link to but 

### `buildProgress()`

This should be called as the final step.  It takes the configured timeline and configures the progress tracking (for an optional progress bar you can make visible to participants).  The progress tracking counts the total number of routes, and for the sequential routes converts the order into a percentage complete (e.g., if there were three routes each would add 33% to the total as you step through).


Here is an example configuring three sequential routes and one non-sequential route:

```js
import { Timeline } from '@/timeline'  // @ resolves to /src in Smile
const timeline = new Timeline()

// first route
timeline.pushSeqRoute({
    path: '/',
    name: 'welcome',
    component: WelcomeComponent
})

// second route
timeline.pushSeqRoute({
    path: '/instructions',
    name: 'instructions',
    component: InstructionsComponent
})

// third route
timeline.pushSeqRoute({
    path: '/thanks',
    name: 'thanks',
    component: ThanksComponent
})

// a non sequential route available for debugging
timeline.pushNonSeqRoute({
    path: '/config',
    name: 'config',
    component: ConfigComponent
})

timeline.buildProgress()

```

During development you can, of course, comment out certain routes to help isolate and test particular aspects of your experiment.

Hopefully you are thinking this sounds super easy to set up, but how do you step from one component/route to the next?  To do that we need to introduce the concept of a stepper.

## Steppers

In each component in our router we need to call a method when that component is "finished" and allow the timeline/router to pass control to the next route in the sequence.  To do this we use the [composables](https://vuejs.org/guide/reusability/composables.html) feature of Vue.  Composables are function that let you re-use logic across multiple components.  To step to the next route in the sequence we import the stepper composable into our component and call the appropriate method when we are done.

The way to import the stepper composable is:

```js
import useStepRoute from '@/composables/steproute'
const { nextFn, prevFn } = useStepRoute()
const next = nextFn()
const prev = prevFn()
```

This imports the composable, then creates a `nextFn` and `prevFn` which are functions that when they are called provides the `name` of the next route.  To navigate to the next route just use the `push()` method of the router:

```js
router.push(next) // go to the next
// or instead
// router.push(prev) // go to the prev
```


Here is a complete, simple SFC component that imports the stepper and uses it to advance to the next route in the sequence when the user clicks a button (calling the `finish()` method):


```vue
<script setup>
import { useRouter, useRoute } from 'vue-router'
import useStepRoute from '@/composables/steproute'
import useSmileStore from '@/stores/smiledata' // get access to the global store

const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { nextFn, prevFn } = useStepRoute()
const next = nextFn()
const prev = prevFn()

if(route.meta.progress) smilestore.global.progress = route.meta.progress

function finish(goto) { 
    router.push(goto)
}
</script>

<template>
    <div class="page">
        <h1 class="title is-3">Experiment</h1>
        <button class="button is-success is-light" id='finish' @click="finish(next)">next &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></button>
    </div>
</template>
```

Details about the implementation of the stepper are quite simple and in `src/composables/steproute.js`.

:::warning IMPORTANT (and helpful!)
One important feature of the stepper is that it calls `saveData()` on the global store prior to route changes.  So as a result you can trust that your data will be saved/synchronized with the persistant store (Firestore) whenever you navigated between sequential routes
:::


## Running custom code before route loading

Sometimes you want to run a little bit of code prior to loading a route.  You can do this using [route guards](https://router.vuejs.org/guide/advanced/navigation-guards.html), a feature of the Vue Router.  Route guards are traditionally used to prevent navigation to a route or redirect it.  Here is an example using the <SmileText /> Timeline object.

```js
// welcome screen
timeline.pushSeqRoute({
  path: '/welcome',
  name: 'welcome',
  component: Advertisement,
  beforeEnter: (to, from) => {
    console.log(to, from)
  },
})
```

The `beforeEnter` method will run before the route is loaded.  This can be helpful for doing computation prior to the route loading.  For example, after the user consents to the study it might make sense to create a database record for them.  So we might add a special method to the route _after_ the consent form to handle that.

It is also possible to register route guards too all routes using the `.beforeEach()` method.  In `src/router.js` there is a method `addGuards()` which has examples of registering global guards.

Note that Vue Router provides a variety of lifecycle hooks that you can customize for all or individual routes.  See the documentation [here](https://router.vuejs.org/guide/advanced/navigation-guards.html#the-full-navigation-resolution-flow) for a full accounting of the order in which things occur.

## Testing the Timeline

The timeline has a full coverage test in `tests/vitest/timeline.test.js`.  You can run that test in isolation with
```
npx vitest timeline
```
