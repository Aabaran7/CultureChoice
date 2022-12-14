
  // gets random integer between min (inclusive) and max (inclusive)
export function randomInt(min, max) {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min)); 
    }

export function shuffle(array) {
    const arrayCopy = array.slice(0);
    let len = arrayCopy.length
    let t
    let i
    // While there remain elements to shuffle…
    while (len) {
        // Pick a remaining element…
        i = randomInt(0, (len-1));
        len -= 1

        // And swap it with the current element.
        t = arrayCopy[len];
        arrayCopy[len] = arrayCopy[i];
        arrayCopy[i] = t;
    }

    return arrayCopy;
    }

export function sampleWithoutReplacement(array, sampleSize) {
    if (sampleSize > array.length) {
        console.error("sample size larger than array length");
      }
      return shuffle(array).slice(0, sampleSize);
    }

export function sampleWithReplacement(array, sampleSize) {
    const sample = [];
    let s = sampleSize
    while (s > 0){
        sample.push(array[randomInt(0, array.length-1)])
        s -= 1
    }
    return(sample)
    }