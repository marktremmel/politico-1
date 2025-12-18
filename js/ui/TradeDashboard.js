import { TRADE_GOODS } from '../systems/TradeSystem.js';

export class TradeDashboard {
    constructor(gameEngine, containerId) {
        this.engine = gameEngine;
        this.container = document.getElementById(containerId);
        this.tradeSystem = this.engine.systems.find(s => s.setTradeAccess);
    }

    render() {
        const state = this.engine.state;
        const trade = state.get('trade') || {};
        const alignment = state.get('alignment') || 0;
        const sovereignty = state.get('sovereignty') || 100;

        // Alignment bar
        const alignmentPct = (alignment + 100) / 2; // Convert -100..100 to 0..100

        let html = `
            <div style="height: 100%; display: flex; flex-direction: column; overflow: hidden;">
                <div style="border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem; margin-bottom: 1rem;">
                    <h2 style="color: var(--accent-gold);">🌍 Trade & Geopolitics</h2>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">Manage trade dependencies and navigate superpower politics.</p>
                </div>

                <!-- Alignment Bar -->
                <div class="glass-panel" style="padding: 1rem; margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: #ef4444;">🐻 East</span>
                        <span style="font-size: 0.85rem; color: var(--text-muted);">Geopolitical Alignment</span>
                        <span style="color: #3b82f6;">🦅 West</span>
                    </div>
                    <div style="background: linear-gradient(90deg, #dc2626, #fbbf24, #2563eb); height: 12px; border-radius: 6px; position: relative;">
                        <div style="position: absolute; left: ${alignmentPct}%; top: -4px; width: 4px; height: 20px; background: white; border-radius: 2px; transform: translateX(-50%); box-shadow: 0 0 6px rgba(0,0,0,0.5);"></div>
                    </div>
                    <div style="text-align: center; margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-muted);">
                        ${alignment > 30 ? 'Western-aligned' : alignment < -30 ? 'Eastern-aligned' : 'Non-aligned'}
                    </div>
                </div>

                <!-- Trade Goods -->
                <h3 style="color: var(--accent-blue); margin-bottom: 0.5rem;">📦 Trade Dependencies</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; overflow-y: auto;">
        `;

        Object.keys(TRADE_GOODS).forEach(key => {
            const config = TRADE_GOODS[key];
            const good = trade[key] || { access: 100, dependency: 50, domesticProduction: 30 };

            // Calculate effective supply
            const importSupply = (good.access / 100) * (1 - good.domesticProduction / 100);
            const totalSupply = Math.min(100, (good.domesticProduction + importSupply * 100));

            // Status color
            let statusColor = 'var(--accent-green)';
            let statusText = 'Stable';
            if (totalSupply < 30) {
                statusColor = 'var(--accent-red)';
                statusText = 'CRISIS';
            } else if (totalSupply < 50) {
                statusColor = '#f59e0b';
                statusText = 'Strained';
            }

            html += `
                <div class="glass-panel" style="padding: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <div style="display: flex; align-items: center; gap: 0.4rem;">
                            <span style="font-size: 1.3rem;">${config.icon}</span>
                            <span style="font-weight: 600;">${config.name}</span>
                        </div>
                        <span style="font-size: 0.7rem; color: ${statusColor}; font-weight: 600;">${statusText}</span>
                    </div>
                    
                    <!-- Supply Bar -->
                    <div style="margin-bottom: 0.6rem;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.7rem; margin-bottom: 0.2rem;">
                            <span style="color: var(--text-muted);">Total Supply</span>
                            <span style="color: ${statusColor};">${Math.round(totalSupply)}%</span>
                        </div>
                        <div style="background: rgba(255,255,255,0.1); height: 6px; border-radius: 3px; overflow: hidden;">
                            <div style="width: ${totalSupply}%; height: 100%; background: ${statusColor};"></div>
                        </div>
                    </div>
                    
                    <!-- Import Access -->
                    <div style="margin-bottom: 0.5rem;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.7rem; margin-bottom: 0.2rem;">
                            <span style="color: var(--text-muted);">Import Access</span>
                            <span>${Math.round(good.access)}%</span>
                        </div>
                        <input type="range" min="0" max="100" value="${good.access}" 
                            class="slider trade-access-slider" data-key="${key}"
                            style="width: 100%; accent-color: var(--accent-blue);" disabled>
                    </div>
                    
                    <!-- Domestic Production -->
                    <div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.7rem; margin-bottom: 0.2rem;">
                            <span style="color: var(--text-muted);">Domestic Production</span>
                            <span>${Math.round(good.domesticProduction)}%</span>
                        </div>
                        <div style="background: rgba(255,255,255,0.1); height: 4px; border-radius: 2px; overflow: hidden;">
                            <div style="width: ${good.domesticProduction}%; height: 100%; background: var(--accent-gold);"></div>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
                
                <!-- Tips -->
                <div style="margin-top: 1rem; padding: 0.8rem; background: rgba(251, 191, 36, 0.1); border-radius: 6px; font-size: 0.75rem; color: var(--text-muted);">
                    💡 <strong>Tip:</strong> Import access is affected by geopolitical alignment. Eastern alignment boosts energy, Western alignment boosts technology.
                </div>
            </div>
        `;

        this.container.innerHTML = html;
    }
}
