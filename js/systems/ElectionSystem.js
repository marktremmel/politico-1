// ============================================
// ELECTION SYSTEM - Full Campaign Mode
// ============================================

const OPPONENT_NAMES = [
    "Viktor Orban Jr.", "Marina Volkov", "Klaus Schmidt", "Jean-Pierre Dubois",
    "Alessandro Romano", "Sarah O'Connor", "Chen Wei", "Ahmed Hassan",
    "Ingrid Larsson", "Carlos Mendez"
];

const OPPONENT_SLOGANS = [
    "Change You Can Trust",
    "A New Dawn for Our People",
    "Security. Prosperity. Unity.",
    "The People's Choice",
    "Real Solutions, Real Leadership"
];

const DEBATE_TOPICS = [
    { id: 'economy', name: 'The Economy', icon: '💰', stat: 'gdp' },
    { id: 'security', name: 'National Security', icon: '🛡️', stat: 'sovereignty' },
    { id: 'welfare', name: 'Social Welfare', icon: '🤝', stat: 'approval' },
    { id: 'foreign', name: 'Foreign Policy', icon: '🌍', stat: 'alignment' },
    { id: 'environment', name: 'Environment', icon: '🌱', stat: null }
];

const CAMPAIGN_PROMISES = [
    { id: 'cut_taxes', text: "Cut taxes by 20%", appeal: ['Business Elite', 'Urban Middle Class'], cost: 3 },
    { id: 'more_welfare', text: "Expand welfare programs", appeal: ['State Pensioners', 'Rural Workers'], cost: 4 },
    { id: 'tough_crime', text: "Get tough on crime", appeal: ['Rural Workers', 'State Pensioners'], cost: 2 },
    { id: 'green_future', text: "Green energy transition", appeal: ['Youth Students'], cost: 3 },
    { id: 'national_pride', text: "Restore national pride", appeal: ['Rural Workers'], cost: 2 },
    { id: 'tech_innovation', text: "Invest in tech innovation", appeal: ['Youth Students', 'Business Elite'], cost: 3 }
];

export class ElectionSystem {
    constructor(gameEngine) {
        this.engine = gameEngine;
        this.electionDay = 1460;
        this.campaignPhaseStart = 1400; // 60 days before election
        this.electionTriggered = false;
        this.inCampaignPhase = false;

        // Campaign state
        this.opponent = null;
        this.opponentPopularity = 35;
        this.playerPopularity = 50;
        this.promisesMade = [];
        this.debatesHeld = 0;
        this.campaignFunds = 0;
        this.ralliesHeld = 0;
    }

    update(state) {
        const startDate = state.get('startDate');
        const currentDate = state.get('date');
        if (!startDate || !currentDate) return;

        const daysPassed = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
        state.update('daysPassed', daysPassed);
        state.update('daysUntilElection', Math.max(0, this.electionDay - daysPassed));

        // Enter Campaign Phase
        if (daysPassed >= this.campaignPhaseStart && !this.inCampaignPhase) {
            this.inCampaignPhase = true;
            this.startCampaign(state);
        }

        // Campaign dynamics
        if (this.inCampaignPhase && !this.electionTriggered) {
            this.updateCampaign(state);
            state.update('campaignPhase', true);
            state.update('opponentPopularity', this.opponentPopularity);
            state.update('playerPopularity', this.playerPopularity);
        }

        // Election Day
        if (daysPassed >= this.electionDay && !this.electionTriggered) {
            this.electionTriggered = true;
            this.triggerElection(state);
        }
    }

    startCampaign(state) {
        // Generate opponent
        this.opponent = {
            name: OPPONENT_NAMES[Math.floor(Math.random() * OPPONENT_NAMES.length)],
            slogan: OPPONENT_SLOGANS[Math.floor(Math.random() * OPPONENT_SLOGANS.length)],
            ideology: Math.random() > 0.5 ? 'populist' : 'establishment'
        };

        // Base popularity from approval
        this.playerPopularity = state.get('approval') || 50;
        this.opponentPopularity = 100 - this.playerPopularity + (Math.random() * 10 - 5);
        this.opponentPopularity = Math.max(25, Math.min(75, this.opponentPopularity));

        // Campaign funds from budget
        this.campaignFunds = Math.min(10, (state.get('budget') || 0) * 0.1);

        // News
        const news = this.engine.systems.find(s => s.addNews);
        if (news) {
            news.addNews(`🗳️ Campaign begins! ${this.opponent.name} challenges for leadership!`, 'neutral');
        }

        console.log(`[ELECTION] Campaign started. Opponent: ${this.opponent.name}`);
    }

    updateCampaign(state) {
        // Opponent campaigns too (slowly gains/loses based on performance)
        if (Math.random() < 0.1) {
            const opponentShift = (Math.random() - 0.5) * 2;
            this.opponentPopularity = Math.max(20, Math.min(80, this.opponentPopularity + opponentShift));
        }

        // Player popularity influenced by current approval
        const approval = state.get('approval') || 50;
        const approvalInfluence = (approval - 50) * 0.01;
        this.playerPopularity = Math.max(10, Math.min(90, this.playerPopularity + approvalInfluence));
    }

    holdRally(state) {
        if (this.campaignFunds < 0.5) return false;

        this.campaignFunds -= 0.5;
        this.ralliesHeld++;
        this.playerPopularity = Math.min(95, this.playerPopularity + 2);

        // Regional boost
        const regions = state.get('regions') || {};
        const regionKeys = Object.keys(regions);
        if (regionKeys.length > 0) {
            const randomRegion = regionKeys[Math.floor(Math.random() * regionKeys.length)];
            regions[randomRegion].support = Math.min(100, (regions[randomRegion].support || 50) + 5);
            state.update('regions', regions);
        }

        return true;
    }

    makePromise(promiseId, state) {
        const promise = CAMPAIGN_PROMISES.find(p => p.id === promiseId);
        if (!promise || this.promisesMade.includes(promiseId)) return false;
        if ((state.get('politicalCapital') || 0) < promise.cost) return false;

        state.update('politicalCapital', (state.get('politicalCapital') || 0) - promise.cost);
        this.promisesMade.push(promiseId);

        // Boost among target factions
        const fs = this.engine.systems.find(s => s.modifyGroupHappiness);
        if (fs) {
            promise.appeal.forEach(faction => {
                fs.modifyGroupHappiness(faction, 10);
            });
            fs.update(state);
        }

        this.playerPopularity = Math.min(95, this.playerPopularity + 3);
        return true;
    }

    holdDebate(state) {
        if (this.debatesHeld >= 3) return null;

        this.debatesHeld++;
        const topic = DEBATE_TOPICS[this.debatesHeld - 1];

        // Debate outcome based on relevant stat + random
        let playerScore = 50 + (Math.random() * 30 - 15);
        let opponentScore = 50 + (Math.random() * 30 - 15);

        // Stat bonus
        if (topic.stat) {
            const statValue = state.get(topic.stat) || 50;
            playerScore += (statValue - 50) * 0.3;
        }

        // PC investment option
        const pc = state.get('politicalCapital') || 0;
        if (pc >= 3) {
            playerScore += 10; // Prep bonus
        }

        const won = playerScore > opponentScore;

        if (won) {
            this.playerPopularity = Math.min(95, this.playerPopularity + 5);
            this.opponentPopularity = Math.max(5, this.opponentPopularity - 3);
        } else {
            this.opponentPopularity = Math.min(95, this.opponentPopularity + 5);
            this.playerPopularity = Math.max(5, this.playerPopularity - 3);
        }

        return {
            topic,
            won,
            playerScore: Math.round(playerScore),
            opponentScore: Math.round(opponentScore)
        };
    }

    triggerElection(state) {
        this.engine.pause();

        // Final calculation
        const approval = state.get('approval') || 50;
        const finalPlayerVotes = (this.playerPopularity * 0.7) + (approval * 0.3);
        const finalOpponentVotes = this.opponentPopularity;

        // Add some randomness
        const playerFinal = finalPlayerVotes + (Math.random() * 6 - 3);
        const opponentFinal = finalOpponentVotes + (Math.random() * 6 - 3);

        const won = playerFinal > opponentFinal;
        const margin = Math.abs(playerFinal - opponentFinal);

        this.showElectionResult(won, playerFinal, opponentFinal, margin, state);
    }

    showElectionResult(won, playerVotes, opponentVotes, margin, state) {
        const container = document.getElementById('panel-center');
        const leaderName = state.get('leaderName') || 'The President';
        const marginText = margin < 2 ? 'razor-thin' : margin < 5 ? 'narrow' : margin < 10 ? 'comfortable' : 'landslide';

        const winContent = `
            <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
            <h1 style="color: #10b981; font-size: 2.5rem; margin-bottom: 1rem;">VICTORY!</h1>
            <p style="font-size: 1.2rem; color: var(--text-main); max-width: 600px; margin-bottom: 1rem;">
                By a ${marginText} margin of ${margin.toFixed(1)}%, ${leaderName} defeats ${this.opponent.name}!
            </p>
            <div style="display: flex; gap: 2rem; margin: 2rem 0;">
                <div class="glass-panel" style="padding: 1rem; text-align: center;">
                    <div style="font-size: 2rem; color: #10b981;">${Math.round(playerVotes)}%</div>
                    <div style="color: var(--text-muted);">You</div>
                </div>
                <div class="glass-panel" style="padding: 1rem; text-align: center;">
                    <div style="font-size: 2rem; color: #ef4444;">${Math.round(opponentVotes)}%</div>
                    <div style="color: var(--text-muted);">${this.opponent.name}</div>
                </div>
            </div>
            ${this.promisesMade.length > 0 ? `
                <div style="padding: 0.8rem; background: rgba(251, 191, 36, 0.15); border-radius: 6px; margin-bottom: 1rem; font-size: 0.85rem;">
                    ⚠️ Remember your ${this.promisesMade.length} campaign promise(s)!
                </div>
            ` : ''}
            <button class="btn-primary" style="margin-top: 1rem;" onclick="window.game.startNewTerm();">Begin Next Term (+20 PC)</button>
        `;

        const loseContent = `
            <div style="font-size: 4rem; margin-bottom: 1rem;">📦</div>
            <h1 style="color: #f59e0b; font-size: 2.5rem; margin-bottom: 1rem;">DEFEAT</h1>
            <p style="font-size: 1.2rem; color: var(--text-main); max-width: 600px; margin-bottom: 1rem;">
                ${this.opponent.name} wins by ${margin.toFixed(1)}%. Time to pack your bags.
            </p>
            <div style="display: flex; gap: 2rem; margin: 2rem 0;">
                <div class="glass-panel" style="padding: 1rem; text-align: center;">
                    <div style="font-size: 2rem; color: #ef4444;">${Math.round(playerVotes)}%</div>
                    <div style="color: var(--text-muted);">You</div>
                </div>
                <div class="glass-panel" style="padding: 1rem; text-align: center;">
                    <div style="font-size: 2rem; color: #10b981;">${Math.round(opponentVotes)}%</div>
                    <div style="color: var(--text-muted);">${this.opponent.name}</div>
                </div>
            </div>
            <div class="glass-panel" style="background: rgba(0,0,0,0.3); padding: 1.5rem; max-width: 500px; border-left: 4px solid #f59e0b;">
                <h4 style="color: var(--accent-gold); margin-bottom: 0.5rem;">📖 Your Legacy</h4>
                <p style="font-style: italic; color: var(--text-muted);">"${leaderName} served one term, remembered for ${this.getRandomLegacy(state)}."</p>
            </div>
            <button class="btn-primary" style="margin-top: 2rem;" onclick="location.reload();">Try Again</button>
        `;

        container.innerHTML = `
            <div class="glass-panel" style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 3rem;">
                ${won ? winContent : loseContent}
            </div>
        `;

        window.game.startNewTerm = () => {
            this.electionTriggered = false;
            this.inCampaignPhase = false;
            this.electionDay += 1460;
            this.campaignPhaseStart += 1460;
            this.promisesMade = [];
            this.debatesHeld = 0;
            this.ralliesHeld = 0;
            this.opponent = null;

            state.update('politicalCapital', (state.get('politicalCapital') || 0) + 20);
            state.update('campaignPhase', false);
            this.engine.resume();
            location.reload();
        };
    }

    getRandomLegacy(state) {
        const legacies = [
            "controversial economic policies",
            "ambitious infrastructure projects",
            "tense foreign relations",
            "sweeping social reforms",
            "maintaining stability through crisis",
            "bold but divisive leadership"
        ];
        return legacies[Math.floor(Math.random() * legacies.length)];
    }

    getCampaignState() {
        return {
            opponent: this.opponent,
            playerPopularity: this.playerPopularity,
            opponentPopularity: this.opponentPopularity,
            campaignFunds: this.campaignFunds,
            promisesMade: this.promisesMade,
            debatesHeld: this.debatesHeld,
            ralliesHeld: this.ralliesHeld,
            availablePromises: CAMPAIGN_PROMISES.filter(p => !this.promisesMade.includes(p.id))
        };
    }
}

export { CAMPAIGN_PROMISES, DEBATE_TOPICS };
