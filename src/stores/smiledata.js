import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from "firebase/firestore"


export const useSmileStore = defineStore('smilestore', {
    // arrow function recommended for full type inference
    state: () => {
        return {
            local: useStorage('smilestore',{
                knownUser: false,
                lastRoute: 'home'
            })
        }
        
    },
    getters: {
        isKnownUser: (state) => state.local.knownUser,
        lastRoute: (state) => state.local.lastRoute,
    },
    actions: {
        setKnown() {
            this.local.knownUser = true;
        },
        setLastRoute(route) {
            this.local.lastRoute = route;
        },
        resetLocal() {
            console.log("resetting state")
            this.local = null
            console.log(this.local)
            this.$reset()
            console.log(this.local)
        }
    }
})