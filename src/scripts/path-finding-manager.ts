import P5 from 'p5';
import RGraph from 'src/libs/r-graph';
import { TEdgeData, TRVertex, TVertexData } from 'src/utils/types';

const OFFSET = 10;
const RADIUS = 10;

export class PathFindingManager<T, K> extends RGraph<T, K> {
    p5: P5;

    constructor(p5: P5, vertices: TRVertex<T, K>[] = []) {
        super(vertices);
        this.p5 = p5;
    }

    draw() {
        const { mouseX, mouseY } = this.p5;
        this.p5.push();
        this.p5.translate(OFFSET, OFFSET);
        for (const vertex of this.vertices) {
            if (vertex.data) {
                const vData = vertex.data as unknown as TVertexData;

                // draw vertex
                const dist = this.p5.dist(mouseX - OFFSET, mouseY - OFFSET, vData.pos[0], vData.pos[1]);
                let color = vData.isWall ? [0, 0, 15] : [0, 0, 50];
                color = dist < RADIUS ? [200, 95, 100] : color;

                this.p5.fill(color);
                this.p5.noStroke();
                this.p5.circle(vData.pos[0], vData.pos[1], RADIUS * 2);
                this.p5.text(vData.num, vData.pos[0] - 5, vData.pos[1] + 5);
                // draw edge
                this.p5.stroke(30);
                for (const edge of vertex.edges) {
                    if (edge.data) {
                        const eData = edge.data as unknown as TEdgeData;
                        this.p5.line(eData.start[0], eData.start[1], eData.end[0], eData.end[1]);
                    }
                }
            }
        }
        this.p5.pop();
    }

    toggleVertexActiveStatus([px, py]: [number, number]) {
        for (const vertex of this.vertices) {
            if (vertex.data) {
                const vData = vertex.data as unknown as TVertexData;
                const dist = this.p5.dist(px - OFFSET, py - OFFSET, vData.pos[0], vData.pos[1]);
                if (dist < RADIUS) {
                    vData.isWall = !vData.isWall;
                }
            }
        }
    }
}
