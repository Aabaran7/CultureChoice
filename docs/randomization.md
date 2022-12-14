# :game_die: Randomization

Most experiments make use of randomization: tasks are presented to participants in a random order, stimuli are randomly selected from a large pool of possible stimuli, participants are randomly assigned to conditions, etc.

This page shows how to generate random numbers in <SmileText />, and how to use random numbers to accomplish each of the above tasks.

<SmileText /> uses <b>seeded</b> random number generation. Setting a seed makes random number generation reproducible. That is, two random number generators set with the same seed will produce the same sequence of random numbers. 

In the context of an experiment, if we know the seed used to assign a particular participant to conditions, stimuli, trial orders, etc., we can completely recreate those conditions, stimuli, trial orders, etc. after the fact. As a result, we can see our experiment *exactly* as any given participant saw it. This makes it easier to find bugs, understand each participant's repsonses, etc.

Seeding is also useful for testing: we can easily reconstruct the exact same trials/stimuli/conditions over and over again.

## Automatic seeding of Math.random()

In <SmileText />, seeding happens automatically upon entry into a **route** (see [Timeline](/timeline) for more on routes). Seeds have two components. The first component is a random character string we'll call the "seed ID," generated for each participant. The second is the name of the route that is currently being displayed. Each time a given route is entered (or re-entered), the random number generator will be seeded with the route-specific, participant-specific seed.

So for example, for a participant with seed ID `a5c40328-0625-4353-bab1-05612539dcc3` who enters the route `instructions`, the random number generator will be seeded with the seed `a5c40328-0625-4353-bab1-05612539dcc3-instructions`. After the seed is set (which happens automatically when the route is entered), any calls to `Math.random()` (or built-in randomization functions, which depend on `Math.random()`) will be fully reproducible with the provided seed.

**Note**: Be careful about using external libraries that depend on `Math.random()`, such as lodash. To get lodash to respect the seed you've set, you must import it within the component where you want to use it, then define a new lodash function. Then you must use that function rather than the default `_`:

``` js
import _ from 'lodash'
const lodash = _.runInContext();

// this will use the seeded Math.random()
lodash.shuffle([1, 2, 3])
```

Why is the random number generator re-seeded upon entry to each route? Why can't we just seed it once? If the participant accidentally refreshes a page, we want the *same* random number to be generated on each refresh. For example, if a random number generator controls which of two images is presented to that participant, we don't want the participant to see image 1, accidentally refresh, then be re-randomized to see image 2. If the random number generator was seeded at the beginning of the study, this is exactly what could happen when the page is refreshed (because the code for the beginning of the study won't be re-run). However, if the random number generator is seeded within the route where randomization occurs, the seed will be reset each time the page reloads. As a result, we will always generate the same random numbers for that participant within that route.

## Built-in randomization functions

<SmileText /> includes the following built-in randomization functions:

### `random.randomInt(min, max)`

Generates a random integer between min and max (both inclusive). For example, this can be used to assign a participant to a (numbered) condition.

```js
// generate a random integer: 1, 2, 3, 4, or 5
const condition = random.randomInt(1, 5)
```

### `random.shuffle(array)`

Randomly shuffles an array. For example, this can be used to present some fixed stimuli in a random order.

```js
const stimuli = ["image1.png", "image2.png", "image3.png", "image4.png", "image5.png"]

// shuffle the stimulus array
const stimuli_shuffled = random.shuffle(stimuli)
```

### `random.sampleWithoutReplacement(array, sampleSize)`

Samples **without** replacement from an array. For example, this can be used to randomly present 3 stimuli from a larger set.

```js
const stimuli = ["image1.png", "image2.png", "image3.png", "image4.png", "image5.png"]

// sample (without replacement) from array
const stimuli_selected = random.sampleWithoutReplacement(stimuli, 3)
```

### `random.sampleWithReplacement(array, sampleSize)`

Samples **with** replacement from an array. For example, this can be used to randomly present 3 stimuli from a larger set (with the possibility of presenting the same stimulus twice).

```js
const stimuli = ["image1.png", "image2.png", "image3.png", "image4.png", "image5.png"]

// sample (with replacement) from array
const stimuli_selected = random.sampleWithReplacement(stimuli, 3)
```

### Random timeline routes

Finally, it is possible to randomize the order of routes in the timeline. See [Timeline](/timeline) for further details.

## Override seed id for debugging

As mentioned, <SmileText /> automatically generates a seed ID, which is used to set all local seeds throughout the experiment. When in dev mode (see [Developing](/developing)), you can also override the seed ID. By doing so, you can recreate exactly what a participant saw when they completed the experiment (or what you yourself saw in a previous run of the experiment). To do so, on the developer mode landing page, replace the contents of the textbox with the seed ID you'd like to use. Then click the green refresh button to the right of the textbox. Finally, proceed with choosing a platform. The following run of the experiment will use random numbers determined by the seed ID you entered.

**Note**: You must choose a platform for the seed to work. Make sure you choose the same platform when trying to re-run the same seed, or else you might get different random numbers.

![Seed override](/images/seedoverride.png)

## "Unseeded" Random Number Generation

In rare cases, it may be desirable to generate "true" or "unseeded" random numbers (by default `Math.random()` actually does set a seed, but it's set automatically using other random stuff). To do so, you can make a local instance of a random number generator using the `seedrandom` library:

``` js
import seedrandom from 'seedrandom'

const rng = seedrandom();

// number will not be reproducible
rng()

```





