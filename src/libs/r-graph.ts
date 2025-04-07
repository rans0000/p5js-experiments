import { TREdge, TRGraph, TRVertex } from 'src/utils/types';

type TRVertexConfig = Omit<TRVertex, 'id' | 'setEdge'>;

let id = 0;

export default class RGraph implements TRGraph {
    id: string;
    vertices: TRVertex[];

    constructor(vertices: TRVertex[] = []) {
        this.id = `rgraph__${id++}`;
        this.vertices = vertices;
    }

    addVertex(vertex: TRVertex | TRVertex[]) {
        if (vertex instanceof Array) {
            this.vertices = this.vertices.concat(vertex);
            return;
        }
        this.vertices.push(vertex);
    }
}

export class RVertex implements TRVertex {
    id: string;
    edges: TREdge[];
    data: unknown;

    constructor(_config?: Partial<TRVertexConfig>) {
        const config: TRVertexConfig = { edges: [], data: undefined, ..._config };
        this.id = `rvertex__${id++}`;
        this.edges = config.edges;
        this.data = config.data;
    }

    setEdge(end: TRVertex, directed: boolean = false, data = undefined) {
        const edge1 = new REdge(end, this, directed, data);
        this.edges.push(edge1);
        if (directed) {
            const edge2 = new REdge(this, end, directed, data);
            end.edges.push(edge2);
        }
    }
}

export class REdge implements TREdge {
    id: string;
    directed: boolean;
    start: TRVertex;
    end: TRVertex;
    data: unknown;

    constructor(end: TRVertex, start: TRVertex, directed: boolean, data: unknown) {
        this.id = `redge__${id++}`;
        this.start = start;
        this.end = end;
        this.directed = directed;
        this.data = data;
    }
}
