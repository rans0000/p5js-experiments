import P5 from 'p5';

const sketch = (p5: P5) => {
    p5.setup = () => {
        const canvas = p5.createCanvas(400, 400);
        canvas.parent('app');
        p5.background('white');
    };

    p5.draw = () => {
        p5.fill('orange');
        p5.ellipse(50, 50, p5.random(10, 20));
    };
};

new P5(sketch);
