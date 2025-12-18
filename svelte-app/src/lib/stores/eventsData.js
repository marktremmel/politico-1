// ============================================
// EVENTS/DILEMMAS - Svelte Version
// ============================================

import { writable, get } from 'svelte/store';
import { approval, budget, politicalCapital, sovereignty, gdp, voterGroups, regions } from './gameState.js';
import { selectedScenario } from './scenarios.js';

export const currentEvent = writable(null);
export const eventHistory = writable([]);

// Generic events (any country)
export const EVENTS = {
    recession: {
        id: 'recession', title: "Economic Recession", icon: "📉",
        desc: "Global markets are crashing. Your economy is suffering.",
        choices: [
            { text: "Stimulus package (-$5B)", effect: () => { budget.update(b => b - 5); gdp.update(g => g * 1.02); } },
            { text: "Austerity measures (-10 Approval)", effect: () => { approval.update(a => a - 10); } }
        ]
    },
    trade_deal: {
        id: 'trade_deal', title: "Trade Agreement Offer", icon: "🤝",
        desc: "A foreign power offers a lucrative trade deal, but with strings attached.",
        choices: [
            { text: "Accept (+$3B, -5 Sovereignty)", effect: () => { budget.update(b => b + 3); sovereignty.update(s => s - 5); } },
            { text: "Decline (Relations hurt)", effect: () => { approval.update(a => a - 3); } }
        ]
    },
    scandal: {
        id: 'scandal', title: "Cabinet Scandal", icon: "😱",
        desc: "A cabinet member has been caught in a corruption scandal.",
        choices: [
            { text: "Fire them immediately (-5 PC)", effect: () => { politicalCapital.update(pc => pc - 5); } },
            { text: "Cover it up (Risk worse scandal)", effect: () => { approval.update(a => a - 8); } }
        ]
    },
    protest: {
        id: 'protest', title: "Mass Protests", icon: "📢",
        desc: "Citizens are taking to the streets demanding change.",
        choices: [
            { text: "Address concerns (-3 PC)", effect: () => { politicalCapital.update(pc => pc - 3); approval.update(a => a + 5); } },
            { text: "Disperse with police (-10 Approval)", effect: () => { approval.update(a => a - 10); modifyUnrest(10); } }
        ]
    },
    natural_disaster: {
        id: 'natural_disaster', title: "Natural Disaster!", icon: "🌊",
        desc: "A devastating flood has hit the region.",
        choices: [
            { text: "Emergency relief (-$4B, +Approval)", effect: () => { budget.update(b => b - 4); approval.update(a => a + 8); } },
            { text: "Limited response (-15 Approval)", effect: () => { approval.update(a => a - 15); } }
        ]
    },
    epidemic: {
        id: 'epidemic', title: "Disease Outbreak", icon: "🦠",
        desc: "A new disease is spreading rapidly.",
        choices: [
            { text: "Lockdown (-GDP, +Health)", effect: () => { gdp.update(g => g * 0.95); approval.update(a => a + 3); } },
            { text: "Stay open (-10 Approval)", effect: () => { approval.update(a => a - 10); } }
        ]
    },
    workers_strike: {
        id: 'workers_strike', title: "Workers Go on Strike", icon: "✊",
        desc: "Industrial workers demand better conditions.",
        choices: [
            { text: "Meet demands (-$2B)", effect: () => { budget.update(b => b - 2); modifyFactionHappiness('Rural Workers', 15); } },
            { text: "Break the strike (-Workers)", effect: () => { modifyFactionHappiness('Rural Workers', -20); modifyFactionHappiness('Business Elite', 10); } }
        ]
    },
    border_tension: {
        id: 'border_tension', title: "Border Tensions", icon: "⚔️",
        desc: "Neighboring country is amassing troops at the border.",
        choices: [
            { text: "Military buildup (-$3B, +Sovereignty)", effect: () => { budget.update(b => b - 3); sovereignty.update(s => s + 5); } },
            { text: "Diplomacy (-5 Sovereignty)", effect: () => { sovereignty.update(s => s - 5); approval.update(a => a + 3); } }
        ]
    }
};

