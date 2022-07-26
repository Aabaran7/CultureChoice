import _ from 'lodash'

export class Timeline {
  constructor() {
    this.routes = []
    this.seqtimeline = []
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
    if (!newroute.meta) newroute.meta = {}
    newroute.meta.sequential = true

    try {
      this.pushToRoutes(newroute)
    } catch (err) {
      console.error('Smile FATAL ERROR: ', err)
      throw err
    }

    try {
      this.pushToTimeline(newroute)
    } catch (err) {
      console.error('Smile FATAL ERROR: ', err)
      throw err
    }
  }

  pushNonSeqRoute(routeConfig) {
    const newroute = _.cloneDeep(routeConfig)
    if (!newroute.meta) newroute.meta = {}
    newroute.meta.sequential = false
    try {
      this.pushToRoutes(newroute)
    } catch (err) {
      console.error('Smile FATAL ERROR: ', err)
      throw err
    }
  }

  buildProgress() {
    const seqTimelineLength = this.seqtimeline.length
    for (let i = 0; i < seqTimelineLength; i++) {
      this.seqtimeline[i].meta.routeIdx = i
      this.seqtimeline[i].meta.progress = (100 * i) / (seqTimelineLength - 1)
    }
  }
}
export default Timeline
