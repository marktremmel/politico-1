export class EconomySystem {
    constructor() {
        // Daily flow divisor (Budget is annual, step is daily)
        this.dailyFactor = 1 / 365;
    }

    update(state) {
        // Get current stats
        // Get current stats
        const gdp = state.get('gdp') || 100; // Billions (Default 100 if missing)
        const debt = state.get('debt') || 0; // % of GDP (Default 0 if missing)
        const taxRate = state.get('taxRate') || 0.40; // 40% default if missing
        // Apply Trade Modifiers based on Geopolitics
        // Default base trade factor
        let tradeModifier = 1.0;

        const relations = state.get('relations');
        if (relations) {
            // EU: Primary trade partner. Major impact.
            const euScore = relations.eu ? relations.eu.score : 50;
            if (euScore > 80) tradeModifier += 0.15; // Free trade perks
            else if (euScore < 30) tradeModifier -= 0.10; // Sanctions/Tariffs

            // China: Export market
            const cnScore = relations.china ? relations.china.score : 50;
            if (cnScore > 70) tradeModifier += 0.05;

            // USA: Investment
            const usScore = relations.usa ? relations.usa.score : 50;
            if (usScore > 80) tradeModifier += 0.05;
        }

        // Apply modifier to GDP growth or Revenue?
        // Let's affect annualRevenue directly via a 'Trade Revenue' component check
        // Or simply scale the GDP temporarily for the calculation

        let adjustedGDP = gdp * tradeModifier;

        // Calculate Revenue
        // 1. Tax Revenue (Base 30% of GDP * TaxRate?)
        // Let's say TaxRate implies effective tax yield.
        const annualRevenue = adjustedGDP * taxRate;

        // Apply Cabinet Efficiency (Economy Minister)
        const cabinetEff = state.get('cabinet_efficiency_economy') || 0;
        // Efficiency is a % modifier (e.g. 0.05 = +5%)
        // We apply it to revenue directly representing better tax collection/management
        const finalAnnualRevenue = annualRevenue * (1 + cabinetEff);

        // Expenses (Simple Model: Fixed Services + Debt Interest)
        // Debt Interest usually ~3-5% of debt value per year
        const debtValue = gdp * (debt / 100);
        const interestRate = 0.04; // 4%
        const annualInterest = debtValue * interestRate;

        // Base Government Spending (Services, Military, Pensions)
        // Now tracked via PolicySystem as 'policyExpense' (Annual)
        // If policyExpense is 0/undefined, fallback to simple model.
        let annualSpendingServices = 0;
        const policyExpense = state.get('policyExpense');
        const lawMaintenance = state.get('law_maintenance_cost') || 0; // NEW: From LawSystem

        if (policyExpense !== undefined) {
            // Total = PolicySliderCosts + LawMaintenance
            annualSpendingServices = policyExpense + lawMaintenance;
        } else {
            const spendingRate = state.get('spendingRate') || (taxRate + 0.02);
            annualSpendingServices = gdp * spendingRate;
        }

        const totalAnnualExpense = annualSpendingServices + annualInterest;
        const totalAnnualNet = annualRevenue - totalAnnualExpense;

        // Daily Calculation
        const dailyNet = totalAnnualNet * this.dailyFactor;

        // Update Budget (in Billions)
        let currentBudget = state.get('budget');
        currentBudget += dailyNet;

        // Update State
        state.update('budget', parseFloat(currentBudget.toFixed(4)));
        state.update('dailyIncome', parseFloat((finalAnnualRevenue * this.dailyFactor).toFixed(4)));
        state.update('dailyExpense', parseFloat((totalAnnualExpense * this.dailyFactor).toFixed(4)));

        // Revenue Breakdown (Simulated distribution)
        // In a real sim, these would be separate inputs. Here we simulate the split based on TaxRate.
        // Approx: 40% Income, 30% VAT, 30% Corporate
        const dailyRevenue = finalAnnualRevenue * this.dailyFactor;
        const dailyIncomeTax = dailyRevenue * 0.40;
        const dailyVAT = dailyRevenue * 0.30;
        const dailyCorpTax = dailyRevenue * 0.30;

        // Spending Breakdown
        const dailySpending = annualSpendingServices * this.dailyFactor;
        const dailyDebt = annualInterest * this.dailyFactor;

        // Policy Breakdown (if we have policyExpense, we can try to break it down, otherwise generic)
        // Access PolicySystem if possible? simpler to simulate based on relative weights if needed, 
        // but 'policyExpense' is already an aggregate.
        // Let's just report the totals for now, but with cleaner names.

        // Detailed Breakdown for UI
        state.update('budgetBreakdown', {
            dailyTax: dailyRevenue.toFixed(3),
            dailyIncomeTax: dailyIncomeTax.toFixed(3),
            dailyVAT: dailyVAT.toFixed(3),
            dailyCorpTax: dailyCorpTax.toFixed(3),

            dailyPolicy: dailySpending.toFixed(3),
            dailyDebt: dailyDebt.toFixed(3)
        });

        // Debt Spiral tracking
        // For now, let's just track the budget surplus/deficit.
    }
}
