import { defineStore } from 'pinia'

export const useSmileStore = defineStore('smilestore', {
    // arrow function recommended for full type inference
    state: () => {
        return {
            counter: 0,
            name: 'Todd',
            isAdmin: true
        }
    }
})
