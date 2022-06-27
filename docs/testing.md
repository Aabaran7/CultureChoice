# :lady_beetle: Testing your experiment

Testing refers to writing automated scripts that verify the logic and operation of your code. Testing your code is critical to avoid bugs that cost you money and add to participant frustration.

Helping to integrate testing the code for your experiments into your project is one of the key features of <SmileText/>.

In [test driven development](https://en.wikipedia.org/wiki/Test-driven_development) you first write tests that describe how you want your software to behave, which initially will all fail.  Then as you implement your code you will begin passing the test.  Later, as your project matures, old tests help make sure that new changes do not break existing code.

Testing is perhaps a less familiar concept to scientific researchers but one that can be especially useful in experiment design and development.

## Types of tests

Within the software development community, there are multiple "kinds" of tests.  In <SmileText/>, we will consider **unit tests** and **integration tests**.

### Unit tests
Unit tests apply to a particular piece of code in isolation.  For example, a test might be written to verify a function or component.  Testing for the web is complicated by the fact that your code runs and interacts with several other programs such as the browser or possible databases.  In the unit testing approach we will consider, we will use tools which are called "headless" in the sense that the run the code in a "virtual browser" that doesn't directly open a browser window.  This can be useful for bits of logic that are not directly displayed as well as generally testing smaller pieces of code.

There is one downside to unit test for web applications which is that the test doesn't render a "visible" version of your user interface.  As a result, it can be hard to test certain things.  For example, imagine writing a test to see if an element is "visible" or "hidden".  Visibility can be toggled by several things including CSS style sheets, etc...  It is possible to test all of these possibilities but just looking at the website can also show you this.  For this reason, we also want to use other types of tests.

### Integration tests
Integration test refer to test that run against the full application.  They are called integration tests because they test the integration of various software pieces together.  These are often much more complicated to test because you have to actually interact with the browser and possibly make network requests, etc...


For unit tests, <SmileText/> user [Vitest](https://vitest.dev) and for integration tests it uses [cypress](https://www.cypress.io).

```
npm run test
```

## Testing coverage

In an ideal world 100% of your code is covered by test (meaning that when your test harness runs every line of your application gets tested).  Coverage refers to the percentage of code covered by test.  The ideal goal is to increase this value.  You can obtain the unit test coverage for <SmileText/> using this command:

```
npm run coverage
```

