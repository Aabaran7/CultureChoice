
export default function assignConds(id) {

    // ENTER YOUR BETWEEN-SUBJECTS CONDITIONS HERE
    const conditionsBetween = {instructionsCond: ["A", "B"], taskCond: ["C", "D", "E"]}

    const keysBetween = Object.keys(conditionsBetween)

// function for all possible combinations of N arrays (from https://stackoverflow.com/questions/8936610/how-can-i-create-every-combination-possible-for-the-contents-of-two-arrays)
    const combine = ([head, ...[headTail, ...tailTail]]) => {
      if (!headTail) return head
      const combined = headTail.reduce((acc, x) => acc.concat(head.map(h => `${h}-${x}`)), [])
      return combine([combined, ...tailTail])
    }

    // Append between-subjects conditions
    const betweenCombos = combine(Object.values(conditionsBetween))

    // Generate a random number seeded by seed, determined by participant id
    function generateRandom(){
        // generate id random numbers, then take the last one
        const seededRandom = Array(id+1).fill().map(Math.random)[id] // add one so it works when ID is 0
        return seededRandom
    }
    const rand = generateRandom()

    // select a between subjects condition
    const randomCond = betweenCombos[Math.floor(rand * betweenCombos.length)];

    // parse into separate variables
    const randomCondParsed = randomCond.split("-");

    // save according to keys
    const conditionList = {}
    let i = 0;
    while (i < keysBetween.length) {
        conditionList[keysBetween[i]] = randomCondParsed[i]
        i += 1;
    }

    return(conditionList)

}