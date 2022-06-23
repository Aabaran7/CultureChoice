# :raising_hand: Getting started contributing

The **🫠 Smile** repo ([https://github.com/NYUCCL/smile](https://github.com/NYUCCL/smile)) includes both the code and documentation for the code.


Things to install so you can contribute to the project:

- You will need to install Node.js on your computer if you haven't already.  You can download the latest version [here](https://nodejs.org/en/download/).  Verify that you have the `npm` command in your terminal program of choice.

- You will also need to install the GitHub [command line tool](https://cli.github.com).  You can download a standard double-click installer or if you use homebrew type `brew install gh` in your terminal program.  To allow the command-line tool access to your GitHub account authenticate by typing `gh auth login --web` and follow the sign-in instructions.

- It is recommended you use [VS Code](https://code.visualstudio.com/) and the [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension as your text editor/development environment.

- The next step is to clone the project [github repo](https://github.com/NYUCCL/smile) and set
your current terminal to the working copy. Then, install the required javascript dependencies
using `npm`, the node package manager (similar to `pip` in python).  This can be accomplished with three simple commands in your terminal program (you can also clone the repo using GUI tools if you prefer):

```
git clone https://github.com/nyuccl/smile.git
cd smile
npm install
```

Once you have the packages installed you can use different commands to start the local development server for either the documentation website or the experiment project.



To start the experiment development server:

```
npm run dev
```

To start the documentation development server:

```
npm run docs:dev
```

Either of these commands will print out a URL that looks roughly like `http://localhost:3000/`. If you open this link in your favorite browser (or command-click the link on MacOS), it will load the respective website. 

Next steps: 
- Learn how to [contribute to the documentation](/contributing)
- Understand the [design principles](/principles)