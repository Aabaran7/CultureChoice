<script setup>
import { computed } from 'vue'

const props = defineProps({
  class: {
    type: String,
    default: '',
  },
  responsiveUI: {
    type: Boolean,
    default: true,
    description: 'Whether to use responsive layout behavior',
  },
  /** When true, container height grows with content (no maxHeight). Use for views that must not cut off on small viewports (e.g. mobile). */
  fluidHeight: {
    type: Boolean,
    default: false,
  },
  width: {
    type: Number,
    default: 800,
    description: 'Width of the page in pixels',
  },
  height: {
    type: Number,
    default: 600,
    description: 'Height of the page in pixels',
  },
})

const containerClasses = computed(() => {
  const baseClasses = 'mx-auto select-none flex flex-col items-center mt-5 mb-10'

  return [baseClasses, props.class].filter(Boolean).join(' ')
})

const containerStyle = computed(() => {
  if (!props.responsiveUI) {
    return {
      width: props.width + 'px',
      minWidth: props.width + 'px',
      height: props.height + 'px',
      minHeight: props.height + 'px',
    }
  }
  if (props.fluidHeight) {
    return {
      width: '100%',
      maxWidth: props.width + 'px',
      minHeight: '100vh',
    }
  }
  return {
    width: '90vw',
    minHeight: props.height + 'px',
    maxWidth: props.width + 'px',
    maxHeight: props.height + 'px',
  }
})
</script>

<template>
  <div class="flex justify-center">
    <div :class="containerClasses" :style="containerStyle">
      <slot />
    </div>
  </div>
</template>
