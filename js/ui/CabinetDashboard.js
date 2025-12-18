import { MINISTRIES, SPECIALIZATIONS } from '../systems/CabinetSystem.js';

export class CabinetDashboard {
    constructor(game, containerId) {
        this.game = game;
        this.containerId = containerId;
        this.hiringFor = null;
        this.candidates = [];
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const cabinetSystem = this.game.systems.find(s => s.generateCandidates);
        const cabinet = this.game.state.get('cabinet') || {};
        const scandal = this.game.state.get('active_scandal');

        let gridHtml = '';
        Object.keys(MINISTRIES).forEach(role => {
            const ministry = MINISTRIES[role];
            const minister = cabinet[role];
            if (!minister) return;

            const spec = minister.specialization ? SPECIALIZATIONS[minister.specialization] : null;
            const compColor = minister.competence > 60 ? 'var(--accent-green)' : (minister.competence < 40 ? 'var(--accent-red)' : 'var(--text-main)');
            const loyalColor = minister.loyalty > 60 ? 'var(--accent-green)' : (minister.loyalty < 40 ? 'var(--accent-red)' : 'var(--text-main)');
            const isScandalized = scandal?.ministerRole === role;

            gridHtml += `
            <div class="glass-panel" style="padding: 1.2rem; ${isScandalized ? 'border: 2px solid var(--accent-red); animation: pulseUrgent 1s infinite;' : ''}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span style="font-size: 1.3rem;">${ministry.icon}</span>
                    <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">${ministry.name}</span>
                </div>
                
                <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.3rem; color: ${minister.isInterim ? 'var(--text-muted)' : 'var(--text-main)'};">
                    ${minister.name}
                </div>
                
                ${spec ? `
                    <div style="display: inline-block; padding: 0.2rem 0.5rem; background: rgba(56, 189, 248, 0.2); border-radius: 4px; font-size: 0.7rem; color: var(--accent-blue); margin-bottom: 0.5rem;">
                        ${spec.name}
                    </div>
                    <div style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 0.5rem;">${spec.desc}</div>
                ` : `
                    <div style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 0.5rem;">No specialization (interim)</div>
                `}
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-top: 0.8rem;">
                    <div>
                        <div style="font-size: 0.7rem; color: var(--text-muted);">Competence</div>
                        <div style="font-weight: 600; color: ${compColor};">${minister.competence}%</div>
                        <div style="height: 4px; background: rgba(255,255,255,0.1); margin-top: 3px; border-radius: 2px;">
                            <div style="width: ${minister.competence}%; height: 100%; background: ${compColor}; border-radius: 2px;"></div>
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 0.7rem; color: var(--text-muted);">Loyalty</div>
                        <div style="font-weight: 600; color: ${loyalColor};">${minister.loyalty}%</div>
                        <div style="height: 4px; background: rgba(255,255,255,0.1); margin-top: 3px; border-radius: 2px;">
                            <div style="width: ${minister.loyalty}%; height: 100%; background: ${loyalColor}; border-radius: 2px;"></div>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${isScandalized ? `
                        <button class="scapegoat-btn" data-role="${role}" style="flex: 1; padding: 0.4rem; background: rgba(239, 68, 68, 0.3); border: 1px solid var(--accent-red); color: var(--accent-red); border-radius: 4px; cursor: pointer; font-size: 0.75rem;">
                            🎯 Scapegoat (+5 Approval)
                        </button>
                    ` : ''}
                    <button class="hire-btn" data-role="${role}" style="flex: 1; padding: 0.4rem; background: rgba(56, 189, 248, 0.2); border: 1px solid var(--accent-blue); color: var(--accent-blue); border-radius: 4px; cursor: pointer; font-size: 0.75rem;">
                        🔄 Replace
                    </button>
                </div>
            </div>
            `;
        });

        // Hiring modal
        let hiringHtml = '';
        if (this.hiringFor && this.candidates.length > 0) {
            const ministry = MINISTRIES[this.hiringFor];
            hiringHtml = `
                <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 1000;">
                    <div class="glass-panel" style="padding: 2rem; max-width: 600px; width: 90%;">
                        <h3 style="color: var(--accent-gold); margin-bottom: 1rem;">Hire ${ministry.name} Minister</h3>
                        <div style="display: grid; gap: 1rem;">
                            ${this.candidates.map((c, i) => {
                const spec = c.specialization ? SPECIALIZATIONS[c.specialization] : null;
                return `
                                    <div class="glass-panel" style="padding: 1rem; cursor: pointer;" onclick="window.selectCandidate(${i})">
                                        <div style="font-weight: 600;">${c.name}</div>
                                        <div style="color: var(--accent-blue); font-size: 0.8rem;">${spec?.name || 'No spec'}: ${spec?.desc || ''}</div>
                                        <div style="display: flex; gap: 1rem; margin-top: 0.5rem; font-size: 0.85rem;">
                                            <span>Comp: ${c.competence}%</span>
                                            <span>Loyal: ${c.loyalty}%</span>
                                        </div>
                                    </div>
                                `;
            }).join('')}
                        </div>
                        <button onclick="window.cancelHiring()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: rgba(239, 68, 68, 0.2); border: 1px solid var(--accent-red); color: var(--accent-red); border-radius: 4px; cursor: pointer;">Cancel</button>
                    </div>
                </div>
            `;
        }

        container.innerHTML = `
            <div style="height: 100%; padding: 1rem; overflow-y: auto;">
                <div style="border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem; margin-bottom: 1rem;">
                    <h2 style="color: var(--accent-gold);">👥 Cabinet of Ministers</h2>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">Hire specialized ministers. Balance competence vs loyalty.</p>
                </div>
                
                ${scandal ? `
                    <div style="padding: 0.8rem; background: rgba(239, 68, 68, 0.15); border: 1px solid var(--accent-red); border-radius: 6px; margin-bottom: 1rem;">
                        ⚠️ <strong style="color: var(--accent-red);">SCANDAL:</strong> ${scandal.title}
                    </div>
                ` : ''}
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                    ${gridHtml}
                </div>
            </div>
            ${hiringHtml}
        `;

        // Bind events
        container.querySelectorAll('.hire-btn').forEach(btn => {
            btn.onclick = () => this.openHiringMenu(btn.dataset.role, cabinetSystem);
        });

        container.querySelectorAll('.scapegoat-btn').forEach(btn => {
            btn.onclick = () => {
                if (cabinetSystem.scapegoat(btn.dataset.role, this.game.state)) {
                    this.render();
                }
            };
        });

        window.selectCandidate = (index) => {
            const candidate = this.candidates[index];
            if (candidate && cabinetSystem) {
                cabinetSystem.hireMinister(this.hiringFor, candidate);
                this.hiringFor = null;
                this.candidates = [];
                this.render();
            }
        };

        window.cancelHiring = () => {
            this.hiringFor = null;
            this.candidates = [];
            this.render();
        };
    }

    openHiringMenu(role, cabinetSystem) {
        this.hiringFor = role;
        this.candidates = cabinetSystem.generateCandidates(role, 3);
        this.render();
    }
}
