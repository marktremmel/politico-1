// ============================================
// SCENARIOS - Central/Eastern European Countries
// ============================================

import { writable } from 'svelte/store';

export const selectedScenario = writable(null);
export const playerCharacter = writable(null);

export const SCENARIOS = {
    hungary: {
        id: 'hungary',
        name: 'Hungary',
        flag: '🇭🇺',
        difficulty: 'Medium',
        description: 'Navigate EU tensions while managing domestic populism',
        startYear: 2025,

        // Starting stats
        stats: {
            countryName: 'Hungary',
            gdp: 180,
            budget: -5,
            approval: 45,
            sovereignty: 60,
            politicalCapital: 40
        },

        // Unique challenges
        challenges: [
            'EU funding disputes',
            'Corruption scandals',
            'Media control debates',
            'Energy dependence on Russia'
        ],

        // Faction adjustments
        factionAdjust: {
            'Rural Workers': 5,      // Traditional base
            'Urban Middle Class': -10, // Opposition stronghold
            'Business Elite': 10,    // Close to power
            'Youth Students': -15    // Brain drain concerns
        },

        // Special events
        specialEvents: ['eu_funding_freeze', 'russia_gas_deal']
    },

    poland: {
        id: 'poland',
        name: 'Poland',
        flag: '🇵🇱',
        difficulty: 'Medium',
        description: 'Balance reform with stability in the EUs largest Eastern member',
        startYear: 2025,

        stats: {
            countryName: 'Poland',
            gdp: 680,
            budget: -8,
            approval: 50,
            sovereignty: 75,
            politicalCapital: 45
        },

        challenges: [
            'Judiciary reform disputes',
            'High inflation',
            'Strong opposition',
            'Ukraine border security'
        ],

        factionAdjust: {
            'Rural Workers': 10,    // Strong rural support
            'Urban Middle Class': -5,
            'State Pensioners': 5,
            'Youth Students': -5
        },

        specialEvents: ['judiciary_clash', 'ukraine_crisis']
    },

    czechia: {
        id: 'czechia',
        name: 'Czechia',
        flag: '🇨🇿',
        difficulty: 'Easy',
        description: 'Manage a stable economy while addressing demographic challenges',
        startYear: 2025,

        stats: {
            countryName: 'Czech Republic',
            gdp: 290,
            budget: -3,
            approval: 55,
            sovereignty: 85,
            politicalCapital: 55
        },

        challenges: [
            'Aging population',
            'Low R&D spending',
            'Housing crisis',
            'Labor shortages'
        ],

        factionAdjust: {
            'Urban Middle Class': 5,
            'Business Elite': 10,
            'State Pensioners': -5,
            'Youth Students': 5
        },

        specialEvents: ['pension_crisis', 'tech_opportunity']
    },

    romania: {
        id: 'romania',
        name: 'Romania',
        flag: '🇷🇴',
        difficulty: 'Hard',
        description: 'Fight corruption while managing a massive budget deficit',
        startYear: 2025,

        stats: {
            countryName: 'Romania',
            gdp: 350,
            budget: -15,
            approval: 35,
            sovereignty: 65,
            politicalCapital: 30
        },

        challenges: [
            '8% GDP deficit',
            'Political instability',
            'Corruption endemic',
            'Far-right rise'
        ],

        factionAdjust: {
            'Rural Workers': -5,
            'Urban Middle Class': -10,
            'Minority Communities': -10,
            'Youth Students': -15  // High emigration
        },

        specialEvents: ['imf_ultimatum', 'election_annulled']
    },

    bulgaria: {
        id: 'bulgaria',
        name: 'Bulgaria',
        flag: '🇧🇬',
        difficulty: 'Hard',
        description: 'Achieve eurozone entry while battling political chaos',
        startYear: 2025,

        stats: {
            countryName: 'Bulgaria',
            gdp: 95,
            budget: -4,
            approval: 40,
            sovereignty: 70,
            politicalCapital: 25
        },

        challenges: [
            'Government instability',
            'Eurozone criteria',
            'Brain drain',
            'Judicial corruption'
        ],

        factionAdjust: {
            'Rural Workers': -5,
            'Urban Middle Class': 0,
            'Business Elite': -10,
            'Youth Students': -20
        },

        specialEvents: ['euro_deadline', 'snap_election']
    },

    slovakia: {
        id: 'slovakia',
        name: 'Slovakia',
        flag: '🇸🇰',
        difficulty: 'Medium',
        description: 'Navigate political polarization and economic transition',
        startYear: 2025,

        stats: {
            countryName: 'Slovakia',
            gdp: 115,
            budget: -6,
            approval: 40,
            sovereignty: 70,
            politicalCapital: 35
        },

        challenges: [
            'Democratic backsliding',
            'Healthcare crisis',
            'Auto industry EV transition',
            'Russian gas dependence'
        ],

        factionAdjust: {
            'Rural Workers': 5,
            'Urban Middle Class': -10,
            'Business Elite': 0,
            'State Pensioners': 5
        },

        specialEvents: ['gas_transit_crisis', 'eu_penalties']
    }
};

// Custom country for advanced players
export const CUSTOM_TEMPLATE = {
    id: 'custom',
    name: 'Custom Nation',
    flag: '🏳️',
    difficulty: 'Variable',
    description: 'Create your own country',
    stats: {
        countryName: 'Republic of...',
        gdp: 200,
        budget: 0,
        approval: 50,
        sovereignty: 80,
        politicalCapital: 50
    }
};
