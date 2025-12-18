export const REGIONS = {
    CAPITAL: 'capital',
    INDUSTRIAL: 'industrial',
    RURAL: 'rural',
    BORDER: 'border'
};

export class MapSystem {
    constructor() {
        this.regions = {
            [REGIONS.CAPITAL]: { name: "Capital Metropolis", groups: ["Urban Middle Class", "Business Elite", "Youth Students"], unrest: 10, development: 80 },
            [REGIONS.INDUSTRIAL]: { name: "Industrial Belt", groups: ["Rural Workers", "State Pensioners"], unrest: 20, development: 60 },
            [REGIONS.RURAL]: { name: "Rural Provinces", groups: ["Rural Workers", "Traditionalists"], unrest: 5, development: 30 }, // "Traditionalists" isn't a group, it's a faction. Wait. Rural Workers have affinity.
            [REGIONS.BORDER]: { name: "Border Zone", groups: ["Minority Communities", "State Pensioners"], unrest: 15, development: 40 }
        };
    }

    update(state) {
        // Derive Unrest/Support from Voter Group Happiness
        // We need to access FactionSystem or State
        const factionData = state.get('factions');
        // Actually we need 'voterGroups' which are internal to FactionSystem
        // Ideally FactionSystem exports them to state? 
        // It doesn't currently. It only exports 'factions' and 'approval'.

        // Refactor: We assume 'factions' logic is running and modifying State.
        // But to get granular "Region Happiness", calculation needs access to specific group happiness.

        // Hack: Since FactionSystem doesn't export raw group data to state, 
        // we can't easily read it without refactoring FactionSystem to state.update('voterGroups', ...)
        // Let's assume FactionSystem DOES update 'voterGroups' to state or we add it.

        this.calculateRegionalUnrest(state);
    }

    calculateRegionalUnrest(state) {
        // Mock calculation since we can't see Group Happiness directly in State yet.
        // We will fix FactionSystem to export it.

        const groups = state.get('voterGroups') || []; // Expecting this now.
        if (groups.length === 0) return;

        Object.values(this.regions).forEach(region => {
            let totalUnrest = 0;
            let count = 0;

            region.groups.forEach(gName => {
                const grp = groups.find(g => g.name === gName);
                if (grp) {
                    // Happiness 0-100. Unrest = 100 - Happiness.
                    totalUnrest += (100 - grp.happiness);
                    count++;
                }
            });

            if (count > 0) {
                region.unrest = totalUnrest / count;
            }
        });

        state.update('regions', this.regions);
    }
}
