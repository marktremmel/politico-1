export const TOOLTIPS = {
    'political-capital': {
        title: "Political Capital (PC)",
        text: "Your resource for enacting policies. Gained daily based on Approval and Cabinet efficiency."
    },
    'budget': {
        title: "National Budget",
        text: "The current state of national reserves. If this hits $0, you face a Debt Crisis."
    },
    'approval': {
        title: "Approval Rating",
        text: "Percentage of voters who support your leadership. Influences Political Capital gain."
    },
    'relation-eu': { title: "EU Relations", text: "Impacts trade tariffs and access to development funds." },
    'relation-usa': { title: "US Relations", text: "Impacts military aid and foreign investment." },
    'relation-russia': { title: "Russia Relations", text: "Impacts energy prices and regional stability." },
    'relation-china': { title: "China Relations", text: "Impacts infrastructure loans and export markets." },
    'sovereignty': { title: "National Sovereignty", text: "Your independence from foreign powers. If this drops to 0%, you become a puppet state (Game Over)." },
    'alignment': { title: "Superpower Alignment", text: "Your stance between the Socialist East and Capitalist West. Drifting too far risks sanctions from the other side." }
};

export class TooltipManager {
    constructor() {
        this.tooltipEl = document.getElementById('tooltip');
        this.init();
    }

    init() {
        if (!this.tooltipEl) return;

        // Delegate listener
        document.body.addEventListener('mouseover', (e) => {
            const target = e.target.closest('.tooltip-target');
            if (target) {
                const key = target.dataset.tooltip;
                if (TOOLTIPS[key]) {
                    this.show(TOOLTIPS[key], e);
                }
            }
        });

        document.body.addEventListener('mouseout', (e) => {
            const target = e.target.closest('.tooltip-target');
            if (target) {
                // If moving to a child element, do not hide (event bubbling)
                if (target.contains(e.relatedTarget)) return;
                this.hide();
            }
        });

        document.body.addEventListener('mousemove', (e) => {
            if (this.isVisible) {
                this.move(e);
            }
        });
    }

    show(data, e) {
        this.tooltipEl.innerHTML = `<strong>${data.title}</strong><br>${data.text}`;
        this.tooltipEl.classList.remove('hidden');
        this.isVisible = true;
        this.move(e);
    }

    hide() {
        this.tooltipEl.classList.add('hidden');
        this.isVisible = false;
    }

    move(e) {
        const x = e.clientX + 15;
        const y = e.clientY + 15;
        this.tooltipEl.style.left = `${x}px`;
        this.tooltipEl.style.top = `${y}px`;
    }
}
