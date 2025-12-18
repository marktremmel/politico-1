<script>
    import {
        activeLaws,
        LAWS,
        LAW_BRANCHES,
        canSignLaw,
        getLawsByBranch,
        applyLawEffects,
    } from "../stores/lawsData.js";
    import { politicalCapital } from "../stores/gameState.js";
    import GlassPanel from "./GlassPanel.svelte";

    const branches = [
        { id: "welfare", name: "Welfare", icon: "🤝", color: "#10b981" },
        { id: "authority", name: "Authority", icon: "🛡️", color: "#ef4444" },
        { id: "liberty", name: "Liberty", icon: "🗽", color: "#38bdf8" },
        { id: "economy", name: "Economy", icon: "💰", color: "#fbbf24" },
    ];

    function signLaw(lawId) {
        const law = LAWS[lawId];
        if (!canSignLaw(lawId, $activeLaws, $politicalCapital)) return;

        politicalCapital.update((pc) => pc - law.costPC);
        activeLaws.update((laws) => [...laws, lawId]);

        // Apply faction effects!
        applyLawEffects(lawId);
    }
</script>

<div class="laws-dashboard">
    <GlassPanel title="⚖️ Law Tree">
        <p class="pc-display">
            Political Capital: <strong>{$politicalCapital.toFixed(0)}</strong>
        </p>

        <div class="branches-grid">
            {#each branches as branch}
                <div
                    class="branch-column"
                    style="--branch-color: {branch.color}"
                >
                    <h3 class="branch-title">
                        <span>{branch.icon}</span>
                        {branch.name}
                    </h3>

                    <div class="laws-list">
                        {#each getLawsByBranch(branch.id) as law}
                            {@const isSigned = $activeLaws.includes(law.id)}
                            {@const canSign = canSignLaw(
                                law.id,
                                $activeLaws,
                                $politicalCapital,
                            )}

                            <div
                                class="law-card tier-{law.tier}"
                                class:signed={isSigned}
                                class:available={canSign && !isSigned}
                                class:locked={!canSign && !isSigned}
                            >
                                <div class="law-header">
                                    <span class="law-title">{law.title}</span>
                                    <span class="law-cost">{law.costPC} PC</span
                                    >
                                </div>
                                <p class="law-desc">{law.desc}</p>

                                {#if isSigned}
                                    <span class="status signed">✅ Enacted</span
                                    >
                                {:else if canSign}
                                    <button
                                        class="sign-btn"
                                        on:click={() => signLaw(law.id)}
                                    >
                                        Sign into Law
                                    </button>
                                {:else}
                                    <span class="status locked"
                                        >🔒 {law.prereqs.length > 0
                                            ? `Requires: ${law.prereqs.join(", ")}`
                                            : "Not enough PC"}</span
                                    >
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </GlassPanel>
</div>

<style>
    .laws-dashboard {
        height: 100%;
        overflow-y: auto;
    }

    .pc-display {
        text-align: center;
        padding: 0.5rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 6px;
        margin-bottom: 1rem;
    }

    .pc-display strong {
        color: var(--accent-gold);
        font-size: 1.2rem;
    }

    .branches-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
    }

    .branch-column {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 0.8rem;
        border-top: 3px solid var(--branch-color);
    }

    .branch-title {
        font-size: 1rem;
        margin: 0 0 0.8rem 0;
        color: var(--branch-color);
        display: flex;
        align-items: center;
        gap: 0.4rem;
    }

    .laws-list {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
    }

    .law-card {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--glass-border);
        border-radius: 6px;
        padding: 0.6rem;
        transition: all 0.2s;
    }

    .law-card.signed {
        background: rgba(16, 185, 129, 0.15);
        border-color: var(--accent-green);
    }
    .law-card.available {
        background: rgba(56, 189, 248, 0.1);
        border-color: var(--accent-blue);
    }
    .law-card.locked {
        opacity: 0.5;
    }

    .law-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.3rem;
    }
    .law-title {
        font-weight: 600;
        font-size: 0.85rem;
    }
    .law-cost {
        font-size: 0.75rem;
        color: var(--accent-gold);
    }
    .law-desc {
        font-size: 0.7rem;
        color: var(--text-muted);
        margin: 0 0 0.5rem 0;
    }

    .sign-btn {
        width: 100%;
        padding: 0.4rem;
        background: linear-gradient(135deg, var(--accent-blue), #0ea5e9);
        border: none;
        border-radius: 4px;
        color: white;
        font-size: 0.75rem;
        cursor: pointer;
    }

    .sign-btn:hover {
        filter: brightness(1.1);
    }

    .status {
        font-size: 0.7rem;
        display: block;
    }
    .status.signed {
        color: var(--accent-green);
    }
    .status.locked {
        color: var(--text-muted);
    }
</style>
