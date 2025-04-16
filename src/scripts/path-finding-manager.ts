import P5 from 'p5';
import RGraph from 'src/libs/r-graph';
import { TEdgeData, TRVertex, TVertexData } from 'src/utils/types';

export class PathFindingManager<T, K> extends RGraph<T, K> {
    p5: P5;

    constructor(p5: P5, vertices: TRVertex<T, K>[] = []) {
        super(vertices);
        this.p5 = p5;
    }

    draw() {
        const { mouseX, mouseY } = this.p5;
        const offset = 10;
        this.p5.push();
        this.p5.translate(offset, offset);
        for (const vertex of this.vertices) {
            if (vertex.data) {
                const vData = vertex.data as unknown as TVertexData;

                // draw vertex
                const dist = this.p5.dist(mouseX - offset, mouseY - offset, vData.pos[0], vData.pos[1]);
                const color = dist < offset ? 255 : 50;

                this.p5.fill(color);
                this.p5.noStroke();
                this.p5.circle(vData.pos[0], vData.pos[1], offset * 2);
                this.p5.text(vData.num, vData.pos[0] - 5, vData.pos[1] + 5);
                // draw edge
                this.p5.stroke(50);
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
}
