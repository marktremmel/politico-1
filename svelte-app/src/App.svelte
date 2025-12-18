<script>
  import { onMount, onDestroy } from "svelte";
  import GlassPanel from "./lib/components/GlassPanel.svelte";
  import StatBar from "./lib/components/StatBar.svelte";
  import BudgetDashboard from "./lib/components/BudgetDashboard.svelte";
  import MapDashboard from "./lib/components/MapDashboard.svelte";
  import FactionsDashboard from "./lib/components/FactionsDashboard.svelte";
  import LawsDashboard from "./lib/components/LawsDashboard.svelte";
  import CabinetDashboard from "./lib/components/CabinetDashboard.svelte";
  import ProjectsDashboard from "./lib/components/ProjectsDashboard.svelte";
  import TradeDashboard from "./lib/components/TradeDashboard.svelte";
  import CampaignDashboard from "./lib/components/CampaignDashboard.svelte";
  import EventModal from "./lib/components/EventModal.svelte";
  import StartScreen from "./lib/components/StartScreen.svelte";
  import {
    countryName,
    leaderName,
    date,
    isPaused,
    politicalCapital,
    budget,
    approval,
    sovereignty,
    gdp,
    daysPassed,
    daysUntilElection,
    averageUnrest,
    regions,
    sectors,
    voterGroups,
  } from "./lib/stores/gameState.js";
  import {
    startGame,
    pauseGame,
    togglePause,
    initializeGame,
    setSpeed,
    currentSpeed,
    gameOver,
  } from "./lib/stores/gameEngine.js";
  import {
    currentEvent,
    triggerRandomEvent,
    eventHistory,
  } from "./lib/stores/eventsData.js";
  import { selectedScenario } from "./lib/stores/scenarios.js";

  let gameStarted = false;
  let currentView = "overview";
  let newsItems = [
    { text: "🎉 Welcome to office!", type: "info" },
    { text: "📰 Your first day as leader...", type: "info" },
    { text: "📊 Check your Budget and pass Laws!", type: "tip" },
  ];
  let eventInterval;
  let selectedNews = null;

  const views = [
    { id: "overview", label: "📊 Overview" },
    { id: "budget", label: "💸 Budget" },
    { id: "laws", label: "⚖️ Laws" },
    { id: "factions", label: "👥 Factions" },
    { id: "cabinet", label: "👔 Cabinet" },
    { id: "map", label: "🗺️ Map" },
    { id: "projects", label: "🏗️ Projects" },
    { id: "trade", label: "🌍 Trade" },
    { id: "campaign", label: "🗳️ Campaign" },
  ];

  function handleGameStart() {
    gameStarted = true;
    initializeGame();

    eventInterval = setInterval(() => {
      if (!$isPaused && !$currentEvent && Math.random() < 0.3) {
        triggerRandomEvent();
      }
    }, 10000);
  }

  function restartGame() {
    gameOver.set(null);
    gameStarted = false;
  }

  onDestroy(() => {
    pauseGame();
    if (eventInterval) clearInterval(eventInterval);
  });

  $: if ($currentEvent) {
    newsItems = [
      {
        text: `${$currentEvent.icon} ${$currentEvent.title}`,
        type: "event",
        event: $currentEvent,
      },
      ...newsItems.slice(0, 4),
    ];
  }

  $: formattedDate = $date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
</script>

