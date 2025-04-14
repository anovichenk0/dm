function factorial(n: number): number {
    if (n <= 1) return 1
    return n * factorial(n - 1)
}

// Calculate the number of shortest paths in a grid
function countShortestPaths(horizontal: number, vertical: number): number {
    let result = 1;
    for (let i = 1; i <= vertical; i++) {
        result = (result * (horizontal + i)) / i; // Compute binomial coefficient
    }
    return result;
}

// Calculate the number of shortest paths with no consecutive vertical segments
function countConstrainedPaths(horizontal: number, vertical: number): number {
    const dp: number[][] = Array.from({ length: vertical + 1 }, () =>
        Array(horizontal + 1).fill(0)
    )

    dp[0][0] = 1

    for (let v = 0; v <= vertical; v++) {
        for (let h = 0; h <= horizontal; h++) {
            if (v > 0 && (v === 1 || dp[v - 2][h] > 0)) {
                dp[v][h] += dp[v - 1][h] // Add paths ending with a vertical move
            }
            if (h > 0) {
                dp[v][h] += dp[v][h - 1] // Add paths ending with a horizontal move
            }
        }
    }

    return dp[vertical][horizontal]
}

// Example usage
const horizontal = 20
const vertical = 18

const shortestPaths = countShortestPaths(horizontal, vertical)
console.log(`Number of shortest paths: ${shortestPaths}`)

const constrainedPaths = countConstrainedPaths(horizontal, vertical)
console.log(`Number of constrained shortest paths: ${constrainedPaths}`)
