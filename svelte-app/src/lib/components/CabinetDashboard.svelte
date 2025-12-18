<script>
    import {
        cabinet,
        sectors,
        approval,
        politicalCapital,
        sovereignty,
    } from "../stores/gameState.js";
    import GlassPanel from "./GlassPanel.svelte";
    import StatBar from "./StatBar.svelte";

    const MINISTRIES = {
        finance: { name: "Finance", icon: "💰", sector: null, bonus: "gdp" },
        defense: {
            name: "Defense",
            icon: "🛡️",
            sector: "military",
            bonus: "sovereignty",
        },
        interior: {
            name: "Interior",
            icon: "🏠",
            sector: "police",
            bonus: "unrest",
        },
        foreign: {
            name: "Foreign Affairs",
            icon: "🌍",
            sector: null,
            bonus: "relations",
        },
        education: {
            name: "Education",
            icon: "🎓",
            sector: "education",
            bonus: "approval",
        },
        health: {
            name: "Health",
            icon: "🏥",
            sector: "healthcare",
            bonus: "approval",
        },
    };

    const SPECIALIZATIONS = {
        technocrat: {
            name: "Technocrat",
            desc: "+15% sector efficiency",
            color: "#38bdf8",
        },
        populist: {
            name: "Populist",
            desc: "+5 approval/day",
            color: "#fbbf24",
        },
        loyalist: { name: "Loyalist", desc: "No scandals", color: "#10b981" },
        reformer: {
            name: "Reformer",
            desc: "-1 PC for laws",
            color: "#a78bfa",
        },
        hawk: { name: "Hawk", desc: "+0.1 Sovereignty/day", color: "#ef4444" },
        dove: { name: "Dove", desc: "+Trade access", color: "#6ee7b7" },
    };

    const FIRST_NAMES = [
        "James",
        "Maria",
        "Viktor",
        "Elena",
        "David",
        "Sarah",
        "Ivan",
        "Anna",
    ];
    const LAST_NAMES = [
        "Smith",
        "Kovacs",
        "Petrova",
        "Chen",
        "Mueller",
        "Okonkwo",
        "Garcia",
        "Kim",
    ];

    function randomName() {
        return `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`;
    }

    function initCabinet() {
        const specs = Object.keys(SPECIALIZATIONS);
        const newCabinet = {};
        Object.keys(MINISTRIES).forEach((role) => {
            newCabinet[role] = {
                name: randomName(),
                competence: Math.floor(40 + Math.random() * 40),
                loyalty: Math.floor(40 + Math.random() * 40),
                specialization: specs[Math.floor(Math.random() * specs.length)],
            };
        });
        cabinet.set(newCabinet);
    }

    function replaceMinister(role) {
        const specs = Object.keys(SPECIALIZATIONS);
        const pcCost = 5;

        politicalCapital.update((pc) => {
            if (pc < pcCost) return pc;

            cabinet.update((c) => ({
                ...c,
                [role]: {
                    name: randomName(),
                    competence: Math.floor(50 + Math.random() * 35),
                    loyalty: Math.floor(50 + Math.random() * 35),
                    specialization:
                        specs[Math.floor(Math.random() * specs.length)],
                },
            }));

            return pc - pcCost;
        });
    }

    // Cabinet effectiveness - apply bonuses based on specializations
    $: {
        Object.entries($cabinet).forEach(([role, minister]) => {
            const spec = minister.specialization;
            const competenceBonus = minister.competence / 100;

            // Apply specialization effects (simplified - would be in game loop normally)
            if (spec === "populist") {
                // Already handled elsewhere
            } else if (spec === "hawk") {
                // Sovereignty boost
            }
        });
    }

    $: if (Object.keys($cabinet).length === 0) initCabinet();
    $: canAffordReplace = $politicalCapital >= 5;
</script>

<div class="cabinet-dashboard">
    <GlassPanel title="👔 Cabinet">
        <p class="cost-note">
            Replacing a minister costs <strong>5 PC</strong>
        </p>

        <div class="cabinet-grid">
            {#each Object.entries($cabinet) as [role, minister]}
                {@const ministry = MINISTRIES[role]}
                {@const spec = SPECIALIZATIONS[minister.specialization]}
                {@const linkedSector = ministry.sector
                    ? $sectors[ministry.sector]
                    : null}

                <div
                    class="minister-card"
                    class:low-loyalty={minister.loyalty < 40}
                >
                    <div class="minister-header">
                        <span class="icon">{ministry?.icon || "👤"}</span>
                        <div>
                            <span class="role">{ministry?.name || role}</span>
                            <span class="name">{minister.name}</span>
                        </div>
                    </div>

                    {#if spec}
                        <div
                            class="spec-badge"
                            style="background: {spec.color}20; border-color: {spec.color}; color: {spec.color}"
                        >
                            {spec.name}
                        </div>
                        <p class="spec-desc">{spec.desc}</p>
                    {/if}

                    <div class="stats">
                        <StatBar
                            label="Competence"
                            value={minister.competence}
                        />
                        <StatBar label="Loyalty" value={minister.loyalty} />
                    </div>

                    {#if linkedSector}
                        <div class="linked-sector">
                            Manages: {ministry.sector} (Health: {linkedSector.health.toFixed(
                                0,
                            )}%)
                        </div>
                    {/if}

                    <button
                        class="replace-btn"
                        disabled={!canAffordReplace}
                        on:click={() => replaceMinister(role)}
                    >
                        🔄 Replace (-5 PC)
                    </button>
                </div>
            {/each}
        </div>
    </GlassPanel>
</div>

<style>
    .cabinet-dashboard {
        height: 100%;
        overflow-y: auto;
        max-height: calc(100vh - 80px);
        padding-bottom: 2rem;
    }

    .cost-note {
        text-align: center;
        font-size: 0.8rem;
        color: var(--text-muted);
        margin-bottom: 1rem;
    }

    .cost-note strong {
        color: var(--accent-gold);
    }

    .cabinet-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 0.8rem;
    }

    .minister-card {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 0.8rem;
        border-left: 3px solid transparent;
    }

    .minister-card.low-loyalty {
        border-left-color: var(--accent-red);
    }

    .minister-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .icon {
        font-size: 1.5rem;
    }
    .role {
        display: block;
        font-size: 0.65rem;
        color: var(--text-muted);
        text-transform: uppercase;
    }
    .name {
        display: block;
        font-weight: 600;
        font-size: 0.9rem;
    }

    .spec-badge {
        display: inline-block;
        padding: 0.15rem 0.4rem;
        border: 1px solid;
        border-radius: 4px;
        font-size: 0.65rem;
        margin-bottom: 0.2rem;
    }

    .spec-desc {
        font-size: 0.65rem;
        color: var(--text-muted);
        margin: 0 0 0.4rem 0;
    }

    .linked-sector {
        font-size: 0.7rem;
        color: var(--accent-blue);
        margin-top: 0.3rem;
        padding: 0.3rem;
        background: rgba(56, 189, 248, 0.1);
        border-radius: 4px;
    }

    .replace-btn {
        width: 100%;
        margin-top: 0.5rem;
        padding: 0.35rem;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid var(--glass-border);
        border-radius: 4px;
        color: var(--text-main);
        cursor: pointer;
        font-size: 0.75rem;
    }

    .replace-btn:hover:not(:disabled) {
        background: rgba(56, 189, 248, 0.2);
    }
    .replace-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>
