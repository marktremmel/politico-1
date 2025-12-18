// ============================================
// SECTOR SYSTEM - Budget Consequences
// ============================================
// Each sector has health (0-100) that decays without funding

export const SECTORS = {
    infrastructure: {
        name: "Infrastructure",
        icon: "🛤️",
        baseCost: 2.0, // Billions per turn to maintain 100%
        decayRate: 0.5, // Health lost per turn if underfunded
        consequence: "gdp", // What stat suffers
        consequenceMultiplier: 0.002, // Per health point below 50
        eventThreshold: 30, // Trigger events below this health
        events: ['bridge_collapse', 'blackout']
    },
    healthcare: {
        name: "Healthcare",
        icon: "🏥",
        baseCost: 1.5,
        decayRate: 0.4,
        consequence: "approval",
        consequenceMultiplier: 0.1,
        eventThreshold: 40,
        events: ['hospital_crisis', 'epidemic']
    },
    education: {
        name: "Education",
        icon: "🎓",
        baseCost: 1.0,
        decayRate: 0.3,
        consequence: "gdpGrowth", // Long-term effect
        consequenceMultiplier: 0.001,
        eventThreshold: 35,
        events: ['teacher_strike', 'brain_drain']
    },
    military: {
        name: "Military",
        icon: "🪖",
        baseCost: 2.5,
        decayRate: 0.6,
        consequence: "sovereignty",
        consequenceMultiplier: 0.05,
        eventThreshold: 25,
        events: ['mutiny', 'border_incursion']
    },
    police: {
        name: "Police",
        icon: "👮",
        baseCost: 0.8,
        decayRate: 0.5,
        consequence: "unrest",
        consequenceMultiplier: 0.3, // Adds to unrest
        eventThreshold: 30,
        events: ['crime_wave', 'riot']
    },
    welfare: {
        name: "Welfare",
        icon: "🏠",
        baseCost: 1.2,
        decayRate: 0.4,
        consequence: "approval",
        consequenceMultiplier: 0.15,
        eventThreshold: 35,
        events: ['homeless_crisis', 'hunger_protest']
    }
};

