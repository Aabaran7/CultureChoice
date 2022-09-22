# :artist: Designing Good Web Experiments


```
.
├── LICENSE
├── README.md
├── css
│   ├── main.css
│   └── styles.css
├── data
├── docs
├── env
├── index.html            <-- main html page
├── package-lock.json
├── package.json
├── public
│   └── favicon.ico
├── sass
│   └── mystyles.scss
├── scripts
├── src
│   ├── App.vue
│   ├── assets
│   ├── components/
│   ├── composables/
│   ├── config.js        <-- configuration object
│   ├── icons.js
│   ├── main.js          <-- javascript execution starts here
│   ├── router.js        <-- configure timeline here
│   ├── seed.js
│   ├── stores
│   ├── timeline.js
│   └── utils.js
├── tests
│   ├── cypress
│   ├── cypress.config.js
│   └── vitest
└── vite.config.js
```


## Captcha

Very fast tasks, requiring human common sense, that are diverse, unpredictable, and have a large number of incorrect responses.


- view everyday photos and answer common sense reasoning question sby clicking on the image in a location (e.g., picture of two people one laughing and say "click on the happy one")

100 images
an interesting image -- click on the with masks that are appropriate

- show an image and record where you click on it

- move an object in a physics/phaser game to achieve something


- normal distorted text (type the word that you can see)

- move a slider slowly so that it doesn't wake up a bear (too fast == wake up, beat clock on time)

- watch a crazy video and type the words it says

## Informed Consent

The text of the informed consent should be updated for each study and placed in `src/components/atoms/InformedConsentText.vue`.  After participants accept the informed consent (usually the first few steps of study) they will see a button that will always be available allowing them to re-review the consent form in case they have questions.

## Withdraw

As part of most IRB approved protocols participants should be eligible to withdraw from a study at any time for any reason.  Online this is as simple as closing the browser windows and moving onto something else.  However, <SmileText/> provides a simple way to withdraw at any time from a study.

![Slack URL](/images/withdraw.png)

When participants click this button (only appears after accepting the informed consent), then they are presented with a form with several optional questions about why they are withdrawing and also providing information about partial compensation.  If a participant is eligible for partial compensation depends on several things specific to each study.  When they submit this form they will be taken to a final page asking them to return the task/hit.  It is the responsibility of the experimenter to monitor withdraws and to try to contact the participant.