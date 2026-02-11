<script setup>
/**
 * @fileoverview Roulette Wheel Component
 * @description Individual roulette wheel with 40 segments, selection state, and spin animation
 */

import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  probability: {
    type: Number,
    required: true
  },
  wheelIndex: {
    type: Number,
    required: true
  },
  // Pixel size of the rendered SVG (scales the 128x128 viewBox)
  size: {
    type: Number,
    default: 128,
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  // Optional highlights for agency/non-agency visuals
  isParticipantChoice: {
    type: Boolean,
    default: false,
  },
  isComputerChoice: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false
  },
  isSpinning: {
    type: Boolean,
    default: false
  },
  outcome: {
    type: Boolean,
    default: null
  }
})

const emit = defineEmits(['click', 'spin-complete'])

// Wheel dimensions
const centerX = 64
const centerY = 64
const radius = 50
const segmentAngle = 9 // 360 / 40 segments

// Create base wheel pattern with seeded randomization
const createBaseWheelPattern = (probability) => {
  const totalSegments = 40
  const winSegments = Math.round(probability * totalSegments)
  
  // Create win/loss array
  const segmentTypes = [
    ...Array(winSegments).fill(true),
    ...Array(totalSegments - winSegments).fill(false)
  ]
  
  // Seeded shuffle using probability as seed
  const seed = Math.floor(probability * 1000)
  let random = seed
  const seededRandom = () => {
    random = (random * 9301 + 49297) % 233280
    return random / 233280
  }
  
  // Fisher-Yates shuffle with seeded random
  for (let i = segmentTypes.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1))
    ;[segmentTypes[i], segmentTypes[j]] = [segmentTypes[j], segmentTypes[i]]
  }
  
  return segmentTypes
}

// Generate wheel segments
const generateSegments = () => {
  const baseSegmentTypes = createBaseWheelPattern(props.probability)
  const wheelRotation = props.wheelIndex * 120 // 0°, 120°, 240°
  const segments = []
  
  for (let i = 0; i < 40; i++) {
    const angle = i * segmentAngle - 90 + wheelRotation
    const startAngle = (angle * Math.PI) / 180
    const endAngle = ((angle + segmentAngle) * Math.PI) / 180
    
    const x1 = centerX + radius * Math.cos(startAngle)
    const y1 = centerY + radius * Math.sin(startAngle)
    const x2 = centerX + radius * Math.cos(endAngle)
    const y2 = centerY + radius * Math.sin(endAngle)
    
    const largeArcFlag = segmentAngle > 180 ? 1 : 0
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ')
    
    const isWin = baseSegmentTypes[i]
    
    segments.push({
      pathData,
      isWin,
      index: i
    })
  }
  
  return segments
}

const segments = computed(() => generateSegments())

// Store the calculated rotation angle
const targetRotation = ref(0)

// Get outcome rotation for the pointer
// withExtraSpins = true -> add 2 full rotations for animation
// withExtraSpins = false -> minimal rotation to a matching segment
const getOutcomeRotation = (withExtraSpins = true) => {
  const baseSegmentTypes = createBaseWheelPattern(props.probability)
  const wheelRotation = props.wheelIndex * 120
  
  // Find all segments matching the outcome
  const targetSegments = baseSegmentTypes
    .map((isWin, i) => isWin === props.outcome ? i : -1)
    .filter(i => i !== -1)
  
  // Random segment of correct type
  const targetSegmentIndex = targetSegments[Math.floor(Math.random() * targetSegments.length)]
  
  // Base angle within the correct outcome segment
  const baseAngle = targetSegmentIndex * segmentAngle + Math.random() * segmentAngle + wheelRotation
  return withExtraSpins ? baseAngle + 720 : baseAngle
}

