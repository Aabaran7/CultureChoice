/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
import { describe, it, expect, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createTestingPinia } from '@pinia/testing'
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
        plugins: [router, pinia],
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
  it('should render welcome then the captcha', async () => {
    const wrapper = setupapp()

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

  it('should render the captcha, then the consent, and the localstore though reflect last route is consent', async () => {
    const wrapper = setupapp()

    await router.isReady()
    expect(wrapper.html()).toContain('Captcha')

    await wrapper.find('button').trigger('click')
    await flushPromises()
    expect(wrapper.html()).toContain('Consent')
    const smilestore = useSmileStore()
    expect(smilestore.local.lastRoute).toBe('consent')
  })

  it('should redirect you to home if you are unknown', async () => {
    const smilestore = useSmileStore()
    const wrapper = setupapp()
    await router.isReady()
    await flushPromises()
    smilestore.resetLocal()
    await router.isReady()
    await flushPromises()
    expect(smilestore.isKnownUser).toBe(false)
    expect(smilestore.lastRoute).toBe('home')
    router.push('/exp')
    await router.isReady()
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('home')
    expect(wrapper.html()).toContain('Welcome') // verify
  })

  it('should let you access config even if known and last route set', async () => {
    const smilestore = useSmileStore()
    smilestore.setKnown()
    smilestore.setLastRoute('consent') // pretend we stopped on consent
    const wrapper = setupapp()
    await router.isReady()
    await flushPromises()
    router.push('/config') // go to home
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
    router.push('/') // go to home
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
