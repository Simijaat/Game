// Basic scene configuration
class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        // Load assets here
    }

    create() {
        const { width, height } = this.scale;

        // Set matter world bounds so the beam doesn't fall endlessly
        this.matter.world.setBounds(0, 0, width, height);

        // Center coordinates
        const cx = width / 2;
        const cy = height / 2;

        // 1. Create the Beam (thick brown rectangle)
        // Draw a rect: x, y, width, height, color
        const beamWidth = 200;
        const beamHeight = 40;
        // In Phaser 3 Matter, we can use `this.matter.add.rectangle` or attach a graphics object to a body.
        // Let's use `this.add.rectangle` and then `this.matter.add.gameObject`.
        const beam = this.add.rectangle(cx, cy, beamWidth, beamHeight, 0x8B4513);
        this.matter.add.gameObject(beam, {
            isStatic: false,
            density: 0.05, frictionAir: 0.02, restitution: 0.1
        });

        // 2. Create the Pins (small red circles)
        const pinRadius = 15;
        // Left pin
        const leftPin = this.add.circle(cx - beamWidth / 2, cy, pinRadius, 0xFF0000);
        this.matter.add.gameObject(leftPin, {
            shape: { type: 'circle', radius: pinRadius },
            isStatic: true,
            isSensor: true
        });

        // Right pin
        const rightPin = this.add.circle(cx + beamWidth / 2, cy, pinRadius, 0xFF0000);
        this.matter.add.gameObject(rightPin, {
            shape: { type: 'circle', radius: pinRadius },
            isStatic: true,
            isSensor: true
        });

        // Make pins interactive
        leftPin.setInteractive();
        rightPin.setInteractive();

        // 3. Create Constraints
        // Pin the left side of the beam to the left pin
        // constraint length 0 so it acts like a pivot point
        const leftConstraint = this.matter.add.constraint(leftPin, beam, 0, 1, {
            pointA: { x: 0, y: 0 },
            pointB: { x: -beamWidth / 2, y: 0 }
        });

        const rightConstraint = this.matter.add.constraint(rightPin, beam, 0, 1, {
            pointA: { x: 0, y: 0 },
            pointB: { x: beamWidth / 2, y: 0 }
        });

        // 4. Add interaction events
        leftPin.on('pointerdown', () => {
            if (leftConstraint) {
                this.matter.world.removeConstraint(leftConstraint);
            }
            leftPin.destroy(); // Remove game object
        });

        rightPin.on('pointerdown', () => {
            if (rightConstraint) {
                this.matter.world.removeConstraint(rightConstraint);
            }
            rightPin.destroy();
        });
    }

    update() {
        // Game loop updates here
    }
}

// Phaser Game Configuration
const config = {
    type: Phaser.AUTO,
    // Parent container in the HTML
    parent: 'puzzle-board',
    // Responsive scaling setup
    scale: {
        mode: Phaser.Scale.RESIZE, // Automatically resize to fit the parent container
        width: '100%',
        height: '100%'
    },
    // Optional physics setup
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 1.5 },
            debug: false
        }
    },
    scene: [MainScene]
};

// Initialize the Phaser Game instance
const game = new Phaser.Game(config);
