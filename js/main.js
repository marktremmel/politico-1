import { GameEngine } from './core/GameEngine.js';
import { UIManager } from './ui/UIManager.js';
import { PoliticsSystem } from './systems/PoliticsSystem.js';
import { EconomySystem } from './systems/EconomySystem.js';
import { FactionSystem } from './systems/FactionSystem.js';
import { PolicySystem } from './systems/PolicySystem.js';
import { GeopoliticsSystem } from './systems/GeopoliticsSystem.js';
import { CabinetSystem } from './systems/CabinetSystem.js';
import { LawSystem } from './systems/LawSystem.js';
import { MapSystem } from './systems/MapSystem.js';
import { GameOverSystem } from './systems/GameOverSystem.js'; // NEW Phase 3
import { ElectionSystem } from './systems/ElectionSystem.js'; // NEW Phase 3
import { ActionSystem } from './systems/ActionSystem.js'; // NEW Phase 3
import { SectorSystem } from './systems/SectorSystem.js'; // NEW Phase 5
import { MegaprojectSystem } from './systems/MegaprojectSystem.js'; // NEW Phase 6
import { TradeSystem } from './systems/TradeSystem.js'; // NEW Phase 7
import { LegacySystem } from './systems/LegacySystem.js'; // NEW Phase 10
import { DilemmaManager } from './events/DilemmaManager.js';
import { NewsManager } from './ui/NewsManager.js';
import { TooltipManager } from './ui/TooltipManager.js';
import { ScenarioLoader, SCENARIOS, SCENARIO_TYPES } from './core/ScenarioLoader.js';
import { PolicyDashboard } from './ui/PolicyDashboard.js';
import { CabinetDashboard } from './ui/CabinetDashboard.js';
import { LawTreeDashboard } from './ui/LawTreeDashboard.js';
import { MapDashboard } from './ui/MapDashboard.js';
import { MegaprojectDashboard } from './ui/MegaprojectDashboard.js';
import { TradeDashboard } from './ui/TradeDashboard.js';
import { CampaignDashboard } from './ui/CampaignDashboard.js';

// Initialize Game & UI
const game = new GameEngine();
const ui = new UIManager(game);

// Debug access
window.game = game;

// Register Systems
game.registerSystem(new PoliticsSystem());
game.registerSystem(new EconomySystem());
game.registerSystem(new PolicySystem());
game.registerSystem(new GeopoliticsSystem());
game.registerSystem(new FactionSystem());
game.registerSystem(new CabinetSystem());
game.registerSystem(new LawSystem());
game.registerSystem(new MapSystem());
game.registerSystem(new GameOverSystem(game)); // NEW Phase 3
game.registerSystem(new ElectionSystem(game)); // NEW Phase 3
game.registerSystem(new ActionSystem(game)); // NEW Phase 3
game.registerSystem(new SectorSystem(game)); // NEW Phase 5
game.registerSystem(new MegaprojectSystem(game)); // NEW Phase 6
game.registerSystem(new TradeSystem(game)); // NEW Phase 7
game.registerSystem(new LegacySystem(game)); // NEW Phase 10
game.registerSystem(new NewsManager(game));
game.registerSystem(new DilemmaManager(game));

// Init UI Tools
new TooltipManager();

// --- View Management ---
let currentView = 'overview';
let policyDash = null;
let cabinetDash = null;
let lawDash = null;
let mapDash = null;
let megaDash = null; // NEW Phase 6
let tradeDash = null; // NEW Phase 7
let campaignDash = null; // NEW Phase 9

