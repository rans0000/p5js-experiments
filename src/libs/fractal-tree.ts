import P5 from 'p5';

type TFractalTree = {
    showHelpers: boolean;
};

type Keys = 'size' | 'showHelpers';

class FractalTree {
    p5: P5;
    showHelpers: boolean;

    constructor(p5: P5, _config?: Partial<TFractalTree>) {
        const config: TFractalTree = {
            showHelpers: false,
            ..._config
        };
        this.p5 = p5;
        this.showHelpers = config.showHelpers;
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
        return this;
    }
}

/**--------------------------------- */
// functions

export default FractalTree;