{#if !gameStarted}
  <StartScreen onStart={handleGameStart} />
{:else if $gameOver}
  <div class="game-over-screen">
    <div class="game-over-content">
      <h1>💀 Game Over</h1>
      <p class="reason">{$gameOver.reason}</p>
      <p>You survived <strong>{$daysPassed}</strong> days.</p>
      <button class="btn-restart" on:click={restartGame}>Try Again</button>
    </div>
  </div>
{:else}
  <EventModal />

  <main>
    <header class="top-bar">
      <div class="country-info">
        <span class="flag">🏛️</span>
        <span class="country-name">{$countryName}</span>
        <span class="leader-name">{$leaderName}</span>
      </div>

      <div class="stats-bar">
        <div class="stat">
          <span class="stat-icon">💰</span>
          <span class="stat-value">{$politicalCapital.toFixed(0)}</span>
          <span class="stat-label">PC</span>
        </div>
        <div
          class="stat"
          class:danger={$approval < 30}
          class:good={$approval >= 60}
        >
          <span class="stat-icon">👍</span>
          <span class="stat-value">{$approval.toFixed(0)}%</span>
          <span class="stat-label">Approval</span>
        </div>
        <div class="stat" class:danger={$budget < -10} class:good={$budget > 5}>
          <span class="stat-icon">🏦</span>
          <span class="stat-value">${$budget.toFixed(1)}B</span>
          <span class="stat-label">Budget</span>
        </div>
        <div class="stat" class:danger={$sovereignty < 30}>
          <span class="stat-icon">🛡️</span>
          <span class="stat-value">{$sovereignty.toFixed(0)}%</span>
          <span class="stat-label">Sov</span>
        </div>
      </div>

      <div class="controls">
        <span class="date">{formattedDate}</span>
        <span class="election-timer">🗳️ {$daysUntilElection}d</span>

        <div class="speed-controls">
          <button
            class="btn-speed"
            class:active={$currentSpeed === 1}
            on:click={() => setSpeed(1)}>1x</button
          >
          <button
            class="btn-speed"
            class:active={$currentSpeed === 2}
            on:click={() => setSpeed(2)}>2x</button
          >
          <button
            class="btn-speed"
            class:active={$currentSpeed === 5}
            on:click={() => setSpeed(5)}>5x</button
          >
        </div>

        <button class="btn-pause" on:click={togglePause}>
          {$isPaused ? "▶️" : "⏸️"}
        </button>
      </div>
    </header>

    <div class="game-layout">
      <nav class="sidebar">
        {#each views as view}
          <button
            class="nav-btn"
            class:active={currentView === view.id}
            on:click={() => (currentView = view.id)}
          >
            {view.label}
          </button>
        {/each}
      </nav>

      <section class="main-content">
        {#if currentView === "overview"}
          <GlassPanel title="📊 Overview">
            <div class="overview-grid">
              <div class="stat-group">
                <h4>Political</h4>
                <StatBar label="Approval" value={$approval} />
                <StatBar label="Political Capital" value={$politicalCapital} />
                <StatBar label="Sovereignty" value={$sovereignty} />
              </div>
              <div class="stat-group">
                <h4>Economy</h4>
                <p>GDP: ${$gdp?.toFixed(1) || 0}B</p>
                <p>Budget: ${$budget?.toFixed(1) || 0}B</p>
                <p>Days: {$daysPassed}</p>
              </div>
              <div class="stat-group">
                <h4>Stability</h4>
                <StatBar label="Avg Unrest" value={$averageUnrest} />
                <p>
                  {$averageUnrest < 30
                    ? "✅ Stable"
                    : $averageUnrest < 60
                      ? "⚠️ Tense"
                      : "🔥 Crisis"}
                </p>
              </div>
            </div>
          </GlassPanel>
        {:else if currentView === "budget"}
          <BudgetDashboard />
        {:else if currentView === "laws"}
          <LawsDashboard />
        {:else if currentView === "factions"}
          <FactionsDashboard />
        {:else if currentView === "cabinet"}
          <CabinetDashboard />
        {:else if currentView === "map"}
          <MapDashboard />
        {:else if currentView === "projects"}
          <ProjectsDashboard />
        {:else if currentView === "trade"}
          <TradeDashboard />
        {:else if currentView === "campaign"}
          <CampaignDashboard />
        {/if}
      </section>

      <aside class="right-panel">
        <GlassPanel title="📰 News">
          {#each newsItems as news, i}
            <button
              class="news-item"
              class:event={news.type === "event"}
              on:click={() => (selectedNews = selectedNews === i ? null : i)}
            >
              {news.text}
            </button>
            {#if selectedNews === i && news.event}
              <div class="news-detail">
                <p>{news.event.desc}</p>
              </div>
            {/if}
          {/each}
        </GlassPanel>
        <GlassPanel title="📊 Quick">
          <p>🌍 Regions: {Object.keys($regions).length}</p>
          <p>🏛️ Sectors: {Object.keys($sectors).length}</p>
          <p>👥 Groups: {$voterGroups.length}</p>
        </GlassPanel>
      </aside>
    </div>
  </main>
{/if}

<style>
  :global(:root) {
    --bg-dark: #0f0f1a;
    --glass-bg: rgba(30, 30, 50, 0.7);
    --glass-border: rgba(255, 255, 255, 0.1);
    --accent-gold: #fbbf24;
    --accent-blue: #38bdf8;
    --accent-green: #10b981;
    --accent-red: #ef4444;
    --text-main: #f0f0f0;
    --text-muted: #888;
  }

  .game-over-screen {
    min-height: 100vh;
    background: linear-gradient(135deg, #1a0505, #0f0f1a);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .game-over-content {
    text-align: center;
    padding: 3rem;
  }

  .game-over-content h1 {
    font-size: 3rem;
    color: var(--accent-red);
  }
  .game-over-content .reason {
    font-size: 1.2rem;
    color: var(--text-main);
    margin: 1rem 0;
  }
  .btn-restart {
    padding: 1rem 3rem;
    background: var(--accent-gold);
    border: none;
    border-radius: 8px;
    color: black;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 1rem;
  }

  :global(body) {
    margin: 0;
    background: var(--bg-dark);
    color: var(--text-main);
    font-family: "Inter", system-ui, sans-serif;
  }

  main {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 1rem;
    background: var(--glass-bg);
    border-bottom: 1px solid var(--glass-border);
  }

  .country-info {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
  .flag {
    font-size: 1.3rem;
  }
  .country-name {
    font-weight: 600;
    color: var(--accent-gold);
    font-size: 0.95rem;
  }
  .leader-name {
    color: var(--text-muted);
    font-size: 0.8rem;
  }

  .stats-bar {
    display: flex;
    gap: 1rem;
  }

  .stat {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.3rem 0.6rem;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    transition: all 0.3s;
  }

  .stat.danger {
    background: rgba(239, 68, 68, 0.2);
    border: 1px solid var(--accent-red);
  }
  .stat.danger .stat-value {
    color: var(--accent-red);
  }
  .stat.good .stat-value {
    color: var(--accent-green);
  }

  .stat-icon {
    font-size: 0.85rem;
  }
  .stat-value {
    font-weight: 600;
    font-size: 0.9rem;
  }
  .stat-label {
    font-size: 0.65rem;
    color: var(--text-muted);
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
  .date {
    font-size: 0.8rem;
  }
  .election-timer {
    color: var(--accent-gold);
    font-size: 0.8rem;
  }

  .btn-pause {
    padding: 0.4rem 0.8rem;
    background: linear-gradient(135deg, var(--accent-gold), #d97706);
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
  }

  .game-layout {
    display: grid;
    grid-template-columns: 160px 1fr 220px;
    flex: 1;
    gap: 0.8rem;
    padding: 0.8rem;
    max-height: calc(100vh - 50px);
    overflow: hidden;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .nav-btn {
    width: 100%;
    padding: 0.6rem 0.8rem;
    text-align: left;
    font-size: 0.85rem;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 6px;
    color: var(--text-main);
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-btn:hover {
    background: rgba(56, 189, 248, 0.2);
  }
  .nav-btn.active {
    border-color: var(--accent-gold);
    color: var(--accent-gold);
    background: rgba(251, 191, 36, 0.1);
  }

  .main-content {
    overflow-y: auto;
  }

  .overview-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .stat-group h4 {
    color: var(--accent-blue);
    margin-bottom: 0.5rem;
    border-bottom: 1px solid var(--glass-border);
    padding-bottom: 0.3rem;
  }

  .right-panel {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    overflow-y: auto;
  }

  .news-item {
    width: 100%;
    padding: 0.4rem;
    border: none;
    border-bottom: 1px solid var(--glass-border);
    background: transparent;
    color: var(--text-main);
    font-size: 0.8rem;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
  }

  .news-item:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  .news-item.event {
    color: var(--accent-gold);
  }

  .news-detail {
    padding: 0.5rem;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .speed-controls {
    display: flex;
    gap: 0.2rem;
  }

  .btn-speed {
    padding: 0.25rem 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid var(--glass-border);
    border-radius: 4px;
    color: var(--text-main);
    font-size: 0.7rem;
    cursor: pointer;
  }

  .btn-speed:hover {
    background: rgba(56, 189, 248, 0.2);
  }
  .btn-speed.active {
    background: var(--accent-gold);
    color: black;
    border-color: var(--accent-gold);
  }
</style>
