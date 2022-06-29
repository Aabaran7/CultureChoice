# :package: Data Storage

Data recording and storage are critical functions of an experiment.  

Depending on your experiment design you may need to develop custom data storage code.  However, for most simple cases <SmileText/> provides a robust solution that requires little to no configuration or code.   Dealing with data is so important, [it isn't something you should even have to think about](/principles#no-code-is-the-best-code)!

This document describes the basics of <SmileText/> data storage including how to configure the system, how use the data storage techniques manually in your code, the overall logic behind how it works, and how to set it up for a new lab.

- has the subject been here before?
    - check localstorage for a "i've seen you clue"
    - if not:
        - create an anonymous login on firebase
        - store relevant information in the local storage to reconnect
        - create an initial data record
    - if yes
        - get the docid
        - pull the state from the firebase record

- offer a method to save the state (verifying that the docid is known and writeable)
- run this on a timer in the background



- create new record for the subject if they don't have any local storage stuff
- if they do have local storage, pull up the credentials
- one local storage is i've been here before using exps.gureckislab.org
- another local storage is if you have been in this experiment and where you are (this includes the database)

## Automatic saving

<img src="/images/firebaselogo.svg" width="70px">

## Data saving outside of Vue Apps

## Local storage

## Setting up Google Firestore

- Create a new project
- Create a web app
- Enable anonymous login
- Change the privacy settings


## SmileStore API

`stores/smiledata.js`

``` vue
<script setup>
import { useSmileStore } from '@/stores/smiledata'
const smileStore = useSmileStore()
<script>
```
<img src="/images/pinialogo.svg" width="70px">

### createStore

This describes this method

- **Arguments**

- **Details**

Somethign about it

### saveData

This describes this method

- **Arguments**

- **Details**

Somethign about it

