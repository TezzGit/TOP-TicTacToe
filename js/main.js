function createPlayer(name, symbol) {
    let playerName = name;
    const SetPlayerName = (newName) => playerName = newName;
    const GetPlayerName = () => playerName;

    let playerSymbol = symbol;
    const GetSymbol = () => playerSymbol;

    let won = false;
    const SetWon = (haveWon) => won = haveWon;
    const GetWon = () => won;

    return { GetPlayerName, SetPlayerName, GetSymbol, SetWon, GetWon };
}

function createScore(name) {
    let playerName = name;
    const SetPlayerName = (name) => playerName = name;
    const GetPlayerName = () => playerName;
    let gamesWon = 1;
    const GetGamesWon = () => gamesWon;
    const IncrementScore = () => { gamesWon++ }
    return { SetPlayerName, GetPlayerName, GetGamesWon, IncrementScore };
}

const Scoreboard = (function () {
    const scores = [];
    const AddScore = (name) => {
        if (scores.length === 0) {
            scores.push(createScore(name));
            return;
        }
        const scoreFound = scores.find((element) => element.GetPlayerName() === name); // <---- FIX PROBLEM

        if (scoreFound === undefined) {
            scores.push(createScore(name));
        } else {
            scoreFound.IncrementScore();
        }
    }

    const GetScore = (name) => scores.find((element) => element.GetPlayerName() === name).gamesWon;

    // Sort Descending -> Return Top 3 Scores
    const GetScores = () => {
        if (scores.length < 2) return scores;
        return scores.sort((a, b) => a.GetGamesWon() > b.GetGamesWon() ? -1 : 1).slice(0, 5);
    };

    return { AddScore, GetScore, GetScores };
})()


const Screen = (function () {
    const gameOverScreen = document.querySelector('.game-over-screen');
    const gameOverHeading = document.querySelector('.result-heading');
    const gameOverText = document.querySelector('.result-text')

    const ShowGameOverScreen = (hide) => {
        if (!hide) {
            gameOverScreen.classList.add('hidden');
            return;
        }
        gameOverScreen.classList.remove('hidden');
    }

    const SetGameOverHeading = (newHeading) => gameOverHeading.innerHTML = newHeading;
    const SetGameOverText = (newText) => gameOverText.innerHTML = newText;

    const boardCells = [...document.querySelectorAll('.cell')];
    const SetGameBoardCell = (cellID, symbol) => boardCells[cellID].classList.add(symbol);
    const ClearGameBoardCell = (cellID) => boardCells[cellID].classList = "cell";

    const players = [...document.querySelectorAll('.player-name')];
    const SetPlayerName = (index, name) => {
        if (index >= 0 && index < players.length) players[index].innerHTML = name.toUpperCase();
    }

    const renamePlayerScreen = document.querySelector('.name-change-screen');
    const renamePlayerFrm = document.querySelector('.name-change-form');
    const renamePlayerInput = document.querySelector('.name-field');
    const renameAcceptBtn = document.querySelector('.accept');
    const renameCancelBtn = document.querySelector('.cancel');

    const GetNameAcceptBtn = () => renameAcceptBtn;
    const GetNameCancelBtn = () => renameCancelBtn;

    const ShowRenameScreen = (showScreen = false) => {
        if (!showScreen) {
            renamePlayerScreen.classList.add('hidden');
            return;
        }
        renamePlayerScreen.classList.remove('hidden');
    }

    const SetNameFormOwner = (id) => {
        switch (id) {
            case 0:
                renamePlayerFrm.classList = "name-change-form";
                renamePlayerFrm.classList.add('player1')
                break;
            case 1:
                // belongs to player 2
                renamePlayerFrm.classList = "name-change-form";
                renamePlayerFrm.classList.add('player2');
                break;
            default:
                // out of scope
                console.log('Screen::SetNameFormOwner -> id out of scope');
        }
    }

    const AcceptNameForm = () => {
        if (renamePlayerFrm.classList.contains('player1')) {
            SetPlayerName(0, renamePlayerInput.value)
            Gameboard.RenamePlayer(0, renamePlayerInput.value);
        }
        if (renamePlayerFrm.classList.contains('player2')) {
            SetPlayerName(1, renamePlayerInput.value);
            Gameboard.RenamePlayer(1, renamePlayerInput.value)
        }
        ClearNameForm();
        ShowRenameScreen();
    }

    const CancelNameForm = () => {
        ClearNameForm();
        ShowRenameScreen();
    }

    const ClearNameForm = () => {
        renamePlayerInput.innerHTML = "";
    }

    const renameBtns = document.querySelectorAll('.rename-btn');

    const GetRenameBtn = (id) => {
        if (id >= 0 && id < renameBtns.length) {
            return renameBtns[id];
        }
    }

    const DrawScoreboard = () => {
        const scoresDivs = document.querySelectorAll(".score");
        const scores = Scoreboard.GetScores();
        scores.forEach((element, iterator) => {
            // Name Div
            scoresDivs[iterator].children[0].innerHTML = element.GetPlayerName();
            if (scoresDivs[iterator].children[0].classList.contains("empty")) {
                scoresDivs[iterator].children[0].classList.remove('empty');
            }
            // Games Won Div
            scoresDivs[iterator].children[1].innerHTML = element.GetGamesWon();
        })
    }

    return { ShowGameOverScreen, SetGameOverHeading, SetGameOverText, SetGameBoardCell, ClearGameBoardCell, SetPlayerName, GetNameAcceptBtn, GetNameCancelBtn, SetNameFormOwner, AcceptNameForm, CancelNameForm, ClearNameForm, GetRenameBtn, ShowRenameScreen, DrawScoreboard }
})()



