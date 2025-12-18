// ============================================
// POLITICS SYSTEM - Approval & PC Management
// ============================================

export class PoliticsSystem {
    constructor() {
        this.baseDrip = 0.3;
    }

    update(state) {
        // === 1. Calculate Regional Unrest Impact on Approval ===
        this.applyUnrestToApproval(state);

        // === 2. PC Generation based on Approval ===
        this.updatePC(state);

        // === 3. Track history for legacy ===
        this.trackHistory(state);
    }

    applyUnrestToApproval(state) {
        const regions = state.get('regions') || {};
        const regionKeys = Object.keys(regions);
        if (regionKeys.length === 0) return;

        // Calculate average unrest
        let totalUnrest = 0;
        regionKeys.forEach(key => {
            totalUnrest += regions[key].unrest || 0;
        });
        const avgUnrest = totalUnrest / regionKeys.length;
        state.update('averageUnrest', avgUnrest);

        // Unrest directly drags down approval
        // High unrest (>50) = approval penalty
        // Max unrest (100) = -2 approval per day
        let approval = state.get('approval') || 50;

        if (avgUnrest > 50) {
            const penalty = (avgUnrest - 50) * 0.04; // 0 to 2 per day
            approval = Math.max(5, approval - penalty);
            state.update('approval', approval);
        } else if (avgUnrest < 20) {
            // Low unrest = slight approval recovery
            approval = Math.min(95, approval + 0.05);
            state.update('approval', approval);
        }

        // Low sector health also hurts approval
        const sectors = state.get('sectors') || {};
        let lowSectors = 0;
        Object.values(sectors).forEach(s => {
            if (s.health < 40) lowSectors++;
        });
        if (lowSectors >= 3) {
            approval = Math.max(5, approval - 0.3 * lowSectors);
            state.update('approval', approval);
        }
    }

    updatePC(state) {
        let currentPC = state.get('politicalCapital');
        const approval = state.get('approval') || 50;

        let change = this.baseDrip;

        if (approval >= 70) {
            change = 0.5 + (approval - 70) * 0.02;
        } else if (approval >= 30) {
            change = 0.2 + (approval - 30) * 0.0075;
        } else {
            change = -0.2 + (approval * 0.013);
        }

        let newPC = Math.max(0, Math.min(100, currentPC + change));

        if (newPC !== currentPC) {
            state.update('politicalCapital', parseFloat(newPC.toFixed(1)));
        }
    }

    trackHistory(state) {
        // Track key stats for legacy/history
        const history = state.get('history') || {
            maxApproval: 50,
            minApproval: 50,
            lawsPassed: 0,
            megaprojectsCompleted: 0,
            crisesHandled: 0,
            electionsWon: 0
        };

        const approval = state.get('approval') || 50;
        history.maxApproval = Math.max(history.maxApproval, approval);
        history.minApproval = Math.min(history.minApproval, approval);

        // Track completed megaprojects
        const projects = state.get('megaprojects') || {};
        history.megaprojectsCompleted = Object.values(projects).filter(p => p.completed).length;

        // Track laws
        const laws = state.get('active_laws') || [];
        history.lawsPassed = laws.length;

        state.update('history', history);
    }
}
