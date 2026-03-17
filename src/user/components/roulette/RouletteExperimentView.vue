<script setup>
/**
 * @fileoverview Roulette Wheel Psychological Research Experiment
 * @description Main experiment orchestrator for studying decision-making, agency, and satisfaction
 * Adapted from Figma prototype to work with SMILE framework
 */

import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import useViewAPI from '@/core/composables/useViewAPI'
import { Button } from '@/uikit/components/ui/button'
import { Switch } from '@/uikit/components/ui/switch'
// Custom progress bar implementation
import { ConstrainedPage } from '@/uikit/layouts'
import RouletteWheel from './RouletteWheel.vue'
import RatingScale from './RatingScale.vue'
import { generateTrialSequence } from './miniBlockGenerator.js'

const props = defineProps({
  // mode === 'practice' runs a short, practice-only version (1 mini-block)
  // and can be used between instructions and the main task.
  mode: {
    type: String,
    default: 'main',
  },
})

const api = useViewAPI()

// Experiment phases
const phases = {
  INSTRUCTIONS: 'instructions',
  BLOCK_CUE: 'blockCue',
  CHOICE: 'choice',
  APPROVAL: 'approval',
  CONFIDENCE: 'confidence',
  SPIN: 'spin',
  AGENCY_SATISFACTION: 'agencySatisfaction',
  NO_AGENCY_SATISFACTION: 'noAgencySatisfaction',
  ITI: 'iti',
  COMPLETE: 'complete'
}

// Trial interface
const createTrial = (trialNumber, probability, miniBlock, outcomeWin, agency) => ({
  trialNumber,
  probability,
  miniBlock,
  outcomeWin,
  agency
})

// Config
const IS_PRACTICE = props.mode === 'practice'
const CONFIG = { numMiniBlocks: IS_PRACTICE ? 1 : 5 }
const ACK_TIME_LIMIT_MS = 4000 // time limit to acknowledge computer choice in non-agency trials
const WIN_POINTS = 50

// State management (block-structured)
const phase = ref(phases.INSTRUCTIONS)
const animationsEnabled = ref(true)
const wheelSize = ref(128)
const isWheelSpinning = computed(() => animationsEnabled.value && !spinComplete.value)
const containerEl = ref(null)
const currentMiniBlock = ref(0) // 0..(CONFIG.numMiniBlocks-1)
const currentSubBlock = ref('agency') // 'agency' | 'noAgency'
const currentTrialInSubBlock = ref(0) // 0..3
const selectedWheel = ref(null)
const computerSelectedWheel = ref(null)
const confidenceRating = ref(null)
const agencySatisfaction = ref(null)
const noAgencySatisfaction = ref(null)
const isApproved = ref(null)
const results = ref([])
const spinComplete = ref(false)
const totalMiniBlocks = ref(CONFIG.numMiniBlocks)
const ackTimeoutId = ref(null)
// For non-agency trials: true if participant clicked the pulsing wheel in time, false if timeout
const computerChoiceAcknowledged = ref(false)
// Which cue to show on BLOCK_CUE: 'agency' | 'noAgency'
const blockCueType = ref('agency')
// Points
const totalPoints = ref(0)
const trialPoints = ref(0)
// Tutorial step used only in practice mode
// 0: before first agency choice
// 1: before first agency confidence
// 10: before first non-agency computer-choice screen
// 12: non-engagement note on first non-agency confidence screen
const tutorialStep = ref(IS_PRACTICE ? 0 : -1)

// Computed properties
const totalTrials = computed(() => CONFIG.numMiniBlocks * 8)
const currentTrialData = computed(() => {
  const mbData = api.persist.trialsByMiniBlock[currentMiniBlock.value]
  const blockTrials = currentSubBlock.value === 'agency' ? mbData.agencyBlock : mbData.noAgencyBlock
  return blockTrials[currentTrialInSubBlock.value]
})
const completedTrialsCount = computed(() => currentMiniBlock.value * 8 + (currentSubBlock.value === 'noAgency' ? 4 : 0) + currentTrialInSubBlock.value)
const progress = computed(() => ((completedTrialsCount.value + 1) / totalTrials.value) * 100)
const isComplete = computed(() => currentMiniBlock.value >= CONFIG.numMiniBlocks)

