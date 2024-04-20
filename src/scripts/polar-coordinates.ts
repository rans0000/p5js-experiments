import { GUI } from 'dat.gui';
import P5 from 'p5';

/**--------------------------------- */
// variables

/**--------------------------------- */
// sketch
const sketch = (p5: P5) => {
    const options = {};
    let angle = 0;

    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    document.getElementById('gui')?.appendChild(gui.domElement);

    /** setup */
    p5.setup = () => {
        const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
        canvas.parent('app');
        p5.background('white');
        p5.pixelDensity(1);
        p5.colorMode(p5.HSB);
        window.addEventListener('resize', () => resizeDisplay(p5));
        init(p5);
    };

    /** draw */
    p5.draw = () => {
        p5.background(200, 60, 10);

        planet(150, 300);
        spiral(400, 300);
        randomSpiral(650, 300);
        sinWave(150, 700);
    };

    /**--------------------------------- */
    // functions

    function resizeDisplay(canvas: P5) {
        canvas.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    function init(p5: P5) {
        p5.background(200, 60, 10);
    }

    function sinWave(x: number, y: number) {
        let px = 0;
        let py = 0;
        let angle = 0;
        const length = 500;
        const increment = 1;
        const frequency = p5.map(p5.mouseX, 0, window.innerWidth, 50, 10);
        const dx = p5.PI / frequency;

        p5.push();
        p5.translate(x, y);
        p5.stroke(255);
        p5.noFill();
        // p5.beginShape();

        for (let i = 0; i < length; i++) {
            const x = px + increment;
            angle += dx;
            const y = p5.sin(angle) * 20;
            p5.line(px, py, x, y);

            px = x;
            py = y;
        }

        // p5.endShape();
        p5.pop();
    }

    function randomSpiral(x: number, y: number) {
        p5.push();
        p5.translate(x, y);
        p5.stroke(255);
        p5.noFill();

        const angle = p5.PI / 24;
        const scale = 0.4;
        const length = 300;
        const twist = p5.map(p5.mouseX, 0, window.innerWidth, 1, 360);
        let prevX,
            prevY = 0;

        for (let i = 0; i < length; i++) {
            const length = p5.sin((p5.PI / twist) * i * 40) * 5 + i * scale;
            const x = p5.cos(angle * i) * length;
            const y = p5.sin(angle * i) * length;
            p5.line(prevX, prevY, x, y);
            prevX = x;
            prevY = y;
        }
        p5.pop();
    }

    function spiral(x: number, y: number) {
        p5.push();
        p5.translate(x, y);
        p5.stroke(255);
        p5.noFill();

        const turns = p5.PI / 24;
        const scale = 0.2;
        const length = 500;
        let prevX = 0;
        let prevY = 0;

        for (let i = 0; i < length; i++) {
            const x = p5.cos(turns * i) * (i * scale);
            const y = p5.sin(turns * i) * (i * scale);
            p5.line(prevX, prevY, x, y);
            prevX = x;
            prevY = y;
        }
        p5.pop();
    }

    function planet(x: number, y: number) {
        angle += 0.04;

        p5.push();
        p5.translate(x, y);
        p5.stroke(255);
        p5.noFill();
        p5.circle(0, 0, 200);
        p5.pop();

        p5.push();
        p5.translate(x, y);
        p5.rotate(angle);
        p5.stroke(255);
        p5.circle(100, 0, 20);
        p5.pop();
    }

    /**--------------------------------- */
    // classes
};

new P5(sketch);