// Country-specific events
export const COUNTRY_EVENTS = {
    hungary: {
        eu_funding_freeze: {
            id: 'eu_funding_freeze', title: "EU Freezes Funds", icon: "🇪🇺",
            desc: "Brussels has frozen €10B in cohesion funds due to rule-of-law concerns.",
            choices: [
                { text: "Comply with EU demands (+Funds, -Sovereignty)", effect: () => { budget.update(b => b + 5); sovereignty.update(s => s - 15); } },
                { text: "Defy Brussels (-Funds, +Base support)", effect: () => { budget.update(b => b - 3); modifyFactionHappiness('Rural Workers', 10); } }
            ]
        },
        russia_gas_deal: {
            id: 'russia_gas_deal', title: "Russian Gas Deal", icon: "🔥",
            desc: "Russia offers cheap gas but the EU is pressuring you to diversify.",
            choices: [
                { text: "Accept Russian deal (-10 Sovereignty)", effect: () => { budget.update(b => b + 4); sovereignty.update(s => s - 10); } },
                { text: "Diversify energy (-$5B)", effect: () => { budget.update(b => b - 5); sovereignty.update(s => s + 5); } }
            ]
        }
    },
    poland: {
        judiciary_clash: {
            id: 'judiciary_clash', title: "Judiciary Clash", icon: "⚖️",
            desc: "The Constitutional Court has ruled against your reform. Do you comply?",
            choices: [
                { text: "Accept the ruling (-5 PC)", effect: () => { politicalCapital.update(pc => pc - 5); approval.update(a => a + 5); } },
                { text: "Defy the court (-10 Approval, +Sovereignty)", effect: () => { approval.update(a => a - 10); sovereignty.update(s => s + 5); } }
            ]
        },
        ukraine_crisis: {
            id: 'ukraine_crisis', title: "Ukrainian Refugees", icon: "🇺🇦",
            desc: "Millions of Ukrainian refugees are crossing the border. How do you respond?",
            choices: [
                { text: "Open borders (+Approval, -$4B)", effect: () => { budget.update(b => b - 4); approval.update(a => a + 10); } },
                { text: "Limit intake (-Approval, saves budget)", effect: () => { approval.update(a => a - 8); } }
            ]
        }
    },
    romania: {
        imf_ultimatum: {
            id: 'imf_ultimatum', title: "IMF Ultimatum", icon: "💰",
            desc: "The IMF demands immediate austerity to address your 8% deficit.",
            choices: [
                { text: "Accept IMF terms (-15 Approval)", effect: () => { approval.update(a => a - 15); budget.update(b => b + 5); } },
                { text: "Reject demands (+Approval, -GDP)", effect: () => { approval.update(a => a + 5); gdp.update(g => g * 0.95); } }
            ]
        },
        corruption_investigation: {
            id: 'corruption_investigation', title: "Anti-Corruption Raids", icon: "🚔",
            desc: "DNA prosecutors are investigating your party leadership.",
            choices: [
                { text: "Cooperate fully (-5 PC)", effect: () => { politicalCapital.update(pc => pc - 5); approval.update(a => a + 8); } },
                { text: "Obstruct investigation (-15 Approval)", effect: () => { approval.update(a => a - 15); } }
            ]
        }
    },
    bulgaria: {
        euro_deadline: {
            id: 'euro_deadline', title: "Eurozone Deadline", icon: "💶",
            desc: "You're failing to meet inflation targets for euro adoption.",
            choices: [
                { text: "Emergency inflation controls (-GDP)", effect: () => { gdp.update(g => g * 0.97); sovereignty.update(s => s - 5); } },
                { text: "Accept delay (+Sovereignty)", effect: () => { sovereignty.update(s => s + 5); approval.update(a => a - 5); } }
            ]
        },
        government_collapse: {
            id: 'government_collapse', title: "Coalition Collapses", icon: "🏛️",
            desc: "Your coalition partners are threatening to leave government.",
            choices: [
                { text: "Make concessions (-8 PC)", effect: () => { politicalCapital.update(pc => pc - 8); } },
                { text: "Call snap election (-20 Approval)", effect: () => { approval.update(a => a - 20); politicalCapital.update(pc => pc + 10); } }
            ]
        }
    },
    czechia: {
        pension_crisis: {
            id: 'pension_crisis', title: "Pension System Crisis", icon: "👴",
            desc: "The aging population is straining the pension system.",
            choices: [
                { text: "Raise retirement age (-Pensioners)", effect: () => { modifyFactionHappiness('State Pensioners', -15); budget.update(b => b + 3); } },
                { text: "Increase pension spending (-$3B)", effect: () => { budget.update(b => b - 3); modifyFactionHappiness('State Pensioners', 10); } }
            ]
        },
        housing_crisis: {
            id: 'housing_crisis', title: "Housing Affordability Crisis", icon: "🏠",
            desc: "Young people can't afford homes. Protests are growing.",
            choices: [
                { text: "Rent controls (+Youth, -Business)", effect: () => { modifyFactionHappiness('Youth Students', 15); modifyFactionHappiness('Business Elite', -10); } },
                { text: "Subsidize construction (-$4B)", effect: () => { budget.update(b => b - 4); modifyFactionHappiness('Youth Students', 8); } }
            ]
        }
    },
    slovakia: {
        gas_transit_crisis: {
            id: 'gas_transit_crisis', title: "Gas Transit Crisis", icon: "⛽",
            desc: "Ukraine is threatening to cut off Russian gas transit through their territory.",
            choices: [
                { text: "Negotiate with Ukraine (-$2B)", effect: () => { budget.update(b => b - 2); } },
                { text: "Support Russian position (-10 Sovereignty)", effect: () => { sovereignty.update(s => s - 10); budget.update(b => b + 2); } }
            ]
        },
        healthcare_collapse: {
            id: 'healthcare_collapse', title: "Healthcare System Failing", icon: "🏥",
            desc: "Doctors are emigrating and hospitals are understaffed.",
            choices: [
                { text: "Emergency funding (-$5B)", effect: () => { budget.update(b => b - 5); approval.update(a => a + 8); } },
                { text: "Import foreign doctors (-5 Approval)", effect: () => { approval.update(a => a - 5); modifyFactionHappiness('State Pensioners', -10); } }
            ]
        }
    }
};