// Watch for spinning state changes and outcome updates
watch(
  () => [props.isSpinning, props.outcome],
  ([isSpinning, outcome]) => {
    console.log('RouletteWheel watch:', {
      isSpinning,
      outcome,
      probability: props.probability,
      wheelIndex: props.wheelIndex,
    })

    if (outcome === null) return

    if (isSpinning) {
      // Animated case: brief reset, then spin to target angle
      targetRotation.value = -10
      setTimeout(() => {
        targetRotation.value = getOutcomeRotation(true)
        console.log('Target rotation set to (animated):', targetRotation.value)
      }, 10)
    } else if (targetRotation.value === 0) {
      // No-animation case (e.g., wheel animation toggle off from the start):
      // jump directly to the correct outcome angle without extra spins.
      targetRotation.value = getOutcomeRotation(false)
      console.log('Target rotation set (no animation):', targetRotation.value)
    }
  },
  { immediate: true },
)

// Also log when component receives isSpinning prop
watch(() => props.isSpinning, (newVal) => {
  console.log('isSpinning changed to:', newVal)
})

// Log the current rotation value
watch(() => targetRotation.value, (newVal) => {
  console.log('targetRotation changed to:', newVal)
})

// Handle click
const handleClick = () => {
  if (!props.disabled) {
    emit('click')
  }
}

// Handle animation complete
const handleAnimationComplete = () => {
  console.log('Animation complete event fired!')
  emit('spin-complete')
}

// Watch for spin completion
watch(() => props.isSpinning, (newVal) => {
  if (!newVal) {
    // Reset rotation when not spinning
  }
})
</script>

<template>
  <div 
    class="relative cursor-pointer transition-all duration-200"
    :class="{
      'scale-110': isSelected || isComputerChoice,
      'scale-105 hover:scale-110': !disabled && !isSelected && !isComputerChoice,
      'opacity-75 cursor-not-allowed': disabled,
      'animate-pulse': isComputerChoice
    }"
    @click="handleClick"
  >
    <!-- Selection ring for computer choice (primary, pulsing) -->
    <div 
      v-if="isComputerChoice"
      class="absolute rounded-full border-4 border-primary animate-pulse shadow-lg"
      :style="{ width: `${props.size}px`, height: `${props.size}px`, top: '-4px', left: '-4px' }"
    />

    <!-- Selection ring for participant's initial choice (red, static) -->
    <div
      v-if="isParticipantChoice && !isComputerChoice"
      class="absolute rounded-full border-4 border-red-500"
      :style="{ width: `${props.size}px`, height: `${props.size}px`, top: '-4px', left: '-4px' }"
    />
    
    <!-- SVG Wheel -->
    <svg 
      :width="props.size" 
      :height="props.size" 
      viewBox="0 0 128 128"
      class="drop-shadow-lg"
    >
      <!-- Wheel segments -->
      <g>
        <path
          v-for="segment in segments"
          :key="segment.index"
          :d="segment.pathData"
          :fill="segment.isWin ? '#10b981' : '#ef4444'"
          stroke="#ffffff"
          stroke-width="1"
        />
      </g>
      
      <!-- Center circle -->
      <circle
        :cx="centerX"
        :cy="centerY"
        r="12"
        fill="white"
        stroke="black"
        stroke-width="2"
      />
      
      <!-- Center dot -->
      <circle
        :cx="centerX"
        :cy="centerY"
        r="3"
        fill="black"
      />
      
      <!-- Clock hand pointer -->
      <g
        :style="{ 
          transformOrigin: 'center center',
          // Always keep the pointer at the last outcome angle so it
          // stays on the winning/losing color after the spin completes.
          transform: `rotate(${targetRotation}deg)`,
          // Shorter spin duration for a snappier feel (see Jiwa-style tasks)
          transition: props.isSpinning ? 'transform 1.5s ease-out' : 'none'
        }"
        @transitionend="handleAnimationComplete"
      >
        <!-- Hand line -->
        <line
          :x1="centerX"
          :y1="centerY"
          :x2="centerX"
          :y2="centerY - radius + 8"
          stroke="black"
          stroke-width="3"
          stroke-linecap="round"
        />
        
        <!-- Arrow tip -->
        <polygon
          :points="`${centerX},${centerY - radius + 2} ${centerX - 3},${centerY - radius + 8} ${centerX + 3},${centerY - radius + 8}`"
          fill="black"
        />
      </g>
    </svg>
  </div>
</template>
