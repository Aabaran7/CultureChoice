<script setup>
</script>

<template>
        <section class="hero">
        <div class="hero-body">
            <p class="title">
            <span id="bigsmile">🤠</span>
            </p>
            <p class="subtitle">
            <h1 class="title is-1">Welcome to presentation 👩‍🏫 mode !</h1>
            </p>
        </div>
        </section>
        <div class="content">
            <p class="is-size-5 has-text-left">
                Use the links below to navigate to different parts of the experiment, or use the navigation bar at the top of the page.
                <br>
                <p class="is-size-6">
                  This website is set up for you to explore the experiment design for a project exploring how people help one another in real time. 
                  If you have questions or comments, please contact the project lead <a href="https://pamop.com">Pam Osborn Popp</a>.
                </p>
                <hr>
                <h3 class="title is-5">Play farm game (single-player)</h3>
                  <p class="is-size-6">
                    Try out the experimental task in a single-player format where you control both players.
                  </p>
                  <a href="#/expgame" class="button is-pink is-small" id='citizen_tester'>Farm game &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></a>
                <hr>
                <h3 class="title is-5">View real gameplay from data</h3>
                  <p class="is-size-6">
                    Watch a replay of a game that was played by two real participants.
                  </p>
                  <a href="#/replayselectpage" class="button is-pink is-small" id='citizen_tester'>Replay game &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></a>
                <hr>
                <h3 class="title is-5">Show game environments (stimuli)</h3>
                  <p class="is-size-6">
                    See the twelve different game environments that participants play in. 
                  </p>
                  <a href="#/stimulipage" class="button is-pink is-small" id='citizen_tester'>Environments &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></a>
                <hr>
                <h3 class="title is-5">Start from beginning</h3>
                <p class="is-size-6">
                    Start the experiment from the very beginning as if you were a real participant. Your data will not be saved, though some local storage may be used while you are on the page.
                  </p>
                  <a href="#/welcome" class="button is-yellow is-small" id="citizen_tester">Start &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></a>
                <hr>
                <h3 class="title is-5">Instructions</h3>
                  <p class="is-size-6">
                    Go to the task instructions to learn about how to play the game. After several pages of instructions, you can try out the comprehension quiz that real participants must pass to continue.
                  </p>
                  <a href="#/instructions" class="button is-yellow is-small" id='citizen_tester'>Instructions &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></a>
                <hr>
                <h3 class="title is-5">Play captcha game</h3>
                  <p class="is-size-6">
                    Try out the captcha game participants play to ensure that they are human (and that the required software loads properly in their browser).
                  </p>
                  <a href="#/captchagame" class="button is-yellow is-small" id='citizen_tester'>Captcha Game &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></a>
              </p>        
        </div>

    
</template>

<style scoped>
.hero {
  background-color: rgb(255, 212, 102);
  margin-bottom: 30px;
  padding: 0px;
}
.hero-body {
  padding: 10px;
}
.content {
    width: 70%;
    margin: auto;
    padding-bottom: 60px;
    
}

.content a {
    margin-left: 10px;
}

.is-pink {
    background-color: #ffc0cb;
}
.is-orange {
    background-color: #fda918;
    color: #fff
}
.config b {
  color: #639aa6;
}
#bigsmile {
  font-size: 100px;
}
</style>