<script>
    import { sectors } from "../stores/gameState.js";
    import GlassPanel from "./GlassPanel.svelte";
    import StatBar from "./StatBar.svelte";

    const SECTOR_CONFIG = {
        infrastructure: { name: "Infrastructure", icon: "🛤️", baseCost: 2.0 },
        healthcare: { name: "Healthcare", icon: "🏥", baseCost: 1.5 },
        education: { name: "Education", icon: "🎓", baseCost: 1.0 },
        military: { name: "Military", icon: "🪖", baseCost: 2.5 },
        police: { name: "Police", icon: "👮", baseCost: 0.8 },
        welfare: { name: "Welfare", icon: "🏠", baseCost: 1.2 },
    };

    function updateFunding(sectorKey, value) {
        sectors.update((s) => {
            s[sectorKey].funding = parseFloat(value);
            return s;
        });
    }

    $: totalExpense = Object.values($sectors).reduce(
        (sum, s) => sum + s.funding,
        0,
    );
</script>

<div class="budget-dashboard">
    <GlassPanel title="💰 Sector Budgets">
        <p class="total-expense">
            Total Daily Expense: <strong>${totalExpense.toFixed(2)}B</strong>
        </p>

        <div class="sector-grid">
            {#each Object.entries($sectors) as [key, sector]}
                {@const config = SECTOR_CONFIG[key]}
                <div class="sector-card">
                    <div class="sector-header">
                        <span class="icon">{config.icon}</span>
                        <span class="name">{config.name}</span>
                    </div>

                    <StatBar label="Health" value={sector.health} />

                    <div class="funding-control">
                        <label>
                            Funding: ${sector.funding.toFixed(1)}B
                            <input
                                type="range"
                                min="0"
                                max={config.baseCost * 2}
                                step="0.1"
                                value={sector.funding}
                                on:input={(e) =>
                                    updateFunding(key, e.target.value)}
                            />
                        </label>
                        <span class="recommended"
                            >(Base: ${config.baseCost}B)</span
                        >
                    </div>
                </div>
            {/each}
        </div>
    </GlassPanel>
</div>

<style>
    .budget-dashboard {
        height: 100%;
        overflow-y: auto;
        max-height: calc(100vh - 80px);
        padding-bottom: 2rem;
    }

    .total-expense {
        margin-bottom: 1rem;
        padding: 0.5rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 6px;
        text-align: center;
    }

    .total-expense strong {
        color: var(--accent-gold);
    }

    .sector-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1rem;
    }

    .sector-card {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 1rem;
    }

    .sector-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.8rem;
    }

    .icon {
        font-size: 1.5rem;
    }
    .name {
        font-weight: 600;
    }

    .funding-control {
        margin-top: 0.8rem;
    }

    .funding-control label {
        display: block;
        font-size: 0.85rem;
        color: var(--text-muted);
    }

    .funding-control input[type="range"] {
        width: 100%;
        margin-top: 0.3rem;
    }

    .recommended {
        font-size: 0.7rem;
        color: var(--text-muted);
    }
</style>
