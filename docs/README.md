# PitchPerfect Team Generator ⚽

A modern, interactive React application for generating balanced soccer team lineups with support for locked player pairs.

## 🌟 Features

- **Player Management**: Add and remove players easily
- **Drag & Drop Pairing**: Create locked pairs by dragging one player onto another
- **Smart Team Generation**: Generates 5 unique team variations while respecting paired players
- **Visual Soccer Field**: Display teams on an interactive soccer field layout
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Modern UI**: Dark tactical board aesthetic with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/amanmadov/team-match.git
cd team-match
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📦 Build

To create a production build:

```bash
npm run build
```

> Note: The build output will be in the `dist` directory.

## 🎮 How to Use

1. **Add Players**: Enter player names in the input field and click "Add"
2. **Create Pairs**: Drag one player onto another to create a locked pair
3. **Generate Teams**: Click "Generate Lineups" to create 5 different team variations
4. **View Results**: Browse through different lineup options using the tabs or arrows
5. **Unpair Players**: Click the X button on any pair to unlock them

## 🛠️ Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Drag & Drop**: @dnd-kit/core
- **State Management**: React Hooks (useState)

## 📁 Project Structure
```
team-match/
├── src/
│   ├── components/
│   │   ├── PlayerInput.jsx      # Player input and pool management
│   │   ├── DndArea.jsx          # Drag-and-drop pairing interface
│   │   └── SoccerField.jsx      # Visual field with team display
│   ├── utils/
│   │   └── teamGenerator.js     # Team generation logic
│   ├── App.jsx                  # Main application component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── docs/
│   └── README.md                # Documentation
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ by Nury Amanmadov
