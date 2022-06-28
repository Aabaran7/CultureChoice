// import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Advertisement from '@/components/pages/Advertisement.vue'
import { setActivePinia, createPinia } from 'pinia'

describe('Advertisement tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render', () => {
    const wrapper = mount(Advertisement)
    expect(wrapper.html()).toContain('Welcome')
  })
})