// Sector-specific events triggered by low health
export const SECTOR_EVENTS = {
    bridge_collapse: {
        id: 'bridge_collapse',
        title: "Bridge Collapses!",
        desc: "Years of neglected infrastructure maintenance has led to disaster. A major highway bridge has collapsed during rush hour.",
        trigger: () => false, // Only triggered by sector system
        isChained: true,
        choices: [
            {
                text: "Emergency repairs (-$3B)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 3);
                    const sectors = state.get('sectors') || {};
                    sectors.infrastructure.health = Math.min(100, sectors.infrastructure.health + 20);
                    state.update('sectors', sectors);
                }
            },
            {
                text: "Blame previous administration",
                effect: (state, engine) => {
                    state.update('approval', (state.get('approval') || 50) - 5);
                }
            }
        ]
    },
    blackout: {
        id: 'blackout',
        title: "Nationwide Blackout",
        desc: "The aging power grid has failed. Major cities are without power.",
        trigger: () => false,
        isChained: true,
        choices: [
            {
                text: "Emergency grid repairs (-$4B)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 4);
                    const sectors = state.get('sectors') || {};
                    sectors.infrastructure.health = Math.min(100, sectors.infrastructure.health + 25);
                    state.update('sectors', sectors);
                }
            },
            {
                text: "Request foreign technicians (-5 Sovereignty)",
                effect: (state, engine) => {
                    state.update('sovereignty', (state.get('sovereignty') || 100) - 5);
                }
            }
        ]
    },
    hospital_crisis: {
        id: 'hospital_crisis',
        title: "Hospitals Overwhelmed",
        desc: "Underfunded hospitals are turning away patients. People are dying in waiting rooms.",
        trigger: () => false,
        isChained: true,
        choices: [
            {
                text: "Emergency healthcare funding (-$2B)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 2);
                    const sectors = state.get('sectors') || {};
                    sectors.healthcare.health = Math.min(100, sectors.healthcare.health + 15);
                    state.update('sectors', sectors);
                }
            },
            {
                text: "Privatize hospitals (+Business, -Workers)",
                effect: (state, engine) => {
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Business Elite', 10);
                        fs.modifyGroupHappiness('Rural Workers', -15);
                        fs.modifyGroupHappiness('State Pensioners', -20);
                        fs.update(state);
                    }
                }
            }
        ]
    },
    epidemic: {
        id: 'epidemic',
        title: "Disease Outbreak!",
        desc: "A preventable disease is spreading due to insufficient healthcare infrastructure.",
        trigger: () => false,
        isChained: true,
        choices: [
            {
                text: "Lockdown and treatment (-$5B, -GDP)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 5);
                    state.update('gdp', state.get('gdp') * 0.98);
                }
            },
            {
                text: "Let it run its course (Major approval hit)",
                effect: (state, engine) => {
                    state.update('approval', (state.get('approval') || 50) - 15);
                }
            }
        ]
    },
    teacher_strike: {
        id: 'teacher_strike',
        title: "Teachers Strike",
        desc: "Underpaid teachers have walked out. Schools across the country are closed.",
        trigger: () => false,
        isChained: true,
        choices: [
            {
                text: "Meet their demands (-$1.5B)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 1.5);
                    const sectors = state.get('sectors') || {};
                    sectors.education.health = Math.min(100, sectors.education.health + 20);
                    state.update('sectors', sectors);
                }
            },
            {
                text: "Fire striking teachers",
                effect: (state, engine) => {
                    state.update('approval', (state.get('approval') || 50) - 10);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Youth Students', -20);
                        fs.update(state);
                    }
                }
            }
        ]
    },
    brain_drain: {
        id: 'brain_drain',
        title: "Brain Drain Crisis",
        desc: "Educated professionals are fleeing the country due to poor conditions.",
        trigger: () => false,
        isChained: true,
        choices: [
            {
                text: "Offer retention bonuses (-$2B)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 2);
                }
            },
            {
                text: "Restrict emigration (Sovereignty -10)",
                effect: (state, engine) => {
                    state.update('sovereignty', (state.get('sovereignty') || 100) - 10);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Youth Students', -15);
                        fs.update(state);
                    }
                }
            }
        ]
    },
    mutiny: {
        id: 'mutiny',
        title: "Military Mutiny!",
        desc: "Unpaid soldiers are refusing orders. Some units have abandoned their posts.",
        trigger: () => false,
        isChained: true,
        choices: [
            {
                text: "Pay military bonuses (-$3B)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 3);
                    const sectors = state.get('sectors') || {};
                    sectors.military.health = Math.min(100, sectors.military.health + 25);
                    state.update('sectors', sectors);
                }
            },
            {
                text: "Purge disloyal officers",
                effect: (state, engine) => {
                    const sectors = state.get('sectors') || {};
                    sectors.military.health = Math.max(0, sectors.military.health - 10);
                    state.update('sectors', sectors);
                }
            }
        ]
    },
    border_incursion: {
        id: 'border_incursion',
        title: "Border Incursion!",
        desc: "Hostile forces have crossed the border. Our weakened military cannot respond effectively.",
        trigger: () => false,
        isChained: true,
        choices: [
            {
                text: "Request foreign military aid (-15 Sovereignty)",
                effect: (state, engine) => {
                    state.update('sovereignty', (state.get('sovereignty') || 100) - 15);
                }
            },
            {
                text: "Cede territory (-10% GDP)",
                effect: (state, engine) => {
                    state.update('gdp', state.get('gdp') * 0.9);
                    state.update('approval', (state.get('approval') || 50) - 10);
                }
            }
        ]
    },
    crime_wave: {
        id: 'crime_wave',
        title: "Crime Wave Sweeping Nation",
        desc: "Underfunded police cannot control rising crime. Citizens live in fear.",
        trigger: () => false,
        isChained: true,
        choices: [
            {
                text: "Emergency police funding (-$2B)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 2);
                    const sectors = state.get('sectors') || {};
                    sectors.police.health = Math.min(100, sectors.police.health + 20);
                    state.update('sectors', sectors);
                }
            },
            {
                text: "Militarize the police (-Liberty)",
                effect: (state, engine) => {
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Youth Students', -15);
                        fs.modifyGroupHappiness('Minority Communities', -20);
                        fs.update(state);
                    }
                }
            }
        ]
    },
    riot: {
        id: 'riot',
        title: "Riots in Major Cities",
        desc: "Civil unrest has exploded. The police cannot maintain order.",
        trigger: () => false,
        isChained: true,
        choices: [
            {
                text: "Deploy National Guard (-$2B, +Unrest)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 2);
                }
            },
            {
                text: "Curfew and martial law",
                effect: (state, engine) => {
                    state.update('sovereignty', (state.get('sovereignty') || 100) - 5);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('all', -5);
                        fs.update(state);
                    }
                }
            }
        ]
    },
    homeless_crisis: {
        id: 'homeless_crisis',
        title: "Homelessness Epidemic",
        desc: "Thousands are living on the streets. Social services have collapsed.",
        trigger: () => false,
        isChained: true,
        choices: [
            {
                text: "Emergency housing program (-$3B)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 3);
                    const sectors = state.get('sectors') || {};
                    sectors.welfare.health = Math.min(100, sectors.welfare.health + 25);
                    state.update('sectors', sectors);
                }
            },
            {
                text: "Clear the camps (Force removal)",
                effect: (state, engine) => {
                    state.update('approval', (state.get('approval') || 50) - 10);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Youth Students', -15);
                        fs.update(state);
                    }
                }
            }
        ]
    },
    hunger_protest: {
        id: 'hunger_protest',
        title: "Hunger Protests",
        desc: "Citizens are protesting food insecurity. The welfare system has failed them.",
        trigger: () => false,
        isChained: true,
        choices: [
            {
                text: "Emergency food distribution (-$2B)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 2);
                    state.update('approval', (state.get('approval') || 50) + 5);
                }
            },
            {
                text: "Suppress the protests",
                effect: (state, engine) => {
                    const dm = engine.systems.find(s => s.addEventToDeck);
                    if (dm) dm.addEventToDeck('police_brutality');
                }
            }
        ]
    }
};

