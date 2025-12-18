// ============================================
// THE EVENT POOL - 30+ Diverse Events
// ============================================

import { SECTOR_EVENTS } from '../systems/SectorSystem.js';

export const EVENTS = [
    // ==================== ECONOMIC EVENTS ====================
    {
        id: 'imf_demands',
        title: "IMF Demands Repayment",
        desc: "International lenders are demanding immediate repayment of $4 Billion. Your treasury is vulnerable.",
        trigger: (state) => state.get('debt') > 60 && Math.random() < 0.08,
        choices: [
            {
                text: "Austerity: Slash public spending",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 4);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('State Pensioners', -15);
                        fs.modifyGroupHappiness('Rural Workers', -10);
                        fs.update(state);
                    }
                }
            },
            {
                text: "Tax the Rich: Emergency corporate levy (Costs 3 PC)",
                effect: (state, engine) => {
                    const pc = state.get('politicalCapital');
                    if (pc < 3) { alert("Not enough Political Capital!"); return; }
                    state.update('politicalCapital', pc - 3);
                    state.update('budget', state.get('budget') - 1);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Business Elite', -25);
                        fs.update(state);
                    }
                }
            },
            {
                text: "Accept Foreign 'Aid' (-10 Sovereignty)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') + 2);
                    state.update('sovereignty', (state.get('sovereignty') || 100) - 10);
                }
            }
        ]
    },
    {
        id: 'market_crash',
        title: "Stock Market Crash",
        desc: "The stock market has plunged 30% overnight. Panic is spreading.",
        trigger: (state) => state.get('gdp') > 200 && Math.random() < 0.03,
        choices: [
            {
                text: "Bail Out the Banks (-$3B)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 3);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Business Elite', 10);
                        fs.modifyGroupHappiness('Urban Middle Class', -10);
                        fs.update(state);
                    }
                }
            },
            {
                text: "Let them fail (GDP -5%)",
                effect: (state, engine) => {
                    state.update('gdp', state.get('gdp') * 0.95);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Business Elite', -20);
                        fs.update(state);
                    }
                }
            },
            {
                text: "Nationalize failing banks (-$2B, -15 Capitalist)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 2);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Business Elite', -15);
                        fs.modifyGroupHappiness('Rural Workers', 5);
                        fs.update(state);
                    }
                }
            }
        ]
    },
    {
        id: 'tech_boom',
        title: "Tech Sector Boom",
        desc: "Several local startups are attracting foreign investment.",
        trigger: (state) => state.get('gdp') > 300 && Math.random() < 0.05,
        choices: [
            {
                text: "Tax them heavily (+Revenue, -Capitalists)",
                effect: (state, engine) => {
                    state.update('taxRate', state.get('taxRate') + 0.01);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Business Elite', -20);
                        fs.update(state);
                    }
                }
            },
            {
                text: "Subsidize further (-$1B, +Capitalists, +GDP)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 1);
                    state.update('gdp', state.get('gdp') + 10);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Business Elite', 15);
                        fs.update(state);
                    }
                }
            }
        ]
    },
    {
        id: 'hyperinflation',
        title: "Hyperinflation Warning",
        desc: "Economists warn that printing more money could trigger hyperinflation.",
        trigger: (state) => state.get('budget') < -5 && Math.random() < 0.1,
        choices: [
            {
                text: "Raise interest rates (Economy slows)",
                effect: (state, engine) => {
                    state.update('gdp', state.get('gdp') * 0.97);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Business Elite', -10);
                        fs.update(state);
                    }
                }
            },
            {
                text: "Print money anyway (+$3B, high risk)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') + 3);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('all', -10);
                        fs.update(state);
                    }
                }
            }
        ]
    },
    {
        id: 'trade_deal',
        title: "Foreign Trade Deal Offer",
        desc: "A neighboring country offers a lucrative trade agreement, but with conditions.",
        trigger: (state) => Math.random() < 0.04,
        choices: [
            {
                text: "Accept (+GDP, -Sovereignty)",
                effect: (state, engine) => {
                    state.update('gdp', state.get('gdp') * 1.05);
                    state.update('sovereignty', (state.get('sovereignty') || 100) - 5);
                }
            },
            {
                text: "Reject (Status quo)",
                effect: (state, engine) => { /* Nothing happens */ }
            },
            {
                text: "Counter-offer (Costs 2 PC, better terms)",
                effect: (state, engine) => {
                    const pc = state.get('politicalCapital');
                    if (pc < 2) { alert("Not enough PC!"); return; }
                    state.update('politicalCapital', pc - 2);
                    state.update('gdp', state.get('gdp') * 1.03);
                }
            }
        ]
    },

    // ==================== SOCIAL EVENTS ====================
    {
        id: 'healthcare_crisis',
        title: "Healthcare System Strain",
        desc: "Hospitals are reporting overcrowding due to seasonal flu and budget cuts.",
        trigger: (state) => state.get('approval') < 50 && Math.random() < 0.08,
        choices: [
            {
                text: "Emergency Funding (-$2B)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 2);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('State Pensioners', 15);
                        fs.modifyGroupHappiness('Rural Workers', 5);
                        fs.update(state);
                    }
                }
            },
            {
                text: "Ignore it (-Approval)",
                effect: (state, engine) => {
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('State Pensioners', -20);
                        fs.update(state);
                    }
                }
            }
        ]
    },
    {
        id: 'teacher_strike',
        title: "Nation-Wide Teacher Strike",
        desc: "Teachers are demanding higher wages. Schools are closed.",
        trigger: (state) => Math.random() < 0.05,
        choices: [
            {
                text: "Meet their demands (-$1B/year)",
                effect: (state, engine) => {
                    state.update('policyExpense', (state.get('policyExpense') || 0) + 1);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Youth Students', 15);
                        fs.modifyGroupHappiness('Urban Middle Class', 10);
                        fs.update(state);
                    }
                }
            },
            {
                text: "Fire striking workers",
                effect: (state, engine) => {
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Youth Students', -20);
                        fs.modifyGroupHappiness('Urban Middle Class', -15);
                        fs.modifyGroupHappiness('Business Elite', 5);
                        fs.update(state);
                    }
                }
            },
            {
                text: "Negotiate (Costs 2 PC, partial raise)",
                effect: (state, engine) => {
                    const pc = state.get('politicalCapital');
                    if (pc < 2) { alert("Not enough PC!"); return; }
                    state.update('politicalCapital', pc - 2);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Youth Students', 5);
                        fs.update(state);
                    }
                }
            }
        ]
    },
    {
        id: 'protest_capital',
        title: "Mass Protest in the Capital",
        desc: "Thousands are gathering in the main square demanding change.",
        trigger: (state) => state.get('approval') < 40 && Math.random() < 0.1,
        choices: [
            {
                text: "Send Riot Police (Risk: Brutality Scandal)",
                effect: (state, engine) => {
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Youth Students', -15);
                        fs.modifyGroupHappiness('Minority Communities', -10);
                        fs.update(state);
                    }
                    // Add chained event to deck
                    const dm = engine.systems.find(s => s.addEventToDeck);
                    if (dm) dm.addEventToDeck('police_brutality');
                }
            },
            {
                text: "Address the crowd personally (Costs 3 PC)",
                effect: (state, engine) => {
                    const pc = state.get('politicalCapital');
                    if (pc < 3) { alert("Not enough PC!"); return; }
                    state.update('politicalCapital', pc - 3);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('all', 5);
                        fs.update(state);
                    }
                }
            },
            {
                text: "Ignore them",
                effect: (state, engine) => {
                    state.update('approval', state.get('approval') - 5);
                }
            }
        ]
    },
    {
        id: 'police_brutality',
        title: "Police Brutality Scandal!",
        desc: "Video footage has surfaced of the crackdown you ordered. The world is watching.",
        trigger: (state) => false, // Only triggered via chain
        isChained: true,
        choices: [
            {
                text: "Fire the Police Chief (Scapegoat)",
                effect: (state, engine) => {
                    state.update('approval', state.get('approval') + 5);
                }
            },
            {
                text: "Defend the Police (-Liberals, -Minorities)",
                effect: (state, engine) => {
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Youth Students', -20);
                        fs.modifyGroupHappiness('Minority Communities', -20);
                        fs.update(state);
                    }
                }
            }
        ]
    },
    {
        id: 'crime_wave',
        title: "Crime Wave Sweeping Cities",
        desc: "Violent crime has spiked 40%. Citizens are afraid.",
        trigger: (state) => Math.random() < 0.04,
        choices: [
            {
                text: "Increase Police Budget (+$1B)",
                effect: (state, engine) => {
                    state.update('policyExpense', (state.get('policyExpense') || 0) + 1);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Urban Middle Class', 10);
                        fs.modifyGroupHappiness('Minority Communities', -5);
                        fs.update(state);
                    }
                }
            },
            {
                text: "Address root causes (Education, Costs 3 PC)",
                effect: (state, engine) => {
                    const pc = state.get('politicalCapital');
                    if (pc < 3) { alert("Not enough PC!"); return; }
                    state.update('politicalCapital', pc - 3);
                }
            },
            {
                text: "Ignore (Approval drops)",
                effect: (state) => {
                    state.update('approval', state.get('approval') - 8);
                }
            }
        ]
    },
    {
        id: 'corruption_scandal',
        title: "Minister Caught in Corruption Scandal",
        desc: "One of your cabinet ministers has been caught accepting bribes.",
        trigger: (state) => Math.random() < 0.05,
        choices: [
            {
                text: "Fire them immediately",
                effect: (state, engine) => {
                    state.update('approval', state.get('approval') + 3);
                    // Could actually fire a minister here if we track who
                }
            },
            {
                text: "Cover it up (Risk: Larger scandal later)",
                effect: (state, engine) => {
                    const dm = engine.systems.find(s => s.addEventToDeck);
                    if (dm) dm.addEventToDeck('major_scandal');
                }
            }
        ]
    },
    {
        id: 'major_scandal',
        title: "MAJOR SCANDAL: Cover-Up Exposed!",
        desc: "The corruption you tried to hide has been exposed by journalists. Your credibility is shattered.",
        trigger: (state) => false,
        isChained: true,
        choices: [
            {
                text: "Resign in disgrace",
                effect: (state, engine) => {
                    state.update('approval', 0);
                    state.update('politicalCapital', 0);
                }
            },
            {
                text: "Blame the media",
                effect: (state, engine) => {
                    state.update('approval', state.get('approval') - 20);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Youth Students', -15);
                        fs.update(state);
                    }
                }
            }
        ]
    },

    // ==================== GEOPOLITICAL EVENTS ====================
    {
        id: 'superpower_request',
        title: "Superpower 'Request'",
        desc: "The Empire's ambassador is here. They want you to vote against the rival bloc at the UN.",
        trigger: (state) => (state.get('sovereignty') || 100) < 80 && Math.random() < 0.08,
        choices: [
            {
                text: "Comply (+Relations, -Sovereignty)",
                effect: (state, engine) => {
                    state.update('sovereignty', (state.get('sovereignty') || 100) - 5);
                    // Could modify relations here
                }
            },
            {
                text: "Refuse (Risk: Sanctions)",
                effect: (state, engine) => {
                    const dm = engine.systems.find(s => s.addEventToDeck);
                    if (dm) dm.addEventToDeck('sanctions');
                }
            }
        ]
    },
    {
        id: 'sanctions',
        title: "International Sanctions Imposed",
        desc: "Your refusal to cooperate has resulted in economic sanctions. Trade is disrupted.",
        trigger: (state) => false,
        isChained: true,
        choices: [
            {
                text: "Endure the sanctions (-GDP)",
                effect: (state, engine) => {
                    state.update('gdp', state.get('gdp') * 0.9);
                }
            },
            {
                text: "Capitulate (-15 Sovereignty)",
                effect: (state, engine) => {
                    state.update('sovereignty', (state.get('sovereignty') || 100) - 15);
                }
            }
        ]
    },
    {
        id: 'border_incident',
        title: "Border Incident",
        desc: "Armed forces from a neighboring country have crossed into your territory.",
        trigger: (state) => Math.random() < 0.03,
        choices: [
            {
                text: "Military Response (Risk: War)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 3);
                    // Could add 'war' event to deck
                }
            },
            {
                text: "Diplomatic Protest (Costs 2 PC)",
                effect: (state, engine) => {
                    const pc = state.get('politicalCapital');
                    if (pc < 2) { alert("Not enough PC!"); return; }
                    state.update('politicalCapital', pc - 2);
                }
            },
            {
                text: "Ignore it (-Nationalist Support)",
                effect: (state, engine) => {
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Rural Workers', -10);
                        fs.update(state);
                    }
                }
            }
        ]
    },
    {
        id: 'refugee_wave',
        title: "Refugee Wave at the Border",
        desc: "Thousands of refugees are fleeing conflict in a neighboring country.",
        trigger: (state) => Math.random() < 0.04,
        choices: [
            {
                text: "Open borders (+Liberals, -Nationalists)",
                effect: (state, engine) => {
                    state.update('policyExpense', (state.get('policyExpense') || 0) + 0.5);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Youth Students', 15);
                        fs.modifyGroupHappiness('Minority Communities', 10);
                        fs.modifyGroupHappiness('Rural Workers', -15);
                        fs.update(state);
                    }
                }
            },
            {
                text: "Close borders (-Liberals, +Nationalists)",
                effect: (state, engine) => {
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Youth Students', -15);
                        fs.modifyGroupHappiness('Minority Communities', -10);
                        fs.modifyGroupHappiness('Rural Workers', 10);
                        fs.update(state);
                    }
                }
            }
        ]
    },
    {
        id: 'foreign_loan',
        title: "Foreign Loan Offer",
        desc: "A superpower is offering a $5 Billion development loan with 'no strings attached.'",
        trigger: (state) => state.get('budget') < 0 && Math.random() < 0.1,
        choices: [
            {
                text: "Accept the loan (+$5B, -10 Sovereignty)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') + 5);
                    state.update('sovereignty', (state.get('sovereignty') || 100) - 10);
                }
            },
            {
                text: "Decline",
                effect: (state, engine) => { /* Nothing */ }
            }
        ]
    },

    // ==================== REGIONAL EVENTS ====================
    {
        id: 'drought',
        title: "Drought Devastates Farmlands",
        desc: "The worst drought in 50 years is destroying crops in the rural provinces.",
        trigger: (state) => Math.random() < 0.04,
        choices: [
            {
                text: "Emergency relief (-$2B)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 2);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Rural Workers', 15);
                        fs.update(state);
                    }
                }
            },
            {
                text: "Let the market handle it (-Rural Support)",
                effect: (state, engine) => {
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Rural Workers', -20);
                        fs.update(state);
                    }
                }
            }
        ]
    },
    {
        id: 'factory_closure',
        title: "Major Factory Announces Closure",
        desc: "The region's largest employer is shutting down. 5,000 jobs are at risk.",
        trigger: (state) => Math.random() < 0.05,
        choices: [
            {
                text: "Subsidize to keep it open (-$3B)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 3);
                }
            },
            {
                text: "Nationalize the factory (-$2B, -Capitalists)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 2);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Business Elite', -15);
                        fs.modifyGroupHappiness('Rural Workers', 10);
                        fs.update(state);
                    }
                }
            },
            {
                text: "Let it close (Workers angry)",
                effect: (state, engine) => {
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Rural Workers', -20);
                        fs.modifyGroupHappiness('State Pensioners', -10);
                        fs.update(state);
                    }
                }
            }
        ]
    },
    {
        id: 'separatist_movement',
        title: "Separatist Movement Growing",
        desc: "A border region is demanding autonomy. Tensions are rising.",
        trigger: (state) => {
            const groups = state.get('voterGroups') || [];
            const minorities = groups.find(g => g.name === 'Minority Communities');
            return minorities && minorities.happiness < 30 && Math.random() < 0.1;
        },
        choices: [
            {
                text: "Offer regional autonomy",
                effect: (state, engine) => {
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Minority Communities', 25);
                        fs.modifyGroupHappiness('Rural Workers', -10);
                        fs.update(state);
                    }
                }
            },
            {
                text: "Crack down on separatists",
                effect: (state, engine) => {
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Minority Communities', -30);
                        fs.modifyGroupHappiness('Rural Workers', 5);
                        fs.update(state);
                    }
                    // Risk: Rebellion event
                    const dm = engine.systems.find(s => s.addEventToDeck);
                    if (dm) dm.addEventToDeck('rebellion');
                }
            }
        ]
    },
    {
        id: 'rebellion',
        title: "Armed Rebellion!",
        desc: "The separatist region has taken up arms. This is a civil conflict.",
        trigger: (state) => false,
        isChained: true,
        choices: [
            {
                text: "Military intervention (-$5B, many casualties)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 5);
                    state.update('approval', state.get('approval') - 10);
                }
            },
            {
                text: "Negotiate independence (-Territory, +Peace)",
                effect: (state, engine) => {
                    state.update('gdp', state.get('gdp') * 0.9);
                    state.update('approval', state.get('approval') + 5);
                }
            }
        ]
    },

    // ==================== UNREST CASCADE EVENTS ====================
    {
        id: 'scattered_protests',
        title: "Scattered Protests Across the Country",
        desc: "Discontent is brewing. Small protests have erupted in multiple cities.",
        trigger: (state) => false, // Only triggered by unrest system
        isChained: true,
        choices: [
            {
                text: "Promise reforms (Costs 5 PC)",
                effect: (state, engine) => {
                    const pc = state.get('politicalCapital');
                    if (pc < 5) { alert("Not enough PC!"); return; }
                    state.update('politicalCapital', pc - 5);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('all', 5);
                        fs.update(state);
                    }
                }
            },
            {
                text: "Increase police presence",
                effect: (state, engine) => {
                    state.update('policyExpense', (state.get('policyExpense') || 0) + 0.5);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Youth Students', -5);
                        fs.update(state);
                    }
                }
            },
            {
                text: "Ignore for now",
                effect: (state, engine) => {
                    state.update('approval', (state.get('approval') || 50) - 3);
                }
            }
        ]
    },
    {
        id: 'general_strike',
        title: "GENERAL STRIKE",
        desc: "Workers across all sectors have walked off the job. The economy is grinding to a halt.",
        trigger: (state) => false,
        isChained: true,
        choices: [
            {
                text: "Emergency concessions (-$3B, wage increase)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 3);
                    state.update('policyExpense', (state.get('policyExpense') || 0) + 1);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Rural Workers', 20);
                        fs.modifyGroupHappiness('State Pensioners', 10);
                        fs.modifyGroupHappiness('Business Elite', -15);
                        fs.update(state);
                    }
                }
            },
            {
                text: "Declare strike illegal, arrest leaders",
                effect: (state, engine) => {
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Rural Workers', -25);
                        fs.modifyGroupHappiness('Youth Students', -15);
                        fs.modifyGroupHappiness('Business Elite', 10);
                        fs.update(state);
                    }
                    // Could trigger police brutality
                    const dm = engine.systems.find(s => s.addEventToDeck);
                    if (dm && Math.random() < 0.4) dm.addEventToDeck('police_brutality');
                }
            },
            {
                text: "Wait it out (Economy suffers)",
                effect: (state, engine) => {
                    state.update('gdp', state.get('gdp') * 0.95);
                    state.update('budget', state.get('budget') - 2);
                }
            }
        ]
    },
    {
        id: 'revolution_warning',
        title: "⚠️ REVOLUTION IMMINENT",
        desc: "Intelligence reports indicate armed groups are organizing. The palace is on high alert.",
        trigger: (state) => false,
        isChained: true,
        choices: [
            {
                text: "Resign and call elections",
                effect: (state, engine) => {
                    state.update('approval', 0);
                    state.update('politicalCapital', 0);
                    alert("You have chosen to step down peacefully. History will judge you kindly... perhaps.");
                }
            },
            {
                text: "Massive emergency spending (-$10B, last chance)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 10);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('all', 15);
                        fs.update(state);
                    }
                }
            },
            {
                text: "Declare martial law (High risk)",
                effect: (state, engine) => {
                    state.update('sovereignty', (state.get('sovereignty') || 100) - 20);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Youth Students', -30);
                        fs.modifyGroupHappiness('Minority Communities', -30);
                        fs.modifyGroupHappiness('Rural Workers', 10);
                        fs.update(state);
                    }
                }
            }
        ]
    },

    // ==================== CULTURAL EVENTS ====================
    {
        id: 'religious_holiday',
        title: "Major Religious Holiday Controversy",
        desc: "Should the government declare a controversial religious holiday as a national day off?",
        trigger: (state) => Math.random() < 0.04,
        choices: [
            {
                text: "Declare it a national holiday (+Traditionalists, -Liberals)",
                effect: (state, engine) => {
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Rural Workers', 10);
                        fs.modifyGroupHappiness('State Pensioners', 10);
                        fs.modifyGroupHappiness('Youth Students', -10);
                        fs.update(state);
                    }
                }
            },
            {
                text: "Keep it unofficial",
                effect: (state, engine) => {
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Rural Workers', -5);
                        fs.update(state);
                    }
                }
            }
        ]
    },
    {
        id: 'controversial_art',
        title: "Controversial Art Exhibition",
        desc: "A state-funded museum is displaying art that some consider offensive to national values.",
        trigger: (state) => Math.random() < 0.03,
        choices: [
            {
                text: "Shut it down (+Traditionalists, -Liberals)",
                effect: (state, engine) => {
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Rural Workers', 5);
                        fs.modifyGroupHappiness('Youth Students', -15);
                        fs.modifyGroupHappiness('Urban Middle Class', -10);
                        fs.update(state);
                    }
                }
            },
            {
                text: "Defend artistic freedom (+Liberals, -Traditionalists)",
                effect: (state, engine) => {
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Youth Students', 15);
                        fs.modifyGroupHappiness('Urban Middle Class', 10);
                        fs.modifyGroupHappiness('Rural Workers', -10);
                        fs.update(state);
                    }
                }
            }
        ]
    },
    {
        id: 'free_speech_debate',
        title: "Free Speech vs. Hate Speech Debate",
        desc: "A prominent figure has made inflammatory statements. The public demands action.",
        trigger: (state) => Math.random() < 0.04,
        choices: [
            {
                text: "Ban hate speech (Costs 2 PC, +Minorities, -Free Speech)",
                effect: (state, engine) => {
                    const pc = state.get('politicalCapital');
                    if (pc < 2) { alert("Not enough PC!"); return; }
                    state.update('politicalCapital', pc - 2);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Minority Communities', 15);
                        fs.modifyGroupHappiness('Youth Students', -5);
                        fs.update(state);
                    }
                }
            },
            {
                text: "Protect free speech (+Liberals, angers some)",
                effect: (state, engine) => {
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Minority Communities', -10);
                        fs.modifyGroupHappiness('Youth Students', 5);
                        fs.update(state);
                    }
                }
            }
        ]
    },

    // ==================== TECHNOLOGY EVENTS ====================
    {
        id: 'ai_regulation',
        title: "AI Regulation Debate",
        desc: "Tech companies are deploying AI that could replace millions of jobs. What should the government do?",
        trigger: (state) => state.get('gdp') > 250 && Math.random() < 0.05,
        choices: [
            {
                text: "Heavy regulation (+Workers, -Business, -GDP)",
                effect: (state, engine) => {
                    state.update('gdp', state.get('gdp') * 0.98);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Rural Workers', 10);
                        fs.modifyGroupHappiness('State Pensioners', 5);
                        fs.modifyGroupHappiness('Business Elite', -15);
                        fs.update(state);
                    }
                }
            },
            {
                text: "Let the market decide (+Business, -Workers)",
                effect: (state, engine) => {
                    state.update('gdp', state.get('gdp') * 1.02);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Business Elite', 15);
                        fs.modifyGroupHappiness('Rural Workers', -15);
                        fs.update(state);
                    }
                }
            },
            {
                text: "Retraining programs (-$2B, balanced)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 2);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('all', 3);
                        fs.update(state);
                    }
                }
            }
        ]
    },
    {
        id: 'social_media_scandal',
        title: "Social Media Misinformation Crisis",
        desc: "Fake news is spreading on social media, influencing public opinion dangerously.",
        trigger: (state) => Math.random() < 0.04,
        choices: [
            {
                text: "Censor platforms (-Liberty, +Order)",
                effect: (state, engine) => {
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Youth Students', -15);
                        fs.modifyGroupHappiness('Rural Workers', 5);
                        fs.update(state);
                    }
                }
            },
            {
                text: "Public awareness campaign (-$1B)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 1);
                }
            },
            {
                text: "Do nothing (Approval drops)",
                effect: (state, engine) => {
                    state.update('approval', (state.get('approval') || 50) - 5);
                }
            }
        ]
    },
    {
        id: 'cyber_attack',
        title: "Major Cyber Attack!",
        desc: "Critical infrastructure has been hacked. Power grids are failing in major cities.",
        trigger: (state) => Math.random() < 0.03,
        choices: [
            {
                text: "Emergency response (-$3B)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 3);
                }
            },
            {
                text: "Blame foreign adversary (+Nationalist support)",
                effect: (state, engine) => {
                    state.update('sovereignty', (state.get('sovereignty') || 100) - 5);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Rural Workers', 5);
                        fs.update(state);
                    }
                }
            }
        ]
    },

    // ==================== ENVIRONMENT EVENTS ====================
    {
        id: 'climate_protest',
        title: "Climate Activists Block Capital",
        desc: "Young activists are blocking major roads demanding climate action.",
        trigger: (state) => Math.random() < 0.05,
        choices: [
            {
                text: "Meet with activists, promise action (Costs 3 PC)",
                effect: (state, engine) => {
                    const pc = state.get('politicalCapital');
                    if (pc < 3) { alert("Not enough PC!"); return; }
                    state.update('politicalCapital', pc - 3);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Youth Students', 20);
                        fs.modifyGroupHappiness('Business Elite', -5);
                        fs.update(state);
                    }
                }
            },
            {
                text: "Clear the roads by force",
                effect: (state, engine) => {
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Youth Students', -20);
                        fs.modifyGroupHappiness('Business Elite', 5);
                        fs.update(state);
                    }
                    const dm = engine.systems.find(s => s.addEventToDeck);
                    if (dm && Math.random() < 0.3) dm.addEventToDeck('police_brutality');
                }
            }
        ]
    },
    {
        id: 'pollution_scandal',
        title: "Major Corporation Caught Polluting",
        desc: "A major employer has been dumping toxic waste. The evidence is damning.",
        trigger: (state) => Math.random() < 0.04,
        choices: [
            {
                text: "Massive fines (+$2B, -Business)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') + 2);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Business Elite', -15);
                        fs.modifyGroupHappiness('Youth Students', 10);
                        fs.update(state);
                    }
                }
            },
            {
                text: "Look the other way (Approval drops, +Business)",
                effect: (state, engine) => {
                    state.update('approval', (state.get('approval') || 50) - 5);
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Business Elite', 5);
                        fs.update(state);
                    }
                }
            }
        ]
    },
    {
        id: 'natural_disaster',
        title: "Earthquake Devastates Region",
        desc: "A major earthquake has struck. Thousands are homeless.",
        trigger: (state) => Math.random() < 0.02,
        choices: [
            {
                text: "Massive relief effort (-$5B)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 5);
                    state.update('approval', (state.get('approval') || 50) + 10);
                }
            },
            {
                text: "Request international aid (-5 Sovereignty)",
                effect: (state, engine) => {
                    state.update('sovereignty', (state.get('sovereignty') || 100) - 5);
                    state.update('approval', (state.get('approval') || 50) + 5);
                }
            },
            {
                text: "Minimal response (Approval plummets)",
                effect: (state, engine) => {
                    state.update('approval', (state.get('approval') || 50) - 15);
                }
            }
        ]
    },

    // ==================== PERSONAL EVENTS ====================
    {
        id: 'assassination_attempt',
        title: "Assassination Attempt!",
        desc: "An attempt on your life has been thwarted. The nation is in shock.",
        trigger: (state) => state.get('approval') < 30 && Math.random() < 0.02,
        choices: [
            {
                text: "Use it to rally support (+10 Approval, +10 PC)",
                effect: (state, engine) => {
                    state.update('approval', (state.get('approval') || 50) + 10);
                    state.update('politicalCapital', (state.get('politicalCapital') || 0) + 10);
                }
            },
            {
                text: "Crack down on opposition (Risk backlash)",
                effect: (state, engine) => {
                    const fs = engine.systems.find(s => s.modifyGroupHappiness);
                    if (fs) {
                        fs.modifyGroupHappiness('Youth Students', -15);
                        fs.modifyGroupHappiness('Minority Communities', -10);
                        fs.update(state);
                    }
                }
            }
        ]
    },
    {
        id: 'health_crisis',
        title: "Leader's Health Crisis",
        desc: "You have been hospitalized. Rumors of incapacity are spreading.",
        trigger: (state) => Math.random() < 0.02,
        choices: [
            {
                text: "Appear in public immediately (+Approval, -Health risk)",
                effect: (state, engine) => {
                    state.update('approval', (state.get('approval') || 50) + 5);
                }
            },
            {
                text: "Rest quietly, let rumors swirl (-5 PC)",
                effect: (state, engine) => {
                    state.update('politicalCapital', (state.get('politicalCapital') || 50) - 5);
                }
            }
        ]
    },
    {
        id: 'family_scandal',
        title: "Family Member in Scandal",
        desc: "Your relative has been caught in an embarrassing scandal. The media is feasting.",
        trigger: (state) => Math.random() < 0.03,
        choices: [
            {
                text: "Distance yourself publicly (-3 Approval)",
                effect: (state, engine) => {
                    state.update('approval', (state.get('approval') || 50) - 3);
                }
            },
            {
                text: "Defend them fiercely (-5 Approval, +PC from loyalists)",
                effect: (state, engine) => {
                    state.update('approval', (state.get('approval') || 50) - 5);
                    state.update('politicalCapital', (state.get('politicalCapital') || 0) + 3);
                }
            },
            {
                text: "Use media censorship to suppress (Risk bigger scandal)",
                effect: (state, engine) => {
                    const dm = engine.systems.find(s => s.addEventToDeck);
                    if (dm && Math.random() < 0.5) dm.addEventToDeck('major_scandal');
                }
            }
        ]
    }
];

