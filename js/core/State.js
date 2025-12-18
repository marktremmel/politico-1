export class GameState {
    constructor() {
        this.data = {
            // Core Stats
            countryName: "Republic of Nowhere",
            leaderName: "President Smith",
            date: new Date("2025-01-01"),
            isPaused: true,

            // Resources
            politicalCapital: 50, // 0-100
            budget: 0, // In Billions
            approval: 50, // 0-100

            // Economic Indicators
            gdp: 0,
            debt: 0,
            population: 0,

            // Systems Data
            factions: {}, // { "capitalists": 50, "socialists": 50 }
            ministers: [],
            activeEffects: [] // "High Crime", "Sanctions"
        };

        this.listeners = [];
    }

    /**
     * Get a value from the state
     * @param {string} key 
     */
    get(key) {
        return this.data[key];
    }

    /**
     * Update a value in the state and notify listeners
     * @param {string} key 
     * @param {any} value 
     */
    update(key, value) {
        this.data[key] = value;
        this.notify(key, value);
    }

    /**
     * Update multiple values at once (batch update)
     * @param {object} updates 
     */
    updateBatch(updates) {
        for (const [key, value] of Object.entries(updates)) {
            this.data[key] = value;
            this.notify(key, value); // Notify for each, or we could optimize to notify once if listeners are generic
        }
    }

    notify(key, value) {
        this.listeners.forEach(listener => {
            if (listener.key === '*' || listener.key === key) {
                listener.callback(value, this.data);
            }
        });
    }

    /**
     * Notify all subscribers - used for batch updates after game tick
     */
    notifySubscribers() {
        this.listeners.forEach(listener => {
            if (listener.key === '*') {
                listener.callback(null, this.data);
            }
        });
    }

    /**
     * Subscribe to state changes
     * @param {string} key - Specific key or '*' for all changes
     * @param {function} callback - (newValue, allState) => {}
     */
    subscribe(key, callback) {
        this.listeners.push({ key, callback });
    }

    /**
     * Export state to JSON string (for Save system)
     */
    exportParams() {
        return JSON.stringify(this.data);
    }

    /**
     * Import state from JSON string
     */
    importParams(jsonString) {
        try {
            const loadedData = JSON.parse(jsonString);
            // Re-inflate Date object
            if (loadedData.date) loadedData.date = new Date(loadedData.date);

            this.data = { ...this.data, ...loadedData };
            this.notify('*', this.data); // Notify all that everything changed
            return true;
        } catch (e) {
            console.error("Failed to load save state:", e);
            return false;
        }
    }
}
