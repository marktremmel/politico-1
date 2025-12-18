// ============================================
// MEGAPROJECT SYSTEM - Long-term Investments
// ============================================

export const MEGAPROJECTS = {
    high_speed_rail: {
        id: 'high_speed_rail',
        name: "High-Speed Rail Network",
        icon: "🚄",
        description: "Connect major cities with modern rail. Boosts economy and infrastructure.",
        totalCost: 15, // Billion
        turnsToBuild: 30,
        effects: {
            gdpBonus: 0.05, // +5% GDP on completion
            infrastructureHealth: 30,
            approval: 10
        },
        factionImpact: {
            'Business Elite': 15,
            'Urban Middle Class': 10,
            'Rural Workers': -5 // Feel left out
        },
        riskEvents: ['rail_cost_overrun', 'rail_strike']
    },
    space_program: {
        id: 'space_program',
        name: "National Space Program",
        icon: "🚀",
        description: "Launch satellites and inspire the nation. Massive prestige boost.",
        totalCost: 25,
        turnsToBuild: 50,
        effects: {
            pcBonus: 20,
            approval: 15,
            techMultiplier: 1.1
        },
        factionImpact: {
            'Youth Students': 25,
            'Business Elite': 10
        },
        riskEvents: ['rocket_failure', 'budget_overrun']
    },
    green_energy: {
        id: 'green_energy',
        name: "Green Energy Grid",
        icon: "⚡",
        description: "Transition to renewable energy. Long-term cost savings.",
        totalCost: 18,
        turnsToBuild: 35,
        effects: {
            sectorCostReduction: 0.1, // -10% sector costs
            approval: 5
        },
        factionImpact: {
            'Youth Students': 20,
            'Business Elite': -10,
            'Rural Workers': 5
        },
        riskEvents: ['green_protest', 'solar_scandal']
    },
    border_wall: {
        id: 'border_wall',
        name: "Border Security Wall",
        icon: "🧱",
        description: "Massive border fortification. Popular with nationalists.",
        totalCost: 10,
        turnsToBuild: 20,
        effects: {
            sovereignty: 10,
            approval: -5 // Controversial
        },
        factionImpact: {
            'Rural Workers': 15,
            'Minority Communities': -25,
            'Youth Students': -15
        },
        riskEvents: ['wall_protest', 'construction_scandal']
    },
    universal_education: {
        id: 'universal_education',
        name: "Universal Education Reform",
        icon: "📚",
        description: "Overhaul education system. Long-term economic benefits.",
        totalCost: 12,
        turnsToBuild: 25,
        effects: {
            educationHealth: 40,
            gdpGrowthBonus: 0.01 // +1% GDP growth
        },
        factionImpact: {
            'Youth Students': 20,
            'State Pensioners': 5,
            'Business Elite': 5
        },
        riskEvents: ['teacher_opposition', 'curriculum_controversy']
    },
    national_healthcare: {
        id: 'national_healthcare',
        name: "Universal Healthcare System",
        icon: "🏥",
        description: "Free healthcare for all citizens. Extremely popular but expensive.",
        totalCost: 20,
        turnsToBuild: 40,
        effects: {
            healthcareHealth: 50,
            approval: 20
        },
        factionImpact: {
            'State Pensioners': 25,
            'Rural Workers': 20,
            'Business Elite': -20
        },
        riskEvents: ['healthcare_opposition', 'funding_crisis']
    }
};

// Cost overrun events
export const MEGAPROJECT_EVENTS = {
    rail_cost_overrun: {
        id: 'rail_cost_overrun',
        title: "Rail Project Cost Overrun",
        desc: "The high-speed rail project has gone over budget. Contractors are demanding more money.",
        trigger: () => false,
        isChained: true,
        projectId: 'high_speed_rail',
        choices: [
            {
                text: "Pay extra ($3B more)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 3);
                }
            },
            {
                text: "Cancel the project",
                effect: (state, engine) => {
                    const projects = state.get('megaprojects') || {};
                    delete projects.high_speed_rail;
                    state.update('megaprojects', projects);
                    state.update('approval', (state.get('approval') || 50) - 10);
                }
            }
        ]
    },
    rocket_failure: {
        id: 'rocket_failure',
        title: "Rocket Launch Failure!",
        desc: "The latest rocket exploded on the launchpad. The space program is in crisis.",
        trigger: () => false,
        isChained: true,
        projectId: 'space_program',
        choices: [
            {
                text: "Investigate and continue (-$2B, delays)",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 2);
                    const projects = state.get('megaprojects') || {};
                    if (projects.space_program) {
                        projects.space_program.progress = Math.max(0, projects.space_program.progress - 10);
                    }
                    state.update('megaprojects', projects);
                }
            },
            {
                text: "Cancel the program (shame)",
                effect: (state, engine) => {
                    const projects = state.get('megaprojects') || {};
                    delete projects.space_program;
                    state.update('megaprojects', projects);
                    state.update('approval', (state.get('approval') || 50) - 15);
                }
            }
        ]
    },
    budget_overrun: {
        id: 'budget_overrun',
        title: "Major Budget Overrun",
        desc: "One of your megaprojects is hemorrhaging money. The total cost has increased by 50%.",
        trigger: () => false,
        isChained: true,
        choices: [
            {
                text: "Accept increased costs",
                effect: (state, engine) => {
                    state.update('budget', state.get('budget') - 5);
                }
            },
            {
                text: "Audit and fire contractors",
                effect: (state, engine) => {
                    state.update('politicalCapital', (state.get('politicalCapital') || 50) - 5);
                }
            }
        ]
    }
};

