// Base Country Data
export const COUNTRIES = {
    "poland": {
        name: "Poland",
        leaderDefault: "President Kowalski",
        flag: "🇵🇱",
        population: 37500000,
        gdp: 840, // Billions USD
        debt: 55.0, // % of GDP
        budget: 0,
        approval: 52,
        politicalCapital: 60,
        taxRate: 0.42, // ~42% Revenue
        spendingRate: 0.46, // ~6% Deficit initially
        desc: "A rising regional power with a large internal market, but facing polarization and border tensions."
    },
    "hungary": {
        name: "Hungary",
        leaderDefault: "PM Nagy",
        flag: "🇭🇺",
        population: 9600000,
        gdp: 200,
        debt: 73.5,
        budget: 0,
        approval: 45,
        politicalCapital: 40,
        taxRate: 0.42,
        spendingRate: 0.47, // High deficit
        desc: "Centrally located with strong industrial ties, but struggling with high inflation and EU disputes."
    },
    // ... Copy other countries here or leave them as is if I used 'SCENARIOS' name differently. 
    // To minimize diff, I will keep 'SCENARIOS' as 'COUNTRIES' for compatibility but export SCENARIO_TYPES
    "czechia": {
        name: "Czechia",
        leaderDefault: "President Novák",
        flag: "🇨🇿",
        population: 10900000,
        gdp: 330,
        debt: 44.0,
        budget: 0,
        approval: 55,
        politicalCapital: 50,
        taxRate: 0.40,
        spendingRate: 0.42, // Small deficit
        desc: "Industrial powerhouse with stable finances, though facing an aging workforce and energy transition costs."
    },
    "slovakia": {
        name: "Slovakia",
        leaderDefault: "PM Horváth",
        flag: "🇸🇰",
        population: 5400000,
        gdp: 130,
        debt: 60.0,
        budget: 0,
        approval: 48,
        politicalCapital: 45,
        taxRate: 0.42,
        spendingRate: 0.47, // High deficit
        desc: "Heavily industrialized economy dependent on automotive exports, facing political fragmentation."
    },
    "romania": {
        name: "Romania",
        leaderDefault: "President Popescu",
        flag: "🇷🇴",
        population: 19000000,
        gdp: 350,
        debt: 55.0,
        budget: 0,
        approval: 50,
        politicalCapital: 55,
        taxRate: 0.34, // Low revenue capture
        spendingRate: 0.42, // High deficit
        desc: "Fast-growing IT and services sector, but hampered by infrastructure deficits and brain drain."
    }
};

// Alias for backward compatibility if needed, but we should switch to COUNTRIES
export const SCENARIOS = COUNTRIES;

export const SCENARIO_TYPES = {
    'standard': {
        name: "Standard Start",
        desc: "Business as usual. No special modifiers.",
        modifiers: {}
    },
    'post_war': {
        name: "Post-War Recovery",
        desc: "The war is over, but the treasury is empty and unrest is high. Rebuild the nation.",
        modifiers: {
            debt: 120, // High Debt
            politicalCapital: 100, // High initial capital (Mandate to rebuild)
            approval: 30, // Low approval (Misery)
            budget: -10 // Starting in hole? (Logic usually sets budget to 0, let's impact debt)
        }
    },
    'resource_curse': {
        name: "Resource Curse",
        desc: "Massive natural wealth, but rampant corruption and low sovereignty.",
        modifiers: {
            gdp: 1.5, // 1.5x GDP Multiplier
            sovereignty: 60, // Low Sovereignty
            politicalCapital: 30 // Hard to govern
        }
    },
    'technocrat': {
        name: "Technocratic Interim",
        desc: "Appointed to fix the economy. High Competence, Low public support.",
        modifiers: {
            approval: 20,
            politicalCapital: 10,
            spendingRate: 0.35 // Forced Austerity
        }
    },
    'emergency': {
        name: "State of Emergency",
        desc: "A pandemic or disaster has struck. Panic is high.",
        modifiers: {
            gdp: 0.8, // Economy crashed
            approval: 80, // Rally round the flag effect initially? Or Panic? Let's say 40.
            politicalCapital: 80 // Emergency powers
        }
    }
};

export class ScenarioLoader {
    /**
     * Loads a scenario into the game state
     * @param {GameState} state 
     * @param {string} countryKey 
     * @param {Object} customization - Optional overrides (leaderName, partyName, flag, scenarioType)
     */
    static load(state, countryKey, customization = {}) {
        const country = COUNTRIES[countryKey];
        if (!country) {
            console.error(`Country ${countryKey} not found!`);
            return;
        }

        const typeKey = customization.scenarioType || 'standard';
        const scenario = SCENARIO_TYPES[typeKey];
        const mods = scenario.modifiers || {};

        console.log(`Loading Country: ${country.name} | Type: ${scenario.name}`);

        // Apply Modifiers
        let finalGdp = country.gdp * (mods.gdp && mods.gdp < 5 ? mods.gdp : 1); // If small num, treat as multiplier
        if (mods.gdp && mods.gdp > 10) finalGdp = mods.gdp; // If large, override

        let finalDebt = mods.debt !== undefined ? mods.debt : country.debt;
        let finalApproval = mods.approval !== undefined ? mods.approval : country.approval;
        let finalPC = mods.politicalCapital !== undefined ? mods.politicalCapital : country.politicalCapital;

        // Handle Sovereignty (New State)
        let finalSov = mods.sovereignty !== undefined ? mods.sovereignty : 100;

        state.updateBatch({
            countryName: country.name,
            leaderName: customization.leaderName || country.leaderDefault,
            flag: customization.flag || country.flag,
            population: country.population,
            gdp: finalGdp,
            debt: finalDebt,
            approval: finalApproval,
            politicalCapital: finalPC,
            taxRate: country.taxRate,
            spendingRate: mods.spendingRate || country.spendingRate,
            budget: 0,
            sovereignty: finalSov,
            startDate: new Date() // For Election System
        });
    }
}
