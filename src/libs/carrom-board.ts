import P5, { Vector } from 'p5';

type TCarromBoardConfig = {};
class CarromBoard {
    p5: P5;

    constructor(p5: P5, _config?: Partial<TCarromBoardConfig>) {
        const config: TCarromBoardConfig = {
            ..._config
        };
        this.p5 = p5;
    }

    update(_deltaTime: number): this {
        return this;
    }
    draw(): this {
        return this;
    }
}

export default CarromBoard;
