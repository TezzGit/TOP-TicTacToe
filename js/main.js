function createPlayer(name) {
    let playerName = name;
    const setPlayerName = (newName) => playerName = newName;

    let symbol = name;
    const getSymbol = () => symbol;

    return { playerName, getSymbol, setPlayerName };
}

function createScore(name) {
    const playerName = name;
    let gamesWon = 1;
    const incrementScore = () => { gamesWon++ }
    return { playerName, gamesWon, incrementScore };
}

const scoreboard = (function () {
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
    let gameOver = false;
    let player1Won = false;
    let player2Won = false;
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

    const PlayRound = (cellPicked) => {
        if (currentTurn > maxTurns) {
            gameOver = true;
        }

        if (gameOver) {
            alert("Game is Over, Restart Game");
            return;
        }

        if (!emptyCell(cellPicked)) {
            return;
        }

        Cells[cellPicked] = currentPlayer.getSymbol();
        drawBoard();

        player1Won = checkWin('x');
        if (player1Won) console.log("Player 1 Won");
        player2Won = checkWin('o');
        if (player2Won) console.log("Player 2 Won")

        if (player1Won || player2Won) {
            gameOver = true;
        }

        EndTurn();
    }

    const ResetGame = () => {
        gameOver = false;
        currentTurn = 1;
        currentPlayer = player1;
        player1Won = false;
        player2Won = false;
        Cells.fill("");
        drawBoard();
    }

    const RenamePlayerOne = (newName) => player1.setPlayerName(newName);
    const RenamePlayerTwo = (newName) => player2.setPlayerName(newName);

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