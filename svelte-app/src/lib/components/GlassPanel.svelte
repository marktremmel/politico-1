<script>
  export let title = "";
  export let style = "";
</script>

<div class="glass-panel" {style}>
  {#if title}
    <h3 class="panel-title">{title}</h3>
  {/if}
  <slot />
</div>

<style>
  .glass-panel {
    background: rgba(30, 30, 50, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1rem;
  }
  
  .panel-title {
    color: var(--accent-gold, #fbbf24);
    margin-bottom: 0.8rem;
    font-size: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 0.5rem;
  }
</style>