function renderSidebar() {
    const leftPanel = document.getElementById('panel-left');

    const navHtml = `
        <div style="margin-bottom: 2rem;">
            <button id="nav-overview" class="btn-secondary" style="width: 100%; margin-bottom: 0.5rem; text-align: left;">📊 Overview</button>
            <button id="nav-laws" class="btn-secondary" style="width: 100%; margin-bottom: 0.5rem; text-align: left;">⚖️ Legislation</button>
            <button id="nav-policies" class="btn-secondary" style="width: 100%; margin-bottom: 0.5rem; text-align: left;">💸 Budget</button>
            <button id="nav-map" class="btn-secondary" style="width: 100%; margin-bottom: 0.5rem; text-align: left;">🗺️ Map</button>
            <button id="nav-cabinet" class="btn-secondary" style="width: 100%; margin-bottom: 0.5rem; text-align: left;">👥 Cabinet</button>
            <button id="nav-megaprojects" class="btn-secondary" style="width: 100%; margin-bottom: 0.5rem; text-align: left;">🏗️ Projects</button>
            <button id="nav-trade" class="btn-secondary" style="width: 100%; margin-bottom: 0.5rem; text-align: left;">🌍 Trade</button>
            <button id="nav-campaign" class="btn-secondary" style="width: 100%; margin-bottom: 0.5rem; text-align: left;">🗳️ Campaign</button>
            <button id="nav-actions" class="btn-secondary" style="width: 100%; text-align: left; background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(239, 68, 68, 0.2));">⚡ Actions</button>
        </div>
        <h3 style="margin-top: 1rem;">News Feed</h3>
    `;

    const newsContainer = document.getElementById('news-feed-container');
    leftPanel.innerHTML = navHtml;
    leftPanel.appendChild(newsContainer);

    document.getElementById('nav-overview').onclick = () => switchView('overview');
    document.getElementById('nav-policies').onclick = () => switchView('policies');
    document.getElementById('nav-cabinet').onclick = () => switchView('cabinet');
    document.getElementById('nav-laws').onclick = () => switchView('laws');
    document.getElementById('nav-map').onclick = () => switchView('map');
    document.getElementById('nav-megaprojects').onclick = () => switchView('megaprojects');
    document.getElementById('nav-trade').onclick = () => switchView('trade');
    document.getElementById('nav-campaign').onclick = () => switchView('campaign');
    document.getElementById('nav-actions').onclick = () => switchView('actions');
}

function switchView(viewName) {
    currentView = viewName;
    const centerPanel = document.getElementById('panel-center');

    // Update Active Nav State
    document.querySelectorAll('#panel-left button').forEach(b => b.classList.remove('active-nav'));
    const btn = document.getElementById(`nav-${viewName}`);
    if (btn) btn.classList.add('active-nav');

    if (viewName === 'overview') {
        renderOverview(centerPanel);
    } else if (viewName === 'policies') {
        if (!policyDash) policyDash = new PolicyDashboard(game, 'panel-center');
        policyDash.render();
    } else if (viewName === 'cabinet') {
        if (!cabinetDash) cabinetDash = new CabinetDashboard(game, 'panel-center');
        cabinetDash.render();
    } else if (viewName === 'laws') {
        if (!lawDash) lawDash = new LawTreeDashboard(game, 'panel-center');
        lawDash.render();
    } else if (viewName === 'map') {
        if (!mapDash) mapDash = new MapDashboard(game, 'panel-center');
        mapDash.render();
    } else if (viewName === 'megaprojects') {
        if (!megaDash) megaDash = new MegaprojectDashboard(game, 'panel-center');
        megaDash.render();
    } else if (viewName === 'trade') {
        if (!tradeDash) tradeDash = new TradeDashboard(game, 'panel-center');
        tradeDash.render();
    } else if (viewName === 'campaign') {
        if (!campaignDash) campaignDash = new CampaignDashboard(game, 'panel-center');
        campaignDash.render();
    } else if (viewName === 'actions') {
        renderActionsPanel(centerPanel);
    }
}

