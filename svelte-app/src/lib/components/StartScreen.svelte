<script>
    import {
        SCENARIOS,
        selectedScenario,
        playerCharacter,
    } from "../stores/scenarios.js";
    import {
        countryName,
        leaderName,
        gdp,
        budget,
        approval,
        sovereignty,
        politicalCapital,
        voterGroups,
    } from "../stores/gameState.js";
    import GlassPanel from "./GlassPanel.svelte";

    export let onStart;

    let step = 1; // 1 = country, 2 = character
    let customName = "";
    let selectedCountry = null;

    const TITLES = ["President", "Prime Minister", "Chancellor", "Premier"];
    let selectedTitle = "President";

    function selectCountry(id) {
        selectedCountry = SCENARIOS[id];
    }

    function proceedToCharacter() {
        if (selectedCountry) step = 2;
    }

    function startGame() {
        if (!customName) customName = "Smith";

        // Apply scenario stats
        const s = selectedCountry.stats;
        countryName.set(s.countryName);
        leaderName.set(`${selectedTitle} ${customName}`);
        gdp.set(s.gdp);
        budget.set(s.budget);
        approval.set(s.approval);
        sovereignty.set(s.sovereignty);
        politicalCapital.set(s.politicalCapital);

        // Apply faction adjustments
        if (selectedCountry.factionAdjust) {
            voterGroups.update((groups) => {
                groups.forEach((g) => {
                    if (selectedCountry.factionAdjust[g.name]) {
                        g.happiness = Math.max(
                            5,
                            Math.min(
                                95,
                                50 + selectedCountry.factionAdjust[g.name],
                            ),
                        );
                    }
                });
                return groups;
            });
        }

        selectedScenario.set(selectedCountry);
        playerCharacter.set({ name: customName, title: selectedTitle });

        onStart();
    }
</script>

