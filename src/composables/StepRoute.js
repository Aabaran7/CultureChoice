import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import useSmileStore from '@/stores/smiledata'

export default function useStepRoute() {
  const smilestore = useSmileStore()
  const router = useRouter()
  const route = useRoute()

  const routes = computed(() => router.options.routes)

  const routeIndex = computed(() =>
    routes.value.findIndex((r) => r.name === route.name)
  )

  const next = computed(() => {
    const nextRoute = routes.value[routeIndex.value + 1]
    smilestore.setLastRoute(nextRoute.name)
    smilestore.data.trial_num += 1
    smilestore.saveData()
    return nextRoute && { name: nextRoute.name }
  })

  const prev = computed(() => {
    const prevRoute = routes.value[routeIndex.value - 1]
    smilestore.setLastRoute(prevRoute.name)
    return prevRoute && { name: prevRoute.name }
  })

  return { next, prev }
}
