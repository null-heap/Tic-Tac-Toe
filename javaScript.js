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
  let playerTurn = 0;
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
    resetGame();
  };

  const getPlayerNameByTurn = () => {
    if (playerTurn) {
      return player2.getName();
    } else {
      return player1.getName();
    }
  };

  const getPlayerSignByTurn = () => {
    if (!playerTurn) {
      return "O";
    } else {
      return "X";
    }
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

    //places current playing player name in cell, and returns his play sign if its "X" or "O",
    //if a player wins, returns his name if its a draw, returns "draw"
    placeInCell = (cellRow, cellColumn) => {
      let player = getPlayerNameByTurn();

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
          return "taken";
        }
      } else {
        //light validation...
        console.log("the placement is out of range...");
      }

      const win = checkWin();
      console.log("win: " + win);

      //switch turns before the return statements
      playerTurn = !playerTurn;
      // if there is a winner or a draw return the winner name or "draw"
      if (win) {
        return win;
      } else {
        //if false it was player1 turn and if true its player2 turn
        return getPlayerSignByTurn();
      }
    };

    //if there is a win pattern return the winner name, if the board is full- return "draw"
    function checkWin() {
      let mainDiagonal = [];
      let counterDiagonal = [];
      let pattern = 0;

      //not used for now...
      //let isBoardFull = 0;

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

  const getRound = () => round;
  const getStatus = () => {
    return `It's ${getPlayerNameByTurn()} Turn!!
    round: ${round}    draws: ${draw}

    score:
    ${player1.getName()}, wins: ${player1.getStatus().wins}, loses: ${
      player1.getStatus().loses
    }
    ---------------------------
    ${player2.getName()}, wins: ${player2.getStatus().wins}, loses: ${
      player2.getStatus().loses
    }`;
  };

  const resetGame = () => {
    board.resetBoard();

    //reset the turn count back to 0/ for player 1
    playerTurn = 0;
  };

  const fullReset = () => {
    player1.resetStatus();
    player2.resetStatus();
    resetGame();
    round = 0;
  };

  const placeOnBoard = (row, column) => {
    //a value check, but i dont think i will need to use it as long as it is 1 vs 1
    //if(playerName.toLowerCase() != player1.getName() && playerName.toLowerCase() != player2.getName()){
    //  return console.log("unknown name..., pls enter a corrent one");
    //}
    let winCheck = board.placeInCell(row, column);

    if (winCheck == "X" || winCheck == "O") {
      return winCheck;
    }

    if (winCheck == "taken") {
      return "taken";
    }

    if (winCheck) {
      round++;
      //not a must can make it manually, but for now i will use it for the logic.
      //can be done 
      //by the DOM function, wastefull the repeat it
      //using it will reset the turn in the last turn...
      //resetGame();
      if (winCheck == "draw") {
        console.log("its a draw");
        return "draw";
      }

      if (player1.getName() == winCheck) {
        player1.addWin();
        player2.addLoss();
        //return player1.getName();
      } else {
        player2.addWin();
        player1.addLoss();
        //return player2.getName();
      }

      return winCheck;
    }
  };
  return {
    setNames,
    placeOnBoard,
    fullReset,
    resetGame,
    getStatus,
    getRound,
    getPlayerNameByTurn,
    getPlayerSignByTurn,
  };
})();

let player1 = "ppp";
let player2 = "hhh";

//made it dependent on size var for future expansion
const boardToDom = (function (size) {
  //the first child because the squares are contained inside a div for styling
  const domBoard = document.querySelector("#gameBoard").firstElementChild;

  //to automaticly reset the board after a click if the game is draw or won

  let endRound = 0;

  const resetDomBoard = () => {
    domBoard.textContent = "";
    for (let i = 0; i < size; i++) {
      //give every div on the created board a id of a cell in two dimensional array
      for (let j = 0; j < size; j++) {
        let id = i + "," + j;
        let div = document.createElement("div");
        div.setAttribute("id", id);

        let divSpan = document.createElement("span");
        divSpan.textContent = " ";
        div.appendChild(divSpan);
        domBoard.appendChild(div);
      }
    }
  };
  resetDomBoard();

  const statusToDom = (stats) => {
    const statusDiv = document.getElementById('statusDiv');
    statusDiv.innerText = stats;
  };

  const playOnBoard = () => {
    domBoard.addEventListener("click", (e) => {
      let target = e.target;

      //in case span is pressed
      if (target.tagName.toLowerCase() == "span") {
        target = target.parentElement;
      }

      let id = target.id;
      if (endRound == 1) {
        resetDomBoard();
        endRound = 0;
        //because the target is empty after the reset so the first play after the next round wont show at dom
        //this will fix it.
        target = document.getElementById(id);

        //reset the logic without reset to the players stats
        gameBoard.resetGame();
      }
      //to lower case because some browsers return in upper case...
      
      console.log("target = " + target.id);
      id = target.id.split(",");

      let sign = gameBoard.placeOnBoard(id[0], id[1]);

      console.log(sign);

      target = target.firstElementChild;

      
      target.textContent = gameBoard.getPlayerSignByTurn();

      if (sign == "taken") {
        endRound = 1;
        statusToDom("choose a different cell, this one is already taken...");
      } else if (sign == "draw") {
        endRound = 1;
        statusToDom("It's a DRAW!!");
      } else if(sign != "X" && sign != "O") { // could also compared to gameBoard.getPlayerNameByTurn()
        endRound = 1;
        statusToDom("The winner is: " + sign);
      }else{
        statusToDom(gameBoard.getStatus());
      }
    });
  };

  return {playOnBoard};
})(3);

//will change it to input form user

//adds the click even listener to the board
boardToDom.playOnBoard();
