export class NewsManager {
    constructor(gameEngine) {
        this.engine = gameEngine;
        this.newsLog = [];
        this.maxItems = 20;

        // Track previous state for comparison
        this.previousState = {
            budget: null,
            approval: null,
            factions: {}
        };
    }

    update(state) {
        // Check for 'lastEvent' update to log event
        const lastEvent = state.get('lastEvent');
        if (lastEvent && lastEvent !== this.lastLoggedEvent) {
            this.addNews(`📰 ${lastEvent}`, 'event');
            this.lastLoggedEvent = lastEvent;
        }

        // Generate headlines based on state changes
        this.generateHeadlines(state);
    }

    generateHeadlines(state) {
        const budget = state.get('budget') || 0;
        const approval = state.get('approval') || 50;
        const factions = state.get('factions') || {};
        const sovereignty = state.get('sovereignty') || 100;

        // Budget Headlines
        if (this.previousState.budget !== null) {
            const budgetChange = budget - this.previousState.budget;
            if (budgetChange <= -2) {
                this.addNews("💸 TREASURY HEMORRHAGING: Major budget losses reported", 'warning');
            } else if (budgetChange >= 3) {
                this.addNews("📈 SURPLUS: Treasury reports significant gains", 'positive');
            }
        }

        // Approval Headlines
        if (this.previousState.approval !== null) {
            const approvalChange = approval - this.previousState.approval;
            if (approvalChange <= -10) {
                this.addNews("📉 POLL COLLAPSE: President's approval plummets", 'warning');
            } else if (approvalChange >= 10) {
                this.addNews("🎉 POPULARITY SURGE: Citizens rally behind leadership", 'positive');
            }
        }

        // Faction Headlines
        Object.keys(factions).forEach(fId => {
            const faction = factions[fId];
            const prevSupport = this.previousState.factions[fId]?.support;

            if (prevSupport !== undefined) {
                if (faction.support < 20 && prevSupport >= 20) {
                    this.addNews(`⚠️ ${this.factionName(fId).toUpperCase()} FURIOUS: Support drops to critical levels`, 'warning');
                } else if (faction.support > 80 && prevSupport <= 80) {
                    this.addNews(`✅ ${this.factionName(fId)} DELIGHTED: Strong support for administration`, 'positive');
                }
            }
        });

        // Sovereignty Headlines
        if (sovereignty < 30 && (this.previousState.sovereignty || 100) >= 30) {
            this.addNews("🚨 INDEPENDENCE THREATENED: Sovereignty at critical low", 'critical');
        }

        // Update previous state
        this.previousState = {
            budget,
            approval,
            sovereignty,
            factions: JSON.parse(JSON.stringify(factions))
        };
    }

    factionName(id) {
        const names = {
            'capitalists': 'Business Leaders',
            'socialists': 'Labor Unions',
            'traditionalists': 'Traditionalists',
            'liberals': 'Liberal Groups',
            'nationalists': 'Nationalists',
            'minorities': 'Minority Communities'
        };
        return names[id] || id;
    }

    addNews(message, type = 'neutral') {
        const date = this.engine.state.get('date');
        const dateStr = date ? date.toLocaleDateString("en-US", { month: 'short', day: 'numeric' }) : 'Today';

        // Avoid duplicate headlines
        if (this.newsLog.length > 0 && this.newsLog[0].text === message) {
            return;
        }

        this.newsLog.unshift({ date: dateStr, text: message, type });

        if (this.newsLog.length > this.maxItems) {
            this.newsLog.pop();
        }

        this.render();
    }

    render() {
        const container = document.getElementById('news-feed-container');
        if (!container) return;

        const typeColors = {
            'event': 'var(--accent-gold)',
            'warning': '#f59e0b',
            'critical': '#ef4444',
            'positive': '#10b981',
            'neutral': 'var(--text-muted)'
        };

        let html = '';
        this.newsLog.forEach(item => {
            const color = typeColors[item.type] || typeColors.neutral;
            html += `
                <div class="news-item" style="border-left: 3px solid ${color}; padding-left: 0.5rem; margin-bottom: 0.5rem;">
                    <span class="date" style="font-size: 0.7rem; color: var(--text-muted);">${item.date}</span>
                    <p style="margin: 0; font-size: 0.85rem; color: var(--text-main);">${item.text}</p>
                </div>
            `;
        });
        container.innerHTML = html || '<p style="color: var(--text-muted); font-size: 0.85rem;">No news yet...</p>';
    }
}
