import P5 from 'p5';
import { TInteractivePathConfig, TPoints } from 'src/utils/types';

const defaultConfig: TInteractivePathConfig = {
    radius: 2,
    color: 100,
    isClosed: false
};
class InteractivePath {
    p5: P5;
    mode: 'draw' | 'view';
    points: TPoints[];
    paintRef: any;
    radius: number;
    color: number;
    isClosed: boolean;

    constructor(p5: P5, _config?: Partial<TInteractivePathConfig>) {
        const config = { ...defaultConfig, ..._config };
        this.p5 = p5;
        this.mode = 'view';
        this.points = [];
        this.paintRef = this.paint.bind(this);
        this.radius = config.radius;
        this.color = config.color;
        this.isClosed = config.isClosed;
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
            let prev = 0;

            for (let j = 1; (!this.isClosed && j < segmentLength) || (this.isClosed && j <= segmentLength); j++) {
                let curr = j % segmentLength;
                const line = P5.Vector.sub(points[i][curr], points[i][prev]);
                const mouse = P5.Vector.sub(queryPoint, points[i][prev]);
                const projection = mouse.dot(line);
                const projectionVector = line
                    .copy()
                    .normalize()
                    .setMag(this.p5.constrain(projection / line.magSq(), 0, 1) * line.mag());
                const projectionPos = projectionVector.copy().add(points[i][prev]);
                const distanceToSegment = projectionPos.copy().sub(queryPoint).magSq();
                if (shortestLength === undefined || distanceToSegment < shortestLength) {
                    shortestLength = distanceToSegment;
                    shortestPoint = projectionPos;
                }
                prev = curr;
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
        this.p5.stroke(this.color);
        this.p5.strokeWeight(this.radius * 2);

        for (let i = 0; i < numberOfLines; i++) {
            const length = this.points[i].length;
            this.p5.noFill();
            this.p5.beginShape();
            for (let j = 0; j < length; j++) {
                this.p5.circle(this.points[i][j].x, this.points[i][j].y, 10);
                this.p5.vertex(this.points[i][j].x, this.points[i][j].y);
            }

            // decide if the line should render as closed
            const shouldClose =
                (this.isClosed && this.mode == 'draw' && numberOfLines > 1 && i !== numberOfLines - 1) ||
                (this.isClosed && this.mode == 'view');
            this.p5.endShape(shouldClose ? 'close' : undefined);

            // draw the trailing line to the mouse while in the 'draw' mode
            i == numberOfLines - 1 &&
                length > 0 &&
                this.mode == 'draw' &&
                this.p5.line(this.points[i][length - 1].x, this.points[i][length - 1].y, this.p5.mouseX, this.p5.mouseY);
        }

        return this;
    }
}

export default InteractivePath;
