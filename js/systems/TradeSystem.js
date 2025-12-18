// ============================================
// TRADE SYSTEM - Dependencies & Sanctions
// ============================================

export const TRADE_GOODS = {
    energy: {
        name: "Energy",
        icon: "⛽",
        baseImportCost: 2.0, // Billion per turn
        criticalThreshold: 0.3, // Below 30% = crisis
        effects: {
            factory: 'gdp', // Affects GDP
            multiplier: 0.15 // 15% GDP loss if cut off
        }
    },
    food: {
        name: "Food",
        icon: "🌾",
        baseImportCost: 1.5,
        criticalThreshold: 0.4,
        effects: {
            factory: 'approval',
            multiplier: 10 // Direct approval loss
        }
    },
    manufacturing: {
        name: "Manufacturing",
        icon: "🏭",
        baseImportCost: 1.0,
        criticalThreshold: 0.3,
        effects: {
            factory: 'inflation', // Causes inflation
            multiplier: 5
        }
    },
    technology: {
        name: "Technology",
        icon: "💻",
        baseImportCost: 0.8,
        criticalThreshold: 0.2,
        effects: {
            factory: 'gdpGrowth',
            multiplier: 0.01
        }
    }
};

export const TRADE_EVENTS = {
    energy_embargo: {
        id: 'energy_embargo',
        title: "Energy Embargo!",
        desc: "A major supplier has cut off energy exports. Factories are shutting down.",
        trigger: () => false,
        isChained: true,
        choices: [
            {
                text: "Pay premium prices (3x cost)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 6);
                }
            },
            {
                text: "Ration energy (GDP penalty)",
                effect: (state, engine) => {
                    state.update('gdp', state.get('gdp') * 0.9);
                    state.update('approval', (state.get('approval') || 50) - 10);
                }
            },
            {
                text: "Seek new suppliers (-10 Sovereignty)",
                effect: (state, engine) => {
                    state.update('sovereignty', (state.get('sovereignty') || 100) - 10);
                }
            }
        ]
    },
    food_crisis: {
        id: 'food_crisis',
        title: "Food Supply Crisis",
        desc: "Food imports have been disrupted. Grocery shelves are empty.",
        trigger: () => false,
        isChained: true,
        choices: [
            {
                text: "Emergency food aid purchase (-$4B)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 4);
                }
            },
            {
                text: "Implement rationing",
                effect: (state, engine) => {
                    state.update('approval', (state.get('approval') || 50) - 15);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('State Pensioners', -20);
                        fs.modifyGroupHappiness('Rural Workers', -10);
                        fs.update(state);
                    }
                }
            }
        ]
    },
    trade_war: {
        id: 'trade_war',
        title: "Trade War Declared!",
        desc: "Tariffs are being imposed on your exports. Your trading position is weakened.",
        trigger: () => false,
        isChained: true,
        choices: [
            {
                text: "Retaliate with counter-tariffs",
                effect: (state, engine) => {
                    state.update('gdp', state.get('gdp') * 0.95);
                    const trade = state.get('trade') || {};
                    Object.keys(trade).forEach(k => {
                        trade[k].access = Math.max(0, (trade[k].access || 100) - 20);
                    });
                    state.update('trade', trade);
                }
            },
            {
                text: "Negotiate (-5 PC, resolve)",
                effect: (state, engine) => {
                    state.update('politicalCapital', (state.get('politicalCapital') || 50) - 5);
                }
            },
            {
                text: "Accept terms (-Sovereignty)",
                effect: (state, engine) => {
                    state.update('sovereignty', (state.get('sovereignty') || 100) - 15);
                }
            }
        ]
    },
    sanctions: {
        id: 'sanctions',
        title: "International Sanctions Imposed",
        desc: "The international community has imposed sanctions on your country.",
        trigger: () => false,
        isChained: true,
        choices: [
            {
                text: "Defy sanctions (Sovereignty +5, trade -30%)",
                effect: (state, engine) => {
                    state.update('sovereignty', (state.get('sovereignty') || 100) + 5);
                    const trade = state.get('trade') || {};
                    Object.keys(trade).forEach(k => {
                        trade[k].access = Math.max(0, (trade[k].access || 100) - 30);
                    });
                    state.update('trade', trade);
                }
            },
            {
                text: "Comply with demands",
                effect: (state, engine) => {
                    state.update('sovereignty', (state.get('sovereignty') || 100) - 20);
                    state.update('approval', (state.get('approval') || 50) - 5);
                }
            }
        ]
    },
    pipeline_politics: {
        id: 'pipeline_politics',
        title: "Pipeline Politics",
        desc: "A neighboring country wants to build a pipeline through your territory. The superpowers are watching.",
        trigger: () => false,
        isChained: true,
        choices: [
            {
                text: "Allow the pipeline (+Energy access, -West alignment)",
                effect: (state, engine) => {
                    const trade = state.get('trade') || {};
                    if (trade.energy) trade.energy.access = Math.min(100, (trade.energy.access || 100) + 20);
                    state.update('trade', trade);
                    state.update('alignment', (state.get('alignment') || 0) - 10);
                }
            },
            {
                text: "Block it (+West alignment, -Energy)",
                effect: (state, engine) => {
                    state.update('alignment', (state.get('alignment') || 0) + 10);
                    const trade = state.get('trade') || {};
                    if (trade.energy) trade.energy.access = Math.max(0, (trade.energy.access || 100) - 15);
                    state.update('trade', trade);
                }
            }
        ]
    }
};

