export const LAW_BRANCHES = {
    WELFARE: 'welfare',
    AUTHORITY: 'authority',
    LIBERTY: 'liberty',
    ECONOMY: 'economy'
};

export const LAWS = {
    // === WELFARE BRANCH ===
    'min_wage': {
        id: 'min_wage', title: "Minimum Wage Act", branch: LAW_BRANCHES.WELFARE, tier: 1,
        desc: "Sets a livable baseline wage for all workers.",
        costPC: 2, maintenance: 0, prereqs: [],
        effects: { 'Rural Workers': 10, 'Business Elite': -10, gdpGrowth: -0.005 }
    },
    'healthcare_act': {
        id: 'healthcare_act', title: "Universal Healthcare", branch: LAW_BRANCHES.WELFARE, tier: 2,
        desc: "State-funded healthcare for all citizens.",
        costPC: 4, maintenance: 2, prereqs: ['min_wage'],
        effects: { 'State Pensioners': 20, 'Rural Workers': 15, approval: 5, healthcareSectorBonus: 20 }
    },
    'ubi': {
        id: 'ubi', title: "Universal Basic Income", branch: LAW_BRANCHES.WELFARE, tier: 3,
        desc: "A guaranteed monthly payment to every citizen.",
        costPC: 8, maintenance: 10, prereqs: ['healthcare_act'],
        effects: { approval: 15, 'Rural Workers': 25, 'Business Elite': -20 }
    },
    'free_childcare': {
        id: 'free_childcare', title: "Free Childcare", branch: LAW_BRANCHES.WELFARE, tier: 1,
        desc: "State-funded childcare for working parents.",
        costPC: 3, maintenance: 1.5, prereqs: [],
        effects: { 'Urban Middle Class': 15, approval: 3 }
    },
    'pension_reform': {
        id: 'pension_reform', title: "Pension Expansion", branch: LAW_BRANCHES.WELFARE, tier: 2,
        desc: "Higher pensions for retired citizens.",
        costPC: 3, maintenance: 3, prereqs: ['free_childcare'],
        effects: { 'State Pensioners': 25, welfareSectorBonus: 15 }
    },

    // === AUTHORITY BRANCH ===
    'police_powers': {
        id: 'police_powers', title: "Expanded Police Powers", branch: LAW_BRANCHES.AUTHORITY, tier: 1,
        desc: "Broader search and seizure rights.",
        costPC: 2, maintenance: 0.5, prereqs: [],
        effects: { policeSectorBonus: 15, 'Minority Communities': -15 }
    },
    'surveillance_act': {
        id: 'surveillance_act', title: "Digital Surveillance Act", branch: LAW_BRANCHES.AUTHORITY, tier: 2,
        desc: "Monitor internet traffic for national security.",
        costPC: 5, maintenance: 1, prereqs: ['police_powers'],
        effects: { 'Youth Students': -20, crimeReduction: 10 }
    },
    'martial_law_readiness': {
        id: 'martial_law_readiness', title: "Emergency State Protocol", branch: LAW_BRANCHES.AUTHORITY, tier: 3,
        desc: "Legal framework to suspend elections in crises.",
        costPC: 10, maintenance: 2, prereqs: ['surveillance_act'],
        effects: { sovereignty: 10, approval: -10 }
    },
    'mandatory_service': {
        id: 'mandatory_service', title: "Mandatory Military Service", branch: LAW_BRANCHES.AUTHORITY, tier: 2,
        desc: "All citizens must serve 2 years in the military.",
        costPC: 6, maintenance: 2, prereqs: ['police_powers'],
        effects: { militarySectorBonus: 25, 'Youth Students': -20, 'Rural Workers': 10 }
    },
    'curfew_powers': {
        id: 'curfew_powers', title: "Curfew Authorization", branch: LAW_BRANCHES.AUTHORITY, tier: 1,
        desc: "Allow local authorities to impose curfews.",
        costPC: 2, maintenance: 0, prereqs: [],
        effects: { unrestReduction: 5, 'Youth Students': -10 }
    },

    // === LIBERTY BRANCH ===
    'deregulation': {
        id: 'deregulation', title: "Market Deregulation", branch: LAW_BRANCHES.LIBERTY, tier: 1,
        desc: "Remove 'red tape' hindering business growth.",
        costPC: 2, maintenance: 0, prereqs: [],
        effects: { 'Business Elite': 15, gdpGrowth: 0.01, 'Rural Workers': -5 }
    },
    'privatization': {
        id: 'privatization', title: "Privatization Initiative", branch: LAW_BRANCHES.LIBERTY, tier: 2,
        desc: "Sell off state assets to private investors.",
        costPC: 4, maintenance: -1, prereqs: ['deregulation'],
        effects: { 'Business Elite': 20, 'State Pensioners': -15, budgetBonus: 3 }
    },
    'corp_sovereignty': {
        id: 'corp_sovereignty', title: "Corporate Sovereignty Zones", branch: LAW_BRANCHES.LIBERTY, tier: 3,
        desc: "Areas where corporations set their own laws.",
        costPC: 10, maintenance: 0, prereqs: ['privatization'],
        effects: { 'Business Elite': 30, sovereignty: -15, 'Rural Workers': -20 }
    },
    'internet_freedom': {
        id: 'internet_freedom', title: "Internet Freedom Act", branch: LAW_BRANCHES.LIBERTY, tier: 1,
        desc: "Guarantee free and open internet access.",
        costPC: 2, maintenance: 0, prereqs: [],
        effects: { 'Youth Students': 20, techTradeBonus: 10 }
    },
    'decriminalization': {
        id: 'decriminalization', title: "Drug Decriminalization", branch: LAW_BRANCHES.LIBERTY, tier: 2,
        desc: "Decriminalize personal drug use, focus on treatment.",
        costPC: 4, maintenance: 0.5, prereqs: ['internet_freedom'],
        effects: { 'Youth Students': 15, 'Rural Workers': -10, policeCostReduction: 0.5 }
    },

    // === ECONOMY BRANCH (NEW) ===
    'land_reform': {
        id: 'land_reform', title: "Land Reform Act", branch: LAW_BRANCHES.ECONOMY, tier: 1,
        desc: "Redistribute land to small farmers.",
        costPC: 5, maintenance: 0, prereqs: [],
        effects: { 'Rural Workers': 25, 'Business Elite': -20, approval: 5 }
    },
    'nationalization': {
        id: 'nationalization', title: "Strategic Nationalization", branch: LAW_BRANCHES.ECONOMY, tier: 2,
        desc: "Bring key industries under state control.",
        costPC: 8, maintenance: 3, prereqs: ['land_reform'],
        effects: { 'Business Elite': -30, sovereignty: 10, domesticProduction: 15 }
    },
    'tax_haven': {
        id: 'tax_haven', title: "Tax Haven Status", branch: LAW_BRANCHES.ECONOMY, tier: 1,
        desc: "Attract foreign investment with low taxes.",
        costPC: 3, maintenance: -2, prereqs: [],
        effects: { 'Business Elite': 25, 'Rural Workers': -10, foreignInvestment: 20 }
    },
    'protectionism': {
        id: 'protectionism', title: "Protectionist Tariffs", branch: LAW_BRANCHES.ECONOMY, tier: 2,
        desc: "High tariffs to protect domestic industry.",
        costPC: 4, maintenance: 0, prereqs: [],
        effects: { domesticProduction: 20, tradeAccess: -15, 'Rural Workers': 10 }
    },
    'green_transition': {
        id: 'green_transition', title: "Green Transition Act", branch: LAW_BRANCHES.ECONOMY, tier: 3,
        desc: "Mandate transition to renewable energy by 2035.",
        costPC: 6, maintenance: 2, prereqs: ['land_reform'],
        effects: { 'Youth Students': 25, 'Business Elite': -15, energySectorBonus: 20 }
    }
};