export class MegaprojectSystem {
    constructor(gameEngine) {
        this.engine = gameEngine;
    }

    update(state) {
        const projects = state.get('megaprojects') || {};
        let totalOngoingCost = 0;

        Object.keys(projects).forEach(id => {
            const project = projects[id];
            const config = MEGAPROJECTS[id];
            if (!config || project.completed) return;

            // Calculate daily cost (total cost / build time)
            const dailyCost = config.totalCost / config.turnsToBuild;
            totalOngoingCost += dailyCost;

            // Increment progress
            project.progress = (project.progress || 0) + 1;

            // Check for random risk events (2% chance per day)
            if (config.riskEvents && Math.random() < 0.02 && project.progress > 5) {
                const eventId = config.riskEvents[Math.floor(Math.random() * config.riskEvents.length)];
                const dm = this.engine.systems.find(s => s.addEventToDeck);
                if (dm) dm.addEventToDeck(eventId);
            }

            // Check completion
            if (project.progress >= config.turnsToBuild) {
                this.completeProject(id, state);
            }
        });

        state.update('megaprojects', projects);
        state.update('megaprojectExpense', totalOngoingCost);
    }

    startProject(projectId, state) {
        const config = MEGAPROJECTS[projectId];
        if (!config) return false;

        const projects = state.get('megaprojects') || {};
        if (projects[projectId]) return false; // Already started

        // Check if we can afford the upfront cost (20% of total)
        const upfrontCost = config.totalCost * 0.2;
        const budget = state.get('budget') || 0;
        if (budget < upfrontCost) {
            alert(`Cannot afford ${config.name}! Need $${upfrontCost.toFixed(1)}B upfront.`);
            return false;
        }

        // Deduct upfront cost
        state.update('budget', budget - upfrontCost);

        // Start project
        projects[projectId] = {
            startedAt: new Date(),
            progress: 0,
            completed: false
        };
        state.update('megaprojects', projects);

        console.log(`[MEGAPROJECT] Started: ${config.name}`);
        return true;
    }

    completeProject(projectId, state) {
        const config = MEGAPROJECTS[projectId];
        const projects = state.get('megaprojects') || {};

        projects[projectId].completed = true;
        projects[projectId].completedAt = new Date();

        // Apply effects
        if (config.effects.gdpBonus) {
            state.update('gdp', state.get('gdp') * (1 + config.effects.gdpBonus));
        }
        if (config.effects.pcBonus) {
            state.update('politicalCapital', (state.get('politicalCapital') || 0) + config.effects.pcBonus);
        }
        if (config.effects.approval) {
            state.update('approval', (state.get('approval') || 50) + config.effects.approval);
        }
        if (config.effects.sovereignty) {
            state.update('sovereignty', (state.get('sovereignty') || 100) + config.effects.sovereignty);
        }

        // Apply sector health boosts
        const sectors = state.get('sectors') || {};
        if (config.effects.infrastructureHealth && sectors.infrastructure) {
            sectors.infrastructure.health = Math.min(100, sectors.infrastructure.health + config.effects.infrastructureHealth);
        }
        if (config.effects.educationHealth && sectors.education) {
            sectors.education.health = Math.min(100, sectors.education.health + config.effects.educationHealth);
        }
        if (config.effects.healthcareHealth && sectors.healthcare) {
            sectors.healthcare.health = Math.min(100, sectors.healthcare.health + config.effects.healthcareHealth);
        }
        state.update('sectors', sectors);

        // Apply faction impacts
        const fs = this.engine.systems.find(s => s.modifyGroupHappiness);
        if (fs && config.factionImpact) {
            Object.keys(config.factionImpact).forEach(faction => {
                fs.modifyGroupHappiness(faction, config.factionImpact[faction]);
            });
            fs.update(state);
        }

        state.update('megaprojects', projects);

        // News
        const news = this.engine.systems.find(s => s.addNews);
        if (news) {
            news.addNews(`🎉 ${config.name} COMPLETED!`, 'positive');
        }

        console.log(`[MEGAPROJECT] COMPLETED: ${config.name}`);
    }

    cancelProject(projectId, state) {
        const projects = state.get('megaprojects') || {};
        if (!projects[projectId]) return false;

        delete projects[projectId];
        state.update('megaprojects', projects);
        state.update('approval', (state.get('approval') || 50) - 5);

        console.log(`[MEGAPROJECT] Cancelled: ${projectId}`);
        return true;
    }

    getActiveProjects(state) {
        const projects = state.get('megaprojects') || {};
        return Object.keys(projects)
            .filter(id => !projects[id].completed)
            .map(id => ({
                id,
                ...MEGAPROJECTS[id],
                ...projects[id],
                percentComplete: (projects[id].progress / MEGAPROJECTS[id].turnsToBuild) * 100
            }));
    }

    getAvailableProjects(state) {
        const projects = state.get('megaprojects') || {};
        return Object.keys(MEGAPROJECTS)
            .filter(id => !projects[id])
            .map(id => MEGAPROJECTS[id]);
    }

    getCompletedProjects(state) {
        const projects = state.get('megaprojects') || {};
        return Object.keys(projects)
            .filter(id => projects[id].completed)
            .map(id => ({
                id,
                ...MEGAPROJECTS[id],
                ...projects[id]
            }));
    }
}
