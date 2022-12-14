import useSmileStore from '@/stores/smiledata' // get access to the global store
import seedrandom from 'seedrandom'

export function setLocalSeed(localTag) {
    if(localTag){
      const smilestore = useSmileStore()
      const rng = seedrandom(`${smilestore.getSeedID }-${localTag}`)
      return rng 
    }
    console.error("Warning: tag for local seed not provided. Auto-seeded rng returned.")
    const rng = seedrandom()
    return rng
  }
  

  // gets random integer between min (inclusive) and max (inclusive)
export function seededRandomInt(min, max, rng) {
    return Math.floor(rng() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min)); 
    }

export function seededShuffle(array, rng) {
    const arrayCopy = array.slice(0);
    let len = arrayCopy.length
    let t
    let i
    // While there remain elements to shuffle…
    while (len) {
        // Pick a remaining element…
        i = seededRandomInt(0, (len-1), rng);
        len -= 1

        // And swap it with the current element.
        t = arrayCopy[len];
        arrayCopy[len] = arrayCopy[i];
        arrayCopy[i] = t;
    }

    return arrayCopy;
    }

export function seededSampleWithoutReplacement(array, sampleSize, rng) {
    if (sampleSize > array.length) {
        console.error("sample size larger than array length");
      }
      return seededShuffle(array, rng).slice(0, sampleSize);
    }

export function seededSampleWithReplacement(array, sampleSize, rng) {
    const sample = [];
    let s = sampleSize
    while (s > 0){
        sample.push(array[seededRandomInt(0, array.length-1, rng)])
        s -= 1
    }
    return(sample)
    }