<script>
  export let value = 50;
  export let max = 100;
  export let label = "Stat";
  export let color = "var(--accent-gold)";
  export let showValue = true;
  
  $: percentage = (value / max) * 100;
  $: barColor = value < 30 ? 'var(--accent-red)' : value < 60 ? '#f59e0b' : 'var(--accent-green)';
</script>

<div class="stat-bar">
  <div class="stat-header">
    <span class="label">{label}</span>
    {#if showValue}
      <span class="value" style="color: {barColor}">{Math.round(value)}%</span>
    {/if}
  </div>
  <div class="bar-bg">
    <div 
      class="bar-fill" 
      style="width: {percentage}%; background: {barColor};"
    ></div>
  </div>
</div>

<style>
  .stat-bar {
    margin-bottom: 0.5rem;
  }
  
  .stat-header {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    margin-bottom: 0.3rem;
  }
  
  .label {
    color: var(--text-muted, #888);
  }
  
  .value {
    font-weight: 600;
  }
  
  .bar-bg {
    background: rgba(255, 255, 255, 0.1);
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease, background 0.3s ease;
  }
</style>
