document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const restartButton = document.getElementById('restartButton');
    const toggleModeButton = document.getElementById('toggleMode');
    const difficultySlider = document.getElementById('difficultySlider');
    const difficultyLabel = document.getElementById('difficultyLabel');
    let cells = [];
    let currentPlayer = 'X';
    let isSinglePlayer = true;

    difficultySlider.oninput = () => {
        const difficulty = difficultySlider.value;
        const difficultyText = ['سهل', 'متوسط', 'صعب'][difficulty - 1];
        difficultyLabel.textContent = difficultyText;
    };

    toggleModeButton.addEventListener('click', () => {
        isSinglePlayer = !isSinglePlayer;
        difficultySlider.disabled = !isSinglePlayer;
        toggleModeButton.textContent = isSinglePlayer ? "لاعبين" : "لاعب واحد";
        resetGame();
    });

    const initializeGame = () => {
        gameBoard.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'game-cell';
            cell.addEventListener('click', () => handleCellClick(i));
            gameBoard.appendChild(cell);
            cells[i] = cell;
        }
        currentPlayer = 'X';
    };
	const gameOverMessage = document.getElementById('gameOverMessage');

function showGameOverMessage(message) {
    gameOverMessage.textContent = message;
    gameOverMessage.style.display = 'block';
}

    const handleCellClick = (index) => {
        if (!cells[index].textContent && (isSinglePlayer && currentPlayer === 'X' || !isSinglePlayer)) {
            cells[index].textContent = currentPlayer;
            if (checkWin(currentPlayer)) {
    showGameOverMessage(`${currentPlayer} wins!`);
    setTimeout(resetGame, 2000); // Delay reset for 2 seconds
} else if (isBoardFull()) {
    showGameOverMessage('Draw!');
    setTimeout(resetGame, 2000); // Delay reset for 2 seconds
}
 else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                if (isSinglePlayer && currentPlayer === 'O') {
                    setTimeout(computerMove, 400);
                }
            }
        }
    };

    // تعريف الوظائف computerMove, findBestMove, minimax, checkWin, isBoardFull كما هو موضح سابقًا
  const computerMove = () => {
        if (difficultySlider.value === '3') {
            let bestMove = findBestMove();
            if (bestMove !== -1) {
                cells[bestMove].textContent = 'O';
            }
        } else {
            let availableCells = cells.filter(cell => !cell.textContent);
            if (availableCells.length > 0) {
                const moveIndex = Math.floor(Math.random() * availableCells.length);
                availableCells[moveIndex].textContent = 'O';
            }
        }

        if (checkWin('O')) {
          showGameOverMessage('O wins!');
         setTimeout(resetGame, 2000);
        } else if (isBoardFull()) {
          showGameOverMessage('Draw!');
            resetGame();
        }
        currentPlayer = 'X';
    };

    const findBestMove = () => {
        let bestScore = -Infinity;
        let bestMove = -1;
        cells.forEach((cell, index) => {
            if (!cell.textContent) {
                cell.textContent = 'O';
                let score = minimax(0, false);
                cell.textContent = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = index;
                }
            }
        });
        return bestMove;
    };

    const minimax = (depth, isMaximizing) => {
        if (checkWin('O')) return 1;
        if (checkWin('X')) return -1;
        if (isBoardFull()) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            cells.forEach((cell, index) => {
                if (!cell.textContent) {
                    cell.textContent = 'O';
                    let score = minimax(depth + 1, false);
                    cell.textContent = '';
                    bestScore = Math.max(score, bestScore);
                }
            });
            return bestScore;
        } else {
            let bestScore = Infinity;
            cells.forEach((cell, index) => {
                if (!cell.textContent) {
                    cell.textContent = 'X';
                    let score = minimax(depth + 1, true);
                    cell.textContent = '';
                    bestScore = Math.min(score, bestScore);
                }
            });
            return bestScore;
        }
    };

    const checkWin = (player) => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6],
        ];
        return winPatterns.some(pattern => {
            return pattern.every(index => cells[index].textContent === player);
        });
    };

    const isBoardFull = () => {
        return cells.every(cell => cell.textContent);
    };

    const resetGame = () => {
        cells.forEach(cell => cell.textContent = ''); // إفراغ كل خلية
        currentPlayer = 'X'; // إعادة تعيين اللاعب الحالي إلى 'X'
        // لا حاجة لاستدعاء computerMove هنا مباشرةً إلا إذا كنت ترغب في تغيير من يبدأ
		gameOverMessage.style.display = 'none';

    };

    restartButton.addEventListener('click', resetGame);

    initializeGame();
});
