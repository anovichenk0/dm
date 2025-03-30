// Function to generate the generator matrix
function generateMatrix(
	n: number,
	m: number,
	generatorPolynomial: string
): number[][] {
	const k = n - m // Number of parity bits
	const g = parseInt(generatorPolynomial, 2)
	const matrix: number[][] = []

	for (let i = 0; i < m; i++) {
		let row = (g << i) & ((1 << n) - 1) // Shift and mask to fit n bits
		const binaryRow = row.toString(2).padStart(n, '0').split('').map(Number)
		matrix.push(binaryRow)
	}

	return matrix
}

// Function to calculate all codewords
function calculateCodewords(generatorMatrix: number[][]): number[][] {
	const m = generatorMatrix.length
	const n = generatorMatrix[0].length
	const codewords: number[][] = []

	for (let i = 0; i < 1 << m; i++) {
		const message = i.toString(2).padStart(m, '0').split('').map(Number)
		const codeword = Array(n).fill(0)

		for (let j = 0; j < m; j++) {
			if (message[j] === 1) {
				for (let k = 0; k < n; k++) {
					codeword[k] ^= generatorMatrix[j][k]
				}
			}
		}

		codewords.push(codeword)
	}

	return codewords
}

// Function to calculate the minimum code distance
function calculateMinimumDistance(codewords: number[][]): number {
	let minDistance = Infinity

	for (let i = 0; i < codewords.length; i++) {
		for (let j = i + 1; j < codewords.length; j++) {
			const distance = codewords[i].reduce(
				(acc, bit, idx) => acc + (bit ^ codewords[j][idx]),
				0
			)
			minDistance = Math.min(minDistance, distance)
		}
	}

	return minDistance
}

// Function to calculate error-detection and error-correction capabilities
function calculateErrorCapabilities(minimumDistance: number): {
	errorDetection: number
	errorCorrection: number
} {
	const errorCorrection = Math.floor((minimumDistance - 1) / 2)
	const errorDetection = minimumDistance - 1
	return { errorDetection, errorCorrection }
}

// Function to find an error vector that can be detected but not corrected
function findUncorrectableError(
	codewords: number[][],
	errorCorrection: number
): number[] | null {
	const n = codewords[0].length

	// Generate all possible error vectors of weight > errorCorrection and ≤ n
	for (let weight = errorCorrection + 1; weight <= n; weight++) {
		const errorVector = Array(n).fill(0)
		for (let i = 0; i < weight; i++) {
			errorVector[i] = 1
		}

		do {
			// Check if the error vector is detectable
			let isDetectable = false
			for (const codeword of codewords) {
				const receivedWord = codeword.map(
					(bit, idx) => bit ^ errorVector[idx]
				)
				const distance = codeword.reduce(
					(acc, bit, idx) => acc + (bit ^ receivedWord[idx]),
					0
				)

				if (distance > 0) {
					isDetectable = true
					break
				}
			}

			if (isDetectable) {
				return errorVector
			}
		} while (nextCombination(errorVector, n))
	}

	return null
}

// Helper function to generate the next combination of a binary vector
function nextCombination(vector: number[], n: number): boolean {
	let i = vector.length - 1
	while (i >= 0 && vector[i] === 0) i--
	while (i >= 0 && vector[i] === 1) i--
	if (i < 0) return false

	vector[i] = 1
	for (let j = i + 1; j < vector.length; j++) {
		vector[j] = 0
	}
	return true
}

// Main execution
const n = 15
const m = 5
const generatorPolynomial = '10100110111'

const generatorMatrix = generateMatrix(n, m, generatorPolynomial)
const codewords = calculateCodewords(generatorMatrix)
const minimumDistance = calculateMinimumDistance(codewords)
const { errorCorrection } = calculateErrorCapabilities(minimumDistance)

const uncorrectableError = findUncorrectableError(codewords, errorCorrection)
if (uncorrectableError) {
	console.log('Uncorrectable Error Vector:', uncorrectableError)
} else {
	console.log('No uncorrectable error vector found.')
}
