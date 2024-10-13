const gameBoard = (function(){
    function createPlayer(name){
        let wins = 0;
        let loses = 0;

        const getName = () => name;
        const addWin = () => win++;
        const addloss = () => loses++;
        const getStatus = () =>{
            return {wins, loses};
        }
        const resetStatus = () =>{
            wins = 0;
            loses = 0;
        }
        return {getName, addWin, addloss, getStatus, resetStatus};
    }

    //default value
    let player1 = createPlayer("player1");
    let player2 = createPlayer("player2");

    //if names are entered mid game the game will reset
    const setNames = (player1Name, player2Name) =>{
        player1 = createPlayer(player1Name);
        console.log(player1.getName());
        player2 = createPlayer(player2Name);
    }


    //i will start will default board size, in the future i will make it into a dependency of the function...
    const board = (function(){
        //the row always need to equal the column to create a square
        const row = 3;
        const column = 3;
        let winPattern = 3;

        // because it start the comparison from 0
        winPattern -= 1;
        let board = [];

        resetBoard = () =>{
            for(let i = 0; i < row; i ++){
                let cell = [];
                board[i] = cell;
                for(let j = 0; j < column; j ++){
                    cell[j] = 0;
                }
            }
        };

        resetBoard();

        placeInCell = (cellRow, cellColumn, player) =>{

            if(cellRow < row && cellColumn < column){
                if(board[cellRow][cellColumn] == 0){
                    board[cellRow][cellColumn] = player.getName();
                    console.table(player.getName() + "placed in " + cellRow + ", " + cellColumn);
                    console.table(board);
                }else{
                    console.log("this cell is already taken by " + board[cellRow][cellColumn]);
                    console.table(board);
                }
        }else{
            console.log("the placement is out of range...");
        }
            checkWin();
        };

        function checkWin(){
            let mainDiagonal = [];
            let counterDiagonal = [];
            let pattern = 0;

            for(let i = 0; i < row; i ++){             
                let name;
                for(let j = 0; j < column - 1; j ++){
                    if(board[i][j] == board[i][j + 1] && board[i][j] != 0){
                        pattern ++;
                        name = board[i][j];
                    }else{
                        pattern = 0;
                    }
                    //store the diagonal into a liner array
                    //main diagonal
                    if(i == j){
                        mainDiagonal.push(board[i][j]);
                    }
                    //counter diagonal
                    if(i + j == row - 1){
                        counterDiagonal.push(board[i][j]);
                    }

                    if(pattern == winPattern){
                        return name
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
            for(let i = 0; i < row - 1; i++){
                if(mainDiagonal[i] == mainDiagonal[i + 1] && mainDiagonal[i] != 0){
                    pattern ++;
                }else{
                    pattern = 0;
                }

                if(counterDiagonal[i] == counterDiagonal[i + 1] && counterDiagonal[i] != 0){
                    counterPattern ++;
                }else{
                    counterPattern = 0;
                }

                if(pattern == winPattern){
                    return mainDiagonal[i];
                }

                if(counterPattern == winPattern){
                    return counterDiagonal[i];
                }
            }

            return false;
        }





        console.table(board);
    

        return {resetBoard, placeInCell, checkWin, board}
    })();
    
    const getPlayer1 = () => player1;
    const getPlayer2 = () => player2;


    return{setNames, board, getPlayer1, getPlayer2};

})();