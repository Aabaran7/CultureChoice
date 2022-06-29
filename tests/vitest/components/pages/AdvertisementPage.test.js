// import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import Advertisement from '@/components/pages/AdvertisementPage.vue'

describe('Advertisement tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render', () => {
    const wrapper = mount(Advertisement)
    expect(wrapper.html()).toContain('Welcome')
  })
})
