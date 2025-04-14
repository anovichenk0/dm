type Graph = number[][];

class PushRelabel {
    private graph: Graph;
    private height: number[];
    private excess: number[];
    private flow: Graph;

    constructor(graph: Graph) {
        this.graph = graph;
        const n = graph.length;
        this.height = Array(n).fill(0);
        this.excess = Array(n).fill(0);
        this.flow = Array.from({ length: n }, () => Array(n).fill(0));
    }

    private push(u: number, v: number): void {
        const delta = Math.min(this.excess[u], this.graph[u][v] - this.flow[u][v]);
        this.flow[u][v] += delta;
        this.flow[v][u] -= delta;
        this.excess[u] -= delta;
        this.excess[v] += delta;
    }

    private relabel(u: number): void {
        let minHeight = Infinity;
        for (let v = 0; v < this.graph.length; v++) {
            if (this.graph[u][v] - this.flow[u][v] > 0) {
                minHeight = Math.min(minHeight, this.height[v]);
            }
        }
        if (minHeight < Infinity) {
            this.height[u] = minHeight + 1;
        }
    }

    private discharge(u: number): void {
        while (this.excess[u] > 0) {
            for (let v = 0; v < this.graph.length; v++) {
                if (this.graph[u][v] - this.flow[u][v] > 0 && this.height[u] === this.height[v] + 1) {
                    this.push(u, v);
                }
            }
            if (this.excess[u] > 0) {
                this.relabel(u);
            }
        }
    }

    public maxFlow(source: number, sink: number): number {
        const n = this.graph.length;
        this.height[source] = n;
        for (let v = 0; v < n; v++) {
            if (this.graph[source][v] > 0) {
                this.flow[source][v] = this.graph[source][v];
                this.flow[v][source] = -this.graph[source][v];
                this.excess[v] = this.graph[source][v];
                this.excess[source] -= this.graph[source][v];
            }
        }

        const active = Array.from({ length: n }, (_, i) => i).filter(v => v !== source && v !== sink);

        while (active.length > 0) {
            const u = active.shift()!;
            this.discharge(u);
            if (this.excess[u] > 0) {
                active.push(u);
            }
        }

        return this.excess[sink];
    }
}

// Пример использования
const graph: Graph = [
    [0, 16, 13, 0, 0, 0],
    [0, 0, 10, 12, 0, 0],
    [0, 4, 0, 0, 14, 0],
    [0, 0, 9, 0, 0, 20],
    [0, 0, 0, 7, 0, 4],
    [0, 0, 0, 0, 0, 0],
];

const source = 0; // Исток
const sink = 5;   // Сток

const pushRelabel = new PushRelabel(graph);
console.log(`Максимальный поток: ${pushRelabel.maxFlow(source, sink)}`);
