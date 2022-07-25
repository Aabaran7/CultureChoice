import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import useSmileStore from '@/stores/smiledata'

export default function useStepRoute() {
  const smilestore = useSmileStore()
  const router = useRouter()
  const route = useRoute()

  const seqroutes = computed(() =>
    router.options.routes.filter((r) => r.meta.sequential)
  )

  const nextFn = () => {
    if (route.meta.next) return { name: route.meta.next }
    if (route.meta.routeIdx + 1 >= seqroutes.value.length) return false
    const nextRoute = seqroutes.value[route.meta.routeIdx + 1]
    // smilestore.setLastRoute(nextRoute.name)
    smilestore.saveData() // automatically saves data
    return nextRoute && { name: nextRoute.name }
  }

  const prevFn = () => {
    if (route.meta.prev) return { name: prev }
    if (route.meta.routeIdx - 1 <= 0) return false
    const prevRoute = seqroutes.value[route.meta.routeIdx - 1]
    // smilestore.setLastRoute(prevRoute.name)
    smilestore.saveData() // automatically saves data
    return prevRoute && { name: prevRoute.name }
  }

  return { nextFn, prevFn }
}
