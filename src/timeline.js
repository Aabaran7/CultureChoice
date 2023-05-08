import _ from 'lodash'

class Timeline {
  constructor() {
    this.routes = [] // the actual routes given to VueRouter
    this.seqtimeline = [] // copies of routes that are sequential
    this.type = "timeline"
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

  pushToTimeline(route) {
    // check that an existing route doesn't exist with same
    // path and/or name
    for (let i = 0; i < this.seqtimeline.length; i += 1) {
      if (this.seqtimeline[i].name === route.name) {
        throw new Error(`DuplicateNameError${route.name}`)
      }
      // only check for duplicate paths if the route name is not an object (subtimeline)
      if (typeof route.name !== 'object'){
        if (this.seqtimeline[i].path === route.path) {
          throw new Error(`DuplicatePathError${route.path}`)
        }
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

  pushRandomizedTimeline(timeline){
    if(timeline.name.type !== 'randomized_sub_timeline'){
      throw new Error("Can only push randomized timelines to timelines")
    }
    const newtimeline = _.cloneDeep(timeline)

    // need to configure next and prev
    if(!newtimeline.meta){
      newtimeline.meta = { next: undefined, prev: undefined, type: "timeline" } 
    } else {
      newtimeline.meta.next = undefined
      newtimeline.meta.prev = undefined
      newtimeline.meta.type = "timeline"
    }

    // get all the routes inside the timeline and add them to routes
    newtimeline.name.routes.forEach(route => {
      try {
        this.pushToRoutes(route)
      } catch (err) {
        console.error('Smile FATAL ERROR: ', err)
        throw err
      }
    })
    
    // add the timeline object itself to the timeline
    this.pushToTimeline(newtimeline)
  }

  build() {
    this.buildGraph()
    // this.buildProgress()
  }

  // buildGraph builds
  buildGraph() {
    // keep track of which objects in sequential timeline are themselves timelines
    const timelineIndices = []

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

      if(this.seqtimeline[i].meta.type === "timeline"){
        timelineIndices.push(i)
      }

    }

    // propogate various meta fields to the routes within the timeline
    // this is relevant for next, previous, label, and orders -- we need that meta info at the route level
    timelineIndices.forEach(index => {
      this.seqtimeline[index].name.routes.forEach((route, i) => {
        this.seqtimeline[index].name.routes[i].meta = {...this.seqtimeline[index].name.routes[i].meta, ...this.seqtimeline[index].meta}
      })
    })

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
