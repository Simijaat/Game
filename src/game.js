
// --- DOM UI Logic ---
let enemyHealth = 100;
const MAX_HEALTH = 100;

window.addEventListener('combatAction', (e) => {
    const damage = e.detail.damage || 0;

    // Deduct health
    enemyHealth -= damage;
    if (enemyHealth <= 0) {
        enemyHealth = MAX_HEALTH; // Reset for next wave
    }

    // Update health bar DOM
    const healthBar = document.getElementById('enemy-health');
    if (healthBar) {
        const percentage = (enemyHealth / MAX_HEALTH) * 100;
        healthBar.style.width = percentage + '%';
    }

    // Animate DOM elements
    const hero = document.querySelector('.hero');
    const enemy = document.querySelector('.enemy');

    if (hero) hero.classList.add('hero-lunge');
    if (enemy) enemy.classList.add('enemy-hit');

    // Remove animation classes after short delay to allow transition to finish
    setTimeout(() => {
        if (hero) hero.classList.remove('hero-lunge');
        if (enemy) enemy.classList.remove('enemy-hit');
    }, 150); // Matches CSS transition duration roughly
});
// --------------------

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

        // Leave the bottom bound open so the beam can fall off
        this.matter.world.setBounds(0, 0, width, height, 32, true, true, true, false);

        this.spawnPuzzle();
    }

    spawnPuzzle() {
        const { width, height } = this.scale;
        const cx = width / 2;
        const cy = height / 2;

        const beamWidth = 200;
        const beamHeight = 40;
        this.beam = this.add.rectangle(cx, cy, beamWidth, beamHeight, 0x8B4513);
        this.matter.add.gameObject(this.beam, {
            isStatic: false,
            density: 0.05, frictionAir: 0.02, restitution: 0.1
        });

        const pinRadius = 15;
        this.leftPin = this.add.circle(cx - beamWidth / 2, cy, pinRadius, 0xFF0000);
        this.matter.add.gameObject(this.leftPin, {
            shape: { type: 'circle', radius: pinRadius },
            isStatic: true,
            isSensor: true
        });

        this.rightPin = this.add.circle(cx + beamWidth / 2, cy, pinRadius, 0xFF0000);
        this.matter.add.gameObject(this.rightPin, {
            shape: { type: 'circle', radius: pinRadius },
            isStatic: true,
            isSensor: true
        });

        this.leftPin.setInteractive();
        this.rightPin.setInteractive();

        this.leftConstraint = this.matter.add.constraint(this.leftPin, this.beam, 0, 1, {
            pointA: { x: 0, y: 0 },
            pointB: { x: -beamWidth / 2, y: 0 }
        });

        this.rightConstraint = this.matter.add.constraint(this.rightPin, this.beam, 0, 1, {
            pointA: { x: 0, y: 0 },
            pointB: { x: beamWidth / 2, y: 0 }
        });

        this.leftPin.on('pointerdown', () => {
            if (this.leftConstraint) {
                this.matter.world.removeConstraint(this.leftConstraint);
            }
            this.leftPin.destroy();
            window.dispatchEvent(new CustomEvent('combatAction', { detail: { type: 'pin_pull', damage: 10 } }));
        });

        this.rightPin.on('pointerdown', () => {
            if (this.rightConstraint) {
                this.matter.world.removeConstraint(this.rightConstraint);
            }
            this.rightPin.destroy();
            window.dispatchEvent(new CustomEvent('combatAction', { detail: { type: 'pin_pull', damage: 10 } }));
        });
    }

    update() {
        if (this.beam && this.beam.y > this.scale.height + 100) {
            // Dispatch the big damage event
            window.dispatchEvent(new CustomEvent('combatAction', { detail: { type: 'beam_drop', damage: 50 } }));

            // Clean up old objects to free memory
            this.beam.destroy();
            this.beam = null;

            if (this.leftPin && this.leftPin.active) this.leftPin.destroy();
            if (this.rightPin && this.rightPin.active) this.rightPin.destroy();

            // Spawn a new puzzle
            this.spawnPuzzle();
        }
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
