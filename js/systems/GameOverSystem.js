// ============================================
// GAME OVER SYSTEM - Stakes & Consequences
// ============================================

export class GameOverSystem {
    constructor(gameEngine) {
        this.engine = gameEngine;

        // Track how long critical conditions have persisted
        this.criticalCounters = {
            bankruptcy: 0,
            coup: 0,
            revolution: 0,
            puppetState: 0,
            capitalFlight: 0
        };

        this.capitalFlightApplied = false;
    }

    update(state) {
        // 1. Check Bankruptcy
        const budget = state.get('budget') || 0;
        if (budget < -10) {
            this.criticalCounters.bankruptcy++;
            if (this.criticalCounters.bankruptcy >= 30) {
                this.triggerGameOver(state, 'bankruptcy');
            }
        } else {
            this.criticalCounters.bankruptcy = 0;
        }

        // 2. Check Coup (Military faction too low)
        const factions = state.get('factions') || {};
        // We need to map factions to danger. Let's use overall approval as proxy for now.
        // Or check specific faction in FactionSystem? Let's use 'nationalists' as military proxy.
        const militarySupport = factions['nationalists']?.support || 50;
        if (militarySupport < 15) {
            this.criticalCounters.coup++;
            if (this.criticalCounters.coup >= 10) {
                this.triggerGameOver(state, 'coup');
            }
        } else {
            this.criticalCounters.coup = 0;
        }

        // 3. Check Revolution (Approval too low for too long)
        const approval = state.get('approval') || 50;
        if (approval < 10) {
            this.criticalCounters.revolution++;
            if (this.criticalCounters.revolution >= 5) {
                this.triggerGameOver(state, 'revolution');
            }
        } else {
            this.criticalCounters.revolution = 0;
        }

        // 4. Check Puppet State (Sovereignty too low)
        const sovereignty = state.get('sovereignty') || 100;
        if (sovereignty < 10) {
            this.criticalCounters.puppetState++;
            if (this.criticalCounters.puppetState >= 3) {
                this.triggerGameOver(state, 'puppet');
            }
        } else {
            this.criticalCounters.puppetState = 0;
        }

        // 5. Check Capital Flight (Capitalists hate you)
        const capitalistSupport = factions['capitalists']?.support || 50;
        if (capitalistSupport < 15 && !this.capitalFlightApplied) {
            this.criticalCounters.capitalFlight++;
            if (this.criticalCounters.capitalFlight >= 20) {
                this.applyCapitalFlight(state);
            }
        } else if (capitalistSupport >= 15) {
            this.criticalCounters.capitalFlight = 0;
        }
    }

    applyCapitalFlight(state) {
        this.capitalFlightApplied = true;
        // Permanent penalty: halve tax income
        const currentRate = state.get('taxRate') || 0.4;
        state.update('taxRate', currentRate * 0.5);

        // Show warning
        this.showWarning("CAPITAL FLIGHT", "Businesses are fleeing the country! Your tax revenue has been permanently halved.");
    }

    triggerGameOver(state, reason) {
        this.engine.pause();

        const reasons = {
            bankruptcy: {
                title: "STATE BANKRUPTCY",
                desc: "The treasury is empty and creditors are demanding payment. The government has collapsed.",
                epitaph: "remembered as the leader who bankrupted the nation."
            },
            coup: {
                title: "MILITARY COUP",
                desc: "Tanks are surrounding the presidential palace. The generals have had enough of your leadership.",
                epitaph: "overthrown by the military, their policies deemed dangerous to national security."
            },
            revolution: {
                title: "POPULAR REVOLUTION",
                desc: "The people have stormed the capital. Your government has been overthrown by popular uprising.",
                epitaph: "toppled by the very people they swore to serve."
            },
            puppet: {
                title: "PUPPET STATE",
                desc: "Your country has lost its sovereignty. The foreign ambassador now runs the government.",
                epitaph: "presided over the loss of national independence, becoming a figurehead for foreign powers."
            }
        };

        const data = reasons[reason];
        const leaderName = state.get('leaderName') || 'The President';

        this.showGameOver(data.title, data.desc, `${leaderName} is ${data.epitaph}`);
    }

    showWarning(title, message) {
        const modal = document.getElementById('modal-container');
        const modalTitle = document.getElementById('dilemma-title');
        const modalDesc = document.getElementById('dilemma-description');
        const choices = document.getElementById('dilemma-choices');

        modalTitle.innerText = `⚠️ ${title}`;
        modalTitle.style.color = '#f59e0b';
        modalDesc.innerText = message;
        choices.innerHTML = `<button class="btn-choice" onclick="document.getElementById('modal-container').classList.add('hidden'); window.game.resume();">Acknowledge</button>`;

        modal.classList.remove('hidden');
    }

    showGameOver(title, desc, epitaph) {
        const container = document.getElementById('panel-center');
        container.innerHTML = `
            <div class="glass-panel" style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">💀</div>
                <h1 style="color: #ef4444; font-size: 2.5rem; margin-bottom: 1rem;">${title}</h1>
                <p style="font-size: 1.2rem; color: var(--text-main); max-width: 600px; margin-bottom: 2rem;">${desc}</p>
                
                <div class="glass-panel" style="background: rgba(0,0,0,0.3); padding: 1.5rem; max-width: 500px; border-left: 4px solid #f59e0b;">
                    <h4 style="color: var(--accent-gold); margin-bottom: 0.5rem;">📖 The History Books Will Say...</h4>
                    <p style="font-style: italic; color: var(--text-muted);">"${epitaph}"</p>
                </div>

                <button class="btn-primary" style="margin-top: 2rem;" onclick="location.reload();">Try Again</button>
            </div>
        `;
    }
}
