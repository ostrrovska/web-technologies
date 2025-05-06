// Object to manage the state of the game
const gameState = {
    cards: [], // Array to store card values
    flippedCards: [], // Array to store indices of currently flipped cards
    matchedPairs: 0, // Counter for matched pairs
    totalPairs: 0, // Total number of pairs in the game
    moves: 0, // Counter for number of moves made
    currentPlayer: 0, // Index of the current player
    players: [ 
        {name: 'Player 1', score: 0, moves: [], times: []}, 
        {name: 'Player 2', score: 0, moves: [], times: []}  
    ],
    timer: null,
    timeLeft: 180,
    gameStarted: false,
    currentRound: 1,
    totalRounds: 1,
    canFlip: true
};

// Object to cache DOM elements used throughout the game
const elements = {
    gameBoard: document.getElementById('gameBoard'),
    startBtn: document.getElementById('startBtn'),
    resetBtn: document.getElementById('resetBtn'),
    restartBtn: document.getElementById('restartBtn'),
    statsPanel: document.getElementById('statsPanel'),
    timeLeft: document.getElementById('timeLeft'),
    currentPlayer: document.getElementById('currentPlayer'),
    moves: document.getElementById('moves'),
    currentRound: document.getElementById('currentRound'),
    gameMode: document.getElementById('gameMode'),
    player1: document.getElementById('player1'),
    player2: document.getElementById('player2'),
    player2Group: document.getElementById('player2Group'),
    rows: document.getElementById('rows'),
    cols: document.getElementById('cols'),
    difficulty: document.getElementById('difficulty'),
    rounds: document.getElementById('rounds'),
    resultsModal: document.getElementById('resultsModal'),
    resultsContent: document.getElementById('resultsContent'),
    closeResultsBtn: document.getElementById('closeResultsBtn')
};

// Event listener to handle game mode changes
elements.gameMode.addEventListener('change', handleGameModeChange);
// Event listener to start a new game
elements.startBtn.addEventListener('click', startGame);
// Event listener to reset game settings
elements.resetBtn.addEventListener('click', resetSettings);
// Event listener to restart the ongoing game
elements.restartBtn.addEventListener('click', restartGame);
// Event listener to close the results modal
elements.closeResultsBtn.addEventListener('click', closeResultsModal);


resetSettings();


function handleGameModeChange() {
    if (elements.gameMode.value === 'multi') {
        elements.player2Group.style.display = 'block';
    } else {
        elements.player2Group.style.display = 'none';
    }
}

/**
 * Resets the game settings to their default values.
 * Updates all input elements to reflect the default configuration.
 */
function resetSettings() {
    elements.gameMode.value = 'single';
    elements.player1.value = 'Player 1';
    elements.player2.value = 'Player 2';
    elements.rows.value = '4';
    elements.cols.value = '4';
    elements.difficulty.value = 'easy';
    elements.rounds.value = '1';
    elements.player2Group.style.display = 'none';
}

/**
 * Starts the game by initializing player details and game state.
 * Validates inputs and sets up the initial round.
 */
function startGame() {

    if (!elements.player1.value.trim()) {
        alert('Please enter Player 1 name');
        return;
    }

    if (elements.gameMode.value === 'multi' && !elements.player2.value.trim()) {
        alert('Please enter Player 2 name');
        return;
    }

    // Initialize player names
    gameState.players[0].name = elements.player1.value.trim();
    gameState.players[1].name = elements.player2.value.trim();
    gameState.totalRounds = parseInt(elements.rounds.value); // Set total rounds
    gameState.currentRound = 1; // Reset to first round

    // Reset player scores and stats for new game
    gameState.players.forEach(player => {
        player.score = 0;
        player.moves = [];
        player.times = [];
    });

    // Set game timer based on difficulty
    switch (elements.difficulty.value) {
        case 'easy':
            gameState.timeLeft = 180;
            break;
        case 'normal':
            gameState.timeLeft = 120;
            break;
        case 'hard':
            gameState.timeLeft = 60;
            break;
    }

    // Start the initial round
    startRound();
}

function startRound() {

    gameState.matchedPairs = 0;
    gameState.moves = 0;
    gameState.currentPlayer = 0;
    gameState.flippedCards = [];
    gameState.canFlip = true;


    elements.statsPanel.style.display = 'flex';
    elements.currentRound.textContent = `${gameState.currentRound}/${gameState.totalRounds}`;
    updateStatsDisplay();
    createGameBoard();


    if (gameState.timer) {
        clearInterval(gameState.timer);
    }
    gameState.timer = setInterval(updateTimer, 1000);
    gameState.gameStarted = true;
}

/**
 * Creates the game board by dynamically generating card elements based on the selected rows and columns.
 * Validates the configuration to ensure the total number of cards is even, as required for pairing.
 * Clears any existing board, shuffles card values, and assigns each card a unique front and
 * back structure along with its respective value.
 * Sets up the board layout grid and attaches event listeners to allow cards to be flipped during gameplay.
 */
