<script>
    import { currentEvent, handleEventChoice } from "../stores/eventsData.js";

    function selectChoice(index) {
        handleEventChoice(index);
    }
</script>

{#if $currentEvent}
    <div class="modal-overlay" on:click|self={() => {}}>
        <div class="modal-content">
            <div class="event-header">
                <span class="icon">{$currentEvent.icon}</span>
                <h2>{$currentEvent.title}</h2>
            </div>

            <p class="description">{$currentEvent.desc}</p>

            <div class="choices">
                {#each $currentEvent.choices as choice, i}
                    <button class="choice-btn" on:click={() => selectChoice(i)}>
                        {choice.text}
                    </button>
                {/each}
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .modal-content {
        background: linear-gradient(
            135deg,
            rgba(30, 30, 50, 0.95),
            rgba(20, 20, 40, 0.95)
        );
        border: 2px solid var(--accent-gold);
        border-radius: 16px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
        from {
            transform: translateY(-20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .event-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--glass-border);
    }

    .icon {
        font-size: 3rem;
    }

    h2 {
        margin: 0;
        color: var(--accent-gold);
    }

    .description {
        font-size: 1rem;
        line-height: 1.6;
        margin-bottom: 1.5rem;
        color: var(--text-main);
    }

    .choices {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
    }

    .choice-btn {
        width: 100%;
        padding: 1rem 1.5rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--glass-border);
        border-radius: 8px;
        color: var(--text-main);
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.2s;
        text-align: left;
    }

    .choice-btn:hover {
        background: rgba(56, 189, 248, 0.2);
        border-color: var(--accent-blue);
        transform: translateX(5px);
    }

    .choice-btn:first-child:hover {
        background: rgba(16, 185, 129, 0.2);
        border-color: var(--accent-green);
    }

    .choice-btn:last-child:hover {
        background: rgba(239, 68, 68, 0.2);
        border-color: var(--accent-red);
    }
</style>
