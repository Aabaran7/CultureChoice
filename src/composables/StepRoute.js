import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import { useSmileStore } from '@/stores/smiledata'

export function useStepRoute() {

    const smileStore = useSmileStore()
    const router = useRouter()
    const route = useRoute()

    const routes = computed(() => {
        return router.options.routes
    })
    
    const routeIndex = computed(() => {
        return routes.value.findIndex(r => r.name === route.name)
    })
    
    const next = computed(() => {
        const nextRoute = routes.value[routeIndex.value + 1]
        smileStore.setLastRoute(nextRoute.name);
        return nextRoute && { name: nextRoute.name }
    })

    const prev = computed(() => {
        const prevRoute = routes.value[routeIndex.value - 1]
        smileStore.setLastRoute(prevRoute.name);
        return prevRoute && { name: prevRoute.name }
    }) 

    return { next, prev }
}