// ============================================
// THE DILEMMA MANAGER
// ============================================

export class DilemmaManager {
    constructor(gameEngine) {
        this.engine = gameEngine;
        // Merge regular events with sector events
        const allEvents = [...EVENTS, ...Object.values(SECTOR_EVENTS)];
        this.eventPool = [...allEvents.filter(e => !e.isChained)]; // Only non-chained events in initial pool
        this.allEvents = allEvents; // Keep reference for chained lookups
        this.chainedDeck = []; // Events added by player choices
        this.cooldown = 0;
        this.turnsSinceChainedAdded = {}; // Track when chained events were added
    }

    update(state) {
        if (this.cooldown > 0) {
            this.cooldown--;
            return;
        }

        // Check for delayed chained events
        this.checkChainedEvents(state);

        // NEW: Check for unrest-triggered events
        this.checkUnrestTriggers(state);

        // Regular event trigger (5% chance per day)
        if (Math.random() < 0.05) {
            const validEvents = this.eventPool.filter(e => e.trigger(state));
            if (validEvents.length > 0) {
                const event = validEvents[Math.floor(Math.random() * validEvents.length)];
                this.triggerEvent(event);
            }
        }
    }

    // NEW: Civil Unrest Cascade System
    checkUnrestTriggers(state) {
        const approval = state.get('approval') || 50;
        const regions = state.get('regions') || {};

        // Calculate average regional unrest
        let totalUnrest = 0;
        let count = 0;
        Object.values(regions).forEach(r => {
            totalUnrest += r.unrest || 0;
            count++;
        });
        const avgUnrest = count > 0 ? totalUnrest / count : 0;

        // Track unrest escalation
        if (!this.unrestLevel) this.unrestLevel = 0;
        if (!this.unrestDays) this.unrestDays = 0;

        // Escalation thresholds
        if (approval < 25 || avgUnrest > 60) {
            this.unrestDays++;

            // Level 1: Scattered Protests (after 5 days of low approval)
            if (this.unrestLevel === 0 && this.unrestDays >= 5) {
                this.addEventToDeck('scattered_protests');
                this.unrestLevel = 1;
                console.log("[UNREST] Escalation Level 1: Scattered Protests triggered");
            }

            // Level 2: General Strike (after 15 days)
            if (this.unrestLevel === 1 && this.unrestDays >= 15) {
                this.addEventToDeck('general_strike');
                this.unrestLevel = 2;
                console.log("[UNREST] Escalation Level 2: General Strike triggered");
            }

            // Level 3: Revolution Warning (after 25 days)
            if (this.unrestLevel === 2 && this.unrestDays >= 25) {
                this.addEventToDeck('revolution_warning');
                this.unrestLevel = 3;
                console.log("[UNREST] Escalation Level 3: Revolution Warning triggered");
            }
        } else {
            // De-escalation if approval improves
            if (this.unrestDays > 0) this.unrestDays--;
            if (this.unrestDays <= 0 && this.unrestLevel > 0) {
                this.unrestLevel = Math.max(0, this.unrestLevel - 1);
                console.log("[UNREST] De-escalation: Level now", this.unrestLevel);
            }
        }
    }

