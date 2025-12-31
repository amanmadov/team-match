# The Prompt

**Role:** Act as a Senior Frontend Engineer and UX Designer specializing in interactive sports applications.

**Objective:** Build a single-page React application named "PitchPerfect Team Generator." The app will be deployed to GitHub Pages. It allows users to input soccer player names, drag and drop them to create "duos" (locked pairs), and then generates 5 different "Team A vs. Team B" lineup variations displayed on a visual soccer field.

**Tech Stack:**

* **Framework:** React (Vite)
* **Styling:** Tailwind CSS
* **Icons:** Lucide-React
* **Drag & Drop:** `@dnd-kit/core` (or `react-beautiful-dnd` if preferred for simplicity)
* **State Management:** React Context or standard useState

**Core Features & Requirements:**

1. **Player Input Section:**
* A clean input field to add player names one by one.
* A list displaying the "Pool" of available players.
* Ability to remove players.


2. **The "Pairing" Interface (Drag & Drop):**
* Users must be able to drag one player onto another player to form a "Link" or "Duo."
* Visual feedback: When paired, the two names should look connected (e.g., a shared border or icon).
* *Logic:* These pairs MUST stay together on the same team (either both on Team A or both on Team B) during generation.


3. **Generation Logic:**
* A "Generate Lineups" button.
* **Algorithm:**
* Take the pool of singles and the pool of user-defined pairs.
* Shuffle and distribute them to create two balanced teams (Team A and Team B).
* Generate **5 unique distinct variations** (permutations) of these teams.


4. **Visual Results (The Pitch):**
* Display the 5 variations as tabs or a carousel (Option 1, Option 2, etc.).
* **The Component:** Render a "Soccer Field" UI (Green background, center circle, penalty box lines using CSS).
* Place Player names as "tokens" or "jerseys" on the field (half on the left for Team A, half on the right for Team B).


5. **Deployment Prep:**
* Ensure the code is client-side only (no backend).
* Provide a `package.json` configuration suitable for deployment to GitHub Pages (including the `gh-pages` script).


**UI/UX Design Style:**

* **Theme:** Modern, Tactical Board aesthetic. Dark greens, slate grays, and white text.
* **Responsiveness:** Must work on mobile and desktop.

**Deliverables:**
Please provide the full code broken down into:

1. `App.jsx` (Main logic)
2. `components/PlayerInput.jsx`
3. `components/DndArea.jsx` (The matching interface)
4. `components/SoccerField.jsx` (The result visualizer)
5. `utils/teamGenerator.js` (The math/logic for pairings)
6. Instructions on how to install dependencies and deploy to GitHub.

