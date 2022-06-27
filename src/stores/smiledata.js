import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'


export const useSmileStore = defineStore('smilestore', {
    // arrow function recommended for full type inference
    state: () => {
        return {
            data: {
                subjectId: 'something',
                trials: 10,
                amt: {
                    previewMode: false,
                    outsideTurk: true,
                    hitId: null,
                    assignmentId: null,
                    workerId: null,
                    turkSubmitTo: null,
                },
            },
            local: useStorage('smile-data',{
                counter: 0,
                name: 'Todd',
                isAdmin: true,
                wework: 'crazy',
            })
        }
    }
})
