<script setup>
/**
 * @fileoverview Rating Scale Component
 * @description Reusable slider-based rating component for confidence and satisfaction
 */

import { ref, computed } from 'vue'
// Custom slider implementation using HTML range input

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  value: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['change'])

// Quick rating options
const quickRatings = [
  { label: 'Very Low', value: 10 },
  { label: 'Low', value: 25 },
  { label: 'Medium', value: 50 },
  { label: 'High', value: 75 },
  { label: 'Very High', value: 90 }
]

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
  <div class="w-full max-w-2xl mx-auto space-y-6">
    <!-- Label -->
    <div class="text-center">
      <h3 class="text-lg font-semibold">{{ label }}</h3>
      <p class="text-sm text-muted-foreground">
        Rate from {{ min }} to {{ max }}
      </p>
    </div>
    
    <!-- Large value display -->
    <div class="text-center">
      <div class="text-4xl font-bold text-primary">
        {{ currentValue }}
      </div>
    </div>
    
    <!-- Slider -->
    <div class="px-4">
      <input
        type="range"
        :min="min"
        :max="max"
        :step="1"
        :value="currentValue"
        @input="handleSliderChange"
        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        style="background: linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentValue - min) / (max - min) * 100}%, #e5e7eb ${(currentValue - min) / (max - min) * 100}%, #e5e7eb 100%)"
      />
      
      <!-- Scale labels -->
      <div class="flex justify-between text-xs text-muted-foreground mt-2">
        <span>{{ min }}</span>
        <span>{{ Math.round((min + max) / 2) }}</span>
        <span>{{ max }}</span>
      </div>
    </div>
    
    <!-- Quick rating buttons -->
    <div class="grid grid-cols-5 gap-2">
      <button
        v-for="rating in quickRatings"
        :key="rating.value"
        @click="handleQuickRating(rating.value)"
        class="px-3 py-2 text-sm rounded-md border transition-colors"
        :class="{
          'bg-primary text-primary-foreground border-primary': isQuickRatingSelected(rating.value),
          'bg-background hover:bg-muted border-border': !isQuickRatingSelected(rating.value)
        }"
      >
        {{ rating.label }}
        <div class="text-xs">{{ rating.value }}</div>
      </button>
    </div>
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
