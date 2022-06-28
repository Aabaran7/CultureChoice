import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from "firebase/firestore"


export const useSmileStore = defineStore('smilestore', {
    // arrow function recommended for full type inference
    state: () => {
        return {
            counter: 0,
            hasConsents: false,
            trials: 0,
            amt: {  // these are things that jsPsych tracks
                previewMode: false,
                outsideTurk: true,
                hitId: null,
                assignmentId: null,
                workerId: null,
                turkSubmitTo: null,
            }
        }
    },
    methods: {

    }
})