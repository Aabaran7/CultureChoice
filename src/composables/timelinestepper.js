import { RandomizeSubTimeline } from '@/subtimeline'
import { useRoute, useRouter } from 'vue-router'
import useSmileStore from '@/stores/smiledata'
import _ from 'lodash'


export default function useTimelineStepper() {
  const smilestore = useSmileStore()
  const route = useRoute()
  const router = useRouter()

  const next = () => {
    if (smilestore.config.auto_save) {
      smilestore.saveData() // automatically saves data
    }
    
    // HANDLE RANDOMIZATION OF SUBTIMELINES
    // if the next thing has a type field of randomized_sub_timeline, then we want to randomize the subtimeline
    if(route.meta.next.type === 'randomized_sub_timeline'){

      // get shuffled routes -- have to just give it the whole router or else there are problems
      const orderedRoutes = RandomizeSubTimeline(route.meta.next, router)

      // return the next route
      return { name: orderedRoutes[0].name, query: route.query}
    }
    
    // HANDLE REGULAR ROUTES
    // otherwise we're just doing the normal thing
    if (route.meta.next) {
      return { name: route.meta.next, query: route.query }
    }
    return null
  }

  const prev = () => {
    if (smilestore.config.auto_save) {
      smilestore.saveData() // automatically saves data
    }
    if (route.meta.prev) {
      return { name: route.meta.prev, query: route.query }
    }
    return null
  }

  return { next, prev }
}
