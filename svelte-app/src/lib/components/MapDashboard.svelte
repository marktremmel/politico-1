<script>
    import { regions, countryName } from "../stores/gameState.js";
    import { selectedScenario } from "../stores/scenarios.js";
    import GlassPanel from "./GlassPanel.svelte";
    import StatBar from "./StatBar.svelte";

    function getUnrestColor(unrest) {
        if (unrest < 30) return "var(--accent-green)";
        if (unrest < 60) return "#f59e0b";
        return "var(--accent-red)";
    }

    function getSupportColor(support) {
        if (support >= 60) return "var(--accent-green)";
        if (support >= 40) return "var(--accent-blue)";
        return "var(--accent-red)";
    }

    $: totalPopulation = Object.values($regions).reduce(
        (sum, r) => sum + r.population,
        0,
    );
    $: avgSupport =
        Object.values($regions).reduce((sum, r) => sum + r.support, 0) /
        Object.keys($regions).length;
    $: avgUnrest =
        Object.values($regions).reduce((sum, r) => sum + r.unrest, 0) /
        Object.keys($regions).length;
</script>

<div class="map-dashboard">
    <GlassPanel title="🗺️ {$countryName} - Regional Overview">
        <!-- Summary Bar -->
        <div class="summary-bar">
            <div class="summary-stat">
                <span class="icon">👥</span>
                <span class="value"
                    >{(totalPopulation / 1000000).toFixed(1)}M</span
                >
                <span class="label">Population</span>
            </div>
            <div class="summary-stat">
                <span class="icon">👍</span>
                <span class="value" style="color: {getSupportColor(avgSupport)}"
                    >{avgSupport.toFixed(0)}%</span
                >
                <span class="label">Avg Support</span>
            </div>
            <div class="summary-stat">
                <span class="icon">🔥</span>
                <span class="value" style="color: {getUnrestColor(avgUnrest)}"
                    >{avgUnrest.toFixed(0)}%</span
                >
                <span class="label">Avg Unrest</span>
            </div>
        </div>

        <!-- Visual Map -->
        <div class="visual-map">
            {#each Object.entries($regions) as [key, region], i}
                {@const size = 80 + (region.population / 1000000) * 5}
                {@const x = (i % 3) * 30 + 15 + (i % 2) * 5}
                {@const y = Math.floor(i / 3) * 30 + 15}

                <div
                    class="map-region"
                    class:hot={region.unrest >= 60}
                    class:warm={region.unrest >= 30 && region.unrest < 60}
                    style="
                        left: {x}%;
                        top: {y}%;
                        width: {size}px;
                        height: {size}px;
                        background: {region.unrest >= 60
                        ? 'linear-gradient(135deg, rgba(239,68,68,0.6), rgba(239,68,68,0.3))'
                        : region.unrest >= 30
                          ? 'linear-gradient(135deg, rgba(245,158,11,0.4), rgba(245,158,11,0.2))'
                          : 'linear-gradient(135deg, rgba(16,185,129,0.4), rgba(16,185,129,0.2))'};
                        border-color: {getUnrestColor(region.unrest)};
                    "
                >
                    <span class="region-name">{region.name.split(" ")[0]}</span>
                    <span class="region-unrest"
                        >{region.unrest.toFixed(0)}%</span
                    >
                </div>
            {/each}
        </div>

        <!-- Detailed List -->
        <div class="region-grid">
            {#each Object.entries($regions) as [key, region]}
                <div
                    class="region-card"
                    style="border-left: 4px solid {getUnrestColor(
                        region.unrest,
                    )}"
                >
                    <div class="region-header">
                        <h4>{region.name}</h4>
                        <span class="pop"
                            >👥 {(region.population / 1000000).toFixed(
                                1,
                            )}M</span
                        >
                    </div>

                    <div class="region-stats">
                        <StatBar
                            label="Support"
                            value={region.support}
                            color="var(--accent-blue)"
                        />
                        <StatBar label="Unrest" value={region.unrest} />
                    </div>

                    <div
                        class="status-tag"
                        class:stable={region.unrest < 30}
                        class:tense={region.unrest >= 30 && region.unrest < 60}
                        class:volatile={region.unrest >= 60}
                    >
                        {region.unrest < 30
                            ? "✅ Stable"
                            : region.unrest < 60
                              ? "⚠️ Tense"
                              : "🔥 Volatile"}
                    </div>
                </div>
            {/each}
        </div>
    </GlassPanel>
</div>

<style>
    .map-dashboard {
        height: 100%;
        overflow-y: auto;
        max-height: calc(100vh - 80px);
    }

    .summary-bar {
        display: flex;
        justify-content: space-around;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        margin-bottom: 1rem;
    }

    .summary-stat {
        text-align: center;
    }

    .summary-stat .icon {
        font-size: 1.5rem;
        display: block;
    }
    .summary-stat .value {
        font-size: 1.3rem;
        font-weight: 600;
        display: block;
    }
    .summary-stat .label {
        font-size: 0.7rem;
        color: var(--text-muted);
    }

    .visual-map {
        position: relative;
        height: 200px;
        background: linear-gradient(
            135deg,
            rgba(30, 30, 50, 0.5),
            rgba(20, 20, 40, 0.5)
        );
        border-radius: 8px;
        margin-bottom: 1rem;
        overflow: hidden;
    }

    .map-region {
        position: absolute;
        border-radius: 50%;
        border: 2px solid;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
        cursor: pointer;
    }

    .map-region:hover {
        transform: scale(1.1);
        z-index: 10;
    }

    .map-region.hot {
        animation: pulse 1s infinite;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.7;
        }
    }

    .region-name {
        font-size: 0.6rem;
        font-weight: 600;
    }
    .region-unrest {
        font-size: 0.55rem;
        color: var(--text-muted);
    }

    .region-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 0.8rem;
    }

    .region-card {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 0.8rem;
    }

    .region-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.6rem;
    }

    .region-header h4 {
        margin: 0;
        color: var(--accent-blue);
        font-size: 0.9rem;
    }

    .pop {
        font-size: 0.75rem;
        color: var(--text-muted);
    }

    .status-tag {
        margin-top: 0.6rem;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.7rem;
        text-align: center;
    }

    .status-tag.stable {
        background: rgba(16, 185, 129, 0.2);
        color: var(--accent-green);
    }
    .status-tag.tense {
        background: rgba(245, 158, 11, 0.2);
        color: #f59e0b;
    }
    .status-tag.volatile {
        background: rgba(239, 68, 68, 0.2);
        color: var(--accent-red);
        animation: pulse 1s infinite;
    }
</style>
