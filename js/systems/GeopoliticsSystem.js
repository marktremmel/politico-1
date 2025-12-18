// ============================================
// GEOPOLITICS SYSTEM - Dynamic Sovereignty
// ============================================

export class GeopoliticsSystem {
    constructor() {
        this.relations = {
            eu: { score: 60, name: "European Union" },
            usa: { score: 50, name: "United States" },
            russia: { score: 40, name: "Russian Federation" },
            china: { score: 45, name: "People's Republic of China" }
        };

        this.sovereignty = 100; // 0-100%
        this.alignment = 0; // -100 (East) to +100 (West)
    }

    update(state) {
        // === SOVEREIGNTY DYNAMICS ===
        this.updateSovereignty(state);

        // === ALIGNMENT DRIFT ===
        this.updateAlignment(state);

        // === RELATIONS DRIFT ===
        if (Math.random() < 0.05) {
            const keys = Object.keys(this.relations);
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            this.modifyRelation(randomKey, (Math.random() * 2) - 1);
        }

        // Export to state
        state.update('relations', this.relations);
        state.update('sovereignty', Math.round(this.sovereignty));
        state.update('alignment', Math.round(this.alignment));
    }

    updateSovereignty(state) {
        let change = 0;

        // === FACTORS THAT REDUCE SOVEREIGNTY ===

        // High debt = loss of independence
        const debt = state.get('debt') || 0;
        const gdp = state.get('gdp') || 100;
        const debtRatio = debt / gdp;
        if (debtRatio > 0.8) {
            change -= 0.05; // Slow drain when over-leveraged
        }

        // Low military sector health = vulnerability
        const sectors = state.get('sectors') || {};
        if (sectors.military?.health < 30) {
            change -= 0.02;
        }

        // Extreme alignment = dependence on a bloc
        const alignment = Math.abs(this.alignment);
        if (alignment > 70) {
            change -= 0.01; // Too dependent on one side
        }

        // Trade dependency crisis
        const trade = state.get('trade') || {};
        const lowAccessCount = Object.values(trade).filter(t => (t.access || 100) < 40).length;
        if (lowAccessCount >= 2) {
            change -= 0.03; // Multiple trade crises
        }

        // === FACTORS THAT INCREASE SOVEREIGNTY ===

        // Strong military
        if (sectors.military?.health > 70) {
            change += 0.02;
        }

        // Completed space program
        const projects = state.get('megaprojects') || {};
        if (projects.space_program?.completed) {
            change += 0.01;
        }

        // Neutral alignment
        if (Math.abs(this.alignment) < 20) {
            change += 0.01; // Non-aligned = more independent
        }

        // === APPLY CHANGE ===
        this.sovereignty = Math.max(0, Math.min(100, this.sovereignty + change));

        // === SOVEREIGNTY CRISIS ===
        if (this.sovereignty < 30 && Math.random() < 0.02) {
            const dm = state._engine?.systems?.find(s => s.addEventToDeck);
            if (dm) dm.addEventToDeck('sovereignty_crisis');
        }

        // === GAME OVER CHECK ===
        if (this.sovereignty <= 0) {
            state.update('gameOverReason', 'Your nation has become a puppet state.');
            state.update('gameOver', true);
        }
    }

    updateAlignment(state) {
        // Alignment slowly drifts based on relations
        const euScore = this.relations.eu?.score || 50;
        const usaScore = this.relations.usa?.score || 50;
        const russiaScore = this.relations.russia?.score || 50;
        const chinaScore = this.relations.china?.score || 50;

        const westScore = (euScore + usaScore) / 2;
        const eastScore = (russiaScore + chinaScore) / 2;

        // Drift toward whoever you're friendlier with
        const diff = (westScore - eastScore) * 0.01;
        this.alignment = Math.max(-100, Math.min(100, this.alignment + diff));

        // Impact trade access based on alignment
        const trade = state.get('trade') || {};
        if (this.alignment > 30 && trade.technology) {
            trade.technology.access = Math.min(100, (trade.technology.access || 50) + 0.1);
        }
        if (this.alignment < -30 && trade.energy) {
            trade.energy.access = Math.min(100, (trade.energy.access || 50) + 0.1);
        }
        state.update('trade', trade);
    }

    modifyRelation(targetKey, amount) {
        if (this.relations[targetKey]) {
            this.relations[targetKey].score = Math.max(0, Math.min(100, this.relations[targetKey].score + amount));
        }
    }

    modifySovereignty(amount) {
        this.sovereignty = Math.max(0, Math.min(100, this.sovereignty + amount));
    }

    modifyAlignment(amount) {
        this.alignment = Math.max(-100, Math.min(100, this.alignment + amount));
    }

    getRelation(targetKey) {
        return this.relations[targetKey] ? this.relations[targetKey].score : 50;
    }
}
