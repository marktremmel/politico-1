// ============================================
// GAME STATE - Svelte Stores
// ============================================

import { writable, derived } from 'svelte/store';

// === CORE STATS ===
export const countryName = writable("Republic of Nowhere");
export const leaderName = writable("President Smith");
export const date = writable(new Date("2025-01-01"));
export const isPaused = writable(true);

// === RESOURCES ===
export const politicalCapital = writable(50);
export const budget = writable(0);
export const approval = writable(50);
export const sovereignty = writable(100);

// === ECONOMY ===
export const gdp = writable(250);
export const debt = writable(0);
export const population = writable(10000000);

// === SYSTEMS DATA ===
export const factions = writable({});
export const voterGroups = writable([]);
export const regions = writable({});
export const sectors = writable({});
export const trade = writable({});
export const megaprojects = writable({});
export const activeLaws = writable([]);
export const cabinet = writable({});
export const achievements = writable([]);
export const factionDemands = writable([]);

// === CAMPAIGN ===
export const campaignPhase = writable(false);
export const playerPopularity = writable(50);
export const opponentPopularity = writable(50);

// === DERIVED VALUES ===
export const daysPassed = derived(date, $date => {
    const start = new Date("2025-01-01");
    return Math.floor(($date - start) / (1000 * 60 * 60 * 24));
});

export const daysUntilElection = derived(daysPassed, $days => {
    return Math.max(0, 1460 - $days); // 4 years
});

export const isWinning = derived(approval, $a => $a >= 50);

export const averageUnrest = derived(regions, $regions => {
    const keys = Object.keys($regions);
    if (keys.length === 0) return 0;
    const total = keys.reduce((sum, k) => sum + ($regions[k].unrest || 0), 0);
    return total / keys.length;
});

// === HELPER FUNCTIONS ===
export function advanceDay() {
    date.update(d => {
        const next = new Date(d);
        next.setDate(d.getDate() + 1);
        return next;
    });
}

export function modifyApproval(amount) {
    approval.update(a => Math.max(0, Math.min(100, a + amount)));
}

export function modifyPC(amount) {
    politicalCapital.update(pc => Math.max(0, Math.min(100, pc + amount)));
}

export function modifySovereignty(amount) {
    sovereignty.update(s => Math.max(0, Math.min(100, s + amount)));
}
