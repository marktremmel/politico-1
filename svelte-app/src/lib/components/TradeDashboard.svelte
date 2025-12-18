<script>
    import { trade } from "../stores/gameState.js";
    import GlassPanel from "./GlassPanel.svelte";
    import StatBar from "./StatBar.svelte";

    const TRADE_GOODS = {
        energy: { name: "Energy", icon: "⚡", desc: "Oil, gas, electricity" },
        food: { name: "Food", icon: "🌾", desc: "Agricultural products" },
        manufacturing: {
            name: "Manufacturing",
            icon: "🏭",
            desc: "Industrial goods",
        },
        technology: {
            name: "Technology",
            icon: "💻",
            desc: "High-tech products",
        },
    };

    // Initialize trade if empty
    function initTrade() {
        const goods = {};
        Object.keys(TRADE_GOODS).forEach((key) => {
            goods[key] = {
                access: 50 + Math.floor(Math.random() * 30),
                domestic: 30 + Math.floor(Math.random() * 40),
                dependency: 20 + Math.floor(Math.random() * 30),
            };
        });
        trade.set(goods);
    }

    $: if (Object.keys($trade).length === 0) initTrade();

    function getSupplyStatus(good) {
        const supply = good.domestic + good.access * 0.5;
        if (supply >= 80)
            return { text: "✅ Abundant", color: "var(--accent-green)" };
        if (supply >= 50) return { text: "⚠️ Adequate", color: "#f59e0b" };
        return { text: "🔴 Shortage", color: "var(--accent-red)" };
    }
</script>

<div class="trade-dashboard">
    <GlassPanel title="🌍 Trade & Dependencies">
        <div class="alignment-bar">
            <span class="label west">🇪🇺 West</span>
            <div class="bar">
                <div class="indicator" style="left: 50%"></div>
            </div>
            <span class="label east">East 🇷🇺</span>
        </div>

        <div class="goods-grid">
            {#each Object.entries($trade) as [key, good]}
                {@const config = TRADE_GOODS[key]}
                {@const status = getSupplyStatus(good)}

                <div class="good-card">
                    <div class="good-header">
                        <span class="icon">{config.icon}</span>
                        <div>
                            <span class="name">{config.name}</span>
                            <span class="desc">{config.desc}</span>
                        </div>
                        <span class="status" style="color: {status.color}"
                            >{status.text}</span
                        >
                    </div>

                    <div class="stats">
                        <StatBar label="Trade Access" value={good.access} />
                        <StatBar
                            label="Domestic Production"
                            value={good.domestic}
                        />
                        <StatBar
                            label="Import Dependency"
                            value={good.dependency}
                            color="var(--accent-red)"
                        />
                    </div>
                </div>
            {/each}
        </div>
    </GlassPanel>
</div>

<style>
    .trade-dashboard {
        height: 100%;
        overflow-y: auto;
    }

    .alignment-bar {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.8rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        margin-bottom: 1rem;
    }

    .alignment-bar .label {
        font-size: 0.8rem;
    }
    .alignment-bar .label.west {
        color: var(--accent-blue);
    }
    .alignment-bar .label.east {
        color: var(--accent-red);
    }

    .alignment-bar .bar {
        flex: 1;
        height: 8px;
        background: linear-gradient(
            90deg,
            var(--accent-blue),
            var(--text-muted),
            var(--accent-red)
        );
        border-radius: 4px;
        position: relative;
    }

    .alignment-bar .indicator {
        position: absolute;
        top: -4px;
        width: 4px;
        height: 16px;
        background: white;
        border-radius: 2px;
        transform: translateX(-50%);
    }

    .goods-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1rem;
    }

    .good-card {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 1rem;
    }

    .good-header {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        margin-bottom: 1rem;
    }

    .icon {
        font-size: 2rem;
    }
    .name {
        display: block;
        font-weight: 600;
    }
    .desc {
        display: block;
        font-size: 0.7rem;
        color: var(--text-muted);
    }
    .status {
        margin-left: auto;
        font-size: 0.75rem;
    }
</style>