// Helper functions
function modifyUnrest(amount) {
    regions.update(r => {
        Object.keys(r).forEach(k => {
            r[k].unrest = Math.min(100, Math.max(0, (r[k].unrest || 0) + amount));
        });
        return r;
    });
}

function modifyFactionHappiness(groupName, amount) {
    voterGroups.update(groups => {
        groups.forEach(g => {
            if (g.name === groupName) {
                g.happiness = Math.max(0, Math.min(100, g.happiness + amount));
            }
        });
        return groups;
    });
}

// Trigger event - prefers country-specific events when applicable
export function triggerRandomEvent() {
    const scenario = get(selectedScenario);
    let eventPool = Object.values(EVENTS);

    // Add country-specific events if available
    if (scenario && COUNTRY_EVENTS[scenario.id]) {
        const countryEvents = Object.values(COUNTRY_EVENTS[scenario.id]);
        // 50% chance of country-specific event
        if (Math.random() < 0.5 && countryEvents.length > 0) {
            eventPool = countryEvents;
        }
    }

    const randomEvent = eventPool[Math.floor(Math.random() * eventPool.length)];
    currentEvent.set(randomEvent);
}

// Handle player choice
export function handleEventChoice(choiceIndex) {
    const event = get(currentEvent);
    if (!event) return;

    const choice = event.choices[choiceIndex];
    if (choice && choice.effect) {
        choice.effect();
    }

    eventHistory.update(h => [...h, { id: event.id, choice: choiceIndex, day: Date.now() }]);
    currentEvent.set(null);
}

