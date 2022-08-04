/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
import { describe, it, expect, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createTestingPinia } from '@pinia/testing'
import { plugin, defaultConfig, reset } from '@formkit/vue'
import '@/icons' // configure fontawesome

import App from '@/App.vue'
import { routes, addGuards } from '@/router' // This import should point to your routes file declared above
import useSmileStore from '@/stores/smiledata'
import appconfig from '@/config'

let router
let pinia

// const app = createApp(App)
describe('App tests', () => {
  // before each test we need to set up
  // pinia (because the router depends on it)

  function setupapp() {
    const wrapper = mount(App, {
      global: {
        plugins: [router, pinia, [plugin, defaultConfig]],
        stubs: ['FAIcon'],
      },
    })
    return wrapper
  }

  function resetLocalStorage() {
    localStorage.setItem(appconfig.local_storage_key, null)
  }

  function getLocalStorage() {
    return JSON.parse(localStorage.getItem(appconfig.local_storage_key))
  }

  beforeEach(() => {
    pinia = createTestingPinia({ stubActions: false })
    router = createRouter({
      history: createWebHashHistory(),
      routes,
    })
    addGuards(router)
  })

  /* there are some basic sanity checks */
  it('localstorage is modified by writing to it', () => {
    localStorage.setItem('test', 'test')
    expect(localStorage.getItem('test')).toBe('test')
  })

  it('localstorage survives between tests', () => {
    expect(localStorage.getItem('test')).toBe('test')
  })

  /* now test the app */
  it('there should be no smilestore before the app created', () => {
    expect(getLocalStorage()).toBe(null)
  })

  it('there should be smilestore after the app started', async () => {
    const wrapper = setupapp()
    await router.isReady()
    // local storage created here by the import of the useSmileStore in the app
    expect(getLocalStorage()).not.toBe(null)
  })

  it('there should be no localstorage if it is reset', () => {
    resetLocalStorage()
    expect(getLocalStorage()).toBe(null)
  })

  it('should render welcome_anonymous when accessing /', async () => {
    const wrapper = setupapp()
    const smilestore = useSmileStore()
    resetLocalStorage()
    router.push('/')
    await router.isReady()
    expect(wrapper.html()).toContain('Please help us')
    expect(smilestore.local.lastRoute).toBe('welcome_anonymous')
  })

  it('should render welcome_referred when accessing a prolific route', async () => {
    const wrapper = setupapp()
    const smilestore = useSmileStore()
    resetLocalStorage()
    router.push('/welcome/prolific?test=test')
    await router.isReady()
    expect(wrapper.html()).toContain('Please help us')
    expect(smilestore.local.lastRoute).toBe('welcome_referred')
  })

  it('should render welcome_referred when accessing a cloudresearch route', async () => {
    const wrapper = setupapp()
    const smilestore = useSmileStore()
    resetLocalStorage()
    router.push('/welcome/cloudresearch?test=test')
    await router.isReady()
    expect(wrapper.html()).toContain('Please help us')
    expect(smilestore.local.lastRoute).toBe('welcome_referred')
  })

  it('should render welcome_referred when accessing an amt route', async () => {
    const wrapper = setupapp()
    const smilestore = useSmileStore()
    resetLocalStorage()
    router.push('/welcome/mturk?test=test')
    await router.isReady()
    expect(wrapper.html()).toContain('Please help us')
    expect(smilestore.local.lastRoute).toBe('welcome_referred')
  })

  it('should render welcome_referred when accessing a citizenscience route', async () => {
    const wrapper = setupapp()
    const smilestore = useSmileStore()
    resetLocalStorage()
    router.push('/welcome/mturk?test=test')
    await router.isReady()
    expect(wrapper.html()).toContain('Please help us')
    expect(smilestore.local.lastRoute).toBe('welcome_referred')
  })

  // should first render the welcome
  it('should render welcome_anonymous when accessing / then the informed consent', async () => {
    const wrapper = setupapp()
    const smilestore = useSmileStore()
    resetLocalStorage()
    router.push('/')
    await router.isReady()
    expect(wrapper.html()).toContain('Please help us')
    expect(smilestore.local.lastRoute).toBe('welcome_anonymous')
    await new Promise((r) => setTimeout(r, 10)) // wait for db connection
    await wrapper.find('#finish').trigger('click')
    // await router.isReady()
    await new Promise((r) => setTimeout(r, 10)) // wait for db connection
    expect(wrapper.html()).toContain('Please take the time to read')
    expect(smilestore.local.lastRoute).toBe('consent') // check that smilestore was updated
  })

  // it.skip('should render the consent, then the demographic survey, and the localstore though reflect last route is demograph', async () => {
  //   const wrapper = setupapp()
  //   const smilestore = useSmileStore()
  //   await router.isReady()
  //   expect(smilestore.local.lastRoute).toBe('consent')
  //   await new Promise((r) => setTimeout(r, 10)) // wait for db connection
  //   console.log('what i got', wrapper.html())
  //   expect(wrapper.html()).toContain(
  //     'Please take the time to read the consent form'
  //   )
  //   expect(smilestore.local.lastRoute).toBe('consent')
  //   const checkbox = wrapper.find('#input_1')
  //   checkbox.element.checked = true // ugh what a nightmare
  //   checkbox.trigger('input')
  //   await new Promise((r) => setTimeout(r, 200)) // wait for db connection
  //   await wrapper.find('#finish').trigger('click')
  //   await new Promise((r) => setTimeout(r, 50)) // wait for db connection
  //   expect(wrapper.html()).toContain('Demographic Information')
  //   expect(smilestore.local.lastRoute).toBe('demograph')
  // })

  it('should redirect you to welcome_anonymous if you are unknown and accessed from an anonymous welcome', async () => {
    const wrapper = setupapp()
    const smilestore = useSmileStore()
    await router.isReady()
    resetLocalStorage()
    smilestore.resetLocal()
    expect(smilestore.isKnownUser).toBe(false)
    expect(smilestore.lastRoute).toBe('welcome')
    router.push('/exp')
    await router.isReady()
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('welcome_anonymous')
    expect(wrapper.html()).toContain('Please help us') // verify
  })

  it(
    'should redirect you to welcome_referred if you are unknown and accessed from a prolific welcome and try accessing /exp'
  )

  it('should keep you on the consent page if you reload it')

  it('should let you access config even if known and last route set', async () => {
    const smilestore = useSmileStore()
    smilestore.setKnown()
    smilestore.setLastRoute('consent') // pretend we stopped on consent
    const wrapper = setupapp()
    await router.isReady()
    await flushPromises()
    router.push('/config') // go to config
    await router.isReady()
    await flushPromises()
    expect(router.currentRoute.value.name).not.toBe('consent') // not this
    expect(router.currentRoute.value.name).toBe('config') // yes this
  })

  it('it should redirect you to the last route if you are known ', async () => {
    const smilestore = useSmileStore()
    smilestore.setKnown()
    smilestore.setLastRoute('exp') // pretend we stopped on consent
    await new Promise((r) => setTimeout(r, 200)) // wait a bit
    expect(smilestore.lastRoute).toBe('exp')
    expect(getLocalStorage().lastRoute).toBe('exp')

    const wrapper = setupapp()
    router.push('/') // go to welcome
    await router.isReady()
    await flushPromises()
    expect(smilestore.isKnownUser).toBe(true)
    expect(smilestore.lastRoute).toBe('exp')
    await router.isReady()
    await flushPromises()
    expect(router.currentRoute.value.name).not.toBe('config') // not this
    expect(router.currentRoute.value.name).toBe('exp') // yes this
    expect(wrapper.html()).toContain('Experiment') // verify
  })

  it('should send you to the last route if you are known and you try to access a different route', async () => {
    const smilestore = useSmileStore()
    smilestore.setKnown()
    smilestore.setLastRoute('consent') // pretend we stopped on consent

    const wrapper = setupapp()
    await router.isReady()
    await flushPromises()
    expect(smilestore.isKnownUser).toBe(true)
    expect(smilestore.lastRoute).toBe('consent')
    await router.isReady()
    router.push('/exp') // go to something different
    await flushPromises()
    expect(router.currentRoute.value.name).not.toBe('exp') // not this
    expect(router.currentRoute.value.name).toBe('consent') // yes this
    expect(wrapper.html()).toContain('Consent') // verify
  })
})
