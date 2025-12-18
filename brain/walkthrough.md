# Political Simulator - Walkthrough

## How to Run
1. Open your terminal in the project directory:
   ```bash
   cd /Users/marktremmel/diplomacy
   ```
2. Run a simple Python server:
   ```bash
   python3 -m http.server 8000
   ```
3. Open your browser to: [http://localhost:8000](http://localhost:8000)

## Features & Usage

### 📊 Dashboard Navigation
- **Rich Overview**: Now features granular Breakdown tables for Revenue/Expenses.
- **Geopolitics**: Live relation scores with EU, USA, Russia, and China. **Hover over them** to see what they affect!
- **Trade Impact**: Your relations now directly affect your GDP and Revenue. High EU relations = Trade Bonus.
- **News Feed**: Live event log in the sidebar.

### 📜 Policy Grid
Go to the **"Policies & Budget"** tab to manage your nation's priorities.
- **Sliders**: Adjust spending (0-100%) on **Healthcare, Education, Military, etc.**
- **Real-Time Cost**: As you drag the slider, the annual cost updates instantly.

### 🌅 Visuals
- **Dynamic Sky**: Smoother 2-minute day/night cycle.
- **City Backdrop**: Your custom city silhouette is integrated safely behind the glass UI.
- **Tooltips**: Hover over icons and headers to learn more about game mechanics.
