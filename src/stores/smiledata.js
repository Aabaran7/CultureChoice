import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'


export const useSmileStore = defineStore('smilestore', {
    // arrow function recommended for full type inference
    state: () => {
        return {
            d: useStorage('smile-data',{
                counter: 0,
                name: 'Todd',
                isAdmin: true,
                wework: 'crazy'
            })
        }
    }
})
