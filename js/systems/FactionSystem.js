// ============================================
// FACTION SYSTEM - Active Factions with Demands
// ============================================

export const FACTION_IDS = {
    CAPITALISTS: 'capitalists',
    SOCIALISTS: 'socialists',
    TRADITIONALISTS: 'traditionalists',
    LIBERALS: 'liberals',
    NATIONALISTS: 'nationalists',
    MINORITIES: 'minorities'
};

// Faction demands - what they want you to do
export const FACTION_DEMANDS = {
    'Business Elite': [
        { id: 'demand_cut_taxes', text: "Cut corporate regulations", lawId: 'deregulation', urgency: 0 },
        { id: 'demand_privatize', text: "Privatize state assets", lawId: 'privatization', urgency: 0 }
    ],
    'Rural Workers': [
        { id: 'demand_min_wage', text: "Raise minimum wage", lawId: 'min_wage', urgency: 0 },
        { id: 'demand_land', text: "Implement land reform", lawId: 'land_reform', urgency: 0 }
    ],
    'State Pensioners': [
        { id: 'demand_healthcare', text: "Pass universal healthcare", lawId: 'healthcare_act', urgency: 0 },
        { id: 'demand_pension', text: "Expand pensions", lawId: 'pension_reform', urgency: 0 }
    ],
    'Youth Students': [
        { id: 'demand_internet', text: "Protect internet freedom", lawId: 'internet_freedom', urgency: 0 },
        { id: 'demand_green', text: "Pass green legislation", lawId: 'green_transition', urgency: 0 }
    ],
    'Minority Communities': [
        { id: 'demand_rights', text: "Expand civil rights", lawId: 'decriminalization', urgency: 0 }
    ],
    'Urban Middle Class': [
        { id: 'demand_stability', text: "Maintain economic stability", lawId: null, urgency: 0 }
    ]
};

export class FactionSystem {
    constructor() {
        this.factions = {};
        Object.values(FACTION_IDS).forEach(id => {
            this.factions[id] = { id, support: 50 };
        });

        this.voterGroups = [
            {
                name: "Rural Workers", population: 0.25, happiness: 50,
                affinities: {
                    [FACTION_IDS.SOCIALISTS]: 0.6, [FACTION_IDS.TRADITIONALISTS]: 0.8,
                    [FACTION_IDS.NATIONALISTS]: 0.7, [FACTION_IDS.CAPITALISTS]: -0.3,
                    [FACTION_IDS.LIBERALS]: -0.5
                }
            },
            {
                name: "Urban Middle Class", population: 0.30, happiness: 50,
                affinities: {
                    [FACTION_IDS.LIBERALS]: 0.8, [FACTION_IDS.CAPITALISTS]: 0.5,
                    [FACTION_IDS.TRADITIONALISTS]: -0.4, [FACTION_IDS.SOCIALISTS]: 0.2
                }
            },
            {
                name: "Business Elite", population: 0.05, happiness: 60,
                affinities: {
                    [FACTION_IDS.CAPITALISTS]: 1.0, [FACTION_IDS.LIBERALS]: 0.3,
                    [FACTION_IDS.SOCIALISTS]: -0.9
                }
            },
            {
                name: "State Pensioners", population: 0.20, happiness: 50,
                affinities: {
                    [FACTION_IDS.SOCIALISTS]: 0.7, [FACTION_IDS.TRADITIONALISTS]: 0.6,
                    [FACTION_IDS.LIBERALS]: -0.4
                }
            },
            {
                name: "Minority Communities", population: 0.10, happiness: 50,
                affinities: {
                    [FACTION_IDS.MINORITIES]: 1.0, [FACTION_IDS.LIBERALS]: 0.6,
                    [FACTION_IDS.NATIONALISTS]: -0.9
                }
            },
            {
                name: "Youth Students", population: 0.10, happiness: 50,
                affinities: {
                    [FACTION_IDS.LIBERALS]: 0.9, [FACTION_IDS.SOCIALISTS]: 0.6,
                    [FACTION_IDS.TRADITIONALISTS]: -0.8, [FACTION_IDS.CAPITALISTS]: 0.1
                }
            }
        ];

        this.activeDemands = []; // Current demands being made
        this.protestCooldown = 0;
    }

    update(state) {
        this.recalculateSupport(state);
        this.checkFactionActions(state);
        this.updateDemands(state);

        if (this.protestCooldown > 0) this.protestCooldown--;
    }

    checkFactionActions(state) {
        // Unhappy factions take action
        this.voterGroups.forEach(group => {
            const demands = FACTION_DEMANDS[group.name] || [];

            // === VERY UNHAPPY (< 25): PROTESTS ===
            if (group.happiness < 25 && this.protestCooldown === 0) {
                this.triggerProtest(group, state);
            }

            // === UNHAPPY (< 40): ISSUE DEMANDS ===
            else if (group.happiness < 40 && demands.length > 0) {
                this.issueDemand(group, state);
            }

            // === ANGRY (< 15): RIOTS/STRIKES ===
            if (group.happiness < 15) {
                this.triggerRiot(group, state);
            }
        });
    }

