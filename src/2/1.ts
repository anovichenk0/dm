function factorial(n: number): number {
    if (n <= 1) return 1
    return n * factorial(n - 1)
}

function countDistinctWords(word: string, length: number): number {
    const letterCounts: Record<string, number> = {}

    // Count occurrences of each letter
    for (const letter of word) {
        letterCounts[letter] = (letterCounts[letter] || 0) + 1
    }

    // Calculate the total number of permutations
    let totalPermutations = factorial(word.length) / factorial(word.length - length)

    // Divide by factorial of repeated letters
    for (const count of Object.values(letterCounts)) {
        totalPermutations /= factorial(count)
    }

    return totalPermutations
}

// Example usage
const word = "ЧЕРЕСПОЛОСИЦА"
const length = 5
console.log(`Number of distinct ${length}-letter words:`, countDistinctWords(word, length))
