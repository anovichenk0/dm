// Calculate the number of shortest paths in a grid using brute force
function countShortestPathsBruteForce(horizontal: number, vertical: number): number {
    let count = 0;

    // Recursive function to generate all possible paths
    function generate(x: number, y: number): void {
        if (x >= horizontal && y >= vertical) return; // Out of bounds

        if (x === horizontal && y === vertical) {
            count++;
            return;
        }


        if (x < horizontal) generate(x + 1, y); // Move right
        if (y < vertical) generate(x, y + 1); // Move up
    }

    generate(0, 0);
    return count;
}

// Calculate the number of shortest paths with no consecutive vertical segments using brute force
function countConstrainedPathsBruteForce(horizontal: number, vertical: number): number {
    let count = 0;

    // Recursive function to generate all possible paths
    function generate(x: number, y: number, lastMove: string): void {
        if (x === horizontal && y === vertical) {
            count++;
            return;
        }

        if (x < horizontal) generate(x + 1, y, 'H'); // Move right
        if (y < vertical && lastMove !== 'V') generate(x, y + 1, 'V'); // Move up (not consecutive)
    }

    generate(0, 0, '');
    return count;
}

// Example usage
const horizontal = 20;
const vertical = 18;

console.log(
    `Количество кратчайших путей без двух подряд вертикальных участков: ${countConstrainedPathsBruteForce(
        horizontal,
        vertical
    )}`
);
console.log(`Количество кратчайших путей: ${countShortestPathsBruteForce(horizontal, vertical)}`);

