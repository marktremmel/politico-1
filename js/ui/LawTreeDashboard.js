import { LAWS, LAW_BRANCHES } from '../systems/LawSystem.js';

export class LawTreeDashboard {
    constructor(game, containerId) {
        this.game = game;
        this.containerId = containerId;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const signedLaws = this.game.state.get('active_laws') || [];
        const pc = this.game.state.get('politicalCapital') || 0;

        // Helper to render a generic branch
        const renderBranch = (branchKey, title, color) => {
            // Get all laws in this branch, sorted by tier
            const branchLaws = Object.values(LAWS)
                .filter(l => l.branch === branchKey)
                .sort((a, b) => a.tier - b.tier);

            let html = `<div style="flex: 1; display: flex; flex-direction: column; align-items: center; min-width: 200px;">`;
            html += `<h3 style="color: ${color}; border-bottom: 2px solid ${color}; width: 100%; text-align: center; padding-bottom: 0.5rem; margin-bottom: 2rem;">${title}</h3>`;

            branchLaws.forEach((law, index) => {
                const isSigned = signedLaws.includes(law.id);
                const isUnlocked = this.checkUnlock(law, signedLaws);
                const canAfford = pc >= law.costPC;

                let cardStyle = `
                    width: 100%; 
                    padding: 1rem; 
                    background: rgba(255,255,255,0.05); 
                    border: 1px solid var(--glass-border); 
                    border-radius: 8px; 
                    margin-bottom: 2rem; 
                    position: relative;
                    transition: all 0.3s;
                `;

                // Connector Line (Except for first item)
                if (index > 0) {
                    html += `<div style="width: 2px; height: 2rem; background: ${isUnlocked ? color : 'rgba(255,255,255,0.1)'}; margin-top: -2rem; margin-bottom: 0;"></div>`;
                }

                // Status Styling
                let btnHtml = '';
                if (isSigned) {
                    cardStyle += `border-color: ${color}; background: rgba(${this.hexToRgb(color)}, 0.1); box-shadow: 0 0 10px rgba(${this.hexToRgb(color)}, 0.2);`;
                    btnHtml = `<span style="color: ${color}; font-weight: bold;">SIGNED</span>`;
                } else if (isUnlocked) {
                    if (canAfford) {
                        cardStyle += `cursor: pointer; border-color: rgba(255,255,255,0.3);`;
                        cardStyle += `box-shadow: 0 4px 6px rgba(0,0,0,0.2);`;
                        btnHtml = `<button class="btn-primary" style="font-size: 0.8rem; padding: 0.3rem 0.8rem; width: 100%;" onclick="window.game.signLaw('${law.id}')">Sign (${law.costPC} PC)</button>`;
                    } else {
                        cardStyle += `opacity: 0.8;`;
                        btnHtml = `<span style="color: var(--text-muted); font-size: 0.9rem;">Cost: ${law.costPC} PC</span>`;
                    }
                } else {
                    cardStyle += `opacity: 0.4; filter: grayscale(1);`;
                    btnHtml = `<span style="font-size: 0.8rem;">Locked</span>`;
                }

                html += `
                    <div class="law-card" style="${cardStyle}">
                        <div style="font-weight: bold; margin-bottom: 0.3rem;">${law.title}</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.8rem;">${law.desc}</div>
                        ${btnHtml}
                    </div>
                `;
            });

            html += `</div>`;
            return html;
        };

        container.innerHTML = `
            <div id="view-laws" class="glass-panel" style="height: 100%; padding: 2rem; overflow-y: auto;">
                 <div style="margin-bottom: 2rem; text-align: center;">
                    <h2 style="color: var(--accent-gold);">Legislative Agenda</h2>
                    <p style="color: var(--text-muted);">Pass laws to shape the future of your nation. Laws require Political Capital (PC).</p>
                    <div style="margin-top: 1rem; font-size: 1.2rem; font-weight: bold; color: var(--accent-blue);">Available Capital: ${Math.floor(pc)} PC</div>
                </div>

                <div style="display: flex; gap: 2rem; justify-content: space-around;">
                    ${renderBranch(LAW_BRANCHES.WELFARE, "Welfare State", "#10b981")}
                    ${renderBranch(LAW_BRANCHES.AUTHORITY, "State Authority", "#3b82f6")}
                    ${renderBranch(LAW_BRANCHES.LIBERTY, "Free Market", "#f59e0b")}
                </div>
            </div>
        `;

        // Bind global helper
        window.game.signLaw = (lawId) => {
            const system = this.game.systems.find(s => s.signLaw);
            if (system) {
                const success = system.signLaw(this.game.state, lawId);
                if (success) {
                    this.game.state.notifySubscribers();
                    this.render();
                } else {
                    alert("Cannot sign this law! Check PC or Prerequisites.");
                }
            }
        };
    }

    checkUnlock(law, signedLaws) {
        if (law.prereqs.length === 0) return true;
        return law.prereqs.every(req => signedLaws.includes(req));
    }

    // Helper for rgba conversion
    hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
    }
}
