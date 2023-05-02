import { useRoute, useRouter } from 'vue-router'
import useSmileStore from '@/stores/smiledata'
import * as random from '@/randomization'
import seedrandom from 'seedrandom'
import { v4 as uuidv4 } from 'uuid';

export default function useTimelineStepper() {
  const smilestore = useSmileStore()
  const route = useRoute()
  const router = useRouter()

  const next = () => {
    if (smilestore.config.auto_save) {
      smilestore.saveData() // automatically saves data
    }
    
    // HANDLE RANDOMIZATION OF SUBTIMELINES
    // if the next thing is an object, then we're dealing with a subtimeline
    if(typeof route.meta.next === 'object'){

      // set seed for randomization
      if(smilestore.local.seedActive){
        const seedID = smilestore.getSeedID
        const seed = `${seedID}-${route.name}-subtimeline`
        seedrandom(seed, { global: true });
      } else{ // if inactive, generate a random string then re-seed
        const newseed = uuidv4();
        seedrandom(newseed, { global: true });
      }


      let orderedRoutes = [];
      const subTimeline = route.meta.next

      // if orders are set, then we want to use the conditions from the data to set the order as specified
      const metaInfo = subTimeline.routes[0].meta
      if(metaInfo.orders && metaInfo.label){
        console.log("setting random route order based on condition and prespecified orders")

        // get condition from data, and then select route order specified for that condition
        const cond = smilestore.getConditions[metaInfo.label]

        if(!cond){
          throw new Error(`ConditionError: Condition label ${metaInfo.label} not found in data`)
        } else {
          const routeOrder = metaInfo.orders[cond]
          // put subTimeline.routes in the order specified by routeOrder
          orderedRoutes = routeOrder.map((order) => subTimeline.routes.find((r) => r.name === order))
        }

      } else {
          console.log("setting random route order based on random seed")
          // if not, then we want to randomize the order: shuffle the routes in subTimeline
          orderedRoutes = random.shuffle(subTimeline.routes)
      }

      // for each route, set the meta.next and meta.prev to be the proper route.
      // By default, both routes already have meta.next as the next route (after the randomized subtimeline), so this can be kept for the last route
      // By default, both routes already have meta.prev as the previous route (before the randomized subtimeline), so this can be kept for the first route
      orderedRoutes.forEach((orderRoute, index) => {
        if(index !== 0) {
          orderedRoutes[index].meta.prev = orderedRoutes[index-1].name
        }
        if(index !== orderedRoutes.length-1){
          orderedRoutes[index].meta.next = orderedRoutes[index+1].name
        }
      })

      // for the current route, change meta.next to be the first route in the randomized subtimeline (this allows the route guards to work)
      route.meta.next = orderedRoutes[0].name

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

    // HANDLE SUBTIMELINE
    if(typeof route.meta.prev === 'object'){
      // find the route in router that has the name of the current route in meta.next
      const routes = router.getRoutes()

      // find object in routes that has meta.next === route.name
      // NOTE: this assumes that next has already been set to the proper route—that is, the subtimeline has already been entered through the next() function above
      const preceedingRoute = routes.find((r) => r.meta.next === route.name)

      // return the route
      return { name: preceedingRoute.name, query: route.query}

    }
  

    if (route.meta.prev) {
      return { name: route.meta.prev, query: route.query }
    }
    return null
  }

  return { next, prev }
}
