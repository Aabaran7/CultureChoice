import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

export function useStepRoute() {

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
        return nextRoute && { name: nextRoute.name }
    })

    const prev = computed(() => {
        const prevRoute = routes.value[routeIndex.value - 1]
        return prevRoute && { name: prevRoute.name }
    }) 

    return { next, prev }
}