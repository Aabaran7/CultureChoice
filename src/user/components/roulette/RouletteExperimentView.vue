<script setup>
/**
 * @fileoverview Roulette Wheel Psychological Research Experiment
 * @description Main experiment orchestrator for studying decision-making, agency, and satisfaction
 * Adapted from Figma prototype to work with SMILE framework
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import useViewAPI from '@/core/composables/useViewAPI'
import { Button } from '@/uikit/components/ui/button'
// Custom progress bar implementation
import { ConstrainedTaskWindow } from '@/uikit/layouts'
import RouletteWheel from './RouletteWheel.vue'
import RatingScale from './RatingScale.vue'
import { generateTrialSequence } from './miniBlockGenerator.js'

const api = useViewAPI()

// Experiment phases
const phases = {
  INSTRUCTIONS: 'instructions',
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
const CONFIG = { numMiniBlocks: 5 }

// State management (block-structured)
const phase = ref(phases.INSTRUCTIONS)
const currentMiniBlock = ref(0) // 0..(CONFIG.numMiniBlocks-1)
const currentSubBlock = ref('agency') // 'agency' | 'noAgency'
const currentTrialInSubBlock = ref(0) // 0..3
const selectedWheel = ref(null)
const confidenceRating = ref(null)
const agencySatisfaction = ref(null)
const noAgencySatisfaction = ref(null)
const isApproved = ref(null)
const results = ref([])
const spinComplete = ref(false)
const totalMiniBlocks = ref(CONFIG.numMiniBlocks)

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
  phase.value = phases.CHOICE
  api.log.log('Experiment started - Trial', completedTrialsCount.value + 1)
}

const handleWheelChoice = (wheelIndex) => {
  selectedWheel.value = wheelIndex
  api.log.log('Wheel selected:', wheelIndex)
}

const proceedToApproval = () => {
  if (selectedWheel.value === null) return
  
  phase.value = phases.APPROVAL
  isApproved.value = currentTrialData.value.agency
  api.log.log('Approval phase - Agency:', isApproved.value)
}

const proceedToConfidence = () => {
  phase.value = phases.CONFIDENCE
  api.log.log('Confidence rating phase')
}

const handleConfidenceRating = (rating) => {
  confidenceRating.value = rating
  api.log.log('Confidence rating:', rating)
}

const proceedToSpin = () => {
  if (confidenceRating.value === null) return
  
  phase.value = phases.SPIN
  spinComplete.value = false
  api.log.log('Spin phase - Outcome:', currentTrialData.value.outcomeWin)
}

const handleSpinComplete = () => {
  spinComplete.value = true
  api.log.log('Spin completed')
}

const completeCurrentTrial = () => {
  // Record trial data
  const trialData = {
    miniBlock: currentMiniBlock.value + 1,
    subBlock: currentSubBlock.value,
    trialInSubBlock: currentTrialInSubBlock.value,
    ...currentTrialData.value,
    selectedWheel: selectedWheel.value,
    isApproved: isApproved.value,
    confidenceRating: confidenceRating.value,
    timestamp: Date.now(),
  }

  results.value.push(trialData)
  api.recordData(trialData)
  api.saveData()

  // Reset trial state
  selectedWheel.value = null
  confidenceRating.value = null
  spinComplete.value = false
  isApproved.value = null

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
    phase.value = phases.CHOICE
  }
}

const completeAgencySatisfaction = () => {
  api.recordData({
    miniBlock: currentMiniBlock.value + 1,
    agencySatisfaction: agencySatisfaction.value,
  })
  api.saveData()

  // Move to no-agency block
  currentSubBlock.value = 'noAgency'
  currentTrialInSubBlock.value = 0
  agencySatisfaction.value = null
  phase.value = phases.CHOICE
}

const completeNoAgencySatisfaction = () => {
  api.recordData({
    miniBlock: currentMiniBlock.value + 1,
    noAgencySatisfaction: noAgencySatisfaction.value,
  })
  api.saveData()

  // Move to next mini-block
  currentMiniBlock.value++

  if (currentMiniBlock.value >= CONFIG.numMiniBlocks) {
    phase.value = phases.COMPLETE
  } else {
    currentSubBlock.value = 'agency'
    currentTrialInSubBlock.value = 0
    noAgencySatisfaction.value = null
    phase.value = phases.CHOICE
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
  <ConstrainedTaskWindow
    variant="ghost"
    :responsiveUI="api.config.responsiveUI"
    :width="api.config.windowsizerRequest.width"
    :height="api.config.windowsizerRequest.height"
    class="p-8"
  >
    <!-- Instructions Phase -->
    <div v-if="phase === phases.INSTRUCTIONS" class="text-center space-y-6">
      <h1 class="text-3xl font-bold">Roulette Wheel Experiment</h1>
      <div class="max-w-2xl mx-auto space-y-4">
        <p class="text-lg">
          You will participate in a decision-making experiment involving roulette wheels.
        </p>
        <p>
          In each trial, you will see three identical roulette wheels. Your task is to choose one wheel.
          The computer will then either approve or veto your choice, and the selected wheel will spin to reveal the outcome.
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

    <!-- Choice Phase -->
    <div v-else-if="phase === phases.CHOICE" class="space-y-6">
      <div class="text-center">
        <h2 class="text-2xl font-bold mb-2">
          Trial {{ completedTrialsCount + 1 }} of {{ totalTrials }}
        </h2>
        <div class="w-full max-w-md mx-auto bg-gray-200 rounded-full h-2">
          <div 
            class="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
        <p class="text-sm text-muted-foreground mt-2">
          Win Probability: {{ Math.round(currentTrialData.probability * 100) }}%
        </p>
        <p class="text-xs text-muted-foreground">
          Mini-block {{ currentMiniBlock + 1 }} / {{ totalMiniBlocks }} — {{ currentSubBlock === 'agency' ? 'Agency' : 'No Agency' }}
        </p>
      </div>
      
      <div class="flex justify-center space-x-8">
        <RouletteWheel
          v-for="(wheel, index) in 3"
          :key="index"
          :probability="currentTrialData.probability"
          :wheel-index="index"
          :is-selected="selectedWheel === index"
          :disabled="false"
          @click="handleWheelChoice(index)"
        />
      </div>
      
      <div v-if="selectedWheel !== null" class="text-center">
        <Button @click="proceedToApproval" size="lg">
          Confirm Choice
        </Button>
      </div>
    </div>

    <!-- Approval Phase -->
    <div v-else-if="phase === phases.APPROVAL" class="text-center space-y-6">
      <div class="text-2xl">
        <div v-if="isApproved" class="text-green-600">
          ✓ Your choice was APPROVED
        </div>
        <div v-else class="text-red-600">
          ✗ Your choice was VETOED
        </div>
      </div>
      <p class="text-lg">
        The computer has {{ isApproved ? 'approved' : 'vetoed' }} your choice.
      </p>
      <Button @click="proceedToConfidence" size="lg">
        Continue
      </Button>
    </div>

    <!-- Confidence Rating Phase -->
    <div v-else-if="phase === phases.CONFIDENCE" class="space-y-6">
      <div class="text-center">
        <h2 class="text-xl font-bold mb-4">Rate Your Confidence</h2>
        <p class="text-muted-foreground">
          How confident are you in your wheel choice?
        </p>
      </div>
      
      <RatingScale
        label="Confidence"
        :min="0"
        :max="100"
        :value="confidenceRating"
        @change="handleConfidenceRating"
      />
      
      <div v-if="confidenceRating !== null" class="text-center">
        <Button @click="proceedToSpin" size="lg">
          Continue
        </Button>
      </div>
    </div>

    <!-- Spin Phase -->
    <div v-else-if="phase === phases.SPIN" class="space-y-6">
      <div class="text-center">
        <h2 class="text-xl font-bold mb-4">Wheel Spinning...</h2>
        <p class="text-muted-foreground">
          The selected wheel is spinning to reveal the outcome.
        </p>
      </div>
      
      <div class="flex justify-center">
        <RouletteWheel
          :probability="currentTrialData?.probability || 0.5"
          :wheel-index="selectedWheel !== null ? selectedWheel : 0"
          :is-selected="false"
          :disabled="true"
          :is-spinning="true"
          :outcome="currentTrialData?.outcomeWin"
          @spin-complete="handleSpinComplete"
        />
      </div>
      
      <div v-if="spinComplete" class="text-center">
        <div class="text-3xl font-bold mb-4" :class="currentTrialData.outcomeWin ? 'text-green-600' : 'text-red-600'">
          {{ currentTrialData.outcomeWin ? 'WIN!' : 'LOSE' }}
        </div>
        <Button @click="completeCurrentTrial" size="lg">
          Continue
        </Button>
      </div>
    </div>

    <!-- Agency Satisfaction Phase -->
    <div v-else-if="phase === phases.AGENCY_SATISFACTION" class="space-y-6">
      <div class="text-center">
        <h2 class="text-xl font-bold mb-4">Agency Block Complete</h2>
      </div>
      <RatingScale
        label="Satisfaction with Agency Block"
        :min="0"
        :max="100"
        :value="agencySatisfaction"
        @change="(val) => agencySatisfaction = val"
      />
      <div class="text-center">
        <Button @click="completeAgencySatisfaction" :disabled="agencySatisfaction === null" size="lg">
          Continue
        </Button>
      </div>
    </div>

    <!-- No Agency Satisfaction Phase -->
    <div v-else-if="phase === phases.NO_AGENCY_SATISFACTION" class="space-y-6">
      <div class="text-center">
        <h2 class="text-xl font-bold mb-4">No Agency Block Complete</h2>
      </div>
      <RatingScale
        label="Satisfaction with No Agency Block"
        :min="0"
        :max="100"
        :value="noAgencySatisfaction"
        @change="(val) => noAgencySatisfaction = val"
      />
      <div class="text-center">
        <Button @click="completeNoAgencySatisfaction" :disabled="noAgencySatisfaction === null" size="lg">
          Continue
        </Button>
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
  </ConstrainedTaskWindow>
</template>
