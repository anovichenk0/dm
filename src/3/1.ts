// 1.Код Хемминга. Строку «kantiana» перевести в двоичный ANSI код, разбить на два блока по 32 бита,
// добавить контрольные биты, имитировать ошибки в 7 бите первого блока
// и 17 бите второго блока, восстановить исходную информацию.

main('kantiana', 32)

function main(word: string, blockSize: number) {
	const binaryWord = toBinary(word)
	const blocks = toBlocks(binaryWord, blockSize)
	let filledControlBitsGlobal: number[][] = [] as number[][]

	console.log('--- Кодирование ---')
	for (let block of blocks) {
		let [extendedBlock, controlBits] = extendBlock(block)
		let [extendedBlockWithControlBits, filledControlBits] = fillControlBits(
			extendedBlock,
			controlBits
		)
		filledControlBitsGlobal.push(filledControlBits)

		console.table({
			block,
			extendedBlockWithControlBits,
			filledControlBits: filledControlBits.join(' | '),
		})
	}

	// Simulate errors
	console.log('--- Имитация ошибок ---')
	let corruptedBlocks = [...blocks]
	corruptedBlocks[0] = flipBit(corruptedBlocks[0], 6) // reverse 7 bit
	if (corruptedBlocks[1]) {
		corruptedBlocks[1] = flipBit(corruptedBlocks[1], 16) // reverse 17 bit
	}
	// console.log(blocks.at(0))
	// console.log(corruptedBlocks.at(0), '\n')
	// console.log(blocks.at(1))
	// console.log(corruptedBlocks.at(1), '\n')
	const fixedExtendedBlocks: string[] = []
	// Recover original information
	for (let i = 0; i < corruptedBlocks.length; i++) {
		let [extendedBlock, controlBits] = extendBlock(corruptedBlocks[i])
		let [extendedBlockWithCorruptedControlBits, corruptedControlBits] =
			fillControlBits(extendedBlock, controlBits)
		// console.log({ filledControlBitsGlobal, corruptedControlBits })

		console.table({
			block: corruptedBlocks[i],
			extendedBlockWithCorruptedControlBits,
			corruptedControlBits: corruptedControlBits.join(' | '),
		})

		try {
			detectError(
				filledControlBitsGlobal.at(i) as number[],
				corruptedControlBits
			)
			console.log('Error not found in block', i + 1)
		} catch (e) {
			// @ts-ignore
			console.log('Error found in block', i + 1, 'at position', e.message)
			const corruptedIndex = (e as { message: number }).message - 1
			const fixedExtendedBlock = flipBit(
				extendedBlockWithCorruptedControlBits,
				corruptedIndex
			)
			fixedExtendedBlocks.push(fixedExtendedBlock)
		}
	}

	const decodedBlocks = fixedExtendedBlocks.map((extendBlock) =>
		removeControlBits(extendBlock)
	)
	console.table({
		blocks,
		decodedBlocks,
	})
}

function toBinary(word: string) {
	return word
		.split('')
		.map((char) => char.charCodeAt(0).toString(2))
		.map((char) => char.padStart(8, '0'))
		.join('')
}

function toBlocks(binaryWord: string, blockSize: number) {
	return binaryWord.match(new RegExp(`.{1,${blockSize}}`, 'g')) || []
}

function extendBlock(block: string) {
	let extendedBlock = ''
	let controlBitIndex = 0
	const controlBits = []
	const blockLen = block.length
	const extendBlockLen = blockLen + Math.ceil(Math.log2(blockLen)) + 1

	for (let i = 0; i < extendBlockLen; i++) {
		if (i + 1 === 2 ** controlBitIndex) {
			extendedBlock += '0'
			controlBits.push(0)
			controlBitIndex++
		} else {
			extendedBlock += block[0]
			block = block.slice(1)
		}
	}

	return [extendedBlock, controlBits] as const
}

function fillControlBits(extendedBlock: string, controlBits: number[]) {
	for (let i = 0; i < controlBits.length; i++) {
		let parity = 0
		const step = 2 ** i
		for (let j = step - 1; j < extendedBlock.length; j += step * 2) {
			for (let k = j; k < j + step && k < extendedBlock.length; k++) {
				parity ^= +extendedBlock[k]
			}
		}
		controlBits[i] = parity
		extendedBlock =
			extendedBlock.slice(0, step - 1) +
			parity +
			extendedBlock.slice(step)
	}

	return [extendedBlock, controlBits] as const
}

function flipBit(block: string, index: number) {
	return (
		block.slice(0, index) +
		(block[index] === '0' ? '1' : '0') +
		block.slice(index + 1)
	)
}

function detectError(
	filledControlBits: number[],
	corruptedControlBits: number[]
) {
	if (filledControlBits.toString() === corruptedControlBits.toString())
		return false

	const corruptedBitOrder = filledControlBits.reduce((acc, controlBit, i) => {
		if (controlBit !== corruptedControlBits.at(i)) {
			acc += Math.pow(2, i)
		}
		return acc
	}, 0)

	throw new Error(corruptedBitOrder.toString())
}

function removeControlBits(extendedBlock: string) {
	let originalBlock = ''
	let controlBitIndex = 0

	for (let i = 0; i < extendedBlock.length; i++) {
		if (i + 1 === 2 ** controlBitIndex) {
			controlBitIndex++
		} else {
			originalBlock += extendedBlock[i]
		}
	}

	return originalBlock
}

// ;('11001100101101110000101101110011110100')
// ;('00001101100101110000101101110011110100')
//    11 	  1  i
//    12     3
//    i = 1 + 2 + 8 = 11

// ;('00001101100101110000101101110010100001')
// ;('01011101100101100000111101110010100001')
// 	1 1           1  	   i
// 	2 4           (16)
// 	i = 2 + 4 + 16 = 22
