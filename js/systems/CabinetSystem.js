// ============================================
// CABINET SYSTEM - Ministers with Perks
// ============================================

export const MINISTRIES = {
    economy: { name: 'Economy', icon: '💰', sector: 'infrastructure' },
    defense: { name: 'Defense', icon: '🛡️', sector: 'military' },
    foreign: { name: 'Foreign Affairs', icon: '🌐', sector: null },
    interior: { name: 'Interior', icon: '🏛️', sector: 'police' },
    welfare: { name: 'Welfare', icon: '🤝', sector: 'welfare' },
    education: { name: 'Education', icon: '📚', sector: 'education' }
};

export const SPECIALIZATIONS = {
    technocrat: {
        name: "Technocrat",
        desc: "+15% sector efficiency, -5 faction appeal",
        competenceBonus: 15,
        loyaltyPenalty: 0,
        sectorBonus: 0.15,
        factionPenalty: 5
    },
    populist: {
        name: "Populist",
        desc: "+10 approval, -10% efficiency",
        competenceBonus: -10,
        loyaltyPenalty: 0,
        approvalBonus: 10,
        sectorBonus: -0.1
    },
    loyalist: {
        name: "Loyalist",
        desc: "Never causes scandals, low performance",
        competenceBonus: -20,
        loyaltyPenalty: -40,
        scandalImmune: true
    },
    reformer: {
        name: "Reformer",
        desc: "Laws cost 1 less PC, may cause controversy",
        competenceBonus: 5,
        loyaltyPenalty: 10,
        lawCostReduction: 1
    },
    hawk: {
        name: "Hawk",
        desc: "+Sovereignty, angers neighbors",
        competenceBonus: 10,
        loyaltyPenalty: 5,
        sovereigntyBonus: 5,
        tradeAccessPenalty: 5
    },
    dove: {
        name: "Dove",
        desc: "+Trade access, -Sovereignty",
        competenceBonus: 5,
        loyaltyPenalty: 0,
        tradeAccessBonus: 10,
        sovereigntyPenalty: 3
    }
};

const FIRST_NAMES = [
    "James", "Maria", "David", "Elena", "Robert", "Sophie", "Michael", "Anna",
    "Thomas", "Lisa", "Alexander", "Victoria", "William", "Catherine", "Joseph",
    "Margaret", "George", "Elizabeth", "Henry", "Sarah", "Ivan", "Natasha"
];

const LAST_NAMES = [
    "Smith", "Kovacs", "Dupont", "Müller", "Garcia", "Tanaka", "Ivanov", "Kim",
    "Patel", "Rossi", "Anderson", "Novak", "Fischer", "Santos", "Volkov",
    "Petrov", "Yamamoto", "Wong", "Singh", "O'Brien"
];

export class CabinetSystem {
    constructor() {
        this.ministers = {};
        this.scapegoatCooldown = 0;

        // Initialize with Interim Ministers
        Object.keys(MINISTRIES).forEach(id => {
            this.ministers[id] = this.generateMinister(id, true);
        });
    }

    generateMinister(role, isInterim = false) {
        if (isInterim) {
            return {
                id: 'interim_' + role,
                name: 'Interim Minister',
                role: role,
                competence: 25,
                loyalty: 50,
                specialization: null,
                isInterim: true
            };
        }

        // Random specialization
        const specKeys = Object.keys(SPECIALIZATIONS);
        const specKey = specKeys[Math.floor(Math.random() * specKeys.length)];
        const spec = SPECIALIZATIONS[specKey];

        const baseCompetence = 30 + Math.floor(Math.random() * 50);
        const baseLoyalty = 30 + Math.floor(Math.random() * 50);

        return {
            id: 'minister_' + Math.floor(Math.random() * 100000),
            name: `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`,
            role: role,
            competence: Math.max(10, Math.min(95, baseCompetence + (spec.competenceBonus || 0))),
            loyalty: Math.max(10, Math.min(95, baseLoyalty - (spec.loyaltyPenalty || 0))),
            specialization: specKey,
            isInterim: false
        };
    }

