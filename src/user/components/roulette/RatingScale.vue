<script setup>
/**
 * @fileoverview Rating Scale Component
 * @description Reusable slider-based rating component for confidence and satisfaction
 */

import { ref, computed } from 'vue'
import { ThumbsDown, ThumbsUp, Frown, Smile } from 'lucide-vue-next'
// Custom slider implementation using HTML range input

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  min: {
    type: Number,
    default: 0
  },
  hideLabels: {
    type: Boolean,
    default: false,
  },
  hideValue: {
    type: Boolean,
    default: false,
  },
  wide: {
    type: Boolean,
    default: false,
  },
  widthClass: {
    type: String,
    default: '',
  },
  trackHeightClass: {
    type: String,
    default: '',
  },
  largeIcons: {
    type: Boolean,
    default: false,
  },
  subtitle: {
    type: String,
    default: '',
  },
  max: {
    type: Number,
    default: 100
  },
  value: {
    type: Number,
    default: null
  },
  // Optional icon hints for the two ends of the slider
  leftIcon: {
    type: String,
    default: '' // 'thumbs' | 'faces'
  },
  rightIcon: {
    type: String,
    default: '' // kept for symmetry; not strictly needed
  }
})

const emit = defineEmits(['change'])

// Minimal UI; no quick presets

// Current rating value
const currentValue = ref(props.value || 50)

// Handle slider change
const handleSliderChange = (event) => {
  const value = parseInt(event.target.value)
  currentValue.value = value
  emit('change', value)
}

// Handle quick rating click
const handleQuickRating = (value) => {
  currentValue.value = value
  emit('change', value)
}

// Computed properties
const isQuickRatingSelected = (value) => currentValue.value === value
</script>

<template>
  <div class="w-full mx-auto space-y-6" :class="widthClass || (wide ? 'max-w-4xl' : 'max-w-2xl')">
    <!-- Optional label -->
    <div v-if="label && !hideLabels" class="text-center">
      <h3 class="text-lg font-semibold">{{ label }}</h3>
      <p v-if="subtitle" class="text-sm text-muted-foreground">{{ subtitle }}</p>
      <p v-else class="text-sm text-muted-foreground">Rate from {{ min }} to {{ max }}</p>
    </div>
    
    <!-- Minimal value text (small, muted) -->
    <div v-if="!hideValue" class="text-center text-sm text-muted-foreground">{{ currentValue }}</div>
    
    <!-- Slider with optional end icons -->
    <div class="px-4">
      <div class="flex items-center gap-3">
        <div class="w-8 shrink-0 text-foreground" aria-hidden="true">
          <component
            :is="leftIcon === 'thumbs' ? ThumbsDown : (leftIcon === 'faces' ? Frown : null)"
            v-if="leftIcon"
            :class="largeIcons ? 'w-8 h-8' : 'w-5 h-5'"
          />
        </div>
      <input
        type="range"
        :min="min"
        :max="max"
        :step="1"
        :value="currentValue"
        @input="handleSliderChange"
        :class="`w-full ${trackHeightClass || 'h-2'} bg-gray-200 rounded-lg appearance-none cursor-pointer slider`"
        style="background: linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentValue - min) / (max - min) * 100}%, #e5e7eb ${(currentValue - min) / (max - min) * 100}%, #e5e7eb 100%)"
      />
        <div class="w-8 shrink-0 text-foreground" aria-hidden="true">
          <component
            :is="leftIcon === 'thumbs' ? ThumbsUp : (leftIcon === 'faces' ? Smile : null)"
            v-if="leftIcon"
            :class="largeIcons ? 'w-8 h-8' : 'w-5 h-5'"
          />
        </div>
      </div>
      
      <!-- Scale labels -->
      <div v-if="!hideLabels" class="flex justify-between text-xs text-muted-foreground mt-2">
        <span>{{ min }}</span>
        <span>{{ Math.round((min + max) / 2) }}</span>
        <span>{{ max }}</span>
      </div>
    </div>
    
    <!-- No quick rating buttons for simplified UI -->
  </div>
</template>

<style scoped>
.slider {
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  border-radius: 4px;
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
