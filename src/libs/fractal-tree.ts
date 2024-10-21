import P5 from 'p5';

type TFractalTree = {
    initialVocab: string;
    vocab: string;
    grammar: Record<string, string>;
    branchLength: number;
    branchAngle: number;
    leafRadius: number;
    showHelpers: boolean;
};
type TFractalTreeConfig = Omit<TFractalTree, 'grammar' | 'vocab'> & { rule: string };

type Keys = 'size' | 'showHelpers';

class FractalTree {
    p5: P5;
    rule: string;
    initialVocab: string;
    vocab: string;
    grammar: Record<string, string>;
    branchLength: number;
    branchAngle: number;
    leafRadius: number;
    showHelpers: boolean;

    constructor(p5: P5, _config?: Partial<TFractalTreeConfig>) {
        const config: TFractalTreeConfig = {
            initialVocab: 'S',
            rule: 'S:FB F:FF B:[lFB][rFB]',
            branchLength: 20,
            branchAngle: Math.PI / 4,
            leafRadius: 3,
            showHelpers: false,
            ..._config
        };
        this.p5 = p5;
        this.vocab = config.initialVocab;
        this.initialVocab = config.initialVocab;
        this.grammar = this.generateGrammar(config.rule);
        this.branchLength = config.branchLength;
        this.branchAngle = config.branchAngle;
        this.leafRadius = config.leafRadius;
        this.showHelpers = config.showHelpers;
    }

    private generateGrammar(rule: string): Record<string, string> {
        let obj: Record<string, string> = {};
        rule.split(' ').map((elem) => {
            const item = elem.split(':');
            obj[item[0]] = item[1];
        });
        return obj;
    }

    generateVocab(iterations: number = 6): string {
        let str = '';
        let vocab = this.initialVocab;

        for (let i = 0; i < iterations; i++) {
            str = '';

            for (const letter of vocab) {
                str += this.grammar.hasOwnProperty(letter) ? this.grammar[letter] : letter;
            }
            vocab = str;
        }
        return (this.vocab = vocab);
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

    update(deltaTime: number): this {
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
