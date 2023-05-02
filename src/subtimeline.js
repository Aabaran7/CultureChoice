import _ from 'lodash'

class RandomSubTimeline {
  constructor() {
    this.routes = [] // the actual routes given to VueRouter
  }

  pushToRoutes(route) {
    // check that an existing route doesn't exist with same
    // path and/or name
    for (let i = 0; i < this.routes.length; i += 1) {
      if (this.routes[i].path === route.path) {
        throw new Error(`DuplicatePathError:${route.path}`)
      }
      if (this.routes[i].name === route.name) {
        throw new Error(`DuplicateNameError:${route.name}`)
      }
    }
    this.routes.push(route)
  }

  pushRoute(routeConfig) {
    const newroute = _.cloneDeep(routeConfig)
    // should NOT allow meta next/prev to exist
    if (!newroute.meta) {
      newroute.meta = { prev: null, next: null }
    } else if (newroute.meta.prev || newroute.meta.next) {
      throw new Error(
        `SubRouteError: Can't have meta.next or meta.prev defined for randomized subroute`
      )
    }
    try {
      this.pushToRoutes(newroute)
    } catch (err) {
      console.error('Smile FATAL ERROR: ', err)
      throw err
    }
  }

}
export default RandomSubTimeline