function renderActionsPanel(container) {
    const actionSys = game.systems.find(s => s.getAvailableActions);
    const actions = actionSys ? actionSys.getAvailableActions(game.state) : [];
    const pc = game.state.get('politicalCapital') || 0;
    const daysUntilElection = game.state.get('daysUntilElection') || '???';

    let actionsHtml = '';
    actions.forEach(action => {
        const disabled = !action.available;
        const cooldownText = action.cooldownRemaining > 0 ? ` (${action.cooldownRemaining} days)` : '';
        actionsHtml += `
            <div class="glass-panel" style="padding: 1rem; ${disabled ? 'opacity: 0.5;' : ''} margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong style="color: ${disabled ? 'var(--text-muted)' : 'var(--accent-gold)'};">${action.name}</strong>
                    <div style="font-size: 0.85rem; color: var(--text-muted);">${action.desc}</div>
                    <div style="font-size: 0.8rem; margin-top: 0.3rem;">Cost: <span style="color: var(--accent-blue);">${action.costPC} PC</span>${cooldownText}</div>
                </div>
                <button class="btn-primary" style="min-width: 80px;" ${disabled ? 'disabled' : ''} data-action-id="${action.id}">
                    ${disabled ? '🔒' : 'Use'}
                </button>
            </div>
        `;
    });

    container.innerHTML = `
        <div class="glass-panel" style="height: 100%; padding: 2rem; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="color: var(--accent-gold);">⚡ Presidential Actions</h2>
                <div>
                    <span style="color: var(--text-muted);">Political Capital:</span>
                    <strong style="color: var(--accent-blue); margin-left: 0.5rem;">${pc}</strong>
                </div>
            </div>
            <div style="padding: 1rem; background: rgba(245, 158, 11, 0.1); border-left: 3px solid var(--accent-gold); margin-bottom: 1.5rem;">
                <strong>🗳️ Days until Election:</strong> <span style="color: var(--accent-blue);">${daysUntilElection}</span>
            </div>
            <h4 style="margin-bottom: 1rem;">Available Actions</h4>
            ${actionsHtml}
        </div>
    `;

    // Bind action buttons
    container.querySelectorAll('[data-action-id]').forEach(btn => {
        btn.onclick = () => {
            const actionId = btn.dataset.actionId;
            if (actionSys) {
                const success = actionSys.performAction(actionId, game.state);
                if (success) {
                    renderActionsPanel(container); // Re-render
                }
            }
        };
    });
}

