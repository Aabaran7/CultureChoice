// based on: http://www.petecorey.com/blog/2020/01/01/random-seeds-lodash-and-es6-imports/
// you must import seed.js before any other modules in your files
import seedrandom from 'seedrandom'
import appconfig from '@/config'

seedrandom(appconfig.random_seed, { global: true })