const isAgencyTutorialTrial = computed(() =>
  IS_PRACTICE &&
  currentMiniBlock.value === 0 &&
  currentSubBlock.value === 'agency' &&
  currentTrialInSubBlock.value === 0,
)

const isNonAgencyTutorialTrial = computed(() =>
  IS_PRACTICE &&
  currentMiniBlock.value === 0 &&
  currentSubBlock.value === 'noAgency' &&
  currentTrialInSubBlock.value === 0,
)

const displayTotalPoints = computed(() => totalPoints.value + (spinComplete.value ? trialPoints.value : 0))

// Initialize experiment
const initializeExperiment = () => {
  const { trialsByMiniBlock, miniBlockMatrix } = generateTrialSequence(CONFIG.numMiniBlocks)
  // Persist so it survives reloads and is accessible globally if needed
  api.persist.trialsByMiniBlock = trialsByMiniBlock
  api.persist.miniBlockMatrix = miniBlockMatrix
  api.persist.totalMiniBlocks = trialsByMiniBlock.length
  api.log.log('Roulette Experiment initialized with', trialsByMiniBlock.length, 'mini-blocks')
  api.log.log('Mini-blocks matrix:', miniBlockMatrix)
}

// Phase transition functions
const startExperiment = () => {
  blockCueType.value = 'agency'
  phase.value = phases.BLOCK_CUE
  api.log.log('Experiment started - block cue (you decide)')
}

const startNonAgencyComputerChoice = () => {
  // Computer selects a wheel; participant only confirms this choice.
  computerSelectedWheel.value = Math.floor(Math.random() * 3)
  selectedWheel.value = computerSelectedWheel.value
  isApproved.value = false
  computerChoiceAcknowledged.value = false
  phase.value = phases.APPROVAL
  api.log.log('Non-agency block - computer selected wheel:', computerSelectedWheel.value)

  const skipTimeoutForFirstPracticeNonAgency =
    IS_PRACTICE && isNonAgencyTutorialTrial.value && currentTrialInSubBlock.value === 0

  if (skipTimeoutForFirstPracticeNonAgency) {
    // Show tutorial overlay; no timeout so participants can read.
    tutorialStep.value = 10
  } else {
    // Start acknowledgment time limit
    if (ackTimeoutId.value) {
      clearTimeout(ackTimeoutId.value)
    }
    ackTimeoutId.value = setTimeout(() => {
      ackTimeoutId.value = null
      api.log.warn('Non-agency trial - acknowledgment timeout, auto-advancing to confidence')
      phase.value = phases.CONFIDENCE
    }, ACK_TIME_LIMIT_MS)
  }
}

const proceedFromBlockCue = () => {
  if (currentSubBlock.value === 'agency') {
    phase.value = phases.CHOICE
    api.log.log('Block cue acknowledged - agency Trial', completedTrialsCount.value + 1)
  } else {
    startNonAgencyComputerChoice()
  }
}

const handleWheelChoice = (wheelIndex) => {
  // In non-agency blocks, the computer decides; ignore participant clicks here.
  if (currentSubBlock.value === 'noAgency') {
    return
  }

  selectedWheel.value = wheelIndex
  api.log.log('Wheel selected:', wheelIndex)

  // For agency trials, immediately move on to the confidence rating
  // without an explicit "confirm choice" or approval screen. The
  // participant sees the selection highlight and then the next screen.
  if (currentSubBlock.value === 'agency') {
    isApproved.value = true
    phase.value = phases.CONFIDENCE
    api.log.log('Agency trial - skipping approval screen, moving to confidence')
    return
  }
}

const proceedToApproval = () => {
  if (selectedWheel.value === null) return
}

const proceedToConfidence = () => {
  phase.value = phases.CONFIDENCE
  api.log.log('Confidence rating phase')
}

const handleComputerChoiceConfirm = (wheelIndex) => {
  // Only accept clicks on the computer-selected wheel
  if (wheelIndex !== computerSelectedWheel.value) {
    return
  }

  isApproved.value = false
  computerChoiceAcknowledged.value = true
  api.log.log('Non-agency trial - participant confirmed computer choice:', wheelIndex)
  if (ackTimeoutId.value) {
    clearTimeout(ackTimeoutId.value)
    ackTimeoutId.value = null
  }
  if (IS_PRACTICE && isNonAgencyTutorialTrial.value && currentTrialInSubBlock.value === 0) {
    // Show non-engagement note on the following confidence screen
    tutorialStep.value = 12
  }
  phase.value = phases.CONFIDENCE
}