function renderOverview(container) {
    container.innerHTML = `
        <div id="view-dashboard" class="glass-panel" style="height: 100%; padding: 2rem; display: flex; flex-direction: column; gap: 1rem; overflow-y: auto;">
            <div style="border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem; margin-bottom: 1rem; display: flex; justify-content: space-between;">
                <div>
                     <h2 style="color: var(--accent-gold);">Economic Overview</h2>
                     <p style="color: var(--text-muted); font-size: 0.9rem;">Daily Report</p>
                </div>
                <button id="btn-force-event" class="btn-secondary" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;">⚡ Force Event</button>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                        <div class="glass-panel" style="background: rgba(0,0,0,0.2); padding: 1.5rem;">
                     <h4 style="color: var(--accent-green); margin-bottom: 1rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 0.5rem; display: flex; justify-content: space-between;">
                        <span>Revenue Breakdown</span>
                        <span style="font-size: 0.8em; opacity: 0.7;">Daily</span>
                     </h4>
                     
                     <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.95rem;">
                            <span>Income Tax</span>
                            <span id="val-tax-inc" style="font-family: monospace;">--</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.95rem;">
                            <span>Corporate Tax</span>
                            <span id="val-tax-corp" style="font-family: monospace;">--</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.95rem;">
                            <span>VAT / Sales</span>
                            <span id="val-tax-vat" style="font-family: monospace;">--</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.95rem; color: var(--text-muted);">
                            <span>Trade Tariffs</span>
                            <span style="font-family: monospace;">$0.000B</span>
                        </div>
                     </div>

                     <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--glass-border); display: flex; justify-content: space-between; font-weight: bold; font-size: 1.1rem;">
                        <span>Total Revenue</span>
                        <span id="dash-income" style="color: var(--accent-green); font-family: monospace;">--</span>
                     </div>
                </div>

                <div class="glass-panel" style="background: rgba(0,0,0,0.2); padding: 1.5rem;">
                     <h4 style="color: var(--accent-red); margin-bottom: 1rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 0.5rem; display: flex; justify-content: space-between;">
                        <span>Expense Breakdown</span>
                        <span style="font-size: 0.8em; opacity: 0.7;">Daily</span>
                     </h4>

                     <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.95rem;">
                            <span>Policy Spending</span>
                            <span id="val-policy" style="font-family: monospace;">--</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.95rem;">
                            <span>Debt Interest</span>
                            <span id="val-debt" style="font-family: monospace;">--</span>
                        </div>
                     </div>

                     <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--glass-border); display: flex; justify-content: space-between; font-weight: bold; font-size: 1.1rem;">
                        <span>Total Expenses</span>
                        <span id="dash-expense" style="color: var(--accent-red); font-family: monospace;">--</span>
                     </div>
                </div>
            </div>

             <!-- Geopolitics Section -->
             <div class="glass-panel" style="background: rgba(0,0,0,0.2); padding: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 0.5rem;">
                    <h4 style="color: var(--accent-blue); margin: 0;">International Relations</h4>
                    <div class="tooltip-target" data-tooltip="sovereignty" style="font-size: 0.9rem; color: var(--text-muted);">
                        Sovereignty: <span id="geo-sovereignty" style="color: var(--accent-gold); font-weight: bold;">--%</span>
                    </div>
                </div>

                <!-- Alignment Slider -->
                <div style="margin-bottom: 1.5rem;" class="tooltip-target" data-tooltip="alignment">
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.2rem;">
                        <span>East (Socialist)</span>
                        <span>West (Capitalist)</span>
                    </div>
                    <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; position: relative;">
                        <!-- Center Marker -->
                        <div style="position: absolute; left: 50%; height: 100%; width: 2px; background: rgba(255,255,255,0.2);"></div>
                        <!-- Thumbtack -->
                        <div id="geo-alignment-marker" style="position: absolute; left: 50%; top: -3px; width: 12px; height: 12px; background: var(--accent-gold); border-radius: 50%; transform: translateX(-50%); transition: left 0.5s;"></div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; text-align: center;">
                    <div id="geo-eu" class="tooltip-target" data-tooltip="relation-eu">
                        <div style="font-size: 1.5rem;">🇪🇺</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.3rem;">EU</div>
                        <div class="geo-score" style="font-weight: bold; color: var(--accent-green);">--</div>
                    </div>
                    <div id="geo-usa" class="tooltip-target" data-tooltip="relation-usa">
                        <div style="font-size: 1.5rem;">🇺🇸</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.3rem;">USA</div>
                        <div class="geo-score" style="font-weight: bold;">--</div>
                    </div>
                    <div id="geo-russia" class="tooltip-target" data-tooltip="relation-russia">
                         <div style="font-size: 1.5rem;">🇷🇺</div>
                         <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.3rem;">Russia</div>
                         <div class="geo-score" style="font-weight: bold;">--</div>
                    </div>
                     <div id="geo-china" class="tooltip-target" data-tooltip="relation-china">
                         <div style="font-size: 1.5rem;">🇨🇳</div>
                         <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.3rem;">China</div>
                         <div class="geo-score" style="font-weight: bold;">--</div>
                    </div>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.5rem;">
                <div style="text-align: center;">
                     <h4 style="color: var(--accent-blue); margin-bottom: 0.2rem;">Net Daily Balance</h4>
                     <div style="font-size: 1.8rem; font-weight: bold;" id="dash-net">--</div>
                </div>
                 <div style="text-align: center;">
                     <h4 style="color: var(--text-muted); margin-bottom: 0.2rem;">National Reserves</h4>
                     <div style="font-size: 1.8rem; font-weight: bold; color: var(--accent-gold);" id="dash-treasure">--</div>
                </div>
            </div>
        </div>
    `;

    // Bind Force Event
    document.getElementById('btn-force-event').onclick = () => {
        const mgr = game.systems.find(s => s.triggerEvent);
        if (mgr) {
            mgr.cooldown = 0; // Reset generic cooldown
            // Pick random event for now
            const event = mgr.eventPool[Math.floor(Math.random() * mgr.eventPool.length)];
            mgr.triggerEvent(event);
        }
    };

    updateOverviewValues();
}

