export class PolicySystem {
    constructor() {
        this.policies = {
            // Spending (in Billions or % of GDP - let's go with absolute Billions for now, easy to understand)
            // Or a 0-100 scailer? "Level". 
            // Level 50 = "Normal".
            spending: {
                health: { level: 50, costPerLevel: 0.1, name: "Healthcare" }, // 50 * 0.1 = $5B
                education: { level: 50, costPerLevel: 0.1, name: "Education" },
                military: { level: 50, costPerLevel: 0.2, name: "Military" },
                infrastructure: { level: 50, costPerLevel: 0.1, name: "Infrastructure" },
                welfare: { level: 30, costPerLevel: 0.1, name: "Welfare" },
                police: { level: 50, costPerLevel: 0.05, name: "Police" }
            },
            // Laws (Booleans or Enums)
            laws: {
                freedom_press: { active: true, name: "Free Press" },
                labor_rights: { active: true, name: "Strong Labor Rights" }
            }
        };
    }

    update(state) {
        // Calculate Total Cost
        let totalSpending = 0;

        Object.values(this.policies.spending).forEach(cat => {
            totalSpending += (cat.level * cat.costPerLevel);
        });

        // Apply Costs to Budget (Daily)
        // EconomySystem handles "Net", so we need to inject this "Expense" into the state
        // so EconomySystem can read it? 
        // OR EconomySystem reads 'policyExpense' from state.

        state.update('policyExpense', parseFloat(totalSpending.toFixed(2))); // Annual Billions

        // Apply Effects on Stats/Factions
        // This is complex. Let's do a simple effect pass.

        // Health -> Happiness of Pensioners/Poor (welfare group?)
        // Military -> Happiness of Patriots/Nationalists

        // Ideally, we'd emit "impacts" that FactionSystem consumes.
        // For now, let's update a shared 'metrics' object in state.
        const metrics = {
            publicHealth: this.policies.spending.health.level,
            security: this.policies.spending.police.level + (this.policies.spending.military.level * 0.5),
            educationQuality: this.policies.spending.education.level,
            infrastructureQuality: this.policies.spending.infrastructure.level
        };

        state.update('metrics', metrics);
    }

    setSpending(category, level) {
        if (this.policies.spending[category]) {
            this.policies.spending[category].level = parseInt(level);
        }
    }
}
