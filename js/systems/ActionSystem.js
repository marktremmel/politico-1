// ============================================
// ACTION SYSTEM - Proactive Player Choices
// ============================================

export const PLAYER_ACTIONS = [
    {
        id: 'address_nation',
        name: "Address the Nation",
        desc: "Make a televised speech to rally support.",
        costPC: 10,
        cooldown: 30, // Days
        effect: (state, engine) => {
            state.update('approval', (state.get('approval') || 50) + 5);
            const fs = engine.systems.find(s => s.modifyGroupHappiness);
            if (fs) {
                fs.modifyGroupHappiness('all', 3);
                fs.update(state);
            }
        }
    },
    {
        id: 'investigate_corruption',
        name: "Launch Corruption Investigation",
        desc: "Risk exposing scandals, but might backfire.",
        costPC: 15,
        cooldown: 60,
        effect: (state, engine) => {
            const success = Math.random() > 0.4; // 60% success
            if (success) {
                state.update('approval', (state.get('approval') || 50) + 10);
                alert("Investigation successful! A corrupt official was caught. +10 Approval.");
            } else {
                state.update('approval', (state.get('approval') || 50) - 5);
                alert("The investigation backfired! Opposition claims it's a witch hunt. -5 Approval.");
            }
        }
    },
    {
        id: 'scapegoat_minister',
        name: "Scapegoat a Minister",
        desc: "Fire a cabinet member to deflect blame from a crisis.",
        costPC: 5,
        cooldown: 45,
        effect: (state, engine) => {
            state.update('approval', (state.get('approval') || 50) + 8);
            // Actually fire a minister
            const cabinet = engine.systems.find(s => s.fireMinister);
            if (cabinet) {
                const roles = ['economy', 'defense', 'foreign', 'interior', 'welfare'];
                const randomRole = roles[Math.floor(Math.random() * roles.length)];
                cabinet.fireMinister(randomRole);
                alert(`The ${randomRole} minister has been dismissed. +8 Approval.`);
            }
        }
    },
    {
        id: 'request_aid',
        name: "Request Foreign Aid",
        desc: "Get emergency funds, but lose independence.",
        costPC: 0,
        cooldown: 90,
        effect: (state, engine) => {
            state.update('budget', (state.get('budget') || 0) + 5);
            state.update('sovereignty', (state.get('sovereignty') || 100) - 10);
            alert("Foreign aid received: +$5B, but -10 Sovereignty.");
        }
    },
    {
        id: 'emergency_powers',
        name: "Invoke Emergency Powers",
        desc: "Gain massive PC, but at a cost to liberty.",
        costPC: 0,
        cooldown: 180,
        effect: (state, engine) => {
            state.update('politicalCapital', (state.get('politicalCapital') || 0) + 30);
            const fs = engine.systems.find(s => s.modifyGroupHappiness);
            if (fs) {
                fs.modifyGroupHappiness('Youth Students', -20);
                fs.modifyGroupHappiness('Minority Communities', -15);
                fs.update(state);
            }
            alert("Emergency powers invoked! +30 PC, but Liberals are furious.");
        }
    },
    {
        id: 'stimulus_package',
        name: "Economic Stimulus Package",
        desc: "Inject money into the economy. Expensive but popular.",
        costPC: 8,
        cooldown: 60,
        effect: (state, engine) => {
            state.update('budget', (state.get('budget') || 0) - 3);
            state.update('gdp', (state.get('gdp') || 100) * 1.02);
            const fs = engine.systems.find(s => s.modifyGroupHappiness);
            if (fs) {
                fs.modifyGroupHappiness('all', 5);
                fs.update(state);
            }
        }
    }
];

export class ActionSystem {
    constructor(gameEngine) {
        this.engine = gameEngine;
        this.cooldowns = {}; // Track when actions were last used
    }

    update(state) {
        // Decrement cooldowns
        Object.keys(this.cooldowns).forEach(id => {
            if (this.cooldowns[id] > 0) {
                this.cooldowns[id]--;
            }
        });
    }

    canPerform(actionId, state) {
        const action = PLAYER_ACTIONS.find(a => a.id === actionId);
        if (!action) return false;

        // Check cooldown
        if (this.cooldowns[actionId] && this.cooldowns[actionId] > 0) return false;

        // Check PC
        const pc = state.get('politicalCapital') || 0;
        if (pc < action.costPC) return false;

        return true;
    }

    performAction(actionId, state) {
        const action = PLAYER_ACTIONS.find(a => a.id === actionId);
        if (!action) return false;
        if (!this.canPerform(actionId, state)) return false;

        // Deduct PC
        const pc = state.get('politicalCapital') || 0;
        state.update('politicalCapital', pc - action.costPC);

        // Set cooldown
        this.cooldowns[actionId] = action.cooldown;

        // Perform effect
        action.effect(state, this.engine);

        return true;
    }

    getAvailableActions(state) {
        return PLAYER_ACTIONS.map(action => ({
            ...action,
            available: this.canPerform(action.id, state),
            cooldownRemaining: this.cooldowns[action.id] || 0
        }));
    }
}
