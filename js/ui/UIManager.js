export class UIManager {
    constructor(engine) {
        this.engine = engine;
        this.state = engine.state;

        // Cache DOM elements
        this.els = {
            date: document.getElementById('game-date'),
            pc: document.getElementById('stat-pc'),
            budget: document.getElementById('stat-budget'),
            approval: document.getElementById('stat-approval'),
            countryName: document.getElementById('country-name'),
            leaderName: document.getElementById('leader-name'),
            btnPause: document.getElementById('btn-pause'),
            factionsList: document.getElementById('factions-list')
        };

        // Subscribe to updates
        this.state.subscribe('date', (date) => this.updateDate(date));
        this.state.subscribe('isPaused', (isPaused) => this.updatePauseBtn(isPaused));
        this.state.subscribe('countryName', (name) => this.els.countryName.innerText = name);
        this.state.subscribe('leaderName', (name) => this.els.leaderName.innerText = name);
        this.state.subscribe('flag', (flag) => {
            const el = document.getElementById('country-flag');
            if (el) el.innerText = flag;
        });

        this.state.subscribe('factions', (factions) => this.renderFactions(factions));

        // Header Stats
        this.state.subscribe('approval', (val) => {
            // Format: "50%" or "50.5%"
            if (this.els.approval) this.els.approval.innerText = `${Math.round(val)}% Approval`;
        });

        this.state.subscribe('budget', (val) => {
            // Format: "$10.5B"
            if (this.els.budget) this.els.budget.innerText = `$${val.toFixed(2)}B Budget`;
        });

        this.state.subscribe('politicalCapital', (val) => {
            // Format: "15 Capital"
            if (this.els.pc) this.els.pc.innerText = `${Math.floor(val)} Capital`;
        });

        // Initial bindings
        this.els.btnPause.addEventListener('click', () => this.engine.togglePause());

        // Initial Render
        this.updateDate(this.state.get('date'));
    }

    renderFactions(factions) {
        if (!this.els.factionsList) return;

        let html = '';
        Object.values(factions).forEach(f => {
            // Determine color based on support
            let colorVar = 'var(--text-muted)';
            if (f.support > 60) colorVar = 'var(--accent-green)';
            else if (f.support < 40) colorVar = 'var(--accent-red)';
            else colorVar = 'var(--accent-blue)';

            html += `
                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 4px;">
                        <span style="text-transform: capitalize;">${f.id}</span>
                        <span style="font-weight: bold; color: ${colorVar};">${Math.round(f.support)}%</span>
                    </div>
                    <div style="width: 100%; background: rgba(255,255,255,0.1); height: 6px; border-radius: 3px;">
                        <div style="width: ${f.support}%; background: ${colorVar}; height: 100%; border-radius: 3px; transition: width 0.5s;"></div>
                    </div>
                </div>
            `;
        });
        this.els.factionsList.innerHTML = html;
    }

    updateDate(date) {
        // Format: "Jan 1, 2025"
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        this.els.date.innerText = date.toLocaleDateString('en-US', options);
    }

    updatePauseBtn(isPaused) {
        this.els.btnPause.innerText = isPaused ? '▶️' : '⏸️';
    }
}
