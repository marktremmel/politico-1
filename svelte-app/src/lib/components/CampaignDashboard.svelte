<script>
    import {
        campaignPhase,
        playerPopularity,
        opponentPopularity,
        politicalCapital,
        approval,
        daysUntilElection,
    } from "../stores/gameState.js";
    import GlassPanel from "./GlassPanel.svelte";
    import StatBar from "./StatBar.svelte";

    let opponent = { name: "Viktor Orban Jr.", slogan: "Change You Can Trust" };
    let ralliesHeld = 0;
    let debatesHeld = 0;

    function holdRally() {
        ralliesHeld++;
        playerPopularity.update((p) => Math.min(95, p + 2));
    }

    function holdDebate() {
        if (debatesHeld >= 3) return;
        debatesHeld++;
        const won = Math.random() > 0.5;
        if (won) {
            playerPopularity.update((p) => Math.min(95, p + 5));
            opponentPopularity.update((p) => Math.max(5, p - 3));
        } else {
            opponentPopularity.update((p) => Math.min(95, p + 5));
            playerPopularity.update((p) => Math.max(5, p - 3));
        }
    }
</script>

<div class="campaign-dashboard">
    {#if $daysUntilElection > 60}
        <GlassPanel title="🗳️ Campaign Mode">
            <div class="not-active">
                <div class="icon">📅</div>
                <h3>Campaign Not Active</h3>
                <p>Campaign mode activates 60 days before the election.</p>
                <div class="countdown">
                    <span class="days">{$daysUntilElection}</span>
                    <span class="label">days until election</span>
                </div>
            </div>
        </GlassPanel>
    {:else}
        <GlassPanel title="🗳️ Campaign Mode - Active!">
            <div class="polling-section">
                <h4>📊 Current Polling</h4>
                <div class="poll-bars">
                    <div class="poll-row">
                        <span class="name">You</span>
                        <div class="bar-container">
                            <div
                                class="bar you"
                                style="width: {$playerPopularity}%"
                            ></div>
                        </div>
                        <span class="value" style="color: var(--accent-green)"
                            >{$playerPopularity.toFixed(0)}%</span
                        >
                    </div>
                    <div class="poll-row">
                        <span class="name">{opponent.name}</span>
                        <div class="bar-container">
                            <div
                                class="bar opp"
                                style="width: {$opponentPopularity}%"
                            ></div>
                        </div>
                        <span class="value" style="color: var(--accent-red)"
                            >{$opponentPopularity.toFixed(0)}%</span
                        >
                    </div>
                </div>
                <p class="slogan">"{opponent.slogan}"</p>
            </div>

            <div class="actions-grid">
                <div class="action-card">
                    <h4>📢 Hold Rally</h4>
                    <p>Boost your popularity with voters</p>
                    <button on:click={holdRally}>Hold Rally (+2%)</button>
                    <span class="count">Rallies: {ralliesHeld}</span>
                </div>

                <div class="action-card">
                    <h4>🎤 Debate</h4>
                    <p>Face your opponent head-to-head</p>
                    <button on:click={holdDebate} disabled={debatesHeld >= 3}>
                        {debatesHeld >= 3
                            ? "No more debates"
                            : `Debate (${debatesHeld}/3)`}
                    </button>
                </div>
            </div>
        </GlassPanel>
    {/if}
</div>

<style>
    .campaign-dashboard {
        height: 100%;
        overflow-y: auto;
    }

    .not-active {
        text-align: center;
        padding: 2rem;
    }

    .not-active .icon {
        font-size: 4rem;
        margin-bottom: 1rem;
    }
    .not-active h3 {
        color: var(--accent-gold);
    }
    .not-active p {
        color: var(--text-muted);
    }

    .countdown {
        margin-top: 1.5rem;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        display: inline-block;
    }

    .countdown .days {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--accent-gold);
    }
    .countdown .label {
        display: block;
        font-size: 0.8rem;
        color: var(--text-muted);
    }

    .polling-section {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
    }

    .polling-section h4 {
        margin: 0 0 0.8rem 0;
    }

    .poll-row {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        margin-bottom: 0.5rem;
    }

    .poll-row .name {
        width: 120px;
        font-size: 0.85rem;
    }
    .poll-row .value {
        width: 50px;
        text-align: right;
        font-weight: 600;
    }

    .bar-container {
        flex: 1;
        height: 20px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        overflow: hidden;
    }

    .bar {
        height: 100%;
        transition: width 0.3s;
    }
    .bar.you {
        background: linear-gradient(90deg, #10b981, #22d3ee);
    }
    .bar.opp {
        background: linear-gradient(90deg, #ef4444, #f97316);
    }

    .slogan {
        font-style: italic;
        color: var(--text-muted);
        font-size: 0.8rem;
        text-align: center;
        margin-top: 0.5rem;
    }

    .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }

    .action-card {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 1rem;
    }

    .action-card h4 {
        margin: 0 0 0.3rem 0;
        color: var(--accent-blue);
    }
    .action-card p {
        font-size: 0.8rem;
        color: var(--text-muted);
        margin: 0 0 0.8rem 0;
    }
    .action-card .count {
        display: block;
        font-size: 0.7rem;
        color: var(--text-muted);
        margin-top: 0.5rem;
    }

    .action-card button {
        width: 100%;
        padding: 0.5rem;
        background: linear-gradient(135deg, var(--accent-gold), #d97706);
        border: none;
        border-radius: 4px;
        color: black;
        font-weight: 600;
        cursor: pointer;
    }

    .action-card button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>