    triggerProtest(group, state) {
        this.protestCooldown = 30; // 30 day cooldown

        // Increase unrest in a random region
        const regions = state.get('regions') || {};
        const regionKeys = Object.keys(regions);
        if (regionKeys.length > 0) {
            const region = regionKeys[Math.floor(Math.random() * regionKeys.length)];
            regions[region].unrest = Math.min(100, (regions[region].unrest || 0) + 15);
            state.update('regions', regions);
        }

        // Reduce sovereignty (shows weakness)
        state.update('sovereignty', Math.max(0, (state.get('sovereignty') || 100) - 2));

        // News
        const news = state._engine?.systems?.find(s => s.addNews);
        if (news) {
            news.addNews(`📢 ${group.name} stage protest - demand action!`, 'negative');
        }

        console.log(`[FACTION] ${group.name} protesting! (Happiness: ${group.happiness})`);
    }

    triggerRiot(group, state) {
        // Only once per group when they hit <15
        if (group._riotTriggered) return;
        group._riotTriggered = true;

        // Major unrest spike
        const regions = state.get('regions') || {};
        Object.keys(regions).forEach(key => {
            regions[key].unrest = Math.min(100, (regions[key].unrest || 0) + 10);
        });
        state.update('regions', regions);

        // Approval hit
        state.update('approval', Math.max(0, (state.get('approval') || 50) - 5));

        // Sovereignty hit (instability)
        state.update('sovereignty', Math.max(0, (state.get('sovereignty') || 100) - 5));

        // Trigger event
        const dm = state._engine?.systems?.find(s => s.addEventToDeck);
        if (dm) {
            dm.addEventToDeck('faction_riot');
        }

        console.log(`[FACTION] ${group.name} RIOTING!`);
    }

    issueDemand(group, state) {
        const demands = FACTION_DEMANDS[group.name] || [];
        const activeLaws = state.get('active_laws') || [];

        // Find an unfulfilled demand
        const unfulfilled = demands.find(d => d.lawId && !activeLaws.includes(d.lawId));
        if (!unfulfilled) return;

        // Check if already demanding
        if (this.activeDemands.find(d => d.id === unfulfilled.id)) {
            // Increase urgency
            const existing = this.activeDemands.find(d => d.id === unfulfilled.id);
            existing.urgency = Math.min(100, existing.urgency + 5);
            return;
        }

        // Issue new demand
        this.activeDemands.push({
            ...unfulfilled,
            from: group.name,
            issuedAt: state.get('daysPassed') || 0,
            urgency: 20
        });

        const news = state._engine?.systems?.find(s => s.addNews);
        if (news) {
            news.addNews(`⚠️ ${group.name} demand: "${unfulfilled.text}"`, 'neutral');
        }

        console.log(`[FACTION] ${group.name} demands: ${unfulfilled.text}`);
    }

    updateDemands(state) {
        const activeLaws = state.get('active_laws') || [];

        // Remove fulfilled demands
        this.activeDemands = this.activeDemands.filter(d => {
            if (d.lawId && activeLaws.includes(d.lawId)) {
                // Fulfilled! Boost happiness
                this.modifyGroupHappiness(d.from, 15);
                console.log(`[FACTION] Demand fulfilled: ${d.text}`);
                return false;
            }
            return true;
        });

        // Increase urgency of old demands
        this.activeDemands.forEach(d => {
            const age = (state.get('daysPassed') || 0) - d.issuedAt;
            if (age > 30) {
                d.urgency = Math.min(100, d.urgency + 1);
            }
            // Very old demands = happiness drain
            if (age > 60) {
                this.modifyGroupHappiness(d.from, -0.5);
            }
        });

        state.update('factionDemands', this.activeDemands);
    }

    recalculateSupport(state) {
        const scores = {};
        Object.values(FACTION_IDS).forEach(id => scores[id] = 0);

        Object.values(FACTION_IDS).forEach(factionId => {
            let totalWeight = 0;
            let totalScore = 0;

            this.voterGroups.forEach(group => {
                const affinity = group.affinities[factionId] || 0;
                if (affinity > 0) {
                    const weight = group.population * affinity;
                    totalWeight += weight;
                    totalScore += (group.happiness * weight);
                }
            });

            this.factions[factionId].support = totalWeight > 0 ? totalScore / totalWeight : 50;
        });

        state.update('factions', this.factions);
        state.update('voterGroups', this.voterGroups);
        this.updateGlobalApproval(state);
    }

    updateGlobalApproval(state) {
        let totalPop = 0;
        let weightedHappiness = 0;

        this.voterGroups.forEach(group => {
            totalPop += group.population;
            weightedHappiness += (group.happiness * group.population);
        });

        // Don't overwrite unrest-affected approval, blend it
        const calculatedApproval = weightedHappiness / totalPop;
        const currentApproval = state.get('approval') || 50;
        const blendedApproval = (calculatedApproval * 0.3) + (currentApproval * 0.7);

        state.update('approval', parseFloat(blendedApproval.toFixed(1)));
    }

    modifyGroupHappiness(groupName, amount) {
        this.voterGroups.forEach(group => {
            if (groupName === 'all' || group.name === groupName) {
                group.happiness = Math.max(0, Math.min(100, group.happiness + amount));
                // Reset riot flag if happiness recovers
                if (group.happiness >= 20) group._riotTriggered = false;
            }
        });
    }

    applyImpactByTag(factionTag, amount) {
        this.voterGroups.forEach(group => {
            const affinity = group.affinities[factionTag] || 0;
            if (affinity !== 0) {
                group.happiness = Math.max(0, Math.min(100, group.happiness + amount * affinity));
            }
        });
    }

    getActiveDemands() {
        return this.activeDemands;
    }
}
