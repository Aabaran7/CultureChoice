import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import useSmileStore from '@/stores/smiledata'

export default function useStepRoute() {
  const smilestore = useSmileStore()
  const route = useRoute()

  const next = () => {
    smilestore.saveData() // automatically saves data
    if (route.meta.next) {
      return { name: route.meta.next }
    }
    return null
  }

  const prev = () => {
    smilestore.saveData() // automatically saves data
    if (route.meta.prev) {
      return { name: route.meta.prev }
    }
    return null
  }

  return { next, prev }
}
