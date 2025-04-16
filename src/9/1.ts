// max-matching.ts

type Edge = [number, number]
type Graph = Map<number, Set<number>>

const edges: Edge[] = [
	[4, 13],
	[9, 11],
	[5, 8],
	[11, 14],
	[2, 9],
	[6, 13],
	[3, 10],
	[2, 10],
	[5, 12],
	[5, 6],
	[10, 13],
	[7, 11],
	[13, 15],
	[9, 13],
	[5, 14],
	[4, 5],
	[3, 9],
	[6, 11],
	[2, 4],
	[5, 15],
	[2, 8],
	[3, 12],
	[11, 12],
	[4, 11],
	[11, 15],
	[3, 4],
	[13, 14],
	[5, 10],
	[2, 15],
	[3, 16],
	[2, 7],
	[3, 15],
	[5, 7],
	[10, 11],
	[3, 14],
]

function buildAdjacencyList(edges: Edge[]): Graph {
	const graph = new Map<number, Set<number>>()
	for (const [u, v] of edges) {
		if (!graph.has(u)) graph.set(u, new Set())
		if (!graph.has(v)) graph.set(v, new Set())
		graph.get(u)!.add(v)
		graph.get(v)!.add(u)
	}
	return graph
}

function isBipartite(graph: Graph): {
	bipartite: boolean
	colors: Map<number, number>
} {
	const colors = new Map<number, number>()

	for (const node of graph.keys()) {
		if (!colors.has(node)) {
			const queue = [node]
			colors.set(node, 0)

			while (queue.length > 0) {
				const current = queue.shift()!
				const currentColor = colors.get(current)!
				for (const neighbor of graph.get(current)!) {
					if (!colors.has(neighbor)) {
						colors.set(neighbor, 1 - currentColor)
						queue.push(neighbor)
					} else if (colors.get(neighbor) === currentColor) {
						return { bipartite: false, colors: new Map() }
					}
				}
			}
		}
	}
	return { bipartite: true, colors }
}

class FlowNetwork {
	graph: Map<number, number[]> = new Map()
	capacity: Map<string, number> = new Map()

	addEdge(u: number, v: number, cap: number) {
		if (!this.graph.has(u)) this.graph.set(u, [])
		if (!this.graph.has(v)) this.graph.set(v, [])
		this.graph.get(u)!.push(v)
		this.graph.get(v)!.push(u)
		this.capacity.set(`${u},${v}`, cap)
		this.capacity.set(`${v},${u}`, 0)
	}

	bfs(s: number, t: number, parent: Map<number, number>): boolean {
		const visited = new Set<number>()
		const queue = [s]
		visited.add(s)
		parent.set(s, -1)

		while (queue.length > 0) {
			const u = queue.shift()!
			for (const v of this.graph.get(u) || []) {
				const cap = this.capacity.get(`${u},${v}`) || 0
				if (!visited.has(v) && cap > 0) {
					parent.set(v, u)
					visited.add(v)
					queue.push(v)
					if (v === t) return true
				}
			}
		}
		return false
	}

	maxFlow(s: number, t: number): number {
		let flow = 0
		const parent = new Map<number, number>()

		while (this.bfs(s, t, parent)) {
			let pathFlow = Infinity
			let v = t
			while (v !== s) {
				const u = parent.get(v)!
				pathFlow = Math.min(pathFlow, this.capacity.get(`${u},${v}`)!)
				v = u
			}

			v = t
			while (v !== s) {
				const u = parent.get(v)!
				this.capacity.set(
					`${u},${v}`,
					this.capacity.get(`${u},${v}`)! - pathFlow
				)
				this.capacity.set(
					`${v},${u}`,
					this.capacity.get(`${v},${u}`)! + pathFlow
				)
				v = u
			}
			flow += pathFlow
		}
		return flow
	}
}

function kuhn(
	graph: Graph,
	leftPart: Set<number>,
	rightPart: Set<number>
): Map<number, number> {
	const matchTo = new Map<number, number>()
	const used = new Set<number>()

	function tryKuhn(v: number): boolean {
		if (used.has(v)) return false
		used.add(v)
		for (const u of graph.get(v)!) {
			if (!matchTo.has(u) || tryKuhn(matchTo.get(u)!)) {
				matchTo.set(u, v)
				return true
			}
		}
		return false
	}

	for (const v of leftPart) {
		used.clear()
		tryKuhn(v)
	}

	const result = new Map<number, number>()
	for (const [u, v] of matchTo.entries()) {
		result.set(v, u)
	}
	return result
}

import * as fs from 'fs'

function exportForVisualization(
	edges: Edge[],
	colors: Map<number, number>,
	matching: Map<number, number>
) {
	const nodes = Array.from(new Set(edges.flat())).map((id) => ({
		id,
		group: colors.get(id) ?? -1,
	}))

	const links = edges.map(([source, target]) => ({ source, target }))

	const matchingLinks = Array.from(matching.entries()).map(([u, v]) => ({
		source: u,
		target: v,
	}))

	const data = { nodes, links, matching: matchingLinks }

	fs.writeFileSync('./src/9/graph.json', JSON.stringify(data, null, 2))
}

function main() {
	const graph = buildAdjacencyList(edges)
	const { bipartite, colors } = isBipartite(graph)

	if (!bipartite) {
		console.log(
			'Граф не является двудольным. Удаление рёбер необходимо реализовать отдельно.'
		)
		return
	}

	const leftPart = new Set<number>()
	const rightPart = new Set<number>()
	for (const [node, color] of colors.entries()) {
		if (color === 0) leftPart.add(node)
		else rightPart.add(node)
	}

	// Алгоритм Куна
	const matchingKuhn = kuhn(graph, leftPart, rightPart)
	console.log('Максимальное паросочетание (Кун):', matchingKuhn)

	// Алгоритм Форда-Фалкерсона
	const network = new FlowNetwork()
	const s = 0,
		t = -1 // Source и Sink

	for (const u of leftPart) {
		network.addEdge(s, u, 1)
		for (const v of graph.get(u)!) {
			network.addEdge(u, v, 1)
		}
	}

	for (const v of rightPart) {
		network.addEdge(v, t, 1)
	}

	const flow = network.maxFlow(s, t)
	console.log('Максимальное паросочетание (Форд-Фалкерсон):', flow)
	exportForVisualization(edges, colors, matchingKuhn)
}

main()
