/**
 * Team Generation Utility
 * Generates multiple unique team lineup variations while keeping paired players on OPPOSITE teams for balance
 */

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray(array) {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

/**
 * Generates a single team split
 * IMPORTANT: Only uses paired players. Unpaired players are excluded from lineups.
 * Paired players are ALWAYS on opposite teams for balance.
 * @param {Array} pairs - Array of pair objects (each pair has player1 and player2)
 * @returns {Object} - { teamA: [], teamB: [] }
 */
function generateSingleLineup(pairs) {
	const shuffledPairs = shuffleArray(pairs);

	const teamA = [];
	const teamB = [];

	// Distribute pairs - ONE player to Team A, ONE to Team B (OPPOSITE TEAMS for balance)
	shuffledPairs.forEach((pair) => {
		// Randomly decide which player goes to which team
		if (Math.random() < 0.5) {
			teamA.push(pair.player1);
			teamB.push(pair.player2);
		} else {
			teamA.push(pair.player2);
			teamB.push(pair.player1);
		}
	});

	return { teamA, teamB };
}

/**
 * Creates a string signature for a team lineup for uniqueness comparison
 */
function createLineupSignature(lineup) {
	const teamANames = lineup.teamA.map(p => p.name).sort().join(',');
	const teamBNames = lineup.teamB.map(p => p.name).sort().join(',');
	return `${teamANames}|${teamBNames}`;
}

/**
 * Generates multiple unique team variations
 * Only uses paired players - unpaired players are excluded from lineups
 * @param {Array} pairs - Array of pair objects { id, player1, player2 }
 * @param {number} count - Number of variations to generate (default 5)
 * @returns {Array} - Array of lineup objects
 */
export function generateTeamVariations(pairs, count = 5) {
	if (pairs.length === 0) {
		return [];
	}

	const variations = [];
	const signatures = new Set();
	const maxAttempts = count * 10; // Prevent infinite loops
	let attempts = 0;

	while (variations.length < count && attempts < maxAttempts) {
		attempts++;
		const lineup = generateSingleLineup(pairs);
		const signature = createLineupSignature(lineup);

		if (!signatures.has(signature)) {
			signatures.add(signature);
			variations.push(lineup);
		}
	}

	return variations;
}

/**
 * Validates if there are enough players to form teams
 * Only paired players count
 */
export function canGenerateTeams(pairs) {
	const totalPlayers = pairs.length * 2;
	return totalPlayers >= 2;
}
