import useSmileStore from '@/stores/smiledata' // get access to the global store
import appconfig from '@/config'

export function processQuery(query) {
  const smilestore = useSmileStore()
  const urlParams = query
  if (!urlParams) return // do nothing if no query

  if (urlParams.PROLIFIC_PID && urlParams.STUDY_ID && urlParams.SESSION_ID) {
    // this is a prolific experiment
    console.log('prolific mode')
    smilestore.setProlific(
      urlParams.PROLIFIC_PID,
      urlParams.STUDY_ID,
      urlParams.SESSION_ID
    )
  } else if (urlParams.assignmentId && urlParams.hitId && urlParams.workerId) {
    if (urlParams.assignmentId == 'ASSIGNMENT_ID_NOT_AVAILABLE') {
      console.log('AMT mode, but no assignment (preview mode)')
      // supposed to show the ad here
    } else {
      console.log('AMT mode, with assignment')
      smilestore.setMechanicalTurk(
        urlParams.workerId,
        urlParams.hitId,
        urlParams.assignmentId
      )
    }
  } else if (
    urlParams.CITIZEN_ID &&
    urlParams.CITIZEN_TASK_ID &&
    urlParams.CITIZEN_ASSIGN_ID
  ) {
    console.log('future citizen mode')
    smilestore.setCitizen(
      urlParams.CITIZEN_ID,
      urlParams.CITIZEN_TASK_ID,
      urlParams.CITIZEN_ASSIGN_ID
    )
  } else {
    console.log('development mode')
  }
}

export class Timeline {
  constructor() {
    this.routes = []
    this.seqtimeline = []
  }

  pushSeqRoute(routeConfig) {
    const newroute = routeConfig
    newroute.meta = {}
    newroute.meta.sequential = true
    this.routes.push(newroute)
    this.seqtimeline.push(newroute)
  }

  pushNonSeqRoute(routeConfig) {
    const newroute = routeConfig
    newroute.meta = {}
    newroute.meta.sequential = false
    this.routes.push(newroute)
  }

  buildProgress() {
    const seqTimelineLength = this.seqtimeline.length
    for (let i = 0; i < seqTimelineLength; i++) {
      this.seqtimeline[i].meta.routeIdx = i
      this.seqtimeline[i].meta.progress = (100 * i) / (seqTimelineLength - 1)
    }
    console.log(this.routes)
  }
}
export default Timeline
