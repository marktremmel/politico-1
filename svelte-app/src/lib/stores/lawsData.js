// ============================================
// LAWS DATA - Svelte Version with Faction Effects
// ============================================

import { writable } from 'svelte/store';
import { voterGroups, approval, gdp, sovereignty } from './gameState.js';
import { get } from 'svelte/store';

export const activeLaws = writable([]);

export const LAW_BRANCHES = {
    WELFARE: 'welfare',
    AUTHORITY: 'authority',
    LIBERTY: 'liberty',
    ECONOMY: 'economy'
};

// Laws with faction effects
export const LAWS = {
    // WELFARE - Popular with workers/pensioners, unpopular with business
    'min_wage': {
        id: 'min_wage', title: "Minimum Wage", branch: 'welfare', tier: 1, costPC: 2, prereqs: [],
        desc: "Baseline wage for workers",
        effects: { 'Rural Workers': 10, 'State Pensioners': 5, 'Business Elite': -15 }
    },
    'healthcare_act': {
        id: 'healthcare_act', title: "Universal Healthcare", branch: 'welfare', tier: 2, costPC: 4, prereqs: ['min_wage'],
        desc: "State-funded healthcare",
        effects: { 'State Pensioners': 15, 'Rural Workers': 10, 'Business Elite': -10 }
    },
    'ubi': {
        id: 'ubi', title: "Universal Basic Income", branch: 'welfare', tier: 3, costPC: 8, prereqs: ['healthcare_act'],
        desc: "Monthly payment to all",
        effects: { 'Rural Workers': 20, 'State Pensioners': 15, 'Youth Students': 10, 'Business Elite': -25 }
    },
    'free_childcare': {
        id: 'free_childcare', title: "Free Childcare", branch: 'welfare', tier: 1, costPC: 3, prereqs: [],
        desc: "State-funded childcare",
        effects: { 'Urban Middle Class': 10, 'Rural Workers': 5 }
    },
    'pension_reform': {
        id: 'pension_reform', title: "Pension Expansion", branch: 'welfare', tier: 2, costPC: 3, prereqs: ['free_childcare'],
        desc: "Higher pensions",
        effects: { 'State Pensioners': 20, 'Business Elite': -5 }
    },

    // AUTHORITY - Popular with traditionalists, unpopular with youth/minorities
    'police_powers': {
        id: 'police_powers', title: "Police Powers", branch: 'authority', tier: 1, costPC: 2, prereqs: [],
        desc: "Broader search rights",
        effects: { 'Business Elite': 5, 'Youth Students': -10, 'Minority Communities': -15 }
    },
    'surveillance_act': {
        id: 'surveillance_act', title: "Surveillance Act", branch: 'authority', tier: 2, costPC: 5, prereqs: ['police_powers'],
        desc: "Monitor internet",
        effects: { 'Youth Students': -20, 'Urban Middle Class': -10, 'Minority Communities': -10 }
    },
    'martial_law': {
        id: 'martial_law', title: "Emergency Protocol", branch: 'authority', tier: 3, costPC: 10, prereqs: ['surveillance_act'],
        desc: "Suspend elections in crisis",
        effects: { 'Youth Students': -25, 'Minority Communities': -20, 'Business Elite': 10 }
    },
    'curfew_powers': {
        id: 'curfew_powers', title: "Curfew Powers", branch: 'authority', tier: 1, costPC: 2, prereqs: [],
        desc: "Allow local curfews",
        effects: { 'Youth Students': -15, 'Rural Workers': 5 }
    },

    // LIBERTY - Popular with business/urban, unpopular with workers
    'deregulation': {
        id: 'deregulation', title: "Deregulation", branch: 'liberty', tier: 1, costPC: 2, prereqs: [],
        desc: "Remove business red tape",
        effects: { 'Business Elite': 20, 'Urban Middle Class': 10, 'Rural Workers': -10 }
    },
    'privatization': {
        id: 'privatization', title: "Privatization", branch: 'liberty', tier: 2, costPC: 4, prereqs: ['deregulation'],
        desc: "Sell state assets",
        effects: { 'Business Elite': 25, 'State Pensioners': -15, 'Rural Workers': -15 }
    },
    'internet_freedom': {
        id: 'internet_freedom', title: "Internet Freedom", branch: 'liberty', tier: 1, costPC: 2, prereqs: [],
        desc: "Open internet access",
        effects: { 'Youth Students': 20, 'Urban Middle Class': 10 }
    },

    // ECONOMY
    'land_reform': {
        id: 'land_reform', title: "Land Reform", branch: 'economy', tier: 1, costPC: 5, prereqs: [],
        desc: "Redistribute land",
        effects: { 'Rural Workers': 25, 'Business Elite': -20 }
    },
    'nationalization': {
        id: 'nationalization', title: "Nationalization", branch: 'economy', tier: 2, costPC: 8, prereqs: ['land_reform'],
        desc: "State-owned industries",
        effects: { 'Rural Workers': 15, 'State Pensioners': 10, 'Business Elite': -30 },
        bonus: (state) => sovereignty.update(s => Math.min(100, s + 5))
    },
    'tax_haven': {
        id: 'tax_haven', title: "Tax Haven", branch: 'economy', tier: 1, costPC: 3, prereqs: [],
        desc: "Attract investment",
        effects: { 'Business Elite': 25, 'Urban Middle Class': 5, 'Rural Workers': -5 },
        bonus: (state) => gdp.update(g => g * 1.03)
    },
    'protectionism': {
        id: 'protectionism', title: "Tariffs", branch: 'economy', tier: 2, costPC: 4, prereqs: [],
        desc: "Protect domestic industry",
        effects: { 'Rural Workers': 15, 'Business Elite': -10 }
    }
};

export function canSignLaw(lawId, currentLaws, pc) {
    const law = LAWS[lawId];
    if (!law) return false;
    if (currentLaws.includes(lawId)) return false;
    if (pc < law.costPC) return false;
    return law.prereqs.every(req => currentLaws.includes(req));
}

export function getLawsByBranch(branch) {
    return Object.values(LAWS).filter(l => l.branch === branch);
}

// Apply law effects to factions
export function applyLawEffects(lawId) {
    const law = LAWS[lawId];
    if (!law || !law.effects) return;

    const groups = get(voterGroups);
    groups.forEach(group => {
        if (law.effects[group.name]) {
            group.happiness = Math.max(0, Math.min(100, group.happiness + law.effects[group.name]));
        }
    });
    voterGroups.set(groups);

    // Apply bonus if exists
    if (law.bonus) law.bonus();
}