const Gameboard = (function () {
    let currentTurn = 1;

    const player1 = createPlayer('Player 1', 'x');
    const player2 = createPlayer('Player 2', 'o');

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

        combinations.forEach((element) => {
            if (element.every((subElement) => Cells[subElement] === currentSymbol)) {
                winCondition = true;
            }
        })
        return winCondition;
    }

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
        Cells.forEach((cell, iterator) => {
            switch (cell) {
                case "x":
                    Screen.SetGameBoardCell(iterator, 'cross');
                    break;
                case "o":
                    Screen.SetGameBoardCell(iterator, 'circle');
                    break;
                case "":
                    Screen.ClearGameBoardCell(iterator);
                    break;
            }
        })
    }

    const GameOver = (winner = "draw") => {
        Screen.ShowGameOverScreen(true);

        switch (winner) {
            case "Player1":
                Screen.SetGameOverHeading(`${player1.GetPlayerName().toUpperCase()} Wins`);
                Screen.SetGameOverText(`Better Luck Next Time ${player2.GetPlayerName().toUpperCase()}, Do You Want To Play Again?`);
                Scoreboard.AddScore(player1.GetPlayerName());
                break;
            case "Player2":
                Screen.SetGameOverHeading(`${player2.GetPlayerName().toUpperCase()} Wins`);
                Screen.SetGameOverText(`Better Luck Next Time ${player1.GetPlayerName().toUpperCase()}, Do You Want to Play Again?`);
                Scoreboard.AddScore(player2.GetPlayerName());
                break;
            case "draw":
                Screen.SetGameOverHeading("Draw - No Winner");
                Screen.SetGameOverText("Better Luck Next Time, Do You Want To Play Again?");
        }

        Screen.DrawScoreboard();
    }

    const PlayRound = (cellPicked) => {

        if (!emptyCell(cellPicked)) {
            return;
        }

        Cells[cellPicked] = currentPlayer.GetSymbol();

        drawBoard();

        currentPlayer.SetWon(checkWin(currentPlayer.GetSymbol()));
        if (player1.GetWon()) GameOver('Player1');
        if (player2.GetWon()) GameOver('Player2');

        EndTurn();

        if (currentTurn > Cells.length) {
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
        Screen.ShowGameOverScreen(false);
    }

    const RenamePlayer = (index, newName) => {
        switch (index) {
            case 0:
                player1.SetPlayerName(newName);
                Screen.SetPlayerName(0, newName);
                break;
            case 1:
                player2.SetPlayerName(newName);
                Screen.SetPlayerName(1, newName);
        }

    }

    const GetPlayerName = (index) => {
        switch (index) {
            case 0:
                return player1.GetPlayerName();
            case 1:
                return player2.GetPlayerName();
            default:
                console.log("BoardGame::GetPlayerName -> Index Out of Bounds");
        }
    }

    return { PlayRound, ResetGame, RenamePlayer, GetPlayerName }
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

    Screen.SetPlayerName(0, Gameboard.GetPlayerName(0));
    Screen.SetPlayerName(1, Gameboard.GetPlayerName(1));

    Screen.GetNameAcceptBtn().addEventListener('click', () => Screen.AcceptNameForm());
    Screen.GetNameCancelBtn().addEventListener('click', () => Screen.CancelNameForm());

    Screen.GetRenameBtn(0).addEventListener('click', () => {
        Screen.SetNameFormOwner(0);
        Screen.ShowRenameScreen(true);
    })

    Screen.GetRenameBtn(1).addEventListener('click', () => {
        Screen.SetNameFormOwner(1);
        Screen.ShowRenameScreen(true);
    })
})