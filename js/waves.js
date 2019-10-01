// Aliases.
let Application = PIXI.Application;
let Graphics = PIXI.Graphics;

let appWidth = 1500;
let appHeight = 750;

// Initiate the application.
let app = new Application({
    width: appWidth,
    height: appHeight,
    antialias: true,
    transparent: false,
    resolution: 1
});

let colors = [0x3c96d6, 0xfca4fa, 0x33de6c, 0xde9014];

let waves = new Set();

function setup() {

    for (let i = 0; i < 10; i++) {
        
        // Select the coordinates at random.
        let x_coordinate = Math.floor(Math.random() * appWidth);
        let y_coordinate = Math.floor(Math.random() * appHeight);
        let max_radius = Math.floor(Math.random() * 100 + 50);

        let wave = new Wave(x_coordinate, y_coordinate, max_radius);

        waves.add(wave);

        for (let gc of wave.getGraphicalComponents()) {
            app.stage.addChild(gc);
        }
    }

    app.ticker.add(delta => gameloop(delta));
}

function gameloop(delta) {

    // Make the waves grow no more than their maximum size.
    for (let wave of waves) {
        if (wave.radius < wave.max_radius ) {
            wave.expand();
        } else {
            
            // Remove the wave from the screen.
            for (let gc of wave.getGraphicalComponents()) {
                app.stage.removeChild(gc);
            }

            // Remove the wave from the set of waves.
            waves.delete(wave);

            // Add a new wave
            // Select the coordinates at random.
            let x_coordinate = Math.floor(Math.random() * appWidth);
            let y_coordinate = Math.floor(Math.random() * appHeight);
            let max_radius = Math.floor(Math.random() * 100 + 50);

            let newWave = new Wave(x_coordinate, y_coordinate, max_radius);

            waves.add(newWave);

            for (let gc of newWave.getGraphicalComponents()) {
                app.stage.addChild(gc);
            }
        }
    }
}

setup();

// Add the canvas generated by PIXI to the DOM.
document.body.appendChild(app.view);


function Wave(x_coordinate, y_coordinate, max_radius) {
    this.x_coordinate = x_coordinate;
    this.y_coordinate = y_coordinate;
    this.radius = 3; // Initial radius.
    this.max_radius = max_radius;

    this.createCircle = function(color, radius) {
        let circle = new Graphics();
        circle.beginFill(color);
        circle.drawCircle(0, 0, radius);
        circle.endFill();
        circle.x = this.x_coordinate;
        circle.y = this.y_coordinate;
        return circle;
    };

    let randomColor = colors[Math.floor(Math.random() * colors.length)];

    this.outerCircle = this.createCircle(randomColor, this.radius);
    this.innerCircle = this.createCircle(randomColor, this.radius - 2);

    this.outerCircle.alpha = 0.75;
    this.innerCircle.alpha  = 0.3;

    this.expand = function() {
        let sizeIncrement = 5;
        
        this.radius += sizeIncrement;

        this.outerCircle.width += sizeIncrement;
        this.outerCircle.height += sizeIncrement;
        
        this.innerCircle.width += sizeIncrement;
        this.innerCircle.height += sizeIncrement;
    }

    this.getGraphicalComponents = function() {
        return [this.outerCircle, this.innerCircle];
    }

}