    generateCandidates(role, count = 3) {
        const candidates = [];
        for (let i = 0; i < count; i++) {
            candidates.push(this.generateMinister(role, false));
        }
        return candidates;
    }

    update(state) {
        state.update('cabinet', this.ministers);

        // Decrement scapegoat cooldown
        if (this.scapegoatCooldown > 0) this.scapegoatCooldown--;

        // Apply minister effects
        Object.keys(this.ministers).forEach(role => {
            const minister = this.ministers[role];
            const ministry = MINISTRIES[role];
            if (!ministry || minister.isInterim) return;

            const spec = minister.specialization ? SPECIALIZATIONS[minister.specialization] : null;

            // Sector efficiency bonus
            if (ministry.sector && spec?.sectorBonus) {
                const sectors = state.get('sectors') || {};
                if (sectors[ministry.sector]) {
                    // Bonus to health regeneration
                    sectors[ministry.sector].health = Math.min(100,
                        sectors[ministry.sector].health + spec.sectorBonus * 0.5);
                    state.update('sectors', sectors);
                }
            }

            // Approval bonus
            if (spec?.approvalBonus) {
                state.update('approval', Math.min(100, (state.get('approval') || 50) + spec.approvalBonus * 0.01));
            }

            // Sovereignty bonus
            if (spec?.sovereigntyBonus) {
                state.update('sovereignty', Math.min(100, (state.get('sovereignty') || 100) + spec.sovereigntyBonus * 0.01));
            }
        });

        // Scandal check (1% per day)
        if (Math.random() < 0.01) {
            this.checkScandals(state);
        }
    }

    checkScandals(state) {
        const riskyMinisters = Object.values(this.ministers).filter(m => {
            if (m.isInterim) return false;
            const spec = m.specialization ? SPECIALIZATIONS[m.specialization] : null;
            if (spec?.scandalImmune) return false;
            return m.loyalty < 40;
        });

        if (riskyMinisters.length > 0 && Math.random() < 0.3) {
            const scapegoat = riskyMinisters[Math.floor(Math.random() * riskyMinisters.length)];
            const dm = state._engine?.systems?.find(s => s.addEventToDeck);
            if (dm) {
                dm.addEventToDeck('minister_scandal');
            }
            state.update('active_scandal', {
                title: `${scapegoat.name} Implicated in Scandal!`,
                ministerId: scapegoat.id,
                ministerRole: scapegoat.role
            });
        }
    }

    scapegoat(role, state) {
        if (this.scapegoatCooldown > 0) {
            console.log('[CABINET] Scapegoat on cooldown');
            return false;
        }

        const minister = this.ministers[role];
        if (!minister || minister.isInterim) return false;

        // Fire minister, gain approval
        state.update('approval', Math.min(100, (state.get('approval') || 50) + 5));
        state.update('politicalCapital', (state.get('politicalCapital') || 50) - 3);

        // Clear scandal if it was about this minister
        const scandal = state.get('active_scandal');
        if (scandal?.ministerRole === role) {
            state.update('active_scandal', null);
        }

        this.ministers[role] = this.generateMinister(role, true);
        this.scapegoatCooldown = 30; // 30 day cooldown

        console.log(`[CABINET] Scapegoated ${minister.name}`);
        return true;
    }

    fireMinister(role) {
        this.ministers[role] = this.generateMinister(role, true);
    }

    hireMinister(role, minister) {
        this.ministers[role] = minister;
    }

    getMinisterInfo(role) {
        const minister = this.ministers[role];
        if (!minister) return null;

        const spec = minister.specialization ? SPECIALIZATIONS[minister.specialization] : null;
        return {
            ...minister,
            specName: spec?.name || 'None',
            specDesc: spec?.desc || 'No specialization'
        };
    }
}
