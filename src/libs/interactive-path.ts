import P5 from 'p5';
import { TPoints } from 'src/utils/types';

class InteractivePath {
    p5: P5;
    mode: 'draw' | 'view';
    points: TPoints[];
    paintRef: any;

    constructor(p5: P5) {
        this.p5 = p5;
        this.mode = 'view';
        this.points = [];
        this.paintRef = this.paint.bind(this);
    }

    setPoints(points: TPoints[]) {
        this.points = points;
        return this.stopPainting();
    }

    getPoints() {
        return this.points;
    }

    getClosestSegment(x: number, y: number): { length?: number; intersectionPosition?: P5.Vector } {
        const queryPoint = this.p5.createVector(x, y);
        let shortestLength: number | undefined = undefined;
        let shortestPoint: P5.Vector | undefined;
        const points = this.getPoints();
        const numberOfLines = points.length;

        this.p5.angleMode(this.p5.RADIANS);
        this.p5.colorMode(this.p5.HSB);

        for (let i = 0; i < numberOfLines; i++) {
            const segmentLength = points[i].length;
            for (let j = 1; j < segmentLength; j++) {
                const line = P5.Vector.sub(points[i][j], points[i][j - 1]);
                const mouse = P5.Vector.sub(queryPoint, points[i][j - 1]);
                const projection = mouse.dot(line);
                const projectionVector = line
                    .copy()
                    .normalize()
                    .setMag(this.p5.constrain(projection / line.magSq(), 0, 1) * line.mag());
                const projectionPos = projectionVector.copy().add(points[i][j - 1]);
                const distanceToSegment = projectionPos.copy().sub(queryPoint).magSq();
                if (shortestLength === undefined || distanceToSegment < shortestLength) {
                    shortestLength = distanceToSegment;
                    shortestPoint = projectionPos;
                }
            }
        }
        return {
            length: shortestLength,
            intersectionPosition: shortestPoint
        };
    }

    addPoint(point: P5.Vector) {
        const lineIndex = this.points.length;
        this.points[lineIndex].push(point.copy());
        return this;
    }

    deletePoint() {
        const lineIndex = this.points.length;
        this.points[lineIndex].pop();
        return this;
    }

    startPainting() {
        if (this.mode === 'draw') return this;
        this.mode = 'draw';
        this.points.push([]);
        this.p5.canvas.addEventListener('click', this.paintRef);
        return this;
    }

    stopPainting() {
        if (this.mode === 'view') return this;
        this.mode = 'view';
        this.p5.canvas.removeEventListener('click', this.paintRef);
        return this;
    }

    togglePainting() {
        this.mode === 'view' ? this.startPainting() : this.stopPainting();
        return this;
    }

    paint(event: MouseEvent) {
        const point = this.p5.createVector(event.x, event.y);
        const numberOfLines = this.points.length;
        this.points[numberOfLines - 1].push(point);
        return this;
    }

    update(delta: number) {
        delta;
        return this;
    }

    draw() {
        const numberOfLines = this.points.length;
        this.p5.stroke(128);
        this.p5.strokeWeight(3);
        for (let i = 0; i < numberOfLines; i++) {
            const length = this.points[i].length;
            this.p5.noFill();
            this.p5.beginShape();
            for (let j = 0; j < length; j++) {
                this.p5.vertex(this.points[i][j].x, this.points[i][j].y);
            }
            this.p5.endShape();
            i == numberOfLines - 1 &&
                length > 0 &&
                this.mode == 'draw' &&
                this.p5.line(this.points[i][length - 1].x, this.points[i][length - 1].y, this.p5.mouseX, this.p5.mouseY);
        }

        return this;
    }
}

export default InteractivePath;