function updateOverviewValues() {
    if (currentView !== 'overview') return;
    const inc = game.state.get('dailyIncome') || 0;
    const exp = game.state.get('dailyExpense') || 0;
    const budget = game.state.get('budget') || 0;
    const breakdown = game.state.get('budgetBreakdown') || {};

    const elInc = document.getElementById('dash-income');
    const elExp = document.getElementById('dash-expense');
    const elNet = document.getElementById('dash-net');
    const elTreasure = document.getElementById('dash-treasure');

    // Breakdown fields
    const elTaxInc = document.getElementById('val-tax-inc');
    const elTaxCorp = document.getElementById('val-tax-corp');
    const elTaxVat = document.getElementById('val-tax-vat');

    const elPolicy = document.getElementById('val-policy');
    const elDebt = document.getElementById('val-debt');

    if (elInc) elInc.innerText = `+$${inc.toFixed(3)}B`;
    if (elExp) elExp.innerText = `-$${exp.toFixed(3)}B`;

    if (elTaxInc && breakdown.dailyIncomeTax) elTaxInc.innerText = `+$${breakdown.dailyIncomeTax}B`;
    if (elTaxCorp && breakdown.dailyCorpTax) elTaxCorp.innerText = `+$${breakdown.dailyCorpTax}B`;
    if (elTaxVat && breakdown.dailyVAT) elTaxVat.innerText = `+$${breakdown.dailyVAT}B`;

    if (elPolicy && breakdown.dailyPolicy) elPolicy.innerText = `-$${breakdown.dailyPolicy}B`;
    if (elDebt && breakdown.dailyDebt) elDebt.innerText = `-$${breakdown.dailyDebt}B`;

    // Geopolitics Values
    const relations = game.state.get('relations') || { eu: { score: 60 }, usa: { score: 50 }, russia: { score: 40 }, china: { score: 45 } };

    const updateGeo = (id, key) => {
        const el = document.getElementById(id);
        if (el) {
            const score = relations[key] ? relations[key].score : 50;
            const valEl = el.querySelector('.geo-score');
            if (valEl) {
                valEl.innerText = Math.round(score);
                // Color coding
                if (score >= 70) valEl.style.color = 'var(--accent-green)';
                else if (score <= 30) valEl.style.color = 'var(--accent-red)';
                else valEl.style.color = 'var(--text-main)';
            }
        }
    };

    updateGeo('geo-eu', 'eu');
    updateGeo('geo-usa', 'usa');
    updateGeo('geo-russia', 'russia');
    updateGeo('geo-china', 'china');

    // Update Sovereignty & Alignment
    const sov = game.state.get('sovereignty') || 100;
    const align = game.state.get('alignment') || 50;

    const elSov = document.getElementById('geo-sovereignty');
    if (elSov) {
        elSov.innerText = `${Math.round(sov)}%`;
        elSov.style.color = sov < 50 ? 'var(--accent-red)' : 'var(--accent-gold)';
    }

    const elAlignMarker = document.getElementById('geo-alignment-marker');
    if (elAlignMarker) {
        elAlignMarker.style.left = `${align}%`;
    }

    if (elNet) {
        const net = inc - exp;
        elNet.innerText = `${net >= 0 ? '+' : ''}$${net.toFixed(3)}B`;
        elNet.style.color = net >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
    }
    if (elTreasure) elTreasure.innerText = `$${budget.toFixed(3)}B`;
}

// Subscribe global updates to refresh overview if active
game.state.subscribe('dailyIncome', updateOverviewValues);
game.state.subscribe('dailyExpense', updateOverviewValues);
game.state.subscribe('budget', updateOverviewValues);


