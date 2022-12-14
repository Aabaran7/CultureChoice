// based on: http://www.petecorey.com/blog/2020/01/01/random-seeds-lodash-and-es6-imports/
// you must import seed.js before any other modules in your files
import { v4 as uuidv4 } from 'uuid';
import appconfig from '@/config'

// NOTE: this DOES NOT set the seed. To set the seed, see setLocalSeed function in '@/randomization.js'
// this script simply defines an ID number that is used to set local seeds throughout the experiment

function getParameterByName(name, url = window.location.href) {
    const nameClean = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${  nameClean  }(=([^&#]*)|&|#|$)`);
        const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }


  const localStore = JSON.parse(window.localStorage.getItem(appconfig.local_storage_key))
  console.log(localStore)

  // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
  const seed = getParameterByName('SEED')

//   if the seed hasn't already been set or if localStore is undefined
  if(!localStore){
    if(seed){
        console.log(`force seed id to ${  seed}`)
        const newStore = {'seed_id': seed, 'seed_set': true}
        window.localStorage.setItem(appconfig.local_storage_key, JSON.stringify(newStore))
      } else { // otherwise, generate a random ID
        const participantID = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
        console.log(`set seed id to ${  participantID}`)
        const newStore = {'seed_id': participantID, 'seed_set': true}
        window.localStorage.setItem(appconfig.local_storage_key, JSON.stringify(newStore))
      }
  } else if(!localStore.seed_set){ 
        // either pull the seed from the URL
        if(seed){
          console.log(`force seed id to ${  seed}`)
          localStore.seed_id = seed
          localStore.seed_set = true
          window.localStorage.setItem(appconfig.local_storage_key, JSON.stringify(localStore))
        } else { // otherwise, generate a random ID
          const participantID = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
          console.log(`set seed id to ${  participantID}`)
          localStore.seed_id = participantID
          localStore.seed_set = true
          window.localStorage.setItem(appconfig.local_storage_key, JSON.stringify(localStore))
        }
    }