import { mount } from '@vue/test-utils'
import { Timeline, processQuery } from '@/timeline'

describe('Timeline tests', () => {
  it('should be able to create a timeline', () => {
    const timeline = new Timeline()
    expect(timeline).toBeDefined()
  })

  it('should add a sequential route', () => {
    const Advertisement = { template: '<div>Advertisement</div>' }
    const timeline = new Timeline()
    timeline.pushSeqRoute({
      path: '/',
      name: 'welcome',
      component: Advertisement,
    })
    expect(timeline.routes.length).toBe(1)
    expect(timeline.seqtimeline.length).toBe(1)
  })

  it('should add a nonsequential route', () => {
    const Advertisement = { template: '<div>Advertisement</div>' }
    const timeline = new Timeline()
    timeline.pushNonSeqRoute({
      path: '/',
      name: 'welcome',
      component: Advertisement,
    })
    expect(timeline.routes.length).toBe(1)
    expect(timeline.seqtimeline.length).toBe(0)
  })

  it('should add a nonsequential and sequential route', () => {
    const Advertisement = { template: '<div>Advertisement</div>' }
    const Thanks = { template: '<div>Thanks</div>' }
    const timeline = new Timeline()
    timeline.pushSeqRoute({
      path: '/',
      name: 'welcome',
      component: Advertisement,
    })
    timeline.pushNonSeqRoute({
      path: '/thanks',
      name: 'thanks',
      component: Thanks,
    })
    expect(timeline.routes.length).toBe(2)
    expect(timeline.seqtimeline.length).toBe(1)
  })

  it('should not allow the same route to be registered twice', () => {
    const Advertisement = { template: '<div>Advertisement</div>' }
    const Thanks = { template: '<div>Thanks</div>' }
    const timeline = new Timeline()
    timeline.pushSeqRoute({
      path: '/thanks',
      name: 'thank',
      component: Advertisement,
    })
    timeline.pushNonSeqRoute({
      path: '/thanks',
      name: 'thanks',
      component: Thanks,
    })
    expect(timeline.routes.length).toBe(1)
    expect(timeline.seqtimeline.length).toBe(1) // only first one should work
  })

  it('should compte the progress correctly', () => {
    const Advertisement = { template: '<div>Advertisement</div>' }
    const Consent = { template: '<div>Consent</div>' }
    const Thanks = { template: '<div>Thanks</div>' }

    const timeline = new Timeline()
    timeline.pushSeqRoute({
      path: '/welcome',
      name: 'welcome',
      component: Advertisement,
    })
    timeline.pushSeqRoute({
      path: '/consent',
      name: 'consent',
      component: Consent,
    })
    timeline.pushSeqRoute({
      path: '/thanks',
      name: 'thanks',
      component: Thanks,
    })
    timeline.buildProgress()
    expect(timeline.seqtimeline[0].meta.progress).toBe((100 * 0) / (3 - 1)) // zero progress
    expect(timeline.seqtimeline[1].meta.progress).toBe((100 * 1) / (3 - 1)) // remaining is split
    expect(timeline.seqtimeline[2].meta.progress).toBe((100 * 2) / (3 - 1))

    timeline.pushSeqRoute({
      path: '/thanks',
      name: 'thanks',
      component: Thanks,
    })

    timeline.buildProgress() // rebuild timeline
    expect(timeline.seqtimeline[0].meta.progress).toBe((100 * 0) / (4 - 1)) // zero progress
    expect(timeline.seqtimeline[1].meta.progress).toBe((100 * 1) / (4 - 1)) // remaining is split
    expect(timeline.seqtimeline[2].meta.progress).toBe((100 * 2) / (4 - 1))
    expect(timeline.seqtimeline[3].meta.progress).toBe((100 * 3) / (4 - 1))
  })
})
