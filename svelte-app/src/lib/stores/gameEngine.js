// ============================================
// GAME ENGINE - Svelte Version
// ============================================

import { get, writable } from 'svelte/store';
import {
    isPaused, date, approval, politicalCapital, budget, gdp, sovereignty,
    regions, sectors, factions, voterGroups, factionDemands,
    advanceDay, modifyApproval, modifySovereignty
} from './gameState.js';

let gameInterval = null;
export const currentSpeed = writable(1);

export function startGame(tickRate = 1000) {
    isPaused.set(false);
    const speed = get(currentSpeed);
    gameInterval = setInterval(() => {
        if (!get(isPaused)) {
            advanceDay();
            runSystems();
        }
    }, tickRate / speed);
}

export function pauseGame() {
    isPaused.set(true);
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }
}

export function setSpeed(speed) {
    currentSpeed.set(speed);
    if (!get(isPaused)) {
        pauseGame();
        startGame();
    }
}

export function togglePause() {
    if (get(isPaused)) startGame();
    else pauseGame();
}

function runSystems() {
    updatePolitics();
    updateEconomy();
    updateFactions();
    updateSovereignty();
    updateSectors();
    updateMegaprojects();
    updateCabinet();
    updateRegions();
}

// === CABINET DYNAMICS ===
import { cabinet } from './gameState.js';

const MINISTRY_SECTORS = {
    defense: 'military',
    interior: 'police',
    education: 'education',
    health: 'healthcare'
};

function updateCabinet() {
    const currentApproval = get(approval);
    const cab = get(cabinet);
    if (!cab || Object.keys(cab).length === 0) return;

    let changed = false;

    Object.entries(cab).forEach(([role, minister]) => {
        // Loyalty changes based on approval
        if (currentApproval < 30) {
            minister.loyalty = Math.max(0, minister.loyalty - 0.2);
            changed = true;
        } else if (currentApproval > 70) {
            minister.loyalty = Math.min(100, minister.loyalty + 0.05);
            changed = true;
        }

        // Low loyalty = risk of scandal (random)
        if (minister.loyalty < 20 && Math.random() < 0.005) {
            // Could trigger scandal event
        }

        // Competent ministers boost their sector
        const linkedSector = MINISTRY_SECTORS[role];
        if (linkedSector) {
            const sectorData = get(sectors);
            if (sectorData[linkedSector]) {
                const competenceBonus = (minister.competence - 50) * 0.01;
                sectorData[linkedSector].health = Math.min(100, sectorData[linkedSector].health + competenceBonus);
                sectors.set(sectorData);
            }
        }
    });

    if (changed) cabinet.set(cab);
}

// === REGION DYNAMICS ===
function updateRegions() {
    regions.update(r => {
        Object.keys(r).forEach(key => {
            const region = r[key];

            // Unrest naturally decays toward 20 (baseline)
            if (region.unrest > 20) {
                region.unrest = Math.max(20, region.unrest - 0.1);
            }

            // Support affected by approval
            const currentApproval = get(approval);
            if (currentApproval > 60 && region.support < 70) {
                region.support = Math.min(80, region.support + 0.1);
            } else if (currentApproval < 30 && region.support > 20) {
                region.support = Math.max(10, region.support - 0.2);
            }
        });
        return r;
    });
}

// === SECTOR DECAY SYSTEM ===
const SECTOR_CONFIG = {
    infrastructure: { baseCost: 2.0, decayRate: 0.5 },
    healthcare: { baseCost: 1.5, decayRate: 0.4 },
    education: { baseCost: 1.0, decayRate: 0.3 },
    military: { baseCost: 2.5, decayRate: 0.6 },
    police: { baseCost: 0.8, decayRate: 0.5 },
    welfare: { baseCost: 1.2, decayRate: 0.4 }
};

