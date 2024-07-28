import { GUI } from 'dat.gui';
import P5 from 'p5';

/**--------------------------------- */
// variables

/**--------------------------------- */
// sketch
const sketch = (p5: P5) => {
    let terrain: Terrain;
    const options = {
        terrainSize: 100,
        tileSize: 10,
        scale: 0.1,
        generate: () => {
            init(p5);
        },
        detail: 4,
        difference: 0.5
    };
    const colorOptions = {
        deepSea: '#0000ff',
        midlands: '#00ff00',
        mountains: '#ff0000'
    };
    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    document.getElementById('gui')?.appendChild(gui.domElement);
    gui.add(options, 'generate').name('Generate Map');
    gui.add(options, 'terrainSize', 20, 200, 1)
        .name('Map Size')
        .onChange(() => {
            init(p5);
        });
    gui.add(options, 'tileSize', 5, 20, 1)
        .name('Tile Size')
        .onChange(() => {
            init(p5);
        });
    gui.add(options, 'scale', 0, 0.2, 0.001)
        .name('scale')
        .onChange(() => {
            init(p5);
        });
    gui.add(options, 'detail', 1, 16, 0.1).onChange((detail: number) => {
        init(p5);
    });
    gui.add(options, 'difference', 0, 1, 0.01)
        .name('Landmass')
        .onChange((difference: number) => {
            init(p5);
        });
    const colorFolder = gui.addFolder('colors');
    colorFolder.add(colorOptions, 'deepSea');
    colorFolder.add(colorOptions, 'midlands');
    colorFolder.add(colorOptions, 'mountains');

    /** setup */
    p5.setup = () => {
        const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
        canvas.parent('app');
        p5.background('white');
        p5.pixelDensity(1);
        p5.colorMode(p5.HSB);
        window.addEventListener('resize', () => resizeDisplay(p5));
        p5.noLoop();
        // init(p5);
    };

    /** draw */
    p5.draw = () => {
        p5.background(200, 60, 10);
        init(p5);
    };

    /**--------------------------------- */
    // functions

    function resizeDisplay(canvas: P5) {
        canvas.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    function init(p5: P5) {
        p5.background(200, 60, 10);
        terrain = new Terrain(p5, options.terrainSize, options.tileSize);
    }

    /**--------------------------------- */
    // classes

    class Terrain {
        p5: P5;
        terrainSize: number;
        tileSize: number;
        tiles: Tile[];

        constructor(p5: P5, terrainSize: number, tileSize: number) {
            this.p5 = p5;
            this.terrainSize = terrainSize;
            this.tileSize = tileSize;
            this.tiles = [];
            this.buildTiles();
        }

        update() {}

        draw() {}

        buildTiles() {
            this.tiles = [];
            for (let i = 0; i < this.terrainSize; i++) {
                for (let j = 0; j < this.terrainSize; j++) {
                    this.p5.noiseDetail(options.detail, options.difference);
                    const elavation = p5.noise(i * options.scale, j * options.scale);
                    const tile = new Tile(this.p5, this.p5.createVector(i, j), elavation, this.tileSize);
                    this.tiles.push(tile);
                    tile.draw();
                }
            }
        }
    }
    class Tile {
        p5: P5;
        pos: P5.Vector;
        elevation: number;
        size: number;

        constructor(p5: P5, pos: P5.Vector, elevation: number, size: number) {
            this.p5 = p5;
            this.pos = pos;
            this.elevation = elevation;
            this.size = size;
        }

        update() {}

        draw() {
            this.p5.push();
            this.p5.translate(this.pos.x * this.size, this.pos.y * this.size);
            // this.p5.stroke(1);
            this.drawTile();
            this.p5.pop();
        }

        drawTile() {
            const elevation = this.p5.map(this.elevation, 0, 1, -1, 1);
            let color = colorOptions.deepSea;
            if (elevation > 0) color = colorOptions.midlands;
            if (elevation > 0.8) color = colorOptions.mountains;

            this.p5.noStroke();
            this.p5.fill(color);
            this.p5.rect(0, 0, this.size);
        }
    }
};

new P5(sketch);
