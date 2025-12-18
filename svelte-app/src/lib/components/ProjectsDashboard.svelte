<script>
    import {
        megaprojects,
        budget,
        politicalCapital,
    } from "../stores/gameState.js";
    import GlassPanel from "./GlassPanel.svelte";

    const PROJECTS = {
        rail: {
            name: "High-Speed Rail",
            icon: "🚄",
            cost: 15,
            buildTime: 180,
            desc: "+GDP, +Infrastructure",
        },
        space: {
            name: "Space Program",
            icon: "🚀",
            cost: 25,
            buildTime: 365,
            desc: "+Sovereignty, +Tech",
        },
        green: {
            name: "Green Energy Grid",
            icon: "⚡",
            cost: 20,
            buildTime: 240,
            desc: "+Energy, +Approval",
        },
        wall: {
            name: "Border Wall",
            icon: "🧱",
            cost: 12,
            buildTime: 120,
            desc: "+Sovereignty, -Relations",
        },
        education: {
            name: "Education Reform",
            icon: "🎓",
            cost: 10,
            buildTime: 180,
            desc: "+Education, +Youth",
        },
        healthcare: {
            name: "Healthcare System",
            icon: "🏥",
            cost: 18,
            buildTime: 200,
            desc: "+Health, +Approval",
        },
    };

    function startProject(projectId) {
        const project = PROJECTS[projectId];
        if ($budget < project.cost) return;

        budget.update((b) => b - project.cost * 0.3); // 30% upfront
        megaprojects.update((p) => ({
            ...p,
            [projectId]: { progress: 0, active: true, completed: false },
        }));
    }

    $: activeProjects = Object.entries($megaprojects).filter(
        ([k, v]) => v.active,
    );
    $: completedProjects = Object.entries($megaprojects).filter(
        ([k, v]) => v.completed,
    );
</script>

<div class="projects-dashboard">
    <GlassPanel title="🏗️ Megaprojects">
        {#if activeProjects.length > 0}
            <div class="section">
                <h4>🔨 Active Projects</h4>
                {#each activeProjects as [id, project]}
                    {@const config = PROJECTS[id]}
                    <div class="project-card active">
                        <span class="icon">{config.icon}</span>
                        <div class="info">
                            <span class="name">{config.name}</span>
                            <div class="progress-bar">
                                <div
                                    class="fill"
                                    style="width: {project.progress}%"
                                ></div>
                            </div>
                            <span class="progress-text"
                                >{project.progress.toFixed(0)}%</span
                            >
                        </div>
                    </div>
                {/each}
            </div>
        {/if}

        <div class="section">
            <h4>📋 Available Projects</h4>
            <div class="projects-grid">
                {#each Object.entries(PROJECTS) as [id, project]}
                    {@const isActive = $megaprojects[id]?.active}
                    {@const isComplete = $megaprojects[id]?.completed}
                    {@const canAfford = $budget >= project.cost * 0.3}

                    {#if !isActive && !isComplete}
                        <div
                            class="project-card available"
                            class:disabled={!canAfford}
                        >
                            <span class="icon">{project.icon}</span>
                            <div class="info">
                                <span class="name">{project.name}</span>
                                <span class="desc">{project.desc}</span>
                                <span class="cost"
                                    >Cost: ${project.cost}B | {project.buildTime}
                                    days</span
                                >
                            </div>
                            <button
                                class="start-btn"
                                disabled={!canAfford}
                                on:click={() => startProject(id)}
                            >
                                Start
                            </button>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>

        {#if completedProjects.length > 0}
            <div class="section">
                <h4>✅ Completed</h4>
                {#each completedProjects as [id]}
                    {@const config = PROJECTS[id]}
                    <div class="project-card completed">
                        <span class="icon">{config.icon}</span>
                        <span class="name">{config.name}</span>
                        <span class="status">✅ Complete</span>
                    </div>
                {/each}
            </div>
        {/if}
    </GlassPanel>
</div>

<style>
    .projects-dashboard {
        height: 100%;
        overflow-y: auto;
    }

    .section {
        margin-bottom: 1.5rem;
    }
    .section h4 {
        color: var(--accent-blue);
        margin-bottom: 0.6rem;
    }

    .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 0.8rem;
    }

    .project-card {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 0.8rem;
    }

    .project-card.active {
        border-left: 3px solid var(--accent-gold);
    }
    .project-card.completed {
        border-left: 3px solid var(--accent-green);
        opacity: 0.7;
    }
    .project-card.disabled {
        opacity: 0.5;
    }

    .icon {
        font-size: 2rem;
    }
    .info {
        flex: 1;
    }
    .name {
        display: block;
        font-weight: 600;
    }
    .desc {
        display: block;
        font-size: 0.75rem;
        color: var(--text-muted);
    }
    .cost {
        display: block;
        font-size: 0.7rem;
        color: var(--accent-gold);
        margin-top: 0.3rem;
    }

    .progress-bar {
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
        margin: 0.3rem 0;
        overflow: hidden;
    }

    .fill {
        height: 100%;
        background: var(--accent-gold);
        transition: width 0.3s;
    }
    .progress-text {
        font-size: 0.7rem;
        color: var(--accent-gold);
    }

    .start-btn {
        padding: 0.4rem 0.8rem;
        background: linear-gradient(135deg, var(--accent-gold), #d97706);
        border: none;
        border-radius: 4px;
        color: black;
        font-weight: 600;
        cursor: pointer;
    }

    .start-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>