const handleConfidenceRating = (rating) => {
  confidenceRating.value = rating
  api.log.log('Confidence rating:', rating)
}

const proceedToSpin = () => {
  if (confidenceRating.value === null) return
  
  phase.value = phases.SPIN
  spinComplete.value = false
  // Points are determined by the pre-generated outcome (not by the animation),
  // so compute them immediately to avoid any timing/transition edge cases.
  trialPoints.value = currentTrialData.value.outcomeWin ? WIN_POINTS : 0
  api.log.log('Spin phase - Outcome:', currentTrialData.value.outcomeWin)

  // If animations are disabled, immediately mark spin complete
  if (!animationsEnabled.value) {
    spinComplete.value = true
  }
}

const handleSpinComplete = () => {
  spinComplete.value = true
  api.log.log('Spin completed')
}

const completeCurrentTrial = () => {
  // Apply points for this trial
  totalPoints.value += trialPoints.value

  // Record trial data
  const trialData = {
    miniBlock: currentMiniBlock.value + 1,
    subBlock: currentSubBlock.value,
    trialInSubBlock: currentTrialInSubBlock.value,
    ...currentTrialData.value,
    selectedWheel: selectedWheel.value,
    isApproved: isApproved.value,
    confidenceRating: confidenceRating.value,
    trialPoints: trialPoints.value,
    totalPoints: totalPoints.value,
    timestamp: Date.now(),
  }
  // Non-agency only: whether they clicked the computer-chosen wheel within the time limit
  if (currentSubBlock.value === 'noAgency') {
    trialData.acknowledgedComputerChoice = computerChoiceAcknowledged.value
  }

  results.value.push(trialData)
  if (!IS_PRACTICE) {
    api.recordData(trialData)
    api.saveData()
  }

  // Reset trial state
  selectedWheel.value = null
  computerSelectedWheel.value = null
  computerChoiceAcknowledged.value = false
  confidenceRating.value = null
  spinComplete.value = false
  isApproved.value = null
  trialPoints.value = 0

  // Move to next trial within current sub-block
  currentTrialInSubBlock.value++

  // If sub-block is complete (4 trials)
  if (currentTrialInSubBlock.value >= 4) {
    if (currentSubBlock.value === 'agency') {
      phase.value = phases.AGENCY_SATISFACTION
    } else {
      phase.value = phases.NO_AGENCY_SATISFACTION
    }
  } else {
    if (currentSubBlock.value === 'agency') {
      phase.value = phases.CHOICE
    } else {
      // For non-agency, the computer selects on every trial; go directly
      // back to the computer-choice screen.
      startNonAgencyComputerChoice()
    }
  }
}

const completeAgencySatisfaction = () => {
  if (!IS_PRACTICE) {
    api.recordData({
      miniBlock: currentMiniBlock.value + 1,
      agencySatisfaction: agencySatisfaction.value,
    })
    api.saveData()
  }

  // Move to no-agency block: show cue then choice
  currentSubBlock.value = 'noAgency'
  currentTrialInSubBlock.value = 0
  agencySatisfaction.value = null
  blockCueType.value = 'noAgency'
  phase.value = phases.BLOCK_CUE
}

const completeNoAgencySatisfaction = () => {
  if (!IS_PRACTICE) {
    api.recordData({
      miniBlock: currentMiniBlock.value + 1,
      noAgencySatisfaction: noAgencySatisfaction.value,
    })
    api.saveData()
  }

  // Move to next mini-block
  currentMiniBlock.value++

  if (currentMiniBlock.value >= CONFIG.numMiniBlocks) {
    if (IS_PRACTICE) {
      finish()
      return
    }
    phase.value = phases.COMPLETE
  } else {
    currentSubBlock.value = 'agency'
    currentTrialInSubBlock.value = 0
    noAgencySatisfaction.value = null
    blockCueType.value = 'agency'
    phase.value = phases.BLOCK_CUE
  }
}

