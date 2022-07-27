import { useRoute } from 'vue-router'
import useSmileStore from '@/stores/smiledata'

export default function useTimelineStepper() {
  const smilestore = useSmileStore()
  const route = useRoute()

  const next = () => {
    if (smilestore.config.auto_save) {
      smilestore.saveData() // automatically saves data
    }
    if (route.meta.next) {
      return { name: route.meta.next }
    }
    return null
  }

  const prev = () => {
    if (smilestore.config.auto_save) {
      smilestore.saveData() // automatically saves data
    }
    if (route.meta.prev) {
      return { name: route.meta.prev }
    }
    return null
  }

  return { next, prev }
}
