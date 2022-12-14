import _ from 'lodash'
import seedrandom from 'seedrandom'
import appconfig from '@/config'
import * as random from '@/randomization'

class Timeline {
  constructor() {
    this.routes = [] // the actual routes given to VueRouter
    this.seqtimeline = [] // copies of routes that are sequential
    this.randroutes = [] // temporary holder used for route randomization
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

  pushToRandRoutes(route) {
    // check that an existing route doesn't exist with same
    // path and/or name
    for (let i = 0; i < this.randroutes.length; i += 1) {
      if (this.randroutes[i].path === route.path) {
        throw new Error(`DuplicatePathError:${route.path}`)
      }
      if (this.randroutes[i].name === route.name) {
        throw new Error(`DuplicateNameError:${route.name}`)
      }
    }
    this.randroutes.push(route)
  }

  pushToTimeline(route) {
    // check that an existing route doesn't exist with same
    // path and/or name
    for (let i = 0; i < this.seqtimeline.length; i += 1) {
      if (this.seqtimeline[i].path === route.path) {
        throw new Error(`DuplicatePathError${route.path}`)
      }
      if (this.seqtimeline[i].name === route.name) {
        throw new Error(`DuplicateNameError${route.name}`)
      }
    }
    this.seqtimeline.push(route)
  }

  pushSeqRoute(routeConfig) {
    const newroute = _.cloneDeep(routeConfig)
    if (!newroute.meta) {
      newroute.meta = { next: undefined, prev: undefined } // need to configure it
    } else {
      if (!newroute.meta.next) {
        // need to configure next
        newroute.meta.next = undefined
      }

      if (!newroute.meta.prev) {
        // need to configure prev
        newroute.meta.prev = undefined
      }
    }
    newroute.meta.sequential = true

    try {
      this.pushToRoutes(newroute)
    } catch (err) {
      console.error('Smile FATAL ERROR: ', err)
      throw err
    }

    try {
      this.pushToTimeline(newroute) // by reference so should update together
    } catch (err) {
      console.error('Smile FATAL ERROR: ', err)
      throw err
    }
  }

  pushRandRoute(routeConfig) {
    const newroute = _.cloneDeep(routeConfig)
    if (!newroute.meta) {
      newroute.meta = { next: undefined, prev: undefined } // need to configure it
    } else {
      if (!newroute.meta.next) {
        // need to configure next
        newroute.meta.next = undefined
      }

      if (!newroute.meta.prev) {
        // need to configure prev
        newroute.meta.prev = undefined
      }
    }
    newroute.meta.sequential = true

    try {
      this.pushToRandRoutes(newroute) // by reference so should update together
    } catch (err) {
      console.error('Smile FATAL ERROR: ', err)
      throw err
    }
  }

  resolveRandRoutes(key) {
    // set seed from seed_id, which is in local storage
    const seedID = window.localStorage.getItem(`${appconfig.local_storage_key  }-seed_id`)
    seedrandom(`${seedID}-${key}`, { global: true });

    // randomly shuffle the routes in randroutes
    this.randroutes = random.shuffle(this.randroutes);

    Object.values(this.randroutes).forEach(route => {
      if(route.meta.rand !== key){ // check if route matches key
        console.error(`random route ${  route.name  } doesn't have meta field matching resolution key -- possible error`)
      }
      const newroute = _.cloneDeep(route)

      newroute.meta.sequential = true

      try {
        this.pushToRoutes(newroute) // add to routes list
      } catch (err) {
        console.error('Smile FATAL ERROR: ', err)
        throw err
      }
      try {
        this.pushToTimeline(newroute) // add to timeline
      } catch (err) {
        console.error('Smile FATAL ERROR: ', err)
        throw err
      }
    });

    // remove random routes so that you can reuse this later
    this.randroutes = []
  }

  pushRoute(routeConfig) {
    const newroute = _.cloneDeep(routeConfig)
    // should NOT allow meta next/prev to exist
    if (!newroute.meta) {
      newroute.meta = { prev: null, next: null }
    } else if (newroute.meta.prev || newroute.meta.next) {
      throw new Error(
        `NonSequentialRouteError: Can't have meta.next or meta.prev defined for non-sequential route`
      )
    }
    newroute.meta.sequential = false
    try {
      this.pushToRoutes(newroute)
    } catch (err) {
      console.error('Smile FATAL ERROR: ', err)
      throw err
    }
  }

  build() {
    this.buildGraph()
    // this.buildProgress()
  }

  // buildGraph builds
  buildGraph() {
    for (let i = 0; i < this.seqtimeline.length; i += 1) {
      if (this.seqtimeline[i].meta.next === undefined) {
        // pass
        if (i === 0) {
          this.seqtimeline[i].meta.next = this.seqtimeline[i + 1].name
        } else if (i === this.seqtimeline.length - 1) {
          this.seqtimeline[i].meta.next = null
        } else {
          this.seqtimeline[i].meta.next = this.seqtimeline[i + 1].name
        }
      }
      if (this.seqtimeline[i].meta.prev === undefined) {
        // pass
        if (i === 0) {
          this.seqtimeline[i].meta.prev = null
        } else if (i === this.seqtimeline.length - 1) {
          this.seqtimeline[i].meta.prev = this.seqtimeline[i - 1].name
        } else {
          this.seqtimeline[i].meta.prev = this.seqtimeline[i - 1].name
        }
      }
    }
  }

  // this won't work with new system
  // buildProgress assigns progrees meeter values to each route
  // buildProgress() {
  //   const seqTimelineLength = this.seqtimeline.length
  //   for (let i = 0; i < seqTimelineLength; i++) {
  //     this.seqtimeline[i].meta.routeIdx = i
  //     this.seqtimeline[i].meta.progress = (100 * i) / (seqTimelineLength - 1)
  //   }
  // }
}
export default Timeline
