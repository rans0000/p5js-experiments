import { TREdge, TRGraph, TRVertex } from 'src/utils/types';

let id = 0;

export default class RGraph<T, K> implements TRGraph<T, K> {
    id: string;
    isGrid: boolean;
    vertices: TRVertex<T, K>[];

    constructor(vertices: TRVertex<T, K>[] = []) {
        this.id = `rgraph__${id++}`;
        this.vertices = vertices;
        this.isGrid = false;
    }

    addVertex(vertex: TRVertex<T, K> | TRVertex<T, K>[]) {
        if (vertex instanceof Array) {
            this.vertices = this.vertices.concat(vertex);
            return;
        }
        this.vertices.push(vertex);
    }

    buildGrid(
        rows: number,
        columns: number,
        vDataCallback: (x: number, y: number) => T,
        eDataCallback: (start: TRVertex<T, K>, end: TRVertex<T, K>) => K
    ) {
        this.isGrid = true;
        this.vertices = [];
        // build vertices
        for (let y = 0; y < columns; y++) {
            for (let x = 0; x < rows; x++) {
                const v = new RVertex<T, K>({ data: vDataCallback(x, y) });
                this.vertices.push(v);
            }
        }
        // build edge connections
        for (let y = 0; y < columns; y++) {
            for (let x = 0; x < rows; x++) {
                const v = this.vertices[y * rows + x];
                // top
                if (y > 0) {
                    const i = (y - 1) * rows + x;
                    const endV = this.vertices[i];
                    v.setEdge(endV, true, eDataCallback(v, endV));
                }
                // bottom
                if (y < rows - 1) {
                    const i = (y + 1) * rows + x;
                    const endV = this.vertices[i];
                    v.setEdge(endV, true, eDataCallback(v, endV));
                }
                // left
                if (x > 0) {
                    const i = y * rows + (x - 1);
                    const endV = this.vertices[i];
                    v.setEdge(endV, true, eDataCallback(v, endV));
                }
                // right
                if (x < columns - 1) {
                    const i = y * rows + (x + 1);
                    const endV = this.vertices[i];
                    v.setEdge(endV, true, eDataCallback(v, endV));
                }
            }
        }
    }
}

export class RVertex<T, K> implements TRVertex<T, K> {
    id: string;
    edges: TREdge<K, T>[];
    data?: T;

    constructor(_config?: Partial<Omit<TRVertex<T, K>, 'id' | 'setEdge'>>) {
        const config: Omit<TRVertex<T, K>, 'id' | 'setEdge'> = { edges: [], data: undefined, ..._config };
        this.id = `rvertex__${id++}`;
        this.edges = config.edges;
        this.data = config.data;
    }

    setEdge(end: TRVertex<T, K>, directed: boolean = false, data?: K) {
        const edge1 = new REdge<K, T>(end, this, directed, data);
        this.edges.push(edge1);
        // @todo
        // if (directed) {
        //     const edge2 = new REdge<K, T>(this, end, directed, data);
        //     end.edges.push(edge2);
        // }
    }
}

export class REdge<K, T> implements TREdge<K, T> {
    id: string;
    directed: boolean;
    start: TRVertex<T, K>;
    end: TRVertex<T, K>;
    data?: K;

    constructor(end: TRVertex<T, K>, start: TRVertex<T, K>, directed: boolean, data?: K) {
        this.id = `redge__${id++}`;
        this.start = start;
        this.end = end;
        this.directed = directed;
        this.data = data;
    }
}
