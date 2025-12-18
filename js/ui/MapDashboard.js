import { REGIONS } from '../systems/MapSystem.js';

export class MapDashboard {
    constructor(game, containerId) {
        this.game = game;
        this.containerId = containerId;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const regions = this.game.state.get('regions') || {};

        // Helper to get color by unrest
        const getColor = (unrest) => {
            // Low Unrest = Green, High = Red
            if (unrest < 20) return '#10b981'; // Green
            if (unrest < 40) return '#f59e0b'; // Yellow
            if (unrest < 60) return '#f97316'; // Orange
            return '#ef4444'; // Red
        };

        // Simplified SVG Map (Abstract Nation)
        // 4 Quadrants basically
        const mapSvg = `
            <svg viewBox="0 0 400 300" style="width: 100%; height: auto; filter: drop-shadow(0 0 10px rgba(0,0,0,0.5));">
                <!-- Border Zone (Background/Edges) -->
                <path d="M20,20 L380,20 L380,280 L20,280 Z" fill="${getColor(regions[REGIONS.BORDER]?.unrest || 0)}" opacity="0.3" stroke="none" />
                <text x="350" y="40" fill="white" font-size="10" opacity="0.8">BORDER ZONE</text>

                <!-- Rural Provinces (Left & Bottom) -->
                <path d="M40,40 L200,40 L200,150 L100,260 L40,260 Z" fill="${getColor(regions[REGIONS.RURAL]?.unrest || 0)}" stroke="rgba(255,255,255,0.2)" stroke-width="1" class="map-region" />
                <text x="80" y="150" fill="white" font-size="12" font-weight="bold">RURAL PROVINCES</text>

                <!-- Industrial Belt (Right) -->
                <path d="M220,40 L360,40 L360,260 L220,150 Z" fill="${getColor(regions[REGIONS.INDUSTRIAL]?.unrest || 0)}" stroke="rgba(255,255,255,0.2)" stroke-width="1" class="map-region" />
                <text x="270" y="150" fill="white" font-size="12" font-weight="bold">INDUSTRIAL BELT</text>

                <!-- Capital (Center Top) -->
                <circle cx="200" cy="100" r="40" fill="${getColor(regions[REGIONS.CAPITAL]?.unrest || 0)}" stroke="white" stroke-width="2" class="map-region" />
                <text x="200" y="105" fill="white" font-size="10" text-anchor="middle" font-weight="bold">CAPITAL</text>
            </svg>
        `;

        // Stats Panel
        let statsHtml = `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">`;
        Object.values(regions).forEach(r => {
            statsHtml += `
                <div class="glass-panel" style="padding: 1rem; background: rgba(0,0,0,0.3);">
                    <div style="font-weight: bold; margin-bottom: 0.5rem; color: var(--accent-blue);">${r.name}</div>
                    <div style="font-size: 0.9rem; display: flex; justify-content: space-between;">
                        <span style="color: var(--text-muted);">Unrest</span>
                        <span style="color: ${getColor(r.unrest)};">${Math.round(r.unrest)}%</span>
                    </div>
                </div>
             `;
        });
        statsHtml += `</div>`;

        container.innerHTML = `
            <div id="view-map" class="glass-panel" style="height: 100%; padding: 2rem; overflow-y: auto;">
                <h2 style="color: var(--accent-gold); margin-bottom: 1rem;">Regional Overview</h2>
                <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
                    <div style="flex: 2; min-width: 300px;">
                        ${mapSvg}
                    </div>
                    <div style="flex: 1; min-width: 200px;">
                        <h4 style="margin-bottom: 1rem;">Regional Stability</h4>
                        ${statsHtml}
                    </div>
                </div>
            </div>
        `;
    }
}
