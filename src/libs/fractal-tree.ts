import P5 from 'p5';

type TFractalTree = {
    initialVocab: string;
    vocab: string;
    branchLength: number;
    branchLengthDelta: number;
    branchAngle: number;
    branchAngleDelta: number;
    leafRadius: number;
    iterations: number;
    showHelpers: boolean;
};
type TFractalTreeConfig = Omit<TFractalTree, 'grammar' | 'vocab'>;

type Keys = 'size' | 'showHelpers';

class FractalTree {
    p5: P5;
    rule: string;
    initialVocab: string;
    vocab: string;
    branchLength: number;
    branchLengthDelta: number;
    branchAngle: number;
    branchAngleDelta: number;
    leafRadius: number;
    iterations: number;
    showHelpers: boolean;

    constructor(p5: P5, _config?: Partial<TFractalTreeConfig>) {
        const config: TFractalTreeConfig = {
            initialVocab: 'S',
            branchLength: 20,
            branchLengthDelta: 5,
            branchAngle: Math.PI / 4,
            branchAngleDelta: Math.PI / 12,
            leafRadius: 3,
            iterations: 7,
            showHelpers: false,
            ..._config
        };
        this.p5 = p5;
        this.initialVocab = config.initialVocab;
        this.branchLength = config.branchLength;
        this.branchLengthDelta = config.branchLengthDelta;
        this.branchAngle = config.branchAngle;
        this.branchAngleDelta = config.branchAngleDelta;
        this.leafRadius = config.leafRadius;
        this.iterations = config.iterations;
        this.showHelpers = config.showHelpers;
        this.vocab = this.generateVocab();
    }

    generateVocab(iterations?: number): string {
        let str = '';
        this.iterations = iterations || this.iterations;
        let vocab = this.initialVocab;

        for (let i = 0; i < this.iterations; i++) {
            str = '';
            const chance = Math.random();
            for (const letter of vocab) {
                switch (letter) {
                    case 'S':
                        str += 'FB';
                        break;
                    case 'F':
                        str += chance > 0.5 ? 'FF' : 'F';
                        break;
                    case 'B':
                        // str += chance < 0.25 ? '[llFB][rFB]' : chance < 0.5 ? '[lFB][rrFB]' : '[lFB][rFB]';
                        str += this.generateBranchVocab(chance);
                        break;
                    default:
                        str += letter;
                        break;
                }
            }
            vocab = str;
        }

        return vocab;
    }

    generateBranchVocab(chance: number): string {
        if (chance < 0.05) return '[lFB]';
        if (chance < 0.1) return '[rFB]';
        if (chance < 0.3) return '[llFB][rFB]';
        if (chance < 0.5) return '[lFB][rrFB]';
        return '[lFB][rFB]';
    }

    setValues(key: Keys, value: number | boolean) {
        if (typeof value === 'number') {
            switch (key) {
                default:
                    throw 'Unsupported key passed to setValues()';
            }
        }
        if (typeof value === 'boolean') {
            switch (key) {
                case 'showHelpers':
                    this.showHelpers = value;
                    break;
                default:
                    throw 'Unsupported key passed to setValues()';
            }
        }
    }

    update(_deltaTime: number): this {
        return this;
    }

    draw(): this {
        for (const letter of this.vocab) {
            switch (letter) {
                case 'F':
                    this.p5.stroke(255);
                    this.p5.strokeWeight(2);
                    this.p5.line(0, 0, 0, -this.branchLength);
                    this.p5.translate(0, -this.branchLength);
                    break;
                case 'B':
                    this.p5.stroke(255);
                    this.p5.strokeWeight(2);
                    this.p5.circle(0, 0, this.leafRadius);
                    break;
                case 'l':
                    this.p5.rotate(-this.branchAngle);
                    break;
                case 'r':
                    this.p5.rotate(this.branchAngle);
                    break;
                case '[':
                    this.p5.push();
                    break;
                case ']':
                    this.p5.pop();
                    break;
                default:
                    break;
            }
        }
        return this;
    }
}

/**--------------------------------- */
// functions

export default FractalTree;
