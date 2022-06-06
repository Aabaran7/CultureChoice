# Getting started

The **🫠 Smile** repo ([https://github.com/NYUCCL/smile](https://github.com/NYUCCL/smile)) includes both the code and documentation for the code.


Things to install so you can contribute to the project:

- It is recommended you use [VS Code](https://code.visualstudio.com/) and the [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension as your development environment.

- You will also need to install Node.js on your computer if you haven't already.  You can download the latest version [here](https://nodejs.org/en/download/).  Verify that you have the `npm` command in your terminal program of choice.

The next step is to clone the project [github repo](https://github.com/NYUCCL/smile) and set
your current terminal to the working copy. Then, install the required javascript dependencies
using `npm`, the node package manager (similar to `pip` in python).  This is three simple commands (you can also clone the repo using GUI tools if you prefer):

```
git clone https://github.com/nyuccl/smile.git
cd smile
npm install
```

Once you have the packages installed you can use the following commands to start the local development server for either the documentation website or the experiment project:

To start the documentation development server:

```
npm run docs:dev
```

To start the experiment development server:

```
npm run dev
```

Either of these command will print out a url like `http://localhost:3000/` which, if you open in your favorite browser, will load the respective site.