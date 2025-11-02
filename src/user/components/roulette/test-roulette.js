/**
 * @fileoverview Test script for Roulette Experiment components
 * @description Validates the mini-block generator and basic functionality
 */

import { generateMiniBlocks } from './miniBlockGenerator.js'

// Test mini-block generation
console.log('Testing mini-block generation...')

try {
  const miniBlocks = generateMiniBlocks()
  console.log('Generated mini-blocks:', miniBlocks)
  
  // Validate the matrix
  const isValid = validateMatrix(miniBlocks)
  console.log('Matrix is valid:', isValid)
  
  if (isValid) {
    console.log('✅ Mini-block generation test passed!')
  } else {
    console.log('❌ Mini-block generation test failed!')
  }
} catch (error) {
  console.error('❌ Error in mini-block generation:', error)
}

// Test matrix validation
function validateMatrix(matrix) {
  // Check dimensions (4×5)
  if (matrix.length !== 4 || matrix.some(row => row.length !== 5)) {
    console.log('❌ Invalid dimensions')
    return false
  }
  
  // Check each row has correct number of wins
  const expectedWins = [1, 2, 3, 4]
  for (let row = 0; row < 4; row++) {
    const actualWins = matrix[row].reduce((sum, val) => sum + val, 0)
    if (actualWins !== expectedWins[row]) {
      console.log(`❌ Row ${row} has ${actualWins} wins, expected ${expectedWins[row]}`)
      return false
    }
  }
  
  // Check no column is all 0s or all 1s
  for (let col = 0; col < 5; col++) {
    const columnSum = matrix.reduce((sum, row) => sum + row[col], 0)
    if (columnSum === 0 || columnSum === 4) {
      console.log(`❌ Column ${col} is invalid (sum: ${columnSum})`)
      return false
    }
  }
  
  return true
}

// Test wheel pattern generation
console.log('\nTesting wheel pattern generation...')

function createBaseWheelPattern(probability) {
  const totalSegments = 40
  const winSegments = Math.round(probability * totalSegments)
  
  const segmentTypes = [
    ...Array(winSegments).fill(true),
    ...Array(totalSegments - winSegments).fill(false)
  ]
  
  // Seeded shuffle
  const seed = Math.floor(probability * 1000)
  let random = seed
  const seededRandom = () => {
    random = (random * 9301 + 49297) % 233280
    return random / 233280
  }
  
  for (let i = segmentTypes.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1))
    ;[segmentTypes[i], segmentTypes[j]] = [segmentTypes[j], segmentTypes[i]]
  }
  
  return segmentTypes
}

const probabilities = [0.2, 0.4, 0.6, 0.8]
probabilities.forEach(prob => {
  const pattern = createBaseWheelPattern(prob)
  const winCount = pattern.filter(x => x).length
  const expectedWins = Math.round(prob * 40)
  
  console.log(`Probability ${prob}: ${winCount} wins (expected ${expectedWins})`)
  
  if (winCount === expectedWins) {
    console.log(`✅ Pattern for ${prob} is correct`)
  } else {
    console.log(`❌ Pattern for ${prob} is incorrect`)
  }
})

console.log('\n🎯 All tests completed!')



