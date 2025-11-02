/**
 * @fileoverview Mini-Block Generator
 * @description Generates and validates the 4×5 mini-block outcome matrix for the roulette experiment
 */

/**
 * Generates a random permutation of numbers from 0 to n-1
 * @param {number} n - The length of the permutation
 * @returns {number[]} Array containing numbers 0 to n-1 in random order
 */
function generatePermutation(n) {
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Applies a column permutation to a matrix
 * @param {number[][]} matrix - The matrix to permute
 * @param {number[]} permutation - The permutation to apply
 * @returns {number[][]} The permuted matrix
 */
function applyColumnPermutation(matrix, permutation) {
  const result = matrix.map(row => [...row])
  const temp = matrix.map(row => [...row])
  
  for (let i = 0; i < permutation.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      result[j][i] = temp[j][permutation[i]]
    }
  }
  
  return result
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param {any[]} array - The array to shuffle
 * @returns {any[]} A new shuffled array
 */
function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Validates a mini-block matrix
 * @param {number[][]} matrix - The matrix to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateMiniBlocks(matrix) {
  // Check dimensions (4×5)
  if (matrix.length !== 4 || matrix.some(row => row.length !== 5)) {
    return false
  }
  
  // Check each row has correct number of wins
  const expectedWins = [1, 2, 3, 4]
  for (let row = 0; row < 4; row++) {
    const actualWins = matrix[row].reduce((sum, val) => sum + val, 0)
    if (actualWins !== expectedWins[row]) {
      return false
    }
  }
  
  // Check no column is all 0s or all 1s
  for (let col = 0; col < 5; col++) {
    const columnSum = matrix.reduce((sum, row) => sum + row[col], 0)
    if (columnSum === 0 || columnSum === 4) {
      return false
    }
  }
  
  return true
}

/**
 * Generates a valid mini-block matrix
 * Attempts up to 1000 times to generate a valid matrix
 * @returns {number[][]} A 4×5 matrix with validated outcomes
 */
export function generateMiniBlocks() {
  const maxAttempts = 1000
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Create 4×5 matrix
    const matrix = [[], [], [], []]
    
    // Each row has k wins: [1, 2, 3, 4]
    const winsPerRow = [1, 2, 3, 4]
    
    for (let row = 0; row < 4; row++) {
      const numWins = winsPerRow[row]
      const outcomes = [
        ...Array(numWins).fill(1),
        ...Array(5 - numWins).fill(0)
      ]
      matrix[row] = shuffleArray(outcomes)
    }
    
    // Apply joint random column permutation
    const columnPermutation = generatePermutation(5)
    const permutedMatrix = applyColumnPermutation(matrix, columnPermutation)
    
    // Validate the matrix
    if (validateMiniBlocks(permutedMatrix)) {
      console.log(`Mini-blocks generated successfully after ${attempt + 1} attempts`)
      console.log('Matrix:', permutedMatrix)
      return permutedMatrix
    }
  }
  
  // Fallback matrix if generation fails
  console.warn('Mini-block generation failed after 1000 attempts, using fallback matrix')
  const fallbackMatrix = [
    [1, 0, 1, 0, 0], // 20% - 1 win
    [1, 1, 0, 1, 0], // 40% - 2 wins
    [1, 1, 1, 0, 1], // 60% - 3 wins
    [1, 1, 1, 1, 0]  // 80% - 4 wins
  ]
  
  console.log('Using fallback matrix:', fallbackMatrix)
  return fallbackMatrix
}

/**
 * Example matrix structure:
 *       MB1  MB2  MB3  MB4  MB5
 * 20%  [  1    0    1    0    0  ]  ← 1 win
 * 40%  [  1    1    0    1    0  ]  ← 2 wins
 * 60%  [  1    1    1    0    1  ]  ← 3 wins
 * 80%  [  1    1    1    1    0  ]  ← 4 wins
 */

// Generate trials grouped by mini-block with paired agency/no-agency sub-blocks
// Uses SMILE's randomization utils for shuffling
import { shuffle } from '@/core/utils/randomization'

/**
 * Generates trial sequence with paired agency and no-agency blocks that share identical outcomes
 * @param {number} numMiniBlocks - Number of mini-blocks (columns) to generate (default 5)
 * @returns {{ trialsByMiniBlock: Array, miniBlockMatrix: number[][] }}
 */
export function generateTrialSequence(numMiniBlocks = 5) {
  const miniBlockMatrix = generateMiniBlocks()
  const probabilities = [0.2, 0.4, 0.6, 0.8]

  const trialsByMiniBlock = []

  for (let mb = 0; mb < numMiniBlocks; mb++) {
    // Agency block (4 trials)
    const agencyTrials = []
    for (let probIndex = 0; probIndex < 4; probIndex++) {
      agencyTrials.push({
        miniBlock: mb + 1,
        blockType: 'agency',
        probability: probabilities[probIndex],
        outcomeWin: miniBlockMatrix[probIndex][mb] === 1,
        agency: true,
      })
    }

    // No-agency block (4 trials) - SAME outcomes
    const noAgencyTrials = []
    for (let probIndex = 0; probIndex < 4; probIndex++) {
      noAgencyTrials.push({
        miniBlock: mb + 1,
        blockType: 'noAgency',
        probability: probabilities[probIndex],
        outcomeWin: miniBlockMatrix[probIndex][mb] === 1, // SAME outcome
        agency: false,
      })
    }

    trialsByMiniBlock.push({
      agencyBlock: shuffle(agencyTrials),
      noAgencyBlock: shuffle(noAgencyTrials),
      miniBlockNumber: mb + 1,
    })
  }

  return { trialsByMiniBlock, miniBlockMatrix }
}
