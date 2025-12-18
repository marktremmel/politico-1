# Svelte Quick Guide for Political Simulator

## What is Svelte?

Svelte is a **compiler** that turns your components into efficient vanilla JavaScript at build time. Unlike React/Vue that ship a runtime, Svelte has zero runtime overhead.

---

## Core Concepts

### 1. Components (.svelte files)

A Svelte component is a single file with HTML, CSS, and JS:

```svelte
<script>
  // JavaScript logic
  let count = 0;
  
  function increment() {
    count++;
  }
</script>

<!-- HTML template -->
<button on:click={increment}>
  Clicks: {count}
</button>

<style>
  /* Scoped CSS - only affects this component */
  button { background: gold; }
</style>
```

### 2. Reactivity

Variables are automatically reactive. Just reassign them:

```svelte
<script>
  let approval = 50;
  
  function handleEvent() {
    approval = approval - 10; // UI updates automatically!
  }
</script>

<p>Approval: {approval}%</p>
```

### 3. Reactive Statements (`$:`)

Run code when dependencies change:

```svelte
<script>
  let budget = 100;
  let expenses = 60;
  
  // This runs whenever budget OR expenses changes
  $: surplus = budget - expenses;
  $: isDeficit = surplus < 0;
  $: console.log('Surplus changed:', surplus);
</script>
```

### 4. Stores (Global State)

For state shared across components:

```javascript
// stores/gameState.js
import { writable, derived } from 'svelte/store';

export const approval = writable(50);
export const budget = writable(100);

// Derived values
export const isWinning = derived(approval, $a => $a >= 50);
```

Using stores in components:

```svelte
<script>
  import { approval, budget } from './stores/gameState.js';
</script>

<!-- $ prefix auto-subscribes -->
<p>Approval: {$approval}%</p>
<button on:click={() => $approval += 5}>Boost</button>
```

---

## Comparison: Current Code vs Svelte

### Current (Vanilla JS)
```javascript
function renderOverview(container) {
  const approval = game.state.get('approval');
  container.innerHTML = `
    <div class="stat">
      Approval: ${approval}%
    </div>
  `;
}

// Manual re-render needed
game.state.subscribe('*', () => renderOverview(container));
```

### Svelte Version
```svelte
<script>
  import { approval } from '$lib/stores/gameState';
</script>

<div class="stat">
  Approval: {$approval}%
</div>

<!-- That's it! Auto-updates when approval changes -->
```

---

## Project Structure

```
svelte-app/
├── src/
│   ├── lib/
│   │   ├── stores/       # Global state
│   │   │   └── gameState.js
│   │   ├── systems/      # Game logic (port from current)
│   │   │   └── PoliticsSystem.js
│   │   └── components/   # Reusable UI
│   │       └── StatBar.svelte
│   ├── routes/ or App.svelte
│   └── main.js
├── public/
└── package.json
```

---

## Key Svelte Features We'll Use

| Feature | Purpose |
|---------|---------|
| `{#each}` | Loop over arrays (factions, regions) |
| `{#if}` | Conditional rendering |
| `bind:value` | Two-way binding for inputs |
| `on:click` | Event handlers |
| `$:` | Reactive statements |
| Stores | Shared game state |
| Transitions | Animate UI changes |

---

## Deployment

### Build for Production
```bash
npm run build
# Creates dist/ folder with static files
```

### Deploy to GitHub Pages
```bash
# In svelte.config.js or vite.config.js, set base path
# Then copy dist/ contents to your gh-pages branch
```

### Other Options
- **Vercel**: `npx vercel` (auto-detects Svelte)
- **Netlify**: Push to GitHub, connect repo
- **Any static host**: Just upload dist/

---

## Quick Reference

```svelte
<!-- Variables -->
{variableName}

<!-- Expressions -->
{count * 2}

<!-- Conditionals -->
{#if condition}
  <p>True</p>
{:else}
  <p>False</p>
{/if}

<!-- Loops -->
{#each items as item, index}
  <div>{index}: {item.name}</div>
{/each}

<!-- Events -->
<button on:click={handleClick}>Click</button>
<button on:click={() => count++}>Inline</button>

<!-- Binding -->
<input bind:value={name}>
<input type="range" bind:value={approval} min="0" max="100">

<!-- Styling -->
<div class:active={isActive}>
  <!-- class="active" added when isActive is true -->
</div>
```

---

## Next Steps

1. Port game state to Svelte stores
2. Create StatBar, GlassPanel components
3. Port Overview dashboard as first component
4. Add systems as pure functions