// --- Scenario Picker Logic ---
function showScenarioPicker() {
    const centerPanel = document.getElementById('panel-center');
    centerPanel.innerHTML = `
        <div class="glass-panel" style="padding: 2rem; display: flex; flex-direction: column; height: 100%; overflow-y: auto;">
            <h2 style="color: var(--accent-gold); margin-bottom: 1.5rem; text-align: center;">Select Your Nation</h2>
            <div id="scenario-list" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
                <!-- Buttons injected here -->
            </div>
        </div>
    `;

    const list = document.getElementById('scenario-list');

    Object.keys(SCENARIOS).forEach(key => {
        const data = SCENARIOS[key];
        const btn = document.createElement('button');
        btn.className = 'btn-choice card-hover';
        btn.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">${data.flag}</div>
            <strong style="font-size: 1.2rem;">${data.name}</strong>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem; line-height: 1.4;">${data.desc}</div>
        `;
        btn.onclick = () => showCustomizationScreen(key);
        list.appendChild(btn);
    });
}

function showCustomizationScreen(scenarioKey) {
    const data = SCENARIOS[scenarioKey];
    const centerPanel = document.getElementById('panel-center');

    centerPanel.innerHTML = `
        <div class="glass-panel" style="padding: 2rem; max-width: 600px; margin: 0 auto; text-align: left;">
            <h2 style="color: var(--accent-gold); margin-bottom: 1rem;">Customize Leader</h2>
            <div style="margin-bottom: 2rem; display: flex; gap: 1rem; align-items: center;">
                <span style="font-size: 3rem;">${data.flag}</span>
                <div>
                    <h3 style="margin: 0;">${data.name}</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">2025 Scenario</p>
                </div>
            </div>

            <form id="customization-form" style="display: flex; flex-direction: column; gap: 1.5rem;">
                <div class="form-group">
                    <label style="display: block; color: var(--text-muted); margin-bottom: 0.5rem; font-size: 0.9rem;">Leader Name</label>
                    <input type="text" id="input-leader" value="${data.leaderDefault}" class="input-field">
                </div>
                
                <div class="form-group">
                    <label style="display: block; color: var(--text-muted); margin-bottom: 0.5rem; font-size: 0.9rem;">Party Name (Optional)</label>
                    <input type="text" id="input-party" placeholder="National Unity Party" class="input-field">
                </div>

                <div class="form-group">
                    <label style="display: block; color: var(--text-muted); margin-bottom: 0.5rem; font-size: 0.9rem;">Starting Scenario</label>
                    <select id="input-scenario-type" class="input-field" style="width: 100%;">
                        ${Object.keys(SCENARIO_TYPES).map(k => `<option value="${k}">${SCENARIO_TYPES[k].name}</option>`).join('')}
                    </select>
                    <div id="scenario-desc" style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem; font-style: italic;">
                        ${SCENARIO_TYPES['standard'].desc}
                    </div>
                </div>

                <div class="form-group">
                    <label style="display: block; color: var(--text-muted); margin-bottom: 0.5rem; font-size: 0.9rem;">Flag Emoji</label>
                    <input type="text" id="input-flag" value="${data.flag}" class="input-field" style="width: 60px; text-align: center;">
                </div>

                <div style="margin-top: 1rem; display: flex; gap: 1rem;">
                    <button type="button" id="btn-back" class="btn-secondary">Back</button>
                    <button type="submit" class="btn-primary">Start Term</button>
                </div>
            </form>
        </div>
    `;

    document.getElementById('btn-back').onclick = showScenarioPicker;

    // Dynamic Description Update
    document.getElementById('input-scenario-type').onchange = (e) => {
        const type = SCENARIO_TYPES[e.target.value];
        if (type) {
            document.getElementById('scenario-desc').innerText = type.desc;
        }
    };

    document.getElementById('customization-form').onsubmit = (e) => {
        e.preventDefault();
        const leaderName = document.getElementById('input-leader').value;
        const flag = document.getElementById('input-flag').value;
        const scenarioType = document.getElementById('input-scenario-type').value; // NEW
        const partyName = document.getElementById('input-party').value; // NEW

        ScenarioLoader.load(game.state, scenarioKey, { leaderName, flag, scenarioType, partyName });

        // Switch to Game View
        document.getElementById('panel-center').innerHTML = ''; // Clear
        renderSidebar();
        renderOverview(document.getElementById('panel-center')); // Default View

        // Unpause and Start Loop
        game.start();
    };
}

function startGame(scenarioKey, customization) {
    // 1. Load Data
    ScenarioLoader.load(game.state, scenarioKey, customization);

    // 2. Clear Picker & Setup Dashboard
    renderSidebar(); // Show Navigation
    switchView('overview'); // Show Default View (which sets up dashboard)

    // 3. Start Engine
    game.start();
}

// Initialize
game.init();

// === DYNAMIC UI UPDATES ===
// Subscribe to state changes to refresh current view
game.state.subscribe('*', () => {
    // Only refresh if game is running
    if (game.state.get('isPaused')) return;

    // Refresh current view
    const centerPanel = document.getElementById('panel-center');
    if (!centerPanel) return;

    // Throttle updates (every 2nd tick)
    const tick = game.state.get('daysPassed') || 0;
    if (tick % 2 !== 0) return;

    // Re-render current view
    if (currentView === 'overview') {
        renderOverview(centerPanel);
    } else if (currentView === 'policies' && policyDash) {
        policyDash.render();
    } else if (currentView === 'cabinet' && cabinetDash) {
        cabinetDash.render();
    } else if (currentView === 'megaprojects' && megaDash) {
        megaDash.render();
    } else if (currentView === 'trade' && tradeDash) {
        tradeDash.render();
    } else if (currentView === 'campaign' && campaignDash) {
        campaignDash.render();
    }
    // Map view handles its own updates
});

showScenarioPicker();
