function createPlayer(name) {
    let playerName = name;
    const SetPlayerName = (newName) => playerName = newName;
    const GetPlayerName = () => playerName;

    let symbol = name;
    const GetSymbol = () => symbol;

    let won = false;
    const SetWon = (haveWon) => won = haveWon;
    const GetWon = () => won;

    return { GetPlayerName, SetPlayerName, GetSymbol, SetWon, GetWon };
}

function createScore(name) {
    const playerName = name;
    let gamesWon = 1;
    const incrementScore = () => { gamesWon++ }
    return { playerName, gamesWon, incrementScore };
}

const Soreboard = (function () {
    const scores = [];
    const AddScore = (name) => {
        const findPlayerIndex = scores.findIndex(name);
        if (findPlayer === -1) {
            scores.push(createScore(name));
        } else {
            scores[findPlayerIndex].incrementScore();
        }
    }
    const GetScore = (name) => scores.find(name).gamesWon;
    return { AddScore, GetScore };
})()

const Gameboard = (function () {
    const gameOverScreen = document.querySelector('.game-over-screen');
    const maxTurns = 9;
    let currentTurn = 1;

    const player1 = createPlayer('x');
    const player2 = createPlayer('o');

    let currentPlayer = player1;

    const Cells = Array(9).fill("");

    const checkWin = (currentSymbol) => {
        const combinations =
            [[0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 4, 8],
            [6, 4, 2],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8]]

        let winCondition = false;
        // theoretically... for each sub array -> return true if all subarray elements in reference to Cells i.e. Cells[SubArrayElement] Equals Current Symbol
        combinations.forEach((element) => {
            if (element.every((subElement) => Cells[subElement] === currentSymbol)) {
                winCondition = true;
            }
        })
        return winCondition;
    }

    const GetCurrentPlayer = () => currentPlayer;

    const EndTurn = () => {
        if (currentPlayer === player1) {
            currentPlayer = player2;
        } else {
            currentPlayer = player1;
        }
        currentTurn++
    }

    const emptyCell = (cell) => {
        if (Cells[cell] === "") {
            return true;
        }
        return false;
    }

    const drawBoard = () => {
        const boardCells = [...document.querySelectorAll('.cell')];

        Cells.forEach((cell, iterator) => {
            switch (cell) {
                case "x":
                    boardCells[iterator].classList.add('cross');
                    break;
                case "o":
                    boardCells[iterator].classList.add('circle');
                    break;
                case "":
                    boardCells[iterator].classList.remove('cross');
                    boardCells[iterator].classList.remove('circle');
                    break;
            }
        })
    }

    const GetRound = () => currentTurn;

    const GameOver = (winner = "draw") => {
        // Get Game Over Heading, text, and screen
        const gameOverHeading = document.querySelector('.result-heading');
        const gameOverText = document.querySelector('.result-text')

        gameOverScreen.classList.remove('hidden')

        switch (winner) {
            case "Player1":
                gameOverHeading.innerHTML = `${player1.GetPlayerName().toUpperCase()} Wins`;
                gameOverText.innerHTML = `Better Luck Next Time ${player2.GetPlayerName().toUpperCase()}, Do You Want To Play Again?`
                break;
            case "Player2":
                gameOverHeading.innerHTML = `${player2.GetPlayerName().toUpperCase()} Wins`
                gameOverText.innerHTML = `Better Luck Next Time ${player1.GetPlayerName().toUpperCase()}, Do You Want to Play Again?`
                break;
            case "draw":
                gameOverHeading.innerHTML = "Draw - No Winner";
                gameOverText.innerHTML = "Better Luck Next Time, Do You Want To Play Again?"
        }
    }

    const PlayRound = (cellPicked) => {

        if (!emptyCell(cellPicked)) {
            return;
        }

        Cells[cellPicked] = currentPlayer.GetSymbol();

        drawBoard();

        player1.SetWon(checkWin('x'));
        if (player1.GetWon()) GameOver('Player1');
        player2.SetWon(checkWin('o'));
        if (player2.GetWon()) GameOver('Player2');

        EndTurn();

        if (currentTurn > maxTurns) {
            GameOver();
        }
    }

    const ResetGame = () => {
        currentTurn = 1;
        currentPlayer = player1;
        player1.SetWon(false);
        player2.SetWon(false);
        Cells.fill("");
        drawBoard();
        gameOverScreen.classList.add('hidden');
    }

    const RenamePlayerOne = (newName) => player1.SetPlayerName(newName);
    const RenamePlayerTwo = (newName) => player2.SetPlayerName(newName);

    return { GetCurrentPlayer, PlayRound, ResetGame, GetRound, RenamePlayerOne, RenamePlayerTwo }
})()



addEventListener('load', () => {
    const gridCells = [...document.querySelectorAll('.cell')]

    gridCells.forEach((gameCell, iterator) => {
        gameCell.addEventListener("click", () => {
            Gameboard.PlayRound(iterator);
        })
    })

    const newGameBtns = [...document.getElementsByClassName('new-game-btn')];

    newGameBtns.forEach((element) => {
        element.addEventListener("click", () => Gameboard.ResetGame());
    })
})


//document.getElementsByClassName('rename-btn')[0].addEventListener("click", () => Gameboard.RenamePlayerOne());
//document.getElementsByClassName('rename-btn')[1].addEventListener("click", () => Gameboard.RenamePlayerTwo());