function updateSectors() {
    const sectorData = get(sectors);
    let totalExpense = 0;

    Object.keys(sectorData).forEach(key => {
        const sector = sectorData[key];
        const config = SECTOR_CONFIG[key];
        const fundingRatio = sector.funding / config.baseCost;

        totalExpense += sector.funding;

        if (fundingRatio >= 1.0) {
            sector.health = Math.min(100, sector.health + 0.2);
        } else if (fundingRatio >= 0.5) {
            sector.health = Math.max(0, sector.health - config.decayRate * (1 - fundingRatio));
        } else {
            sector.health = Math.max(0, sector.health - config.decayRate * 2);
        }

        // === DETERIORATION EFFECTS ===
        if (sector.health < 50) {
            const severity = (50 - sector.health) / 50; // 0 to 1

            if (key === 'infrastructure') {
                gdp.update(g => g * (1 - severity * 0.001)); // GDP loss
            } else if (key === 'healthcare' || key === 'welfare') {
                approval.update(a => Math.max(0, a - severity * 0.1)); // Approval loss
            } else if (key === 'military') {
                sovereignty.update(s => Math.max(0, s - severity * 0.05)); // Sovereignty loss
            } else if (key === 'police') {
                // Increase unrest
                regions.update(r => {
                    Object.keys(r).forEach(k => {
                        r[k].unrest = Math.min(100, (r[k].unrest || 0) + severity * 0.2);
                    });
                    return r;
                });
            } else if (key === 'education') {
                // Long-term GDP growth penalty (simplified)
                gdp.update(g => g * (1 - severity * 0.0005));
            }
        }
    });

    sectors.set(sectorData);
    budget.update(b => b - totalExpense * 0.01);
}

// === MEGAPROJECT PROGRESS ===
import { megaprojects } from './gameState.js';

function updateMegaprojects() {
    const projects = get(megaprojects);
    let changed = false;

    Object.keys(projects).forEach(id => {
        const project = projects[id];
        if (project.active && !project.completed) {
            project.progress = Math.min(100, project.progress + 0.5); // ~200 days to complete
            changed = true;

            if (project.progress >= 100) {
                project.completed = true;
                project.active = false;
                // Completion bonuses applied elsewhere
            }
        }
    });

    if (changed) megaprojects.set(projects);
}

// === POLITICS SYSTEM ===
function updatePolitics() {
    const currentApproval = get(approval);
    const avgUnrest = getAverageUnrest();

    // Unrest drags down approval
    if (avgUnrest > 50) {
        const penalty = (avgUnrest - 50) * 0.04;
        approval.update(a => Math.max(5, a - penalty));
    } else if (avgUnrest < 20 && currentApproval < 50) {
        approval.update(a => Math.min(95, a + 0.05));
    }

    // === PC REGENERATION - SCALED BY APPROVAL ===
    // High approval = gain PC, Low approval = LOSE PC rapidly
    if (currentApproval >= 70) {
        politicalCapital.update(pc => Math.min(100, pc + 0.3));
    } else if (currentApproval >= 50) {
        politicalCapital.update(pc => Math.min(100, pc + 0.1));
    } else if (currentApproval >= 30) {
        // Stagnant - no change
    } else if (currentApproval >= 15) {
        // Low approval = PC drain
        politicalCapital.update(pc => Math.max(0, pc - 0.3));
    } else {
        // Very low approval = rapid PC drain (lame duck)
        politicalCapital.update(pc => Math.max(0, pc - 0.8));
    }

    // === FACTION HAPPINESS SHOULD REFLECT APPROVAL ===
    // If approval is very low, it drags down faction happiness
    voterGroups.update(groups => {
        groups.forEach(g => {
            if (currentApproval < 30) {
                // Low approval drags everyone down
                g.happiness = Math.max(5, g.happiness - 0.3);
            } else if (currentApproval < 15) {
                // Very low - rapid decline
                g.happiness = Math.max(5, g.happiness - 0.8);
            } else if (currentApproval > 70 && g.happiness < 50) {
                // High approval slowly lifts everyone
                g.happiness = Math.min(60, g.happiness + 0.1);
            }
        });
        return groups;
    });
}

// === ECONOMY SYSTEM ===
function updateEconomy() {
    const currentGDP = get(gdp);
    const currentBudget = get(budget);

    // Simple tax revenue
    const revenue = currentGDP * 0.001; // 0.1% of GDP per day

    // Simple expenses (will be more complex later)
    const expenses = 0.05;

    budget.update(b => b + revenue - expenses);

    // Small GDP drift
    const growth = (Math.random() - 0.48) * 0.1;
    gdp.update(g => Math.max(10, g + growth));
}