export class SectorSystem {
    constructor(gameEngine) {
        this.engine = gameEngine;
        this.initialized = false;
    }

    initializeSectors(state) {
        if (this.initialized) return;

        const sectors = {};
        Object.keys(SECTORS).forEach(key => {
            sectors[key] = {
                health: 100,
                funding: SECTORS[key].baseCost // Start at recommended funding
            };
        });
        state.update('sectors', sectors);
        this.initialized = true;
    }

    update(state) {
        // Initialize on first run
        if (!state.get('sectors')) {
            this.initializeSectors(state);
            return;
        }

        const sectors = state.get('sectors');
        let totalSectorCost = 0;

        Object.keys(SECTORS).forEach(key => {
            const config = SECTORS[key];
            const sector = sectors[key];

            // Calculate funding ratio
            const fundingRatio = sector.funding / config.baseCost;

            // Add to total cost
            totalSectorCost += sector.funding;

            // Update health based on funding
            if (fundingRatio >= 1.0) {
                // Full funding = slowly restore health
                sector.health = Math.min(100, sector.health + 0.2);
            } else if (fundingRatio >= 0.5) {
                // Partial funding = slow decay
                sector.health = Math.max(0, sector.health - config.decayRate * (1 - fundingRatio));
            } else {
                // Severe underfunding = rapid decay
                sector.health = Math.max(0, sector.health - config.decayRate * 2);
            }

            // Apply consequences for low health
            if (sector.health < 50) {
                this.applyConsequence(state, config, sector);
            }

            // Trigger events for very low health
            if (sector.health < config.eventThreshold && Math.random() < 0.05) {
                this.triggerSectorEvent(config);
            }
        });

        state.update('sectors', sectors);
        state.update('sectorExpense', totalSectorCost);
    }

    applyConsequence(state, config, sector) {
        const healthDeficit = 50 - sector.health;
        const penalty = healthDeficit * config.consequenceMultiplier;

        switch (config.consequence) {
            case 'gdp':
                state.update('gdp', state.get('gdp') * (1 - penalty / 100));
                break;
            case 'approval':
                state.update('approval', Math.max(0, (state.get('approval') || 50) - penalty / 10));
                break;
            case 'sovereignty':
                state.update('sovereignty', Math.max(0, (state.get('sovereignty') || 100) - penalty / 10));
                break;
            case 'unrest':
                // Increase regional unrest
                const regions = state.get('regions') || {};
                Object.values(regions).forEach(r => {
                    r.unrest = Math.min(100, (r.unrest || 0) + penalty / 10);
                });
                state.update('regions', regions);
                break;
        }
    }

    triggerSectorEvent(config) {
        if (!config.events || config.events.length === 0) return;

        const eventId = config.events[Math.floor(Math.random() * config.events.length)];
        const dm = this.engine.systems.find(s => s.addEventToDeck);
        if (dm) {
            dm.addEventToDeck(eventId);
            console.log(`[SECTOR] ${config.name} crisis: ${eventId} added to deck`);
        }
    }

    // Allow external systems to modify sector funding
    setSectorFunding(sectorKey, amount, state) {
        const sectors = state.get('sectors') || {};
        if (sectors[sectorKey]) {
            sectors[sectorKey].funding = Math.max(0, amount);
            state.update('sectors', sectors);
        }
    }

    getSectorHealth(sectorKey, state) {
        const sectors = state.get('sectors') || {};
        return sectors[sectorKey]?.health || 100;
    }
}