export class TradeSystem {
    constructor(gameEngine) {
        this.engine = gameEngine;
        this.initialized = false;
    }

    initializeTrade(state) {
        if (this.initialized) return;

        const trade = {};
        Object.keys(TRADE_GOODS).forEach(key => {
            trade[key] = {
                access: 100, // 0-100% access
                dependency: 50, // How much you need imports (0-100)
                domesticProduction: 30 // How much you produce yourself
            };
        });
        state.update('trade', trade);
        this.initialized = true;
    }

    update(state) {
        if (!state.get('trade')) {
            this.initializeTrade(state);
            return;
        }

        const trade = state.get('trade');
        const alignment = state.get('alignment') || 0; // -100 (East) to +100 (West)
        let totalTradeCost = 0;

        Object.keys(TRADE_GOODS).forEach(key => {
            const config = TRADE_GOODS[key];
            const good = trade[key];

            // Calculate effective supply
            const importSupply = (good.access / 100) * (1 - good.domesticProduction / 100);
            const totalSupply = (good.domesticProduction / 100) + importSupply;

            // Calculate trade cost
            const importCost = config.baseImportCost * (1 - good.domesticProduction / 100) * (good.access / 100);
            totalTradeCost += importCost;

            // Apply penalties if supply is low
            if (totalSupply < config.criticalThreshold) {
                this.applyCrisis(key, config, totalSupply, state);
            }

            // Alignment affects trade access slowly
            if (key === 'energy' && alignment < -20) {
                // East alignment = better energy access
                good.access = Math.min(100, good.access + 0.1);
            } else if (key === 'technology' && alignment > 20) {
                // West alignment = better tech access
                good.access = Math.min(100, good.access + 0.1);
            }
        });

        state.update('trade', trade);
        state.update('tradeExpense', totalTradeCost);

        // Random trade events based on alignment extremes
        if (Math.random() < 0.01) {
            this.checkTradeEvents(state);
        }
    }

    applyCrisis(goodKey, config, supply, state) {
        const deficit = config.criticalThreshold - supply;

        switch (config.effects.factory) {
            case 'gdp':
                state.update('gdp', state.get('gdp') * (1 - deficit * config.effects.multiplier));
                break;
            case 'approval':
                state.update('approval', Math.max(0, (state.get('approval') || 50) - deficit * config.effects.multiplier));
                break;
            case 'inflation':
                // Could add inflation stat later
                state.update('approval', Math.max(0, (state.get('approval') || 50) - deficit * config.effects.multiplier));
                break;
        }

        // Trigger crisis events
        if (supply < 0.2 && Math.random() < 0.1) {
            const dm = this.engine.systems.find(s => s.addEventToDeck);
            if (dm) {
                if (goodKey === 'energy') dm.addEventToDeck('energy_embargo');
                else if (goodKey === 'food') dm.addEventToDeck('food_crisis');
            }
        }
    }

    checkTradeEvents(state) {
        const alignment = Math.abs(state.get('alignment') || 0);
        const sovereignty = state.get('sovereignty') || 100;

        // More likely to get trade events with extreme alignment or low sovereignty
        if (alignment > 50 || sovereignty < 50) {
            const dm = this.engine.systems.find(s => s.addEventToDeck);
            if (dm) {
                const events = ['trade_war', 'sanctions', 'pipeline_politics'];
                const eventId = events[Math.floor(Math.random() * events.length)];
                dm.addEventToDeck(eventId);
            }
        }
    }

    setTradeAccess(goodKey, value, state) {
        const trade = state.get('trade') || {};
        if (trade[goodKey]) {
            trade[goodKey].access = Math.max(0, Math.min(100, value));
            state.update('trade', trade);
        }
    }

    setDomesticProduction(goodKey, value, state) {
        const trade = state.get('trade') || {};
        if (trade[goodKey]) {
            trade[goodKey].domesticProduction = Math.max(0, Math.min(100, value));
            state.update('trade', trade);
        }
    }

    // Called when alignment changes significantly
    onAlignmentShift(oldAlignment, newAlignment, state) {
        const trade = state.get('trade') || {};
        const shift = newAlignment - oldAlignment;

        if (shift > 20) {
            // Big shift toward West
            trade.technology.access = Math.min(100, trade.technology.access + 10);
            trade.energy.access = Math.max(0, trade.energy.access - 10);
        } else if (shift < -20) {
            // Big shift toward East
            trade.energy.access = Math.min(100, trade.energy.access + 10);
            trade.technology.access = Math.max(0, trade.technology.access - 10);
        }

        state.update('trade', trade);
    }
}
