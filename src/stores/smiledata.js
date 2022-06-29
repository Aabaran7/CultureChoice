import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

// import { initializeApp } from 'firebase/app'
// import { getFirestore, collection, addDoc } from 'firebase/firestore'

export default defineStore('smilestore', {
  // arrow function recommended for full type inference
  state: () => ({
    local: useStorage('smilestore', {
      knownUser: false,
      lastRoute: 'home',
    }),
  }),

  getters: {
    isKnownUser: (state) => state.local.knownUser,
    lastRoute: (state) => state.local.lastRoute,
  },

  actions: {
    setKnown() {
      console.log('inSetKnown')
      this.local.knownUser = true
      console.log('set knownUser to true')
    },
    setLastRoute(route) {
      this.local.lastRoute = route
    },
    resetLocal() {
      console.log('resetting state')
      this.local = null
      console.log(this.local)
      this.$reset()
      console.log(this.local)
    },
  },
})

/*
async function startup() {
  // const smileStore = useSmileStore() // get access to the global store
  console.log(appconfig.firebaseConfig);
  const firebaseApp = initializeApp(appconfig.firebaseConfig);
  const db = getFirestore(firebaseApp);

  try {
    const docRef = await addDoc(collection(db, 'users'), {
      first: 'Ada',
      last: 'Lovelace',
      born: 1815,
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}
*/
