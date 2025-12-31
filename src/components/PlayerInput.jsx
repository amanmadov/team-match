import React, { useState } from 'react';
import { UserPlus, X } from 'lucide-react';

export default function PlayerInput({ players, onAddPlayer, onRemovePlayer }) {
	const [inputValue, setInputValue] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		const trimmedName = inputValue.trim();

		if (trimmedName && !players.find(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
			onAddPlayer(trimmedName);
			setInputValue('');
		}
	};

	return (
		<div className="bg-uefa-blue-light/80 backdrop-blur-sm rounded-xl p-7 shadow-2xl border border-uefa-cyan/20">
			<h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-3 uppercase tracking-wide">
				<UserPlus className="w-7 h-7 text-uefa-cyan" />
				Add Players
			</h2>

			<form onSubmit={handleSubmit} className="mb-5">
				<div className="flex gap-3">
					<input
						type="text"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						placeholder="Enter player name..."
						className="flex-1 px-4 py-3 bg-uefa-blue-dark/60 text-white rounded-lg border border-uefa-cyan/30 focus:outline-none focus:ring-2 focus:ring-uefa-cyan focus:border-transparent placeholder-gray-400"
					/>
					<button
						type="submit"
						className="px-8 py-3 bg-uefa-cyan hover:bg-uefa-teal text-uefa-blue-dark font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-uefa-cyan/50 uppercase tracking-wide"
					>
						Add
					</button>
				</div>
			</form>

			<div className="space-y-3">
				<h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
					Player Pool ({players.length})
				</h3>
				<div className="max-h-72 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
					{players.length === 0 ? (
						<p className="text-gray-400 text-sm italic py-6 text-center border border-uefa-cyan/10 rounded-lg">
							No players added yet. Start by adding some players!
						</p>
					) : (
						players.map((player) => (
							<div
								key={player.id}
								className="flex items-center justify-between bg-uefa-blue-dark/60 px-4 py-3 rounded-lg border border-uefa-cyan/20 hover:border-uefa-cyan/50 transition-all hover:shadow-lg"
							>
								<span className="text-white font-semibold">{player.name}</span>
								<button
									onClick={() => onRemovePlayer(player.id)}
									className="text-red-400 hover:text-red-300 transition-colors p-1 hover:bg-red-500/10 rounded"
									aria-label="Remove player"
								>
									<X className="w-5 h-5" />
								</button>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
