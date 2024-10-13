const gameBoard = (function () {
  function createPlayer(name) {
    let wins = 0;
    let loses = 0;

    const getName = () => name;
    const addWin = () => wins++;
    const addLoss = () => loses++;
    const getStatus = () => {
      return { wins, loses };
    };
    const resetStatus = () => {
      wins = 0;
      loses = 0;
    };
    return { getName, addWin, addLoss, getStatus, resetStatus };
  }

  let round = 1;
  //to keep track of the draws
  let draw = 0;
  //default value
  let player1 = createPlayer("player1");
  let player2 = createPlayer("player2");

  //if names are entered mid game the game will reset
  const setNames = (player1Name, player2Name) => {
    player1 = createPlayer(player1Name);
    console.log(player1.getName());
    player2 = createPlayer(player2Name);
  };

  //i will start will default board size, in the future i will make it into a dependency of the function...
  const board = (function () {
    //the row always need to equal the column to create a square
    const row = 3;
    const column = 3;
    let winPattern = 3;
    // because it start the comparison from 0
    winPattern -= 1;
    let board = [];

    resetBoard = () => {
      for (let i = 0; i < row; i++) {
        let cell = [];
        board[i] = cell;
        for (let j = 0; j < column; j++) {
          cell[j] = 0;
        }
      }
    };
    resetBoard();

    placeInCell = (cellRow, cellColumn, player) => {
      //the player var accept the name
      if (cellRow < row && cellColumn < column) {
        if (board[cellRow][cellColumn] == 0) {
          board[cellRow][cellColumn] = player;
          console.table(player + " placed in " + cellRow + ", " + cellColumn);
          console.table(board);
        } else {
          console.log(
            "this cell is already taken by " + board[cellRow][cellColumn]
          );
          console.table(board);
        }
      } else {
        console.log("the placement is out of range...");
      }

      const win = checkWin();
      console.log("win: " + win);
      return win;
    };

    function checkWin() {
      let mainDiagonal = [];
      let counterDiagonal = [];
      let pattern = 0;

      let isBoardFull = 0;

      for (let i = 0; i < row; i++) {
        let horizontalPattern = 0;
        let name;
        for (let j = 0; j < column - 1; j++) {
          //checking vertically
          if (board[i][j] == board[i][j + 1] && board[i][j]) {
            pattern++;
          } else {
            pattern = 0;
          }
          //checking horizontally
          if (board[j][i] == board[j + 1][i] && board[j][i]) {
            horizontalPattern++;
          } else {
            horizontalPattern = 0;
          }
          //store the diagonal into a liner array
          //main diagonal
          if (i == j) {
            mainDiagonal.push(board[i][j]);
          }
          //counter diagonal
          if (i + j == row - 1) {
            counterDiagonal.push(board[i][j]);
          }

          if (pattern == winPattern) {
            // vertical
            //returns the name of the winner
            name = board[i][j];
            return name;
          } else if (horizontalPattern == winPattern) {
            name = board[j][i];
            return name;
          }
        }
        //because the of the diagonal comparison its not at the start of the for.
        pattern = 0;
      }

      //because the for goes till column - 1 and not fully.
      mainDiagonal.push(board[row - 1][column - 1]);
      counterDiagonal.push(board[0][column - 1]);

      //check if there is a win in the diagonal lines;
      let counterPattern = 0;
      for (let i = 0; i < row - 1; i++) {
        if (mainDiagonal[i] == mainDiagonal[i + 1] && mainDiagonal[i] != 0) {
          pattern++;
        } else {
          pattern = 0;
        }

        if (
          counterDiagonal[i] == counterDiagonal[i + 1] &&
          counterDiagonal[i] != 0
        ) {
          counterPattern++;
        } else {
          counterPattern = 0;
        }

        if (pattern == winPattern) {
          return mainDiagonal[i];
        }

        if (counterPattern == winPattern) {
          return counterDiagonal[i];
        }
      }

      //if the board is full and there is no left cell its a draw
      //checks if there are empty cell that include 0;
      if (!board.some((row) => row.includes(0))) {
        return "draw";
      }

      return false;
    }
    console.table(board);
    return { resetBoard, placeInCell };
  })();

  //const getPlayer1 = () => player1;
  //const getPlayer2 = () => player2;

  const getStatus = () =>{
    return `round: ${round}, draws: ${draw}
    score:
    ${player1.getName()}, wins: ${player1.getStatus().wins}, loses: ${player1.getStatus().loses}
    ************
    ${player2.getName()}, wins: ${player2.getStatus().wins}, loses: ${player2.getStatus().loses}`;
  };

  const resetGame = () => {
    board.resetBoard();
  };

  const fullReset = () => {
    player1.resetStatus();
    player2.resetStatus();
    resetGame();
    round = 0;
  };

  const placeOnBoard = (row, column, playerName) => {
    //a value check, but i dont think i will need to use it as long as it is 1 vs 1
     if(playerName.toLowerCase() != player1.getName() && playerName.toLowerCase() != player2.getName()){
         return console.log("unknown name..., pls enter a corrent one");
    }
    let winCheck = board.placeInCell(row, column, playerName);
    if (winCheck) {
      if (winCheck == "draw") {
        console.log("its a draw");
        return "draw";
      } else {
        console.log(playerName + "is the winner of the round!!");
        round++;
        resetGame();
        if (player1.getName() == playerName) {
          player1.addWin();
          player2.addLoss();
          //return player1.getName();
        } else {
          player2.addWin();
          player1.addLoss();
          //return player2.getName();
        }

        return "win";
      }
    }
  };
  return {setNames, placeOnBoard, fullReset, resetGame, getStatus};
})();
