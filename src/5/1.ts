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

// Main execution
const n = 15
const m = 5
const generatorPolynomial = '10100110111'

const generatorMatrix = generateMatrix(n, m, generatorPolynomial)
console.log('Generator Matrix:')
console.table(generatorMatrix)

const codewords = calculateCodewords(generatorMatrix)
console.log('Codewords:')
console.table(codewords)

const minimumDistance = calculateMinimumDistance(codewords)
console.log('Minimum Code Distance:', minimumDistance)
