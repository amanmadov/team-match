import React, { useState } from 'react';
import { Shuffle, Users } from 'lucide-react';
import PlayerInput from './components/PlayerInput';
import DndArea from './components/DndArea';
import SoccerField from './components/SoccerField';
import { generateTeamVariations, canGenerateTeams } from './utils/teamGenerator';

// Initial placeholder data
const initialPlayers = [
	'Serdar T',
	'Serdar A',
	'Dowlet S',
	'Yhlas R',
	'Meylis aga',
	'Hasan',
	'Kuwwat',
	'Shahriyar aga',
	'Dowran',
	'Mekan aga',
	'Dowlet aga',
	'Nowruz',
	'Yagmyr aga',
	'Begench H',
	'Merdan',
	'Maksat aga',
	'Agamyrat aga',
	'Nury aga',
	'Yakup',
	'Muhammetnazar',
	'Hally',
	'Suleyman',
	'Yhlas',
	'Dayanch',
	'Ahmet S',
	'Akmuhammet A',
	'Abray',
	'Mekan DZ'
];

function App() {
	const [players, setPlayers] = useState(
		initialPlayers.map((name, index) => ({
			id: `player-${index + 1}`,
			name
		}))
	);
	const [pairs, setPairs] = useState([]);
	const [variations, setVariations] = useState([]);
	const [nextId, setNextId] = useState(initialPlayers.length + 1);
	const [nextPairId, setNextPairId] = useState(1);

	// Add a player to the pool
	const handleAddPlayer = (name) => {
		setPlayers([...players, { id: `player-${nextId}`, name }]);
		setNextId(nextId + 1);
	};

	// Remove a player from the pool
	const handleRemovePlayer = (playerId) => {
		setPlayers(players.filter(p => p.id !== playerId));
		// Also remove any pairs containing this player
		setPairs(pairs.filter(pair =>
			pair.player1.id !== playerId && pair.player2.id !== playerId
		));
	};

	// Create a pair of players
	const handleCreatePair = (player1, player2) => {
		const newPair = {
			id: `pair-${nextPairId}`,
			player1,
			player2
		};
		setPairs([...pairs, newPair]);
		setNextPairId(nextPairId + 1);
	};

	// Unpair players
	const handleUnpair = (pairId) => {
		setPairs(pairs.filter(p => p.id !== pairId));
	};

	// Get players that are not in any pair (available for pairing)
	const getAvailablePlayers = () => {
		const pairedPlayerIds = new Set();
		pairs.forEach(pair => {
			pairedPlayerIds.add(pair.player1.id);
			pairedPlayerIds.add(pair.player2.id);
		});
		return players.filter(p => !pairedPlayerIds.has(p.id));
	};

	// Generate team lineups
	const handleGenerateLineups = () => {
		if (!canGenerateTeams(pairs)) {
			alert('Please create at least 1 pair to generate teams.');
			return;
		}

		const newVariations = generateTeamVariations(pairs, 5);
		setVariations(newVariations);

		// Scroll to results
		setTimeout(() => {
			document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
		}, 100);
	};

	const availablePlayers = getAvailablePlayers();
	const totalPlayers = players.length;

	return (
		<div className="min-h-screen bg-gradient-to-br from-uefa-blue via-uefa-blue-light to-uefa-blue-dark">
			{/* Header */}
			<header className="bg-uefa-blue-dark border-b-2 border-uefa-cyan shadow-2xl">
				<div className="container mx-auto px-4 py-8">
					<h1 className="text-5xl font-bold text-white flex items-center gap-4 tracking-tight">
						<Users className="w-12 h-12 text-uefa-cyan" />
						PitchPerfect Team Generator
					</h1>
					<p className="text-gray-300 mt-3 text-lg">
						Create balanced soccer teams with skill-based pairing (only paired players in lineups)
					</p>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-10">
				{/* Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
					<div className="bg-uefa-blue-light/80 backdrop-blur-sm rounded-xl p-6 border border-uefa-cyan/20 shadow-xl hover:border-uefa-cyan/40 transition-all">
						<div className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Players</div>
						<div className="text-4xl font-bold text-white mt-2">{totalPlayers}</div>
					</div>
					<div className="bg-uefa-blue-light/80 backdrop-blur-sm rounded-xl p-6 border border-uefa-cyan/20 shadow-xl hover:border-uefa-cyan/40 transition-all">
						<div className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Balanced Pairs</div>
						<div className="text-4xl font-bold text-uefa-cyan mt-2">{pairs.length}</div>
						<div className="text-xs text-gray-400 mt-1">Only paired players in lineups</div>
					</div>
					<div className="bg-uefa-blue-light/80 backdrop-blur-sm rounded-xl p-6 border border-uefa-cyan/20 shadow-xl hover:border-uefa-cyan/40 transition-all">
						<div className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Players in Lineups</div>
						<div className="text-4xl font-bold text-uefa-teal mt-2">{pairs.length * 2}</div>
					</div>
				</div>

				{/* Player Input and Pairing */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
					<PlayerInput
						players={players}
						onAddPlayer={handleAddPlayer}
						onRemovePlayer={handleRemovePlayer}
					/>

					<DndArea
						availablePlayers={availablePlayers}
						pairs={pairs}
						onCreatePair={handleCreatePair}
						onUnpair={handleUnpair}
					/>
				</div>

				{/* Generate Button */}
				<div className="text-center mb-10">
					<button
						onClick={handleGenerateLineups}
						disabled={pairs.length === 0}
						className="px-10 py-5 bg-gradient-to-r from-uefa-cyan to-uefa-teal hover:from-uefa-teal hover:to-uefa-cyan disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold text-xl rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 flex items-center gap-4 mx-auto uppercase tracking-wide"
					>
						<Shuffle className="w-7 h-7" />
						Generate Lineups
					</button>
					{pairs.length === 0 && (
						<p className="text-gray-400 text-sm mt-3">
							Create at least 1 pair to generate lineups
						</p>
					)}
				</div>

				{/* Results */}
				<div id="results">
					<SoccerField variations={variations} />
				</div>
			</main>

			{/* Footer */}
			<footer className="bg-uefa-blue-dark border-t border-uefa-cyan/20 mt-20">
				<div className="container mx-auto px-4 py-8 text-center text-gray-400">
					<p className="text-sm">PitchPerfect Team Generator • Built with React, Tailwind CSS, and @dnd-kit</p>
					<p className="text-xs mt-2 text-gray-500">Inspired by UEFA design</p>
				</div>
			</footer>
		</div>
	);
}

export default App;
