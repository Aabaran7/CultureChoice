/* eslint-disable no-undef */
import RandomSubTimeline from '@/subtimeline'

describe('Subtimeline tests', () => {
  it('should be able to create a subtimline', () => {
    const subtimeline = new RandomSubTimeline()
    expect(subtimeline).toBeDefined()
  })

  it('should add a route to subtimeline', () => {
    const MockComponent = { template: '<div>Mock Component</div>' }
    const subtimeline = new RandomSubTimeline()
    subtimeline.pushRoute({
      path: '/',
      name: 'index',
      component: MockComponent,
    })
    expect(subtimeline.routes.length).toBe(1)
  })

  it('should leave next and prev undefined but meta defined', () => {
    const MockComponent = { template: '<div>Mock Component</div>' }
    const subtimeline = new RandomSubTimeline()
    subtimeline.pushRoute({
      path: '/',
      name: 'index',
      component: MockComponent,
      // meta: { prev: 'prev', next: 'next' },
    })
    expect(subtimeline.routes[0].meta).toBeDefined()
    expect(subtimeline.routes[0].meta.next).toBe(undefined)
    expect(subtimeline.routes[0].meta.prev).toBe(undefined)
  })

  it('should raise an error if you try to specify next or prev', () => {
    const MockComponent = { template: '<div>Mock Component</div>' }
    const subtimeline = new RandomSubTimeline()
    const errorTrigger = () => {
      subtimeline.pushRoute({
        path: '/',
        name: 'index',
        component: MockComponent,
        meta: {prev: 'prev', next: 'next'}
      })
    }
    expect(errorTrigger).toThrowError()
  })

  it('should not allow the same route to be registered twice', () => {
    const MockComponent = { template: '<div>Mock Component</div>' }
    const subtimeline = new RandomSubTimeline()
    subtimeline.pushRoute({
      path: '/thanks',
      name: 'thank',
      component: MockComponent,
    })

    const errorTrigger = () => {
      subtimeline.pushRoute({
        path: '/thanks',
        name: 'thanks',
        component: MockComponent,
      })
    }
    expect(errorTrigger).toThrowError()
    expect(subtimeline.routes.length).toBe(1)
  })

  it('you cannot nest subtimelines into each other', () => {
    const MockComponent1 = { template: '<div>Mock Component</div>' }
    const MockComponent2 = { template: '<div>Mock Component</div>' }
    const subtimeline1 = new RandomSubTimeline()
    const subtimeline2 = new RandomSubTimeline()
    subtimeline1.pushRoute({
      path: '/first',
      name: 'first',
      component: MockComponent1,
    })
    subtimeline2.pushRoute({
      path: '/mid1',
      name: 'mid1',
      component: MockComponent2,
    })
    const errorTrigger = () => {
      subtimeline1.pushRandomizedTimeline({
        name: subtimeline2
      })
    }
    expect(errorTrigger).toThrowError()
  })

})
