<script setup>
const emit = defineEmits(['nextPageCaptcha'])
</script>

<template>
  <div class="instructions">
    <h1 class="title">Lets play a game!</h1>
    <p class="is-size-5 has-text-left">
      Before we begin we'd like you to solve a couple quick problems for us,
      just to warm up your brain. They are common
      sense questions and tasks that should be easy and fun if you are a human.
    </p>
    <p class="is-size-5 has-text-left">
      Each question will need to be answered as quickly as possible. If you
      don't respond in time it will move to the
      next question.
    </p>
    <p class="is-size-5 has-text-left">
      Your speed and accuracy in answering these questions will help us verify
      that you are a human.
    </p>
    <p class="is-size-5 has-text-left">
      Only begin when you are ready to focus because if you fail to respond to
      too many questions, your answers are
      incorrect, your response times appear irregular, you may be flagged as
      likely a bot and your compensation may be
      denied.
    </p>
    <hr />
    <button class="button is-success" id="finish"
      @click="$emit('nextPageCaptcha')">
      I'm ready &nbsp;
      <FAIcon icon="fa-solid fa-arrow-right" />
    </button>
  </div>
</template>

<style scoped>
.instructions {
  width: 60%;
  margin: auto;
}

.instructions p {
  padding-bottom: 20px;
}
</style>
