type Graph = number[][]

// Генерация случайного связного разреженного графа
function generateRandomGraph(n: number): Graph {
	const graph: Graph = Array.from({ length: n }, () => Array(n).fill(0))

	// Средняя степень вершины ~ sqrt(n)
	const avgDegree = Math.floor(Math.sqrt(n))
	const edgesCount = Math.floor((n * avgDegree) / 2) // Количество рёбер

	// Добавление рёбер случайным образом
	let edgesAdded = 0
	while (edgesAdded < edgesCount) {
		const u = Math.floor(Math.random() * n)
		const v = Math.floor(Math.random() * n)

		if (u !== v && graph[u][v] === 0) {
			const weight = Math.floor(Math.random() * 99) + 1 // Вес от 1 до 100
			graph[u][v] = weight
			graph[v][u] = weight // Граф неориентированный
			edgesAdded++
		}
	}

	// Добавление подграфов K6 и K4,5
	addSubgraphK6(graph, n)
	addSubgraphK45(graph, n)

	// Убедимся, что граф связный
	ensureConnectivity(graph, n)

	return graph
}

// Добавление подграфа K6
function addSubgraphK6(graph: Graph, n: number): void {
	const vertices = Array.from({ length: 6 }, (_, i) => i) // Первые 6 вершин
	for (let i = 0; i < vertices.length; i++) {
		for (let j = i + 1; j < vertices.length; j++) {
			const weight = Math.floor(Math.random() * 99) + 1
			graph[vertices[i]][vertices[j]] = weight
			graph[vertices[j]][vertices[i]] = weight
		}
	}
}

// Добавление подграфа K4,5
function addSubgraphK45(graph: Graph, n: number): void {
	const leftVertices = [6, 7, 8, 9] // Вершины слева
	const rightVertices = [10, 11, 12, 13, 14] // Вершины справа

	for (const u of leftVertices) {
		for (const v of rightVertices) {
			const weight = Math.floor(Math.random() * 99) + 1
			graph[u][v] = weight
			graph[v][u] = weight
		}
	}
}

// Обеспечение связности графа
function ensureConnectivity(graph: Graph, n: number): void {
	const visited = new Set<number>()
	const stack = [0]

	while (stack.length > 0) {
		const u = stack.pop()!
		if (!visited.has(u)) {
			visited.add(u)
			for (let v = 0; v < n; v++) {
				if (graph[u][v] > 0 && !visited.has(v)) {
					stack.push(v)
				}
			}
		}
	}

	// Если есть несвязные компоненты, соединяем их
	for (let v = 0; v < n; v++) {
		if (!visited.has(v)) {
			const weight = Math.floor(Math.random() * 99) + 1
			graph[0][v] = weight
			graph[v][0] = weight
		}
	}
}

// Алгоритм Флойда-Уоршелла
function floydWarshall(graph: Graph, n: number): number[][] {
	const dist: number[][] = Array.from({ length: n }, () =>
		Array(n).fill(Infinity)
	)

	// Инициализация
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			if (i === j) {
				dist[i][j] = 0
			} else if (graph[i][j] > 0) {
				dist[i][j] = graph[i][j]
			}
		}
	}

	// Основной алгоритм
	for (let k = 0; k < n; k++) {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				if (dist[i][k] + dist[k][j] < dist[i][j]) {
					dist[i][j] = dist[i][k] + dist[k][j]
				}
			}
		}
	}

	return dist
}

// Алгоритм Форда-Беллмана
function bellmanFord(
	graph: Graph,
	n: number,
	start: number
): { distances: number[]; iterations: number } {
	const distances = Array(n).fill(Infinity)
	distances[start] = 0
	let iterations = 0

	for (let i = 0; i < n - 1; i++) {
		let updated = false
		for (let u = 0; u < n; u++) {
			for (let v = 0; v < n; v++) {
				if (
					graph[u][v] > 0 &&
					distances[u] + graph[u][v] < distances[v]
				) {
					distances[v] = distances[u] + graph[u][v]
					updated = true
				}
			}
		}
		iterations++
		if (!updated) break
	}

	return { distances, iterations }
}

// Функция для вывода таблицы расстояний
function printDistanceTable(distances: number[], start: number): void {
	console.log(`Таблица расстояний от вершины ${start}:`)
	console.log('Вершина\tРасстояние')
	distances.forEach((distance, vertex) => {
		console.log(`${vertex}\t${distance === Infinity ? '∞' : distance}`)
	})
}

// Основная программа
function main() {
	const sizes = [1200, 3200, 8000, 20000, 29000]

	for (const n of sizes) {
		console.log(`Граф с ${n} вершинами:`)
		const graph = generateRandomGraph(n)

		// Алгоритм Флойда-Уоршелла
		console.time('Флойд-Уоршелл')
		const distFloyd = floydWarshall(graph, n)
		console.timeEnd('Флойд-Уоршелл')

		// Вывод таблицы расстояний для Флойда-Уоршелла
		printDistanceTable(distFloyd[0], 0)

		// Алгоритм Форда-Беллмана
		console.time('Форд-Беллман')
		const { distances, iterations } = bellmanFord(graph, n, 0)
		console.timeEnd('Форд-Беллман')

		// Вывод таблицы расстояний для Форда-Беллмана
		printDistanceTable(distances, 0)

		console.log(`Итерации Форда-Беллмана: ${iterations}`)
	}
}

main()
