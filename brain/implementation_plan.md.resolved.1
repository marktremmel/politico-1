# Political Simulator Implementation Plan

## Goal Description
Create a deep, responsive country leader simulator that allows the player to manage a nation through Political Capital, Faction balancing, Economic management, and Geopolitical maneuvering. The game will focus on "dilemmas", emergent storytelling, and deep consequences.

## User Review Required
> [!IMPORTANT]
> **Decision: Technology Stack**
> You asked for a comparison. Please choose one of the following approaches:
>
> **Option A: Modern Vanilla JS (Recommended for Education)**
> - **Pros**: Zero build tools needed. Students can "View Source" and understand it immediately. Excellent performance.
> - **Cons**: UI code is more verbose. "Reactivity" (updating the screen when numbers change) must be written manually.
> - **Educational Value**: High. Shows exactly how web browsers work without "magic".
>
> **Option B: React or Vue (Recommended for Rapid UI Dev)**
> - **Pros**: Handling complex UIs (nested tooltips, dynamic lists) is much faster. State management is built-in.
> - **Cons**: Requires a "build step" (bundling). The final code is minified/unreadable to students unless they have the source project.
> - **Educational Value**: Medium. Teaches modern industry standards, but hides the "how".
>
> *Reflecting your desire for "Modern UI" and "Interactivity", I can achieve premium aesthetics with EITHER. The complex animations and glassmorphism are CSS-based, which works in both.*

## Proposed Changes

### Core Architecture
We will use a modular architecture (ES6 Modules) to keep logic separate from UI. This applies regardless of the Tech Stack choice.

#### [NEW] [js/core/GameEngine.js](file:///Users/marktremmel/diplomacy/js/core/GameEngine.js)
- Manages the game loop.
- **Save/Load System**: Implements `exportState()` to JSON and `importState()` from JSON for file sharing.

#### [NEW] [js/core/ScenarioLoader.js](file:///Users/marktremmel/diplomacy/js/core/ScenarioLoader.js)
- Loads starting data for specific countries (e.g., "Poland 2025", "Hungary 2025").
- **Data**: Includes GDP, Debt, Population, starting Faction support.
- **Customization**: Allows player to overwrite Leader Name, Party Name, and Party Symbol/Color.

### Systems Implementation

#### [NEW] [js/systems/PoliticsSystem.js](file:///Users/marktremmel/diplomacy/js/systems/PoliticsSystem.js)
- **Political Capital**: Calculating authority flow.
- **Cabinet Generator**:
    - Includes a `NameGenerator` with localized name lists (e.g., Hungarian, Czech, Polish names).
    - Randomizes attributes: `Competence` (0-10), `Loyalty` (0-10), `Corruption` (0-10).

#### [NEW] [js/systems/GeopoliticsSystem.js](file:///Users/marktremmel/diplomacy/js/systems/GeopoliticsSystem.js)
- **Superpowers**: USA, EU, Russia, China.
- **Regional Powers**: India, Turkey, Saudi Arabia, Japan, Vietnam.
- **Mechanics**: "Alignment Meter" (-100 to +100). High alignment grants perks (Trade Deals), low alignment brings threats (Sanctions).

### UI/UX (Approach depends on Tech Stack choice)
*Targeting "Premium" feel: Glassmorphism, smooth transitions, rich data visualization.*

#### [NEW] [js/ui/Dashboard.js](file:///Users/marktremmel/diplomacy/js/ui/Dashboard.js)
- **Visual Feedback**: Dynamic background (smoke for riots, construction cranes for growth).
- **Nested Tooltips**: Hovering `GDP` shows `C + I + G + (X-M)` breakdown.

## Verification Plan

### Automated Tests
- [ ] Verify `Save/Load` creates valid JSON independent of device.
- [ ] Verify `ScenarioLoader` correctly sets initial values for different countries.
- [ ] Verify `CabinetGenerator` produces unique ministers.

### Manual Verification
- **Scenario Check**: Start a game as "Czechia" -> Check if GDP/Debt matches real data (approx).
- **Customization**: Verify Leader Name/Party Symbol appear in the UI.
- **Save Sharing**: Export a save, clear cache, import it back.
