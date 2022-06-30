/* eslint-disable import/no-unresolved */
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import Advertisement from '@/components/pages/AdvertisementPage.vue'
import smileconfig from '@/plugins/smileconfig'

describe('Advertisement tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render', () => {
    const wrapper = mount(Advertisement, {
      global: {
        plugins: [smileconfig],
      },
    })

    expect(wrapper.html()).toContain('Welcome')
  })
})
