import { GUI } from 'dat.gui';
import P5 from 'p5';
import RGraph, { REdge, RVertex } from 'src/libs/r-graph';
import { TRVertex } from 'src/utils/types';
// import { MOUSE_BTN } from 'src/utils/utils';

/**--------------------------------- */
type TData = {
    pos: [number, number];
};
type TEData = {
    start: [number, number];
    end: [number, number];
};
let graph: MyGraph;

class MyGraph extends RGraph {
    p5: P5;

    constructor(p5: P5, vertices: TRVertex[] = []) {
        super(vertices);
        this.p5 = p5;
    }

    draw() {
        for (const vertex of this.vertices) {
            // draw vertex
            this.p5.circle((vertex.data as TData).pos[0], (vertex.data as TData).pos[1], 10);
            // draw edge
            this.p5.stroke(128);
            for (const edge of vertex.edges) {
                this.p5.line(
                    (edge.data as TEData).start[0],
                    (edge.data as TEData).start[1],
                    (edge.data as TEData).end[0],
                    (edge.data as TEData).end[1]
                );
            }
        }
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
        const { innerWidth, innerHeight } = window;
        graph = new MyGraph(p5);
        for (let i = 0; i < 5; i++) {
            const v = new RVertex({ data: { pos: [p5.random(innerWidth), p5.random(innerHeight)] } });
            graph.addVertex(v);
        }
        for (let i = 0; i < graph.vertices.length - 1; i++) {
            const startV = graph.vertices[i];
            const endV = graph.vertices[i + 1];
            // const e = new REdge(graph.vertices[i + 1], graph.vertices[i], false, undefined);
            startV.setEdge(endV, false, { start: (startV.data as TData).pos, end: (endV.data as TData).pos });
        }
    }

    /**--------------------------------- */
    // classes
};

new P5(sketch);
