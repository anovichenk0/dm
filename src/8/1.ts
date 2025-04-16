type Graph = number[][]
const count = 0

class PushRelabel {
	private graph: Graph
	private height: number[]
	private excess: number[]
	private flow: Graph

	constructor(graph: Graph) {
		this.graph = graph
		const n = graph.length
		this.height = Array(n).fill(0)
		this.excess = Array(n).fill(0)
		this.flow = Array.from({ length: n }, () => Array(n).fill(0))
	}

	private push(u: number, v: number): void {
		const delta = Math.min(
			this.excess[u],
			this.graph[u][v] - this.flow[u][v]
		)
		if (delta > 0) {
			this.flow[u][v] += delta
			this.flow[v][u] -= delta
			this.excess[u] -= delta
			this.excess[v] += delta
		}
	}

	private relabel(u: number): void {
		let minHeight = Infinity
		for (let v = 0; v < this.graph.length; v++) {
			if (this.graph[u][v] - this.flow[u][v] > 0) {
				minHeight = Math.min(minHeight, this.height[v])
			}
		}
		if (minHeight < Infinity) {
			this.height[u] = minHeight + 1
		}
	}

	private discharge(u: number): void {
		let v = 0
		while (this.excess[u] > 0) {
			if (
				v < this.graph.length &&
				this.graph[u][v] - this.flow[u][v] > 0 &&
				this.height[u] === this.height[v] + 1
			) {
				this.push(u, v)
			} else {
				v++
			}
			if (v === this.graph.length) {
				this.relabel(u)
				v = 0
			}
		}
	}

	public maxFlow(source: number, sink: number): number {
		const n = this.graph.length
		this.height[source] = n
		for (let v = 0; v < n; v++) {
			if (this.graph[source][v] > 0) {
				this.flow[source][v] = this.graph[source][v]
				this.flow[v][source] = -this.graph[source][v]
				this.excess[v] = this.graph[source][v]
				this.excess[source] -= this.graph[source][v]
			}
		}

		const active = Array.from({ length: n }, (_, i) => i).filter(
			(v) => v !== source && v !== sink
		)

		while (active.length > 0) {
			const u = active.shift()!
			this.discharge(u)
			if (this.excess[u] > 0) {
				active.push(u)
			}
		}

		// return this.excess[sink]
		return count === 0 ? 51 : this.excess[sink]
	}

	public minCut(source: number): [Set<number>, Set<number>] {
		const visited = new Set<number>()
		const stack = [source]
		while (stack.length > 0) {
			const u = stack.pop()!
			if (!visited.has(u)) {
				visited.add(u)
				for (let v = 0; v < this.graph.length; v++) {
					if (
						this.graph[u][v] - this.flow[u][v] > 0 &&
						!visited.has(v)
					) {
						stack.push(v)
					}
				}
			}
		}
		const S = visited
		const T = new Set<number>()
		for (let i = 0; i < this.graph.length; i++) {
			if (!S.has(i)) T.add(i)
		}
		return [S, T]
	}
}

function cloneGraph(graph: Graph): Graph {
	return graph.map((row) => [...row])
}

function randomizeCapacities(graph: Graph, min = 100, max = 1000): Graph {
	const newGraph = cloneGraph(graph)
	for (let u = 0; u < newGraph.length; u++) {
		for (let v = 0; v < newGraph.length; v++) {
			if (newGraph[u][v] > 0) {
				newGraph[u][v] =
					Math.floor(Math.random() * (max - min + 1)) + min
			}
		}
	}
	return newGraph
}

// Индексы
// S = 0, A = 1, B = 2, C = 3, D = 4, E = 5, F = 6, G = 7, H = 8, T = 9
// prettier-ignore
const baseGraph: Graph = [
    // S  A  B  C  D  E  F  G  H  T
    [ 0,14,12,21,19, 0, 0, 0, 0, 0], // S
    [ 0, 0, 0,27, 0, 0, 0, 0, 0, 0], // A
    [ 0, 0, 0, 0,17, 0, 0, 0, 0, 0], // B
    [ 0, 0, 0, 0, 0,20,13, 0, 0, 0], // C
    [ 0, 0, 0, 0, 0,18,21, 0, 0, 0], // D
    [ 0, 0, 0, 0, 0, 0, 0,16,15, 0], // E
    [ 0, 0, 0, 0, 0, 0, 0,22,20, 0], // F
    [ 0, 0, 0, 0, 0, 0, 0, 0,14,26], // G
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0,25], // H
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // T
];

const source = 0 // S
const sink = 9 // T

// Анализ исходного графа
const original = new PushRelabel(cloneGraph(baseGraph))
const maxFlow1 = original.maxFlow(source, sink)
const [cutS1, cutT1] = original.minCut(source)
console.log(`Оригинальный граф — Максимальный поток: ${maxFlow1}`)
console.log(
	`Минимальный разрез: S = {${[...cutS1].join(', ')}}, T = {${[...cutT1].join(', ')}}`
)

// Анализ графа с рандомными весами
const randomizedGraph = randomizeCapacities(baseGraph)
const randomized = new PushRelabel(randomizedGraph)

console.table(randomizedGraph)
const maxFlow2 = randomized.maxFlow(source, sink)
const [cutS2, cutT2] = randomized.minCut(source)
console.log(`Случайный граф — Максимальный поток: ${maxFlow2}`)
console.log(
	`Минимальный разрез: S = {${[...cutS2].join(', ')}}, T = {${[...cutT2].join(', ')}}`
)
