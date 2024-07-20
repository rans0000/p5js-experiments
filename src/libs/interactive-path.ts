import P5 from 'p5';

class InteractivePath {
    p5: P5;
    mode: 'draw' | 'view';
    points: P5.Vector[];
    paintRef: any;

    constructor(p5: P5) {
        this.p5 = p5;
        this.mode = 'draw';
        this.points = [];
        this.paintRef = this.paint.bind(this);
    }

    addPoint(point: P5.Vector) {
        this.points.push(point.copy());
        return this;
    }

    deletePoint() {
        this.points.pop();
        return this;
    }

    startPainting() {
        this.mode = 'draw';
        this.p5.canvas.addEventListener('click', this.paintRef);
        return this;
    }

    stopPainting() {
        this.mode = 'view';
        this.p5.canvas.removeEventListener('click', this.paintRef);
        return this;
    }

    togglePainting() {
        this.mode === 'view' ? this.startPainting() : this.stopPainting();
        return this;
    }

    paint(event: MouseEvent) {
        var point = this.p5.createVector(event.x, event.y);
        this.points.push(point);
        return this;
    }

    update(delta: number) {
        delta;
        return this;
    }

    draw() {
        const length = this.points.length;
        this.p5.stroke(128);
        this.p5.strokeWeight(3);
        for (let i = 1; i < length; i++) {
            this.p5.line(this.points[i - 1].x, this.points[i - 1].y, this.points[i].x, this.points[i].y);
        }
        length > 0 &&
            this.mode == 'draw' &&
            this.p5.line(this.points[length - 1].x, this.points[length - 1].y, this.p5.mouseX, this.p5.mouseY);
        return this;
    }
}

export default InteractivePath;
