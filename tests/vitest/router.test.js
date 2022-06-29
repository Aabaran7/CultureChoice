// import { describe, it, expect } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createTestingPinia } from '@pinia/testing'
import App from '@/App.vue'
import { routes, addGuards } from '@/router' // This import should point to your routes file declared above
import useSmileStore from '@/stores/smiledata'
import smileconfig from '@/plugins/smileconfig'

let router
let pinia

// const app = createApp(App)
describe('App tests', () => {
  // before each test we need to set up
  // pinia (because the router depends on it)

  beforeEach(() => {
    router = createRouter({
      history: createWebHashHistory(),
      routes,
    })
    addGuards(router)
    pinia = createTestingPinia({ stubActions: false })
  })

  /* there are some basic sanity checks */
  it('localstorage is modified', () => {
    localStorage.setItem('test', 'test')
    expect(localStorage.getItem('test')).toBe('test')
  })

  it('localstorage survives between tests', () => {
    expect(localStorage.getItem('test')).toBe('test')
  })

  /* now test the app */
  it('there should be no smilestore before the app created', () => {
    expect(localStorage.getItem('smilestore')).toBe(null)
  })

  it('there should be smilestore after the app started', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router, pinia, smileconfig],
      },
    })
    await router.isReady()
    // local storage created here by the import of the useSmileStore in the app
    expect(localStorage.getItem('smilestore')).not.toBe(null)
  })

  it('there should be no localstorage if it is reset', () => {
    localStorage.setItem('smilestore', null)
    expect(localStorage.getItem('smilestore')).toBe(null)
  })

  // should first render the welcome
  it('should render welcome then the captcha', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router, pinia, smileconfig], // i'm worried this testing pinia
      }, // is different from above
    })

    router.push('/')
    await router.isReady()
    // await flushPromises() // wait to make sure this workd
    // console.log(localStorage.getItem('smilestore'))  this won't work because it has been serialized

    // maybe can useSmileStore here
    expect(wrapper.html()).toContain('Welcome')
    await wrapper.find('button').trigger('click')
    await flushPromises()
    expect(wrapper.html()).toContain('Captcha')
    const smilestore = useSmileStore()
    expect(smilestore.local.lastRoute).toBe('captcha')
  })

  it('should render the captcha, and the store though reflect last route', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router, pinia, smileconfig], // i'm worried this testing pinia
      }, // is different from above
    })

    await router.isReady()
    expect(wrapper.html()).toContain('Captcha')

    await wrapper.find('button').trigger('click')
    await flushPromises()
    expect(wrapper.html()).toContain('Consent')
    const smilestore = useSmileStore()
    expect(smilestore.local.lastRoute).toBe('consent')
  })

  // should first render the welcome
  /*
  it('should render welcome again', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router, pinia], // i'm worried this testing pinia
      }, // is different from above
    })
    const smilestore = useSmileStore()
    expect(smilestore.local.knownUser).toBe(true)
    // maybe can useSmileStore here

    expect(wrapper.html()).toContain('Welcome')
  })
  */
  /*
  it('should render welcome again', async () => {
    router.push('/')
    await router.isReady()
    const wrapper = mount(App, {
      global: {
        plugins: [router, createTestingPinia()], // i'm worried this testing pinia
      }, // is different from above
    })
    // const smilestore = useSmileStore()
    expect(smilestore.local.knownUser).toBe(true)

    expect(wrapper.html()).toContain('Welcome')
  })
  */

  /*
  // should render the captcha when you click the button
  it('should follow sequence', async () => {
    const smilestore = useSmileStore()

    router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router, createTestingPinia()], // i'm worried this testing pinia is different from above
      },
    })
    const screens = [
      'Welcome',
      'Captcha',
      'Consent',
      'Exp',
      'Debrief',
      'Thanks',
    ]
    for (let i = 0; i < screens.length; i++) {
      expect(wrapper.html()).toContain(screens[i])
      await wrapper.find('button').trigger('click')
      await flushPromises()
    }
    expect(smilestore.local.knownUser).toBe(true)
  })
  */

  // should render the captcha when you click the button
})