<div class="start-screen">
    {#if step === 1}
        <div class="screen-content">
            <h1>🏛️ Choose Your Nation</h1>
            <p class="subtitle">
                Lead a Central/Eastern European country through political
                turmoil
            </p>

            <div class="country-grid">
                {#each Object.values(SCENARIOS) as scenario}
                    <button
                        class="country-card"
                        class:selected={selectedCountry?.id === scenario.id}
                        on:click={() => selectCountry(scenario.id)}
                    >
                        <span class="flag">{scenario.flag}</span>
                        <h3>{scenario.name}</h3>
                        <span
                            class="difficulty"
                            class:easy={scenario.difficulty === "Easy"}
                            class:medium={scenario.difficulty === "Medium"}
                            class:hard={scenario.difficulty === "Hard"}
                        >
                            {scenario.difficulty}
                        </span>
                        <p class="desc">{scenario.description}</p>

                        {#if selectedCountry?.id === scenario.id}
                            <div class="challenges">
                                <strong>Challenges:</strong>
                                {#each scenario.challenges as c}
                                    <span class="chip">{c}</span>
                                {/each}
                            </div>
                        {/if}
                    </button>
                {/each}
            </div>

            <button
                class="btn-continue"
                disabled={!selectedCountry}
                on:click={proceedToCharacter}
            >
                Continue →
            </button>
        </div>
    {:else}
        <div class="screen-content">
            <h1>{selectedCountry.flag} Create Your Leader</h1>
            <p class="subtitle">Who will lead {selectedCountry.name}?</p>

            <GlassPanel>
                <div class="form-group">
                    <label>Title</label>
                    <div class="title-options">
                        {#each TITLES as title}
                            <button
                                class="title-btn"
                                class:selected={selectedTitle === title}
                                on:click={() => (selectedTitle = title)}
                            >
                                {title}
                            </button>
                        {/each}
                    </div>
                </div>

                <div class="form-group">
                    <label>Last Name</label>
                    <input
                        type="text"
                        bind:value={customName}
                        placeholder="Enter your name..."
                    />
                </div>

                <div class="preview">
                    <span class="preview-title"
                        >{selectedTitle} {customName || "Smith"}</span
                    >
                    <span class="preview-country"
                        >of {selectedCountry.name}</span
                    >
                </div>
            </GlassPanel>

            <div class="starting-stats">
                <h4>Starting Conditions</h4>
                <div class="stat-row">
                    <span>GDP</span><span>${selectedCountry.stats.gdp}B</span>
                </div>
                <div class="stat-row">
                    <span>Budget</span><span
                        >${selectedCountry.stats.budget}B</span
                    >
                </div>
                <div class="stat-row">
                    <span>Approval</span><span
                        >{selectedCountry.stats.approval}%</span
                    >
                </div>
                <div class="stat-row">
                    <span>Sovereignty</span><span
                        >{selectedCountry.stats.sovereignty}%</span
                    >
                </div>
            </div>

            <div class="button-row">
                <button class="btn-back" on:click={() => (step = 1)}
                    >← Back</button
                >
                <button class="btn-start" on:click={startGame}
                    >Start Game 🎮</button
                >
            </div>
        </div>
    {/if}
</div>

<style>
    .start-screen {
        min-height: 100vh;
        background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }

    .screen-content {
        max-width: 900px;
        text-align: center;
    }

    h1 {
        font-size: 2.5rem;
        color: var(--accent-gold);
        margin-bottom: 0.5rem;
    }

    .subtitle {
        color: var(--text-muted);
        margin-bottom: 2rem;
    }

    .country-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .country-card {
        background: var(--glass-bg);
        border: 2px solid var(--glass-border);
        border-radius: 12px;
        padding: 1rem;
        cursor: pointer;
        transition: all 0.3s;
        text-align: left;
        color: var(--text-main);
    }

    .country-card:hover {
        border-color: var(--accent-blue);
    }
    .country-card.selected {
        border-color: var(--accent-gold);
        background: rgba(251, 191, 36, 0.1);
    }

    .flag {
        font-size: 2.5rem;
        display: block;
        margin-bottom: 0.5rem;
    }
    .country-card h3 {
        margin: 0 0 0.3rem 0;
    }

    .difficulty {
        font-size: 0.75rem;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
    }
    .difficulty.easy {
        background: rgba(16, 185, 129, 0.2);
        color: var(--accent-green);
    }
    .difficulty.medium {
        background: rgba(245, 158, 11, 0.2);
        color: #f59e0b;
    }
    .difficulty.hard {
        background: rgba(239, 68, 68, 0.2);
        color: var(--accent-red);
    }

    .desc {
        font-size: 0.8rem;
        color: var(--text-muted);
        margin: 0.5rem 0;
    }

    .challenges {
        margin-top: 0.5rem;
    }
    .chip {
        display: inline-block;
        font-size: 0.65rem;
        background: rgba(56, 189, 248, 0.2);
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        margin: 0.2rem;
        color: var(--accent-blue);
    }

    .btn-continue,
    .btn-start {
        padding: 1rem 3rem;
        background: linear-gradient(135deg, var(--accent-gold), #d97706);
        border: none;
        border-radius: 8px;
        color: black;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
    }

    .btn-continue:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .btn-back {
        padding: 1rem 2rem;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid var(--glass-border);
        border-radius: 8px;
        color: var(--text-main);
        cursor: pointer;
    }

    .button-row {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
    }

    .form-group {
        margin-bottom: 1.5rem;
        text-align: left;
    }
    .form-group label {
        display: block;
        color: var(--text-muted);
        margin-bottom: 0.5rem;
    }
    .form-group input {
        width: 100%;
        padding: 0.8rem;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid var(--glass-border);
        border-radius: 6px;
        color: var(--text-main);
        font-size: 1rem;
    }

    .title-options {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    .title-btn {
        padding: 0.5rem 1rem;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid var(--glass-border);
        border-radius: 6px;
        color: var(--text-main);
        cursor: pointer;
    }
    .title-btn.selected {
        border-color: var(--accent-gold);
        color: var(--accent-gold);
    }

    .preview {
        text-align: center;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
    }
    .preview-title {
        display: block;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--accent-gold);
    }
    .preview-country {
        color: var(--text-muted);
    }

    .starting-stats {
        background: var(--glass-bg);
        border-radius: 8px;
        padding: 1rem;
        margin-top: 1rem;
        text-align: left;
    }
    .starting-stats h4 {
        color: var(--accent-blue);
        margin: 0 0 0.5rem 0;
    }
    .stat-row {
        display: flex;
        justify-content: space-between;
        padding: 0.3rem 0;
        font-size: 0.85rem;
    }
</style>
