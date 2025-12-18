import { MEGAPROJECTS } from '../systems/MegaprojectSystem.js';

export class MegaprojectDashboard {
    constructor(gameEngine, containerId) {
        this.engine = gameEngine;
        this.container = document.getElementById(containerId);
        this.megaprojectSystem = this.engine.systems.find(s => s.startProject);
    }

    render() {
        const state = this.engine.state;
        const activeProjects = this.megaprojectSystem?.getActiveProjects(state) || [];
        const availableProjects = this.megaprojectSystem?.getAvailableProjects(state) || [];
        const completedProjects = this.megaprojectSystem?.getCompletedProjects(state) || [];

        let html = `
            <div style="height: 100%; display: flex; flex-direction: column; overflow: hidden;">
                <div style="border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem; margin-bottom: 1rem;">
                    <h2 style="color: var(--accent-gold);">🏗️ Megaprojects</h2>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">Invest in nation-defining infrastructure. Takes time but rewards are massive.</p>
                </div>
        `;

        // Active Projects
        if (activeProjects.length > 0) {
            html += `<h3 style="color: var(--accent-blue); margin-bottom: 0.5rem;">🔨 In Progress</h3>`;
            html += `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">`;

            activeProjects.forEach(project => {
                const daysRemaining = project.turnsToBuild - project.progress;
                html += `
                    <div class="glass-panel" style="padding: 1rem; border-left: 3px solid var(--accent-blue);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <span style="font-size: 1.3rem;">${project.icon}</span>
                            <span style="font-size: 0.7rem; color: var(--text-muted);">${daysRemaining} days left</span>
                        </div>
                        <div style="font-weight: 600; margin-bottom: 0.5rem;">${project.name}</div>
                        
                        <!-- Progress Bar -->
                        <div style="background: rgba(255,255,255,0.1); height: 10px; border-radius: 5px; overflow: hidden; margin-bottom: 0.5rem;">
                            <div style="width: ${project.percentComplete}%; height: 100%; background: linear-gradient(90deg, var(--accent-blue), var(--accent-gold)); transition: width 0.3s;"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
                            <span style="color: var(--text-muted);">Progress</span>
                            <span style="color: var(--accent-gold);">${Math.round(project.percentComplete)}%</span>
                        </div>
                        
                        <button class="cancel-project-btn" data-id="${project.id}" 
                            style="margin-top: 0.8rem; width: 100%; padding: 0.4rem; background: rgba(239, 68, 68, 0.2); border: 1px solid var(--accent-red); color: var(--accent-red); border-radius: 4px; cursor: pointer; font-size: 0.75rem;">
                            ❌ Cancel Project
                        </button>
                    </div>
                `;
            });
            html += `</div>`;
        }

        // Available Projects
        if (availableProjects.length > 0) {
            html += `<h3 style="color: var(--accent-green); margin-bottom: 0.5rem;">📋 Available Projects</h3>`;
            html += `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; overflow-y: auto;">`;

            availableProjects.forEach(project => {
                const upfrontCost = (project.totalCost * 0.2).toFixed(1);
                html += `
                    <div class="glass-panel" style="padding: 1rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <span style="font-size: 1.5rem;">${project.icon}</span>
                            <span style="font-size: 0.7rem; color: var(--accent-gold);">$${project.totalCost}B total</span>
                        </div>
                        <div style="font-weight: 600; color: var(--accent-blue); margin-bottom: 0.3rem;">${project.name}</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.8rem;">${project.description}</div>
                        
                        <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.8rem;">
                            ⏱️ ${project.turnsToBuild} days to complete
                        </div>
                        
                        <button class="start-project-btn" data-id="${project.id}"
                            style="width: 100%; padding: 0.6rem; background: linear-gradient(135deg, var(--accent-green), #15803d); border: none; color: white; border-radius: 6px; cursor: pointer; font-weight: 600;">
                            Start Project ($${upfrontCost}B upfront)
                        </button>
                    </div>
                `;
            });
            html += `</div>`;
        }

        // Completed Projects
        if (completedProjects.length > 0) {
            html += `<h3 style="color: var(--accent-gold); margin-top: 1.5rem; margin-bottom: 0.5rem;">🏆 Completed</h3>`;
            html += `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">`;
            completedProjects.forEach(project => {
                html += `
                    <div style="padding: 0.4rem 0.8rem; background: rgba(251, 191, 36, 0.2); border-radius: 4px; font-size: 0.8rem;">
                        ${project.icon} ${project.name}
                    </div>
                `;
            });
            html += `</div>`;
        }

        html += `</div>`;
        this.container.innerHTML = html;

        // Bind events
        this.container.querySelectorAll('.start-project-btn').forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.id;
                if (this.megaprojectSystem.startProject(id, state)) {
                    this.render(); // Re-render
                }
            };
        });

        this.container.querySelectorAll('.cancel-project-btn').forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.id;
                if (confirm('Are you sure you want to cancel this project? You will lose all invested money.')) {
                    if (this.megaprojectSystem.cancelProject(id, state)) {
                        this.render();
                    }
                }
            };
        });
    }
}
