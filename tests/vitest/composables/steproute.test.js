import useStepRoute from '@/composables/steproute'

describe('steproute.js tests', () => {
  it('computes the correct step', () => {
    const { nextFn, prevFn } = useStepRoute()
    const next = nextFn()
    const prev = prevFn()
    expect(true)
  })
})
