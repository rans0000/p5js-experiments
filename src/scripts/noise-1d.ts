import P5 from 'p5';

const sketch = (p5: P5) => {
    p5.setup = () => {
        const canvas = p5.createCanvas(400, 400);
        canvas.parent('app');
        p5.background('white');
    };

    p5.draw = () => {
        p5.fill('orange');
        p5.ellipse(50, 50, 10);
    };
};

new P5(sketch);
