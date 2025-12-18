// ============================================
// LEGACY SYSTEM - Achievements & History
// ============================================

export const ACHIEVEMENTS = {
    first_law: {
        id: 'first_law', name: "Legislator", icon: "⚖️",
        desc: "Pass your first law", check: (state) => (state.get('active_laws') || []).length >= 1
    },
    iron_fist: {
        id: 'iron_fist', name: "Iron Fist", icon: "✊",
        desc: "Pass 3 Authority laws", check: (state) => {
            const laws = state.get('active_laws') || [];
            return laws.filter(l => l.includes('police') || l.includes('surveillance') || l.includes('martial')).length >= 3;
        }
    },
    people_champ: {
        id: 'people_champ', name: "Champion of the People", icon: "🏆",
        desc: "Reach 80% approval", check: (state) => (state.get('approval') || 0) >= 80
    },
    crisis_manager: {
        id: 'crisis_manager', name: "Crisis Manager", icon: "🔥",
        desc: "Survive with approval below 20%", check: (state, history) => (history?.minApproval || 100) < 20
    },
    megabuilder: {
        id: 'megabuilder', name: "Mega Builder", icon: "🏗️",
        desc: "Complete 3 megaprojects", check: (state) => {
            const p = state.get('megaprojects') || {};
            return Object.values(p).filter(x => x.completed).length >= 3;
        }
    },
    space_race: {
        id: 'space_race', name: "Space Pioneer", icon: "🚀",
        desc: "Complete the Space Program", check: (state) => {
            const p = state.get('megaprojects') || {};
            return p.space_program?.completed;
        }
    },
    unifier: {
        id: 'unifier', name: "Unifier", icon: "🤝",
        desc: "Keep all regions under 30% unrest", check: (state) => {
            const r = state.get('regions') || {};
            return Object.values(r).every(x => (x.unrest || 0) < 30);
        }
    },
    survivor: {
        id: 'survivor', name: "Survivor", icon: "⏰",
        desc: "Govern for 2 years (730 days)", check: (state) => (state.get('daysPassed') || 0) >= 730
    },
    reelected: {
        id: 'reelected', name: "Re-Elected", icon: "🗳️",
        desc: "Win re-election", check: (state, history) => (history?.electionsWon || 0) >= 1
    },
    balance_master: {
        id: 'balance_master', name: "Balance Master", icon: "⚖️",
        desc: "Keep budget positive for 100 days", check: (state, history) => (history?.daysInSurplus || 0) >= 100
    }
};

export class LegacySystem {
    constructor(gameEngine) {
        this.engine = gameEngine;
        this.unlockedAchievements = new Set();
    }

    update(state) {
        const history = state.get('history') || {};

        // Track days in surplus
        const budget = state.get('budget') || 0;
        if (budget > 0) {
            history.daysInSurplus = (history.daysInSurplus || 0) + 1;
        }

        // Check achievements
        Object.keys(ACHIEVEMENTS).forEach(id => {
            if (this.unlockedAchievements.has(id)) return;

            const achievement = ACHIEVEMENTS[id];
            if (achievement.check(state, history)) {
                this.unlockAchievement(id, state);
            }
        });

        state.update('history', history);
        state.update('achievements', Array.from(this.unlockedAchievements));
    }

    unlockAchievement(id, state) {
        const achievement = ACHIEVEMENTS[id];
        this.unlockedAchievements.add(id);

        // News notification
        const news = this.engine.systems.find(s => s.addNews);
        if (news) {
            news.addNews(`🏆 Achievement Unlocked: ${achievement.name}!`, 'positive');
        }

        console.log(`[ACHIEVEMENT] Unlocked: ${achievement.name}`);
    }

    generateHistoryBook(state) {
        const history = state.get('history') || {};
        const leader = state.get('leaderName') || 'The President';
        const country = state.get('countryName') || 'The Republic';
        const daysPassed = state.get('daysPassed') || 0;
        const years = Math.floor(daysPassed / 365);
        const laws = (state.get('active_laws') || []).length;
        const projects = Object.values(state.get('megaprojects') || {}).filter(p => p.completed).length;
        const achievements = this.unlockedAchievements.size;

        let verdict = "an unremarkable";
        if (history.maxApproval >= 80 && history.minApproval > 30) verdict = "a triumphant";
        else if (history.minApproval < 20) verdict = "a turbulent";
        else if (projects >= 2) verdict = "an ambitious";
        else if (laws >= 5) verdict = "a legislative";

        return {
            title: `The ${leader} Years`,
            summary: `${leader} served ${years} year(s) as leader of ${country}. It was ${verdict} tenure.`,
            stats: {
                'Peak Approval': `${Math.round(history.maxApproval || 50)}%`,
                'Lowest Point': `${Math.round(history.minApproval || 50)}%`,
                'Laws Passed': laws,
                'Megaprojects': projects,
                'Achievements': `${achievements}/${Object.keys(ACHIEVEMENTS).length}`
            },
            achievements: Array.from(this.unlockedAchievements).map(id => ACHIEVEMENTS[id])
        };
    }
}