export class LawSystem {
    constructor() {
        this.signedLaws = []; // List of IDs
    }

    update(state) {
        // Apply ongoing costs of signed laws
        let totalLawMaintenance = 0;

        this.signedLaws.forEach(lawId => {
            const law = LAWS[lawId];
            if (law) {
                totalLawMaintenance += law.maintenance;
            }
        });

        state.update('active_laws', this.signedLaws);
        state.update('law_maintenance_cost', totalLawMaintenance);
    }

    canSign(state, lawId) {
        const law = LAWS[lawId];
        if (!law) return false;
        if (this.signedLaws.includes(lawId)) return false; // Already signed

        // Check PC
        const pc = state.get('politicalCapital') || 0;
        if (pc < law.costPC) return false;

        // Check Prereqs
        for (let req of law.prereqs) {
            if (!this.signedLaws.includes(req)) return false;
        }

        return true;
    }

    signLaw(state, lawId) {
        if (!this.canSign(state, lawId)) return false;

        const law = LAWS[lawId];

        // Deduct Cost
        const pc = state.get('politicalCapital');
        state.update('politicalCapital', pc - law.costPC);

        // Add to list
        this.signedLaws.push(lawId);

        // Trigger immediate effects (if any)
        // Ideally we'd modify factions here. 
        // For now, let's just log it.
        console.log(`Signed Law: ${law.title}`);

        return true;
    }
}