// === FACTION SYSTEM ===
function updateFactions() {
    const groups = get(voterGroups);
    const demands = get(factionDemands);

    groups.forEach(group => {
        // Natural happiness drift toward 50
        if (group.happiness < 50) {
            group.happiness = Math.min(50, group.happiness + 0.1);
        } else if (group.happiness > 50) {
            group.happiness = Math.max(50, group.happiness - 0.05);
        }

        // Protests if very unhappy
        if (group.happiness < 25) {
            const regs = get(regions);
            Object.keys(regs).forEach(key => {
                regs[key].unrest = Math.min(100, (regs[key].unrest || 0) + 0.5);
            });
            regions.set(regs);

            // Issue demand if not already pending
            const demands = get(factionDemands);
            if (!demands.find(d => d.from === group.name)) {
                factionDemands.update(d => [...d, {
                    from: group.name,
                    text: getFactionDemand(group.name),
                    urgency: group.happiness < 15 ? 'critical' : 'high',
                    issuedAt: Date.now()
                }]);
            }
        }

        // Riots if extremely unhappy
        if (group.happiness < 15) {
            approval.update(a => Math.max(0, a - 0.5));
            politicalCapital.update(pc => Math.max(0, pc - 0.3));
        }
    });

    voterGroups.set(groups);
}

// Faction demand texts
function getFactionDemand(groupName) {
    const demands = {
        'Rural Workers': ['Raise minimum wage!', 'Fund agriculture!', 'Land reform now!'],
        'Urban Middle Class': ['Cut taxes!', 'Improve infrastructure!', 'Fight corruption!'],
        'Business Elite': ['Deregulate!', 'Cut corporate taxes!', 'Privatize!'],
        'State Pensioners': ['Raise pensions!', 'Fund healthcare!', 'Lower retirement age!'],
        'Minority Communities': ['Equal rights!', 'End discrimination!', 'Fund education!'],
        'Youth Students': ['Free education!', 'Internet freedom!', 'Climate action!']
    };
    const options = demands[groupName] || ['We demand change!'];
    return options[Math.floor(Math.random() * options.length)];
}

// === SOVEREIGNTY SYSTEM ===
function updateSovereignty() {
    const currentSov = get(sovereignty);
    const currentBudget = get(budget);
    const currentGDP = get(gdp);

    let change = 0;

    // High debt = loss
    const debtRatio = Math.abs(currentBudget) / currentGDP;
    if (currentBudget < 0 && debtRatio > 0.1) {
        change -= 0.02;
    }

    // Neutral alignment = independence
    change += 0.01;

    sovereignty.update(s => Math.max(0, Math.min(100, s + change)));

    // === GAME OVER CHECK ===
    checkGameOver();
}

// Game over store
import { writable as gameWritable } from 'svelte/store';
export const gameOver = gameWritable(null);

function checkGameOver() {
    const app = get(approval);
    const sov = get(sovereignty);
    const bud = get(budget);

    if (app <= 0) {
        gameOver.set({ reason: 'Your approval hit 0%. You have been removed from office.' });
        pauseGame();
    } else if (sov <= 0) {
        gameOver.set({ reason: 'Your nation has lost all sovereignty. You are now a puppet state.' });
        pauseGame();
    } else if (bud <= -50) {
        gameOver.set({ reason: 'Your nation is bankrupt. The IMF has taken control.' });
        pauseGame();
    }
}

// === HELPER FUNCTIONS ===
function getAverageUnrest() {
    const regs = get(regions);
    const keys = Object.keys(regs);
    if (keys.length === 0) return 0;
    const total = keys.reduce((sum, k) => sum + (regs[k].unrest || 0), 0);
    return total / keys.length;
}

export function initializeGame(scenario = 'default') {
    // Initialize regions
    regions.set({
        capital: { name: "Capital District", population: 3000000, support: 55, unrest: 10 },
        industrial: { name: "Industrial Heartland", population: 2500000, support: 50, unrest: 15 },
        rural: { name: "Rural Provinces", population: 2000000, support: 45, unrest: 20 },
        coastal: { name: "Coastal Region", population: 1500000, support: 50, unrest: 10 }
    });

    // Initialize sectors
    sectors.set({
        infrastructure: { health: 100, funding: 2.0 },
        healthcare: { health: 100, funding: 1.5 },
        education: { health: 100, funding: 1.0 },
        military: { health: 100, funding: 2.5 },
        police: { health: 100, funding: 0.8 },
        welfare: { health: 100, funding: 1.2 }
    });

    // Initialize voter groups
    voterGroups.set([
        { name: "Rural Workers", population: 0.25, happiness: 50 },
        { name: "Urban Middle Class", population: 0.30, happiness: 50 },
        { name: "Business Elite", population: 0.05, happiness: 60 },
        { name: "State Pensioners", population: 0.20, happiness: 50 },
        { name: "Minority Communities", population: 0.10, happiness: 50 },
        { name: "Youth Students", population: 0.10, happiness: 50 }
    ]);
}
