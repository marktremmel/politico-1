import { GameState } from './State.js';

export class GameEngine {
    constructor() {
        this.state = new GameState();
        this.systems = [];
        this.tickRate = 1000; // 1 second = 1 day
        this.timer = null;
    }

    /**
     * registerSystem - Adds a system to the update loop
     * @param {Object} system - Must have an .update(state) method
     */
    registerSystem(system) {
        this.systems.push(system);
    }

    init() {
        console.log("Game Engine Initialized");
        // Initial setup logic here
    }

    start() {
        console.log("Game Engine Started");
        this.state.update('isPaused', false);
        this.loop();
    }

    pause() {
        this.state.update('isPaused', true);
        clearTimeout(this.timer);
        console.log("Game Paused");
    }

    resume() {
        if (this.state.get('isPaused')) {
            this.state.update('isPaused', false);
            this.loop();
            console.log("Game Resumed");
        }
    }

    togglePause() {
        if (this.state.get('isPaused')) {
            this.resume();
        } else {
            this.pause();
        }
    }

    /**
     * The Main Game Loop
     * Advances time by 1 day and triggers system updates
     */
    loop() {
        if (this.state.get('isPaused')) return;

        // 1. Advance Date
        const currentDate = this.state.get('date');
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 1);
        this.state.update('date', nextDate);

        // 2. Run Systems
        this.systems.forEach(system => {
            if (system.update) {
                try {
                    system.update(this.state);
                } catch (e) {
                    console.error("System Update Failed:", e);
                }
            }
        });

        // 3. Notify UI subscribers for dynamic updates
        this.state.notifySubscribers();

        // 4. Schedule next tick
        this.timer = setTimeout(() => this.loop(), this.tickRate);
    }
}
