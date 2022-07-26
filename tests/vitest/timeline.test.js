/* eslint-disable no-undef */
import Timeline from '@/timeline'

describe('Timeline tests', () => {
  it('should be able to create a timeline', () => {
    const timeline = new Timeline()
    expect(timeline).toBeDefined()
  })

  it('should add a sequential route', () => {
    const MockComponent = { template: '<div>Mock Component</div>' }
    const timeline = new Timeline()
    timeline.pushSeqRoute({
      path: '/',
      name: 'index',
      component: MockComponent,
    })
    expect(timeline.routes.length).toBe(1)
    expect(timeline.seqtimeline.length).toBe(1)
  })

  it('should add a nonsequential route', () => {
    const MockComponent = { template: '<div>Mock Component</div>' }
    const timeline = new Timeline()
    timeline.pushNonSeqRoute({
      path: '/',
      name: 'index',
      component: MockComponent,
    })
    expect(timeline.routes.length).toBe(1)
    expect(timeline.seqtimeline.length).toBe(0)
  })

  it('should add a nonsequential and sequential route', () => {
    const MockComponentOne = { template: '<div>Mock Component One</div>' }
    const MockComponentTwo = { template: '<div>Mock Component Two</div>' }
    const timeline = new Timeline()
    timeline.pushSeqRoute({
      path: '/one',
      name: 'one',
      component: MockComponentOne,
    })
    timeline.pushNonSeqRoute({
      path: '/two',
      name: 'two',
      component: MockComponentTwo,
    })
    expect(timeline.routes.length).toBe(2)
    expect(timeline.seqtimeline.length).toBe(1)
  })

  it('should not allow the same sequential route to be registered twice', () => {
    const MockComponent = { template: '<div>Mock Component</div>' }
    const timeline = new Timeline()
    timeline.pushSeqRoute({
      path: '/thanks',
      name: 'thank',
      component: MockComponent,
    })

    const errorTrigger = () => {
      timeline.pushSeqRoute({
        path: '/thanks',
        name: 'thanks',
        component: MockComponent,
      })
    }
    expect(errorTrigger).toThrowError()
    expect(timeline.routes.length).toBe(1)
    expect(timeline.seqtimeline.length).toBe(1) // only first one should work
  })

  it('should not allow the same non-sequential route to be registered twice', () => {
    const MockComponent = { template: '<div>Mock Component</div>' }
    const timeline = new Timeline()
    timeline.pushNonSeqRoute({
      path: '/thanks',
      name: 'thank',
      component: MockComponent,
    })
    const errorTrigger = () => {
      timeline.pushNonSeqRoute({
        path: '/thanks',
        name: 'thanks',
        component: MockComponent,
      })
    }
    expect(errorTrigger).toThrowError()
    expect(timeline.routes.length).toBe(1)
    expect(timeline.seqtimeline.length).toBe(0)
  })

  it('should not allow the same route to be registered twice', () => {
    const MockComponent = { template: '<div>Mock Component</div>' }
    const timeline = new Timeline()
    timeline.pushSeqRoute({
      path: '/thanks',
      name: 'thank',
      component: MockComponent,
    })
    const errorTrigger = () => {
      timeline.pushNonSeqRoute({
        path: '/thanks',
        name: 'thanks',
        component: MockComponent,
      })
    }
    expect(errorTrigger).toThrowError()
    expect(timeline.routes.length).toBe(1)
    expect(timeline.seqtimeline.length).toBe(1) // only first one should work
  })

  it('should compute the progress correctly', () => {
    const MockComponentOne = { template: '<div>Mock Component One</div>' }
    const MockComponentTwo = { template: '<div>Mock Component Two</div>' }
    const MockComponentThree = { template: '<div>Mock Component Three</div>' }
    const MockComponentFour = { template: '<div>Mock Component Four</div>' }

    const timeline = new Timeline()
    timeline.pushSeqRoute({
      path: '/one',
      name: 'one',
      component: MockComponentOne,
    })
    timeline.pushSeqRoute({
      path: '/two',
      name: 'two',
      component: MockComponentTwo,
    })
    timeline.pushSeqRoute({
      path: '/three',
      name: 'three',
      component: MockComponentThree,
    })
    timeline.buildProgress()
    expect(timeline.seqtimeline[0].meta.progress).toBe((100 * 0) / (3 - 1)) // zero progress
    expect(timeline.seqtimeline[1].meta.progress).toBe((100 * 1) / (3 - 1)) // remaining is split
    expect(timeline.seqtimeline[2].meta.progress).toBe((100 * 2) / (3 - 1))

    timeline.pushSeqRoute({
      path: '/four',
      name: 'four',
      component: MockComponentFour,
    })

    timeline.buildProgress() // rebuild timeline
    expect(timeline.seqtimeline[0].meta.progress).toBe((100 * 0) / (4 - 1)) // zero progress
    expect(timeline.seqtimeline[1].meta.progress).toBe((100 * 1) / (4 - 1)) // remaining is split
    expect(timeline.seqtimeline[2].meta.progress).toBe((100 * 2) / (4 - 1))
    expect(timeline.seqtimeline[3].meta.progress).toBe((100 * 3) / (4 - 1))
  })
})