function createGameBoard() {
    const rows = parseInt(elements.rows.value);
    const cols = parseInt(elements.cols.value);


    if ((rows * cols) % 2 !== 0) {
        alert('The number of cards (rows × columns) must be even for pairs');
        return;
    }

    elements.gameBoard.innerHTML = '';
    elements.gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    gameState.totalPairs = (rows * cols) / 2;

    const cardValues = [];
    for (let i = 1; i <= gameState.totalPairs; i++) {
        cardValues.push(i, i);
    }

    shuffleArray(cardValues);
    gameState.cards = cardValues;

    cardValues.forEach((value, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.value = value;

        const front = document.createElement('div');
        front.className = 'front';

        const back = document.createElement('div');
        back.className = 'back';
        back.style.backgroundImage = `url('img/${value}.png')`;

        card.appendChild(front);
        card.appendChild(back);

        card.addEventListener('click', () => handleCardClick(index));
        elements.gameBoard.appendChild(card);
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Handles card click events during the game.
 * Prevents invalid moves, updates game state, and checks for matches.
 *
 * @param {number} index - The index of the clicked card in the board.
 */
function handleCardClick(index) {
    if (!gameState.gameStarted || !gameState.canFlip) return;

    const card = elements.gameBoard.children[index];

    if (card.classList.contains('matched') || card.classList.contains('flipped') ||
        (gameState.flippedCards.length === 1 && gameState.flippedCards[0] === index)) {
        return;
    }

    card.classList.add('flipped');
    gameState.flippedCards.push(index);

    if (gameState.flippedCards.length === 2) {
        processTurn();
    }
}

/**
 * Processes the current turn upon flipping two cards.
 * Checks for matches, updates scores, and handles game state transitions.
 */
function processTurn() {
    gameState.moves++;
    updateStatsDisplay();

    const [firstIndex, secondIndex] = gameState.flippedCards;
    const card1 = elements.gameBoard.children[firstIndex];
    const card2 = elements.gameBoard.children[secondIndex];

    if (card1.dataset.value === card2.dataset.value) {
        handleMatch(card1, card2);
    } else {
        handleMismatch(card1, card2);
    }
}

/**
 * Handles the logic when two flipped cards match.
 * Updates scores, marks cards as matched, and checks for round completion.
 *
 * @param {HTMLElement} card1 - The first flipped card.
 * @param {HTMLElement} card2 - The second flipped card.
 */
function handleMatch(card1, card2) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    gameState.matchedPairs++;
    gameState.flippedCards = [];

    if (elements.gameMode.value === 'multi') {
        gameState.players[gameState.currentPlayer].score++;
    }

    if (gameState.matchedPairs === gameState.totalPairs) {
        endRound();
    }
}

/**
 * Handles the logic when two flipped cards do not match.
 * Temporarily disables flipping and reverts the cards after a delay.
 *
 * @param {HTMLElement} card1 - The first flipped card.
 * @param {HTMLElement} card2 - The second flipped card.
 */
function handleMismatch(card1, card2) {
    gameState.canFlip = false;
    setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        gameState.flippedCards = [];
        gameState.canFlip = true;

        if (elements.gameMode.value === 'multi') {
            gameState.currentPlayer = 1 - gameState.currentPlayer; // Switch player
            updateStatsDisplay();
        }
    }, 1000);
}

function updateStatsDisplay() {

    const minutes = Math.floor(gameState.timeLeft / 60);
    const seconds = gameState.timeLeft % 60;
    elements.timeLeft.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;


    if (elements.gameMode.value === 'multi') {
        elements.currentPlayer.innerHTML = `<span class="current-player">${gameState.players[gameState.currentPlayer].name}</span>`;
    } else {
        elements.currentPlayer.textContent = gameState.players[0].name;
    }


    elements.moves.textContent = gameState.moves;
}

function updateTimer() {
    gameState.timeLeft--;
    updateStatsDisplay();

    if (gameState.timeLeft <= 0) {
        clearInterval(gameState.timer);
        endRound();
    }
}

