import React from 'react';
import { Link2, X } from 'lucide-react';

function PlayerButton({ player, onClick, isSelected }) {
	return (
		<button
			onClick={() => onClick(player)}
			className={`px-4 py-3 font-bold rounded-lg transition-all duration-200 shadow-lg ${isSelected
					? 'bg-yellow-400 text-uefa-blue-dark ring-4 ring-yellow-300 scale-105'
					: 'bg-uefa-cyan hover:bg-uefa-teal text-uefa-blue-dark hover:shadow-uefa-cyan/50'
				}`}
		>
			{player.name}
		</button>
	);
}

function PlayerSlot({ slot, player, onRemove }) {
	return (
		<div
			className={`relative flex-1 min-h-[80px] flex items-center justify-center rounded-xl border-3 border-dashed transition-all ${player
					? 'border-uefa-cyan/50 bg-uefa-cyan/10'
					: 'border-uefa-cyan/30 bg-uefa-blue-dark/40'
				}`}
		>
			{player ? (
				<>
					<div className="px-4 py-3 bg-uefa-cyan text-uefa-blue-dark font-bold rounded-lg shadow-lg">
						{player.name}
					</div>
					<button
						onClick={onRemove}
						className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-all hover:scale-110"
						aria-label="Remove player"
					>
						<X className="w-4 h-4" />
					</button>
				</>
			) : (
				<div className="text-center px-4">
					<div className="text-4xl mb-2 opacity-30">👤</div>
					<p className="text-gray-400 text-sm font-semibold">
						Click Player {slot}
					</p>
				</div>
			)}
		</div>
	);
}

function PairDisplay({ pair, onUnpair }) {
	return (
		<div className="bg-uefa-blue-dark/80 rounded-xl p-5 border-2 border-yellow-400/80 relative shadow-xl">
			<button
				onClick={() => onUnpair(pair.id)}
				className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-xl transition-all z-10 hover:scale-110"
				aria-label="Unpair players"
			>
				<X className="w-5 h-5" />
			</button>
			<div className="flex items-center justify-between gap-3">
				<div className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg px-4 py-3 text-center transition-all shadow-lg">
					{pair.player1.name}
				</div>
				<div className="flex flex-col items-center">
					<span className="text-yellow-400 text-sm font-black uppercase tracking-wider">VS</span>
					<div className="w-10 h-1 bg-yellow-400 rounded"></div>
				</div>
				<div className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg px-4 py-3 text-center transition-all shadow-lg">
					{pair.player2.name}
				</div>
			</div>
			<div className="text-center mt-3 text-xs text-gray-300 font-semibold">
				⚖️ Always on opposite teams for balance
			</div>
		</div>
	);
}

export default function DndArea({ availablePlayers, pairs, onCreatePair, onUnpair }) {
	const [pairSlot1, setPairSlot1] = React.useState(null);
	const [pairSlot2, setPairSlot2] = React.useState(null);
	const [selectedPlayer, setSelectedPlayer] = React.useState(null);

	const handlePlayerClick = (player) => {
		// If clicking the same player, deselect
		if (selectedPlayer?.id === player.id) {
			setSelectedPlayer(null);
			return;
		}

		// If no slot filled yet, fill slot 1
		if (!pairSlot1) {
			setPairSlot1(player);
			setSelectedPlayer(null);
			return;
		}

		// If slot 1 filled but not slot 2, fill slot 2
		if (!pairSlot2 && player.id !== pairSlot1.id) {
			setPairSlot2(player);
			setSelectedPlayer(null);
			return;
		}

		// If both slots filled, select for highlighting
		setSelectedPlayer(player);
	};

	const handleCreatePair = () => {
		if (pairSlot1 && pairSlot2 && pairSlot1.id !== pairSlot2.id) {
			onCreatePair(pairSlot1, pairSlot2);
			setPairSlot1(null);
			setPairSlot2(null);
			setSelectedPlayer(null);
		}
	};

	const handleClearSlots = () => {
		setPairSlot1(null);
		setPairSlot2(null);
		setSelectedPlayer(null);
	};

	// Filter out players already in the pairing slots
	const displayPlayers = availablePlayers.filter(p =>
		p.id !== pairSlot1?.id && p.id !== pairSlot2?.id
	);

	const canCreatePair = pairSlot1 && pairSlot2 && pairSlot1.id !== pairSlot2.id;

	return (
		<div className="bg-uefa-blue-light/80 backdrop-blur-sm rounded-xl p-7 shadow-2xl border border-uefa-cyan/20">
			<h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-3 uppercase tracking-wide">
				<Link2 className="w-7 h-7 text-uefa-cyan" />
				Create Balanced Pairs
			</h2>

			<p className="text-gray-300 text-sm mb-5 leading-relaxed">
				Click two players from the pool to create a balanced pair. Paired players will <strong className="text-uefa-cyan">always be on opposite teams</strong>.
			</p>

			{/* Pairing Slots */}
			<div className="mb-6 bg-uefa-blue-dark/60 rounded-xl p-6 border border-uefa-cyan/30">
				<h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 text-center">
					Click Players to Fill Slots
				</h3>

				<div className="flex items-center gap-4 mb-5">
					<PlayerSlot
						slot={1}
						player={pairSlot1}
						onRemove={() => setPairSlot1(null)}
					/>

					<div className="flex flex-col items-center">
						<span className="text-yellow-400 text-lg font-black uppercase">VS</span>
						<div className="w-10 h-1 bg-yellow-400 rounded"></div>
					</div>

					<PlayerSlot
						slot={2}
						player={pairSlot2}
						onRemove={() => setPairSlot2(null)}
					/>
				</div>

				<div className="flex gap-3">
					<button
						onClick={handleCreatePair}
						disabled={!canCreatePair}
						className="flex-1 px-6 py-3 bg-uefa-cyan hover:bg-uefa-teal disabled:bg-gray-600 disabled:cursor-not-allowed text-uefa-blue-dark disabled:text-gray-400 font-bold rounded-lg transition-all shadow-lg uppercase tracking-wide"
					>
						Create Pair
					</button>
					<button
						onClick={handleClearSlots}
						disabled={!pairSlot1 && !pairSlot2}
						className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all shadow-lg"
					>
						Clear
					</button>
				</div>
			</div>

			{/* Available Players Pool */}
			<div className="mb-7">
				<h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">
					Available Players ({displayPlayers.length}) - Click to Select
				</h3>

				{displayPlayers.length === 0 ? (
					<p className="text-gray-400 text-sm italic py-6 text-center border border-uefa-cyan/10 rounded-lg">
						No available players. All players are paired or add more players.
					</p>
				) : (
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
						{displayPlayers.map((player) => (
							<PlayerButton
								key={player.id}
								player={player}
								onClick={handlePlayerClick}
								isSelected={selectedPlayer?.id === player.id}
							/>
						))}
					</div>
				)}
			</div>

			{/* Paired Players */}
			{pairs.length > 0 && (
				<div>
					<h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">
						Balanced Pairs ({pairs.length}) - Always on Opposite Teams
					</h3>
					<div className="grid gap-4">
						{pairs.map((pair) => (
							<PairDisplay key={pair.id} pair={pair} onUnpair={onUnpair} />
						))}
					</div>
				</div>
			)}
		</div>
	);
}
