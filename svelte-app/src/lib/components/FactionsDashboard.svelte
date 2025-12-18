<script>
    import { voterGroups, factionDemands } from "../stores/gameState.js";
    import GlassPanel from "./GlassPanel.svelte";
    import StatBar from "./StatBar.svelte";

    function getHappinessEmoji(happiness) {
        if (happiness >= 70) return "😊";
        if (happiness >= 50) return "😐";
        if (happiness >= 30) return "😟";
        return "😡";
    }
</script>

<div class="factions-dashboard">
    <GlassPanel title="👥 Factions & Voter Groups">
        {#if $factionDemands.length > 0}
            <div class="demands-section">
                <h4>⚠️ Active Demands</h4>
                {#each $factionDemands as demand}
                    <div class="demand-item">
                        <span class="from">{demand.from}:</span>
                        <span class="text">"{demand.text}"</span>
                        <span class="urgency" style="width: {demand.urgency}%"
                        ></span>
                    </div>
                {/each}
            </div>
        {/if}

        <div class="groups-grid">
            {#each $voterGroups as group}
                <div class="group-card" class:unhappy={group.happiness < 30}>
                    <div class="group-header">
                        <span class="emoji"
                            >{getHappinessEmoji(group.happiness)}</span
                        >
                        <span class="name">{group.name}</span>
                        <span class="pop"
                            >{(group.population * 100).toFixed(0)}%</span
                        >
                    </div>

                    <StatBar label="Happiness" value={group.happiness} />

                    {#if group.happiness < 40}
                        <div class="warning">⚠️ At risk of protest</div>
                    {/if}
                </div>
            {/each}
        </div>
    </GlassPanel>
</div>

<style>
    .factions-dashboard {
        height: 100%;
        overflow-y: auto;
    }

    .demands-section {
        background: rgba(245, 158, 11, 0.1);
        border: 1px solid #f59e0b;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
    }

    .demands-section h4 {
        margin: 0 0 0.5rem 0;
        color: #f59e0b;
    }

    .demand-item {
        display: flex;
        gap: 0.5rem;
        font-size: 0.85rem;
        padding: 0.3rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .demand-item .from {
        color: var(--accent-blue);
    }
    .demand-item .text {
        flex: 1;
    }

    .groups-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;
    }

    .group-card {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 1rem;
    }

    .group-card.unhappy {
        border: 1px solid var(--accent-red);
    }

    .group-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .emoji {
        font-size: 1.3rem;
    }
    .name {
        font-weight: 600;
        flex: 1;
    }
    .pop {
        font-size: 0.75rem;
        color: var(--text-muted);
    }

    .warning {
        margin-top: 0.5rem;
        font-size: 0.75rem;
        color: var(--accent-red);
    }
</style>