function endRound() {
    clearInterval(gameState.timer);
    gameState.gameStarted = false;
    
    const timeUsed = getInitialTime() - gameState.timeLeft;
    const minutes = Math.floor(timeUsed / 60);
    const seconds = timeUsed % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // if (elements.gameMode.value === 'multi') {
    //     gameState.players[0].moves.push(gameState.moves);
    //     gameState.players[0].times.push(timeString);
    //
    //     gameState.players[gameState.currentPlayer].moves.push(gameState.moves);
    //     gameState.players[gameState.currentPlayer].times.push(timeString);
    // } else {
    //
    //     gameState.players[0].moves.push(gameState.moves);
    //     gameState.players[0].times.push(timeString);
    // }
    if (elements.gameMode.value === 'multi') {
        if (!gameState.players[0].moves[gameState.currentRound - 1]) {
            gameState.players[0].moves.push('-');
            gameState.players[0].times.push('-');
        }
        if (!gameState.players[1].moves[gameState.currentRound - 1]) {
            gameState.players[1].moves.push('-');
            gameState.players[1].times.push('-');
        }

        gameState.players[gameState.currentPlayer].moves[gameState.currentRound - 1] = gameState.moves;
        gameState.players[gameState.currentPlayer].times[gameState.currentRound - 1] = timeString;
    }



    if (gameState.currentRound < gameState.totalRounds) {
        gameState.currentRound++;
        setTimeout(startRound, 2000);
    } else {

        setTimeout(showResults, 2000);
    }
}

function getInitialTime() {
    switch (elements.difficulty.value) {
        case 'easy':
            return 180;
        case 'normal':
            return 120;
        case 'hard':
            return 60;
        default:
            return 180;
    }
}

function showResults() {
    elements.resultsContent.innerHTML = '';

    const title = document.createElement('h3');

    if (elements.gameMode.value === 'multi') {

        const player1Score = gameState.players[0].score;
        const player2Score = gameState.players[1].score;

        if (player1Score > player2Score) {
            title.textContent = `Winner: ${gameState.players[0].name}!`;
            title.className = 'winner';
        } else if (player2Score > player1Score) {
            title.textContent = `Winner: ${gameState.players[1].name}!`;
            title.className = 'winner';
        } else {
            title.textContent = "It's a tie!";
        }
    } else {
        title.textContent = "Game Completed!";
    }

    elements.resultsContent.appendChild(title);


    const table = document.createElement('table');
    table.className = 'results-table';


    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const roundHeader = document.createElement('th');
    roundHeader.textContent = 'Round';
    headerRow.appendChild(roundHeader);

    if (elements.gameMode.value === 'multi') {
        const player1Header = document.createElement('th');
        player1Header.textContent = gameState.players[0].name;
        headerRow.appendChild(player1Header);

        const player2Header = document.createElement('th');
        player2Header.textContent = gameState.players[1].name;
        headerRow.appendChild(player2Header);
    } else {
        const movesHeader = document.createElement('th');
        movesHeader.textContent = 'Moves';
        headerRow.appendChild(movesHeader);

        const timeHeader = document.createElement('th');
        timeHeader.textContent = 'Time';
        headerRow.appendChild(timeHeader);
    }

    thead.appendChild(headerRow);
    table.appendChild(thead);


    const tbody = document.createElement('tbody');

    for (let i = 0; i < gameState.totalRounds; i++) {
        const row = document.createElement('tr');

        const roundCell = document.createElement('td');
        roundCell.textContent = i + 1;
        row.appendChild(roundCell);

        if (elements.gameMode.value === 'multi') {
            const player1Cell = document.createElement('td');
            if (gameState.players[0].moves[i] !== undefined) {
                player1Cell.textContent = `${gameState.players[0].moves[i]} moves (${gameState.players[0].times[i]})`;
            } else {
                player1Cell.textContent = '-';
            }
            row.appendChild(player1Cell);

            const player2Cell = document.createElement('td');
            if (gameState.players[1].moves[i] !== undefined) {
                player2Cell.textContent = `${gameState.players[1].moves[i]} moves (${gameState.players[1].times[i]})`;
            } else {
                player2Cell.textContent = '-';
            }
            row.appendChild(player2Cell);
        } else {
            const movesCell = document.createElement('td');
            movesCell.textContent = gameState.players[0].moves[i] || '-';
            row.appendChild(movesCell);

            const timeCell = document.createElement('td');
            timeCell.textContent = gameState.players[0].times[i] || '-';
            row.appendChild(timeCell);
        }

        tbody.appendChild(row);
    }

    table.appendChild(tbody);
    elements.resultsContent.appendChild(table);


    if (elements.gameMode.value === 'multi') {
        const totalsRow = document.createElement('tr');
        totalsRow.style.fontWeight = 'bold';

        const totalsLabel = document.createElement('td');
        totalsLabel.textContent = 'Total';
        totalsRow.appendChild(totalsLabel);

        const player1Total = document.createElement('td');
        player1Total.textContent = gameState.players[0].score;
        totalsRow.appendChild(player1Total);

        const player2Total = document.createElement('td');
        player2Total.textContent = gameState.players[1].score;
        totalsRow.appendChild(player2Total);

        tbody.appendChild(totalsRow);
    }


    elements.resultsModal.style.display = 'flex';
}

function closeResultsModal() {
    elements.resultsModal.style.display = 'none';
}

function restartGame() {
    clearInterval(gameState.timer);
    elements.statsPanel.style.display = 'none';
    elements.gameBoard.innerHTML = '';
    gameState.gameStarted = false;
}