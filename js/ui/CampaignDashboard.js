import { CAMPAIGN_PROMISES, DEBATE_TOPICS } from '../systems/ElectionSystem.js';

export class CampaignDashboard {
    constructor(gameEngine, containerId) {
        this.engine = gameEngine;
        this.container = document.getElementById(containerId);
        this.electionSystem = this.engine.systems.find(s => s.getCampaignState);
        this.debateResult = null;
    }

    render() {
        const state = this.engine.state;
        const campaign = this.electionSystem?.getCampaignState();

        if (!campaign || !campaign.opponent) {
            this.container.innerHTML = `
                <div class="glass-panel" style="height: 100%; display: flex; justify-content: center; align-items: center;">
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🗳️</div>
                        <h2 style="color: var(--accent-gold);">No Active Campaign</h2>
                        <p style="color: var(--text-muted);">Campaign mode activates 60 days before the election.</p>
                        <div style="margin-top: 1rem; font-size: 1.2rem;">
                            ${state.get('daysUntilElection') || '???'} days until election
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        const daysLeft = state.get('daysUntilElection') || 0;
        const pc = state.get('politicalCapital') || 0;

        // Polling bars
        const playerWidth = Math.min(100, campaign.playerPopularity);
        const oppWidth = Math.min(100, campaign.opponentPopularity);

        let html = `
            <div style="height: 100%; display: flex; flex-direction: column; overflow: hidden; padding: 1rem;">
                <div style="border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem; margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h2 style="color: var(--accent-gold);">🗳️ Campaign Mode</h2>
                            <p style="color: var(--text-muted); font-size: 0.9rem;">${daysLeft} days until election</p>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 0.8rem; color: var(--text-muted);">Campaign Funds</div>
                            <div style="font-size: 1.2rem; color: var(--accent-gold);">$${campaign.campaignFunds.toFixed(1)}B</div>
                        </div>
                    </div>
                </div>

                <!-- Polling Section -->
                <div class="glass-panel" style="padding: 1rem; margin-bottom: 1rem;">
                    <h3 style="margin-bottom: 0.8rem;">📊 Current Polling</h3>
                    <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 0.5rem;">
                        <div style="width: 100px;">You</div>
                        <div style="flex: 1; background: rgba(255,255,255,0.1); height: 20px; border-radius: 10px; overflow: hidden;">
                            <div style="width: ${playerWidth}%; height: 100%; background: linear-gradient(90deg, #10b981, #22d3ee);"></div>
                        </div>
                        <div style="width: 50px; text-align: right; font-weight: 600; color: #10b981;">${Math.round(campaign.playerPopularity)}%</div>
                    </div>
                    <div style="display: flex; gap: 1rem; align-items: center;">
                        <div style="width: 100px; font-size: 0.85rem;">${campaign.opponent.name}</div>
                        <div style="flex: 1; background: rgba(255,255,255,0.1); height: 20px; border-radius: 10px; overflow: hidden;">
                            <div style="width: ${oppWidth}%; height: 100%; background: linear-gradient(90deg, #ef4444, #f97316);"></div>
                        </div>
                        <div style="width: 50px; text-align: right; font-weight: 600; color: #ef4444;">${Math.round(campaign.opponentPopularity)}%</div>
                    </div>
                    <div style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--text-muted); font-style: italic;">
                        "${campaign.opponent.slogan}"
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; overflow-y: auto;">
                    
                    <!-- Campaign Actions -->
                    <div class="glass-panel" style="padding: 1rem;">
                        <h3 style="margin-bottom: 0.8rem;">⚡ Campaign Actions</h3>
                        
                        <button id="rally-btn" class="btn-primary" style="width: 100%; margin-bottom: 0.5rem;" ${campaign.campaignFunds < 0.5 ? 'disabled' : ''}>
                            📢 Hold Rally (-$0.5B, +2% polling)
                        </button>
                        <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 1rem;">
                            Rallies held: ${campaign.ralliesHeld}
                        </div>

                        <button id="debate-btn" class="btn-secondary" style="width: 100%;" ${campaign.debatesHeld >= 3 ? 'disabled' : ''}>
                            🎤 Hold Debate (${campaign.debatesHeld}/3)
                        </button>
                    </div>

                    <!-- Campaign Promises -->
                    <div class="glass-panel" style="padding: 1rem;">
                        <h3 style="margin-bottom: 0.8rem;">🤝 Make Promises</h3>
                        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">
                            Promises cost PC but boost faction support
                        </div>
                        ${campaign.availablePromises.map(p => `
                            <button class="promise-btn btn-secondary" data-id="${p.id}" 
                                style="width: 100%; margin-bottom: 0.5rem; text-align: left; font-size: 0.8rem;"
                                ${pc < p.cost ? 'disabled' : ''}>
                                ${p.text} <span style="float: right; color: var(--accent-blue);">${p.cost} PC</span>
                            </button>
                        `).join('')}
                        ${campaign.promisesMade.length > 0 ? `
                            <div style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--accent-gold);">
                                ✅ Made ${campaign.promisesMade.length} promise(s)
                            </div>
                        ` : ''}
                    </div>
                </div>

                ${this.debateResult ? this.renderDebateResult() : ''}
            </div>
        `;

        this.container.innerHTML = html;

        // Bind events
        document.getElementById('rally-btn')?.addEventListener('click', () => {
            if (this.electionSystem.holdRally(state)) {
                this.render();
            }
        });

        document.getElementById('debate-btn')?.addEventListener('click', () => {
            this.debateResult = this.electionSystem.holdDebate(state);
            this.render();
        });

        this.container.querySelectorAll('.promise-btn').forEach(btn => {
            btn.onclick = () => {
                if (this.electionSystem.makePromise(btn.dataset.id, state)) {
                    this.render();
                }
            };
        });

        document.getElementById('close-debate')?.addEventListener('click', () => {
            this.debateResult = null;
            this.render();
        });
    }

    renderDebateResult() {
        const result = this.debateResult;
        const color = result.won ? '#10b981' : '#ef4444';
        const icon = result.won ? '🏆' : '😔';

        return `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 1000;">
                <div class="glass-panel" style="padding: 2rem; text-align: center; max-width: 400px;">
                    <div style="font-size: 3rem;">${icon}</div>
                    <h2 style="color: ${color}; margin: 1rem 0;">Debate: ${result.topic.name}</h2>
                    <p style="color: var(--text-muted); margin-bottom: 1rem;">
                        ${result.won ? 'You dominated the debate!' : 'Your opponent scored key points.'}
                    </p>
                    <div style="display: flex; justify-content: center; gap: 2rem; margin-bottom: 1.5rem;">
                        <div>
                            <div style="font-size: 1.5rem; color: ${result.won ? '#10b981' : 'var(--text-muted)'};">${result.playerScore}</div>
                            <div style="font-size: 0.8rem;">You</div>
                        </div>
                        <div style="font-size: 1.5rem;">vs</div>
                        <div>
                            <div style="font-size: 1.5rem; color: ${!result.won ? '#10b981' : 'var(--text-muted)'};">${result.opponentScore}</div>
                            <div style="font-size: 0.8rem;">Opponent</div>
                        </div>
                    </div>
                    <button id="close-debate" class="btn-primary">Continue</button>
                </div>
            </div>
        `;
    }
}