    // NEW: Living Deck feature
    addEventToDeck(eventId) {
        const event = this.allEvents.find(e => e.id === eventId);
        if (event && !this.chainedDeck.includes(eventId)) {
            this.chainedDeck.push(eventId);
            this.turnsSinceChainedAdded[eventId] = 0;
            console.log(`[LIVING DECK] Added '${event.title}' - will trigger in 3-10 turns.`);
        }
    }

    checkChainedEvents(state) {
        // Increment turn counters
        Object.keys(this.turnsSinceChainedAdded).forEach(id => {
            this.turnsSinceChainedAdded[id]++;
        });

        // Trigger chained events after 3-10 turns
        const toTrigger = this.chainedDeck.filter(id => {
            const turns = this.turnsSinceChainedAdded[id] || 0;
            return turns >= 3 && Math.random() < 0.2; // 20% chance per day after day 3
        });

        if (toTrigger.length > 0) {
            const eventId = toTrigger[0];
            const event = this.allEvents.find(e => e.id === eventId);
            if (event) {
                this.triggerEvent(event);
                this.chainedDeck = this.chainedDeck.filter(id => id !== eventId);
                delete this.turnsSinceChainedAdded[eventId];
            }
        }
    }

    triggerEvent(event) {
        this.engine.pause();
        this.renderModal(event);
        console.log(`Event Triggered: ${event.title}`);
        this.cooldown = 7; // 1 week cooldown
    }

    renderModal(event) {
        const modal = document.getElementById('modal-container');
        const title = document.getElementById('dilemma-title');
        const desc = document.getElementById('dilemma-description');
        const choices = document.getElementById('dilemma-choices');

        title.innerText = event.title;
        desc.innerText = event.desc;
        choices.innerHTML = '';

        event.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'btn-choice';
            btn.innerText = choice.text;
            btn.onclick = () => {
                choice.effect(this.engine.state, this.engine);
                this.engine.state.update('lastEvent', event.title);
                modal.classList.add('hidden');
                this.engine.resume();
            };
            choices.appendChild(btn);
        });

        modal.classList.remove('hidden');
    }
}
