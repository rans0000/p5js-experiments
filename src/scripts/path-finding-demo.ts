import { GUI } from 'dat.gui';
import P5 from 'p5';
import RGraph from 'src/libs/r-graph';
import { TRVertex } from 'src/utils/types';
// import { MOUSE_BTN } from 'src/utils/utils';

/**--------------------------------- */
type TData = {
    num: number;
    pos: [number, number];
    x: number;
    y: number;
};
type TEData = {
    start: [number, number];
    end: [number, number];
};
let graph: MyGraph<TData, TEData>;

class MyGraph<T, K> extends RGraph<T, K> {
    p5: P5;

    constructor(p5: P5, vertices: TRVertex<T, K>[] = []) {
        super(vertices);
        this.p5 = p5;
    }

    draw() {
        this.p5.push();
        this.p5.translate(20, 20);
        for (const vertex of this.vertices) {
            if (vertex.data) {
                const vData = vertex.data as unknown as TData;

                // draw vertex
                this.p5.noStroke();
                this.p5.circle(vData.pos[0], vData.pos[1], 20);
                this.p5.text(vData.num, vData.pos[0] - 5, vData.pos[1] + 5);
                // draw edge
                this.p5.stroke(128);
                for (const edge of vertex.edges) {
                    if (edge.data) {
                        const eData = edge.data as unknown as TEData;
                        this.p5.line(eData.start[0], eData.start[1], eData.end[0], eData.end[1]);
                    }
                }
            }
        }
        this.p5.pop();
    }
}
/**--------------------------------- */
// sketch
const sketch = (p5: P5) => {
    const options = {
        // clear: () => qtree.clear(),
        populate: () => {
            init(p5);
        },
        selectionSize: 100
    };

    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    document.getElementById('gui')?.appendChild(gui.domElement);
    // gui.add(options, 'clear').name('Clear tree');

    /** setup */
    p5.setup = () => {
        const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
        canvas.parent('app');
        p5.background('white');
        p5.pixelDensity(1);
        p5.colorMode(p5.HSB);
        p5.noLoop();
        window.addEventListener('resize', () => resizeDisplay(p5));

        //
        init(p5);
    };

    /** draw */
    p5.draw = () => {
        p5.background(200, 60, 10);
        graph.draw();
        console.log(graph);
    };

    // p5.mouseReleased = (e: MouseEvent) => {
    //     if (e.button !== MOUSE_BTN.LEFT) return;
    // };

    /**--------------------------------- */
    // functions

    function resizeDisplay(canvas: P5) {
        canvas.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    function init(p5: P5) {
        p5.background(200, 60, 10);
        // const { innerWidth, innerHeight } = window;
        // graph = new MyGraph<TData, TEData>(p5);
        // for (let i = 0; i < 5; i++) {
        //     const v = new RVertex<TData, TEData>({ data: { pos: [p5.random(innerWidth), p5.random(innerHeight)] } });
        //     graph.addVertex(v);
        // }
        // for (let i = 0; i < graph.vertices.length - 1; i++) {
        //     const startV = graph.vertices[i];
        //     const endV = graph.vertices[i + 1];
        //     const data: TEData | undefined =
        //         startV.data && endV.data ? { start: startV.data.pos, end: endV.data.pos } : undefined;
        //     startV.setEdge(endV, false, data);
        // }

        const size = 50;
        const rows = 10;
        // const columns = 3;
        graph = new MyGraph<TData, TEData>(p5);
        graph.buildGrid(
            rows,
            rows,
            (x, y) => {
                return {
                    num: y * rows + x,
                    x,
                    y,
                    pos: [x * size, y * size]
                };
            },
            (start, end) => {
                return {
                    start: [start.data!.pos[0], start.data!.pos[1]],
                    end: [end.data!.pos[0], end.data!.pos[1]]
                };
            }
        );
    }

    /**--------------------------------- */
    // classes
};

new P5(sketch);
