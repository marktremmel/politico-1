import { SECTORS } from '../systems/SectorSystem.js';

export class PolicyDashboard {
    constructor(gameEngine, containerId) {
        this.engine = gameEngine;
        this.container = document.getElementById(containerId);
        this.policySystem = this.engine.systems.find(s => s.policies);
        this.sectorSystem = this.engine.systems.find(s => s.setSectorFunding);
    }

    render() {
        const sectors = this.engine.state.get('sectors') || {};

        let html = `
            <div style="height: 100%; display: flex; flex-direction: column; overflow: hidden;">
                <div style="border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem; margin-bottom: 1rem;">
                    <h2 style="color: var(--accent-gold);">💸 National Budget</h2>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">Adjust funding to maintain sectors. Underfunding causes decay!</p>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; overflow-y: auto; padding-right: 0.5rem;">
        `;

        Object.keys(SECTORS).forEach(key => {
            const config = SECTORS[key];
            const sector = sectors[key] || { health: 100, funding: config.baseCost };

            // Health color
            let healthColor = 'var(--accent-green)';
            if (sector.health < 30) healthColor = 'var(--accent-red)';
            else if (sector.health < 60) healthColor = '#f59e0b';

            // Health bar width
            const healthWidth = Math.max(0, Math.min(100, sector.health));

            // Funding ratio
            const fundingRatio = sector.funding / config.baseCost;
            let fundingStatus = '✅ Funded';
            let fundingColor = 'var(--accent-green)';
            if (fundingRatio < 0.5) {
                fundingStatus = '⚠️ Critical';
                fundingColor = 'var(--accent-red)';
            } else if (fundingRatio < 1.0) {
                fundingStatus = '⚡ Partial';
                fundingColor = '#f59e0b';
            }

            html += `
                <div class="glass-panel" style="padding: 1.2rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span style="font-size: 1.5rem;">${config.icon}</span>
                            <span style="font-weight: 600; color: var(--accent-blue);">${config.name}</span>
                        </div>
                        <span style="font-size: 0.75rem; color: ${fundingColor};">${fundingStatus}</span>
                    </div>
                    
                    <!-- Health Bar -->
                    <div style="margin-bottom: 0.8rem;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 0.3rem;">
                            <span style="color: var(--text-muted);">Health</span>
                            <span style="color: ${healthColor}; font-weight: 600;">${Math.round(sector.health)}%</span>
                        </div>
                        <div style="background: rgba(255,255,255,0.1); height: 8px; border-radius: 4px; overflow: hidden;">
                            <div style="width: ${healthWidth}%; height: 100%; background: ${healthColor}; transition: width 0.3s;"></div>
                        </div>
                    </div>
                    
                    <!-- Funding Slider -->
                    <div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 0.3rem;">
                            <span style="color: var(--text-muted);">Funding</span>
                            <span id="funding-label-${key}" style="color: var(--text-main);">$${sector.funding.toFixed(1)}B / $${config.baseCost}B</span>
                        </div>
                        <input type="range" min="0" max="${config.baseCost * 2}" step="0.1" value="${sector.funding}" 
                            class="slider sector-slider" data-key="${key}"
                            style="width: 100%; accent-color: var(--accent-gold);">
                    </div>
                    
                    <!-- Warning if low -->
                    ${sector.health < 40 ? `
                        <div style="margin-top: 0.6rem; padding: 0.4rem 0.6rem; background: rgba(239, 68, 68, 0.15); border-radius: 4px; font-size: 0.7rem; color: var(--accent-red);">
                            ⚠️ Low health: ${config.consequence} penalty active
                        </div>
                    ` : ''}
                </div>
            `;
        });

        // Total cost summary
        let totalCost = 0;
        Object.keys(sectors).forEach(key => {
            totalCost += sectors[key]?.funding || 0;
        });

        html += `
                </div>
                
                <div style="margin-top: 1rem; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 8px; display: flex; justify-content: space-between;">
                    <span style="color: var(--text-muted);">Total Sector Spending:</span>
                    <span style="color: var(--accent-gold); font-weight: 600;">$${totalCost.toFixed(1)}B / year</span>
                </div>
            </div>
        `;

        this.container.innerHTML = html;

        // Bind slider events
        this.container.querySelectorAll('.sector-slider').forEach(input => {
            input.oninput = (e) => this.handleFundingChange(e.target.dataset.key, parseFloat(e.target.value));
        });
    }

    handleFundingChange(key, value) {
        const sectors = this.engine.state.get('sectors') || {};
        if (sectors[key]) {
            sectors[key].funding = value;
            this.engine.state.update('sectors', sectors);
        }

        // Update label
        const config = SECTORS[key];
        document.getElementById(`funding-label-${key}`).innerText = `$${value.toFixed(1)}B / $${config.baseCost}B`;
    }
}
