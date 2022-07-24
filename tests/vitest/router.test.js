/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
import { describe, it, expect, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createTestingPinia } from '@pinia/testing'
import { plugin, defaultConfig } from '@formkit/vue'
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

  beforeEach(() => {
    pinia = createTestingPinia({ stubActions: false })
    router = createRouter({
      history: createWebHashHistory(),
      routes,
    })
    addGuards(router)
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
    expect(localStorage.getItem(appconfig.local_storage_key)).toBe(null)
  })

  it('there should be smilestore after the app started', async () => {
    const wrapper = setupapp()
    await router.isReady()
    // local storage created here by the import of the useSmileStore in the app
    expect(localStorage.getItem(appconfig.local_storage_key)).not.toBe(null)
  })

  it('there should be no localstorage if it is reset', () => {
    localStorage.setItem(appconfig.local_storage_key, null)
    expect(localStorage.getItem(appconfig.local_storage_key)).toBe(null)
  })

  // should first render the welcome
  it('should render welcome then the informed consent', async () => {
    const wrapper = setupapp()
    const smilestore = useSmileStore()
    localStorage.setItem(appconfig.local_storage_key, null)
    router.push('/')
    await router.isReady()
    expect(wrapper.html()).toContain('Please help us')
    expect(smilestore.local.lastRoute).toBe('welcome')
    await new Promise((r) => setTimeout(r, 10)) // wait for db connection
    await wrapper.find('#finish').trigger('click')
    // await router.isReady()
    await new Promise((r) => setTimeout(r, 10)) // wait for db connection
    expect(wrapper.html()).toContain('Please take the time to read')
    expect(smilestore.local.lastRoute).toBe('consent') // check that smilestore was updated
  })

  it('should render the consent, then the demographic survey, and the localstore though reflect last route is demograph', async () => {
    const wrapper = setupapp()
    const smilestore = useSmileStore()
    await router.isReady()
    expect(smilestore.local.lastRoute).toBe('consent')
    await new Promise((r) => setTimeout(r, 10)) // wait for db connection
    console.log('what i got', wrapper.html())
    expect(wrapper.html()).toContain(
      'Please take the time to read the consent form'
    )
    expect(smilestore.local.lastRoute).toBe('consent')
    const checkbox = wrapper.find('#input_1')
    checkbox.element.checked = true // ugh what a nightmare
    checkbox.trigger('input')
    await new Promise((r) => setTimeout(r, 200)) // wait for db connection
    await wrapper.find('#finish').trigger('click')
    await new Promise((r) => setTimeout(r, 50)) // wait for db connection
    expect(wrapper.html()).toContain('Demographic Information')
    expect(smilestore.local.lastRoute).toBe('demograph')
  })

  it('should redirect you to welcome if you are unknown', async () => {
    const wrapper = setupapp()
    const smilestore = useSmileStore()
    await router.isReady()
    localStorage.setItem(appconfig.local_storage_key, null)
    smilestore.resetLocal()
    expect(smilestore.isKnownUser).toBe(false)
    expect(smilestore.lastRoute).toBe('welcome')
    router.push('/exp')
    await router.isReady()
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('welcome')
    expect(wrapper.html()).toContain('Please help us') // verify
  })

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
    smilestore.setLastRoute('consent') // pretend we stopped on consent

    const wrapper = setupapp()
    await router.isReady()
    await flushPromises()
    expect(smilestore.isKnownUser).toBe(true)
    expect(smilestore.lastRoute).toBe('consent')
    await router.isReady()
    router.push('/') // go to welcome
    await flushPromises()
    expect(router.currentRoute.value.name).not.toBe('config') // not this
    expect(router.currentRoute.value.name).toBe('consent') // yes this
    expect(wrapper.html()).toContain('Consent') // verify
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
