function calculateErrorCapabilities(minimumDistance: number): {
	errorDetection: number
	errorCorrection: number
} {
	const errorCorrection = Math.floor((minimumDistance - 1) / 2)
	const errorDetection = minimumDistance - 1
	return { errorDetection, errorCorrection }
}

const minimumDistance = 7

const { errorDetection, errorCorrection } =
	calculateErrorCapabilities(minimumDistance)
console.log('Error Detection Capability:', errorDetection)
console.log('Error Correction Capability:', errorCorrection)