const downloadResults = () => {
  const summary = {
    participantId: Date.now().toString(),
    completedTrials: results.value.length,
    averageConfidence: results.value.reduce((sum, t) => sum + t.confidenceRating, 0) / results.value.length,
    averageSatisfaction: results.value.reduce((sum, t) => sum + t.satisfactionRating, 0) / results.value.length,
    agencyRate: results.value.filter(t => t.agency).length / results.value.length,
    winRate: results.value.filter(t => t.outcomeWin).length / results.value.length,
    completedAt: new Date().toISOString()
  }
  
  const exportData = {
    summary,
    trials: results.value,
    miniBlocks: miniBlocks.value
  }
  
  const dataStr = JSON.stringify(exportData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `roulette_experiment_${summary.participantId}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  api.log.log('Results downloaded')
}

const finish = () => {
  api.goNextView()
}

// Initialize on mount
onMounted(async () => {
  // Ensure Firebase anonymous auth is established early and wait for doc creation
  await api.connectDB()
  initializeExperiment()
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n))
  const setSize = () => {
    // Derive size from viewport width so choice and spin phases match
    const vw = window.innerWidth
    const gap = 24
    // Mobile-first sizing: larger wheels on phones, consistent scale on larger screens
    if (vw < 640) {
      if (phase.value === phases.CHOICE) {
        wheelSize.value = clamp(Math.floor(vw * 0.6), 120, 220)
      } else if (phase.value === phases.SPIN) {
        wheelSize.value = clamp(Math.floor(vw * 0.65), 140, 240)
      } else {
        wheelSize.value = clamp(Math.floor(vw * 0.55), 110, 210)
      }
    } else {
      const base = Math.floor((vw - gap * 2) / 3)
      wheelSize.value = clamp(base, 120, 220)
    }
  }
  setSize()
  window.addEventListener('resize', setSize)
})
onUnmounted(() => {
  window.removeEventListener('resize', () => {})
})

watch(() => phase.value, () => {
  // Recompute wheel size when the layout changes
  setTimeout(() => {
    const el = containerEl.value
    if (el) {
      const event = new Event('resize')
      window.dispatchEvent(event)
    }
  }, 0)
})

// Respect toggle changes during the spin phase
watch(animationsEnabled, (newValue) => {
  if (phase.value === phases.SPIN && !newValue) {
    // Immediately complete spin when animation is turned off mid-spin
    spinComplete.value = true
  }
})

// Autofill function for development
const autofill = () => {
  if (api.config.mode === 'development' || api.config.mode === 'presentation') {
    // Autofill all trials
    while (currentTrial.value < totalTrials) {
      selectedWheel.value = Math.floor(Math.random() * 3)
      confidenceRating.value = Math.floor(Math.random() * 101)
      satisfactionRating.value = Math.floor(Math.random() * 101)
      completeCurrentTrial()
    }
    api.log.warn('DEV MODE: Experiment autofilled')
  }
}

api.setAutofill(autofill)
</script>

<template>
  <ConstrainedPage :responsiveUI="api.config.responsiveUI" :fluidHeight="true" class="p-4 md:p-8 relative overflow-x-hidden">
    <!-- Instructions Phase -->
    <div v-if="phase === phases.INSTRUCTIONS" class="text-center space-y-6">
      <h1 class="text-3xl font-bold">Roulette Wheel Experiment</h1>
      <div class="max-w-2xl mx-auto space-y-4">
        <p class="text-lg">
          You will participate in a decision-making experiment involving roulette wheels.
        </p>
        <p v-if="IS_PRACTICE" class="font-semibold">
          Practice round (points shown for learning only).
        </p>
        <p>
          In each trial, you will see three identical roulette wheels. Your task is to choose one wheel.
          The computer will then either approve or veto your choice, and the selected wheel will spin to reveal the outcome.
        </p>
        <p>
          Points: each <span class="font-semibold">WIN</span> is worth <span class="font-semibold">{{ WIN_POINTS }}</span> points.
          Each <span class="font-semibold">LOSS</span> is worth <span class="font-semibold">0</span> points.
        </p>
        <p>
          After each trial, you will rate your confidence in your choice and your satisfaction with the outcome.
        </p>
        <p class="font-semibold">
          The experiment consists of {{ totalTrials }} trials and should take about 15-20 minutes.
        </p>
      </div>
      <Button @click="startExperiment" size="lg">
        Start Experiment
      </Button>
    </div>

    <!-- Block cue: "you decide" / "computer decides" before each 4-trial block -->
    <div v-else-if="phase === phases.BLOCK_CUE" class="text-center">
      <div class="flex flex-col items-center justify-center min-h-[50vh] gap-[7.5rem]">
        <h2 class="text-2xl sm:text-3xl font-bold">
          {{ blockCueType === 'agency' ? 'For the next 4 trials, you decide.' : 'For the next 4 trials, the computer decides.' }}
        </h2>
        <Button @click="proceedFromBlockCue" size="lg">
          Continue
        </Button>
      </div>
    </div>

    <!-- Choice Phase (no trial/mini-block label; block cue already states you decide / computer decides) -->
    <div v-else-if="phase === phases.CHOICE" class="space-y-6">
      <div class="pt-10 sm:pt-16 md:pt-24 lg:pt-28"></div>
      <p class="text-center text-xl sm:text-2xl font-semibold text-foreground">Select a wheel</p>
      <div ref="containerEl" class="grid grid-cols-1 md:grid-cols-3 place-items-center gap-4 sm:gap-6 md:gap-8">
        <RouletteWheel
          v-for="(wheel, index) in 3"
          :key="index"
          :probability="currentTrialData.probability"
          :wheel-index="index"
          :size="wheelSize"
          :is-selected="currentSubBlock === 'agency' && selectedWheel === index"
          :is-computer-choice="false"
          :disabled="currentSubBlock === 'noAgency'"
          @click="handleWheelChoice(index)"
        />
      </div>
      
    </div>

    <!-- Approval Phase (used for non-agency only) -->
    <div v-else-if="phase === phases.APPROVAL" class="space-y-6">
      <div class="flex flex-col items-center justify-center min-h-[40vh] sm:min-h-[45vh] w-full">
        <div class="text-center mb-4">
          <h2 class="text-xl font-bold mb-1">Computer&apos;s Choice</h2>
          <p class="text-muted-foreground">
            The computer has selected one of the wheels. Please click the pulsing wheel within a few seconds to continue.
          </p>
        </div>

        <div ref="containerEl" class="grid grid-cols-1 md:grid-cols-3 place-items-center gap-4 sm:gap-6 md:gap-8">
          <RouletteWheel
            v-for="(wheel, index) in 3"
            :key="index"
            :probability="currentTrialData.probability"
            :wheel-index="index"
            :size="wheelSize"
            :is-selected="false"
            :is-computer-choice="computerSelectedWheel === index"
            :disabled="index !== computerSelectedWheel"
            @click="handleComputerChoiceConfirm(index)"
          />
        </div>
      </div>
    </div>

    <!-- Confidence Rating Phase -->
    <div v-else-if="phase === phases.CONFIDENCE" class="space-y-6">
      <div class="flex flex-col items-center justify-center min-h-[40vh] sm:min-h-[45vh] w-full">
        <div class="text-center mb-2">
          <h2 class="text-xl font-bold mb-1">Rate Your Confidence</h2>
          <p class="text-muted-foreground">How confident are you in your wheel choice?</p>
        </div>
      <RatingScale
        label=""
        :min="0"
        :max="100"
        :value="confidenceRating"
        leftIcon="thumbs"
        :hideLabels="true"
        :hideValue="true"
        :wide="true"
        widthClass="w-[40vw] md:w-[35vw] lg:w-[30vw]"
        trackHeightClass="h-[12px]"
        :largeIcons="true"
        @change="handleConfidenceRating"
      />
      </div>
      <div v-if="confidenceRating !== null" class="text-center mt-2">
        <Button @click="proceedToSpin" size="lg">
          Continue
        </Button>
      </div>
    </div>

    <!-- Spin Phase -->
    <div v-else-if="phase === phases.SPIN" class="space-y-6">
      <div class="text-center">
        <h2 class="text-xl sm:text-2xl md:text-3xl font-bold mb-4">{{ animationsEnabled ? 'Wheel Spinning...' : 'Outcome' }}</h2>
        <p class="text-muted-foreground" v-if="animationsEnabled">
          The selected wheel is spinning to reveal the outcome.
        </p>
      </div>
      
      <div class="pt-16 md:pt-24 lg:pt-28"></div>
      <div ref="containerEl" class="flex justify-center">
        <RouletteWheel
          :probability="currentTrialData?.probability || 0.5"
          :wheel-index="selectedWheel !== null ? selectedWheel : 0"
          :size="wheelSize"
          :is-selected="false"
          :disabled="true"
          :is-spinning="isWheelSpinning"
          :outcome="currentTrialData?.outcomeWin"
          @spin-complete="handleSpinComplete"
        />
      </div>
      
      <div v-if="spinComplete" class="text-center">
        <div class="text-3xl font-bold mb-4" :class="currentTrialData.outcomeWin ? 'text-green-600' : 'text-red-600'">
          {{ currentTrialData.outcomeWin ? 'WIN!' : 'LOSE' }}
        </div>
        <div class="text-muted-foreground mb-4">
          +{{ trialPoints }} points (Total: {{ displayTotalPoints }})
        </div>
        <Button @click="completeCurrentTrial" size="lg">
          Continue
        </Button>
      </div>
    </div>

    <!-- Agency Satisfaction Phase -->
    <div v-else-if="phase === phases.AGENCY_SATISFACTION" class="space-y-6">
      <div class="flex flex-col items-center justify-center min-h-[40vh] sm:min-h-[45vh] w-full">
        <div class="text-center mb-2">
          <h2 class="text-xl font-bold mb-1">Block Complete</h2>
          <p class="text-muted-foreground">Happy with your lottery outcome?</p>
        </div>
        <RatingScale
          label=""
          :min="0"
          :max="100"
          :value="agencySatisfaction"
          leftIcon="faces"
          :hideLabels="true"
          :hideValue="true"
          :wide="true"
          widthClass="w-[40vw] md:w-[35vw] lg:w-[30vw]"
          trackHeightClass="h-[12px]"
          :largeIcons="true"
          @change="(val) => agencySatisfaction = val"
        />
      </div>
      <div class="text-center mt-2">
        <Button @click="completeAgencySatisfaction" :disabled="agencySatisfaction === null" size="lg">
          Continue
        </Button>
      </div>
    </div>

    <!-- No Agency Satisfaction Phase -->
    <div v-else-if="phase === phases.NO_AGENCY_SATISFACTION" class="space-y-6">
      <div class="flex flex-col items-center justify-center min-h-[40vh] sm:min-h-[45vh] w-full">
        <div class="text-center mb-2">
          <h2 class="text-xl font-bold mb-1">Block Complete</h2>
          <p class="text-muted-foreground">Happy with your lottery outcome?</p>
        </div>
        <RatingScale
          label=""
          :min="0"
          :max="100"
          :value="noAgencySatisfaction"
          leftIcon="faces"
          :hideLabels="true"
          :hideValue="true"
          :wide="true"
          widthClass="w-[40vw] md:w-[35vw] lg:w-[30vw]"
          trackHeightClass="h-[12px]"
          :largeIcons="true"
          @change="(val) => noAgencySatisfaction = val"
        />
      </div>
      <div class="text-center mt-2">
        <Button @click="completeNoAgencySatisfaction" :disabled="noAgencySatisfaction === null" size="lg">
          Continue
        </Button>
      </div>
    </div>

    <!-- Practice tutorial overlays -->
    <!-- 1) Agency: first choice trial -->
    <div
      v-if="IS_PRACTICE && isAgencyTutorialTrial && tutorialStep === 0 && phase === phases.CHOICE"
      class="absolute inset-0 bg-black/50 flex items-center justify-center z-20"
    >
      <div class="bg-white rounded-lg shadow-lg max-w-lg p-6 text-left space-y-4">
        <h2 class="text-xl font-bold">Choosing a wheel</h2>
        <p>
          You will often see three wheels like this. In <span class="font-semibold">“you decide”</span> blocks,
          <span class="font-semibold">click one wheel</span> to select it. All three wheels have the same chance of winning –
          there is no “better” wheel.
        </p>
        <p>
          Points: each <span class="font-semibold">WIN</span> is worth <span class="font-semibold">{{ WIN_POINTS }}</span> points.
          Each <span class="font-semibold">LOSS</span> is worth <span class="font-semibold">0</span> points.
          (In practice, points are shown for learning only.)
        </p>
        <div class="text-right">
          <Button size="sm" @click="tutorialStep = 1">Got it</Button>
        </div>
      </div>
    </div>

    <!-- 2) Agency: first confidence rating -->
    <div
      v-if="IS_PRACTICE && isAgencyTutorialTrial && tutorialStep === 1 && phase === phases.CONFIDENCE"
      class="absolute inset-0 bg-black/50 flex items-center justify-center z-20"
    >
      <div class="bg-white rounded-lg shadow-lg max-w-lg p-6 text-left space-y-4">
        <h2 class="text-xl font-bold">Confidence rating</h2>
        <p>
          After each trial, rate <span class="font-semibold">how confident</span> you were about your choice.
          Move the slider from “not at all confident” to “very confident”. You will do this after every trial in the task.
        </p>
        <div class="text-right">
          <Button size="sm" @click="tutorialStep = 2">Got it</Button>
        </div>
      </div>
    </div>

    <!-- 3) Non-agency: first computer-choice screen (no timeout) -->
    <div
      v-if="IS_PRACTICE && isNonAgencyTutorialTrial && tutorialStep === 10 && phase === phases.APPROVAL"
      class="absolute inset-0 bg-black/50 flex items-center justify-center z-20"
    >
      <div class="bg-white rounded-lg shadow-lg max-w-lg p-6 text-left space-y-4">
        <h2 class="text-xl font-bold">When the computer decides</h2>
        <p>
          Here, the <span class="font-semibold">computer has chosen one wheel for you</span>.
          The <span class="font-semibold">pulsing wheel</span> shows which one it selected.
          Please <span class="font-semibold">click the pulsing wheel</span> to confirm that you understand the computer’s choice.
        </p>
        <div class="text-right">
          <Button size="sm" @click="tutorialStep = 11">Got it</Button>
        </div>
      </div>
    </div>

    <!-- 4) Non-agency: non-engagement note on first confidence screen -->
    <div
      v-if="IS_PRACTICE && isNonAgencyTutorialTrial && tutorialStep === 12 && phase === phases.CONFIDENCE"
      class="absolute inset-0 bg-black/50 flex items-center justify-center z-20"
    >
      <div class="bg-white rounded-lg shadow-lg max-w-lg p-6 text-left space-y-4">
        <h2 class="text-xl font-bold">If you don&apos;t click in time</h2>
        <p>
          In the main task, you will have a <span class="font-semibold">short time</span> to click the pulsing wheel
          when the computer decides. If you do not click in time, the trial will still continue, but we may treat it as
          <span class="font-semibold">low engagement</span> and ignore it in our analyses.
        </p>
        <div class="text-right">
          <Button size="sm" @click="tutorialStep = 13">Got it</Button>
        </div>
      </div>
    </div>

    <!-- Complete Phase -->
    <div v-else-if="phase === phases.COMPLETE" class="text-center space-y-6">
      <h1 class="text-3xl font-bold text-green-600">Experiment Complete!</h1>
      <div class="max-w-md mx-auto space-y-4">
        <p class="text-lg">
          Thank you for participating in this experiment.
        </p>
        <p>
          You completed {{ results.length }} trials. Your data has been recorded.
        </p>
        <div class="space-y-2 text-sm">
          <p>Average Confidence: {{ Math.round(results.reduce((sum, t) => sum + t.confidenceRating, 0) / results.length) }}%</p>
          <p>Average Satisfaction: {{ Math.round(results.reduce((sum, t) => sum + t.satisfactionRating, 0) / results.length) }}%</p>
          <p>Win Rate: {{ Math.round((results.filter(t => t.outcomeWin).length / results.length) * 100) }}%</p>
        </div>
      </div>
      
      <div class="space-x-4">
        <Button @click="downloadResults" variant="outline">
          Download Results
        </Button>
        <Button @click="finish">
          Continue
        </Button>
      </div>
    </div>
  </ConstrainedPage>
</template>
