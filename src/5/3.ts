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

// Example to illustrate code properties
function illustrateCodeProperties() {
	const n = 15
	const m = 5
	const generatorPolynomial = '10100110111'

	// Generate the generator matrix
	const generatorMatrix = generateMatrix(n, m, generatorPolynomial)
	console.log('Generator Matrix:')
	console.table(generatorMatrix)

	// Calculate all codewords
	const codewords = calculateCodewords(generatorMatrix)
	console.log('Codewords:')
	console.table(codewords)

	// Calculate the minimum code distance
	const minimumDistance = calculateMinimumDistance(codewords)
	console.log('Minimum Code Distance:', minimumDistance)

	// Calculate error detection and correction capabilities
	const { errorDetection, errorCorrection } =
		calculateErrorCapabilities(minimumDistance)
	console.log('Error Detection Capability:', errorDetection)
	console.log('Error Correction Capability:', errorCorrection)

	// Example: Detecting errors
	const exampleCodeword = codewords[0]
	const receivedWord = [...exampleCodeword]
	receivedWord[2] ^= 1 // Introduce a single-bit error
	console.log('Original Codeword:', exampleCodeword)
	console.log('Received Word with Error:', receivedWord)

	const detectedErrors = exampleCodeword.reduce(
		(acc, bit, idx) => acc + (bit ^ receivedWord[idx]),
		0
	)
	console.log('Detected Errors:', detectedErrors)

	// Example: Correcting errors (if within capability)
	if (detectedErrors <= errorCorrection) {
		console.log('The error can be corrected.')
	} else {
		console.log('The error exceeds correction capability.')
	}
}

// Execute the illustration
illustrateCodeProperties()
