/**
  * Author: Dorcas Ujiji
  * Date: April 5th 2019
  * Coordinates main logic of game play and animation
  */

/* initilize game */
var grid;

/* monitors whose turn it is to play next */
var computerTurn = false;

/* disk color for the handles color */
var color = "steelblue";

/* monitors the disk-fall animation */
var diskFalling = false;

/* controls whether or not the game is in play */
var gameInPlay = false;

/* delay for animation */
var wait = (ms) => new Promise((r, j)=> setTimeout(r, ms));

/**
 * displays appropriate gif when game is won by either player
 */
function gameWon() {
    gameInPlay = false; // stop game play

    var image;
    (color == "steelblue") ? image = "win.gif": image = "lose.gif";

    document.getElementById("winnerImage").src = image;
    document.getElementById("popUp").style.display = "flex";
    document.getElementById("pageMask").style.display = "block";
    document.getElementById("gameStatus").innerHTML = "";
}

/*
 * animates disk droping down column on grid
 */
async function dropDisk(clicked, thisElem, columnNo) {
    var cellArray = [];
    var column = columnNo;

    if(clicked) { // if function called by player click
        cellArray = thisElem.getElementsByTagName("td");
        column = parseInt(thisElem.id, 10);
    } else { // function called by computer player
        cellArray = document.getElementById(column.toString())
        .getElementsByTagName("td");
    }

    var index = 0;
    if(!diskFalling && gameInPlay) {
        diskFalling = true;
        await loop();
    }

    /**
      * animate drop of disk between two cells in column
      * and checks for game status when animation completes */
    async function loop() {
        var columnCells = grid.cells[column];
        if(index > 0) { // remove disk from cell above
            cellArray[index-1].style.backgroundColor = "#bbb";
            columnCells[index-1].setEmpty();
        }
        if(!columnCells[index].filled) { // move disk into cell
            cellArray[index].style.backgroundColor = color;
            columnCells[index].setFilled(color);
        }
        if((index+1) < 6 && !columnCells[index+1].filled) { // if next cell is empty
            index++;
            await wait(100);
            await loop();
        } else {
            // if game won
            if(grid.checkWin(column, index, color)) {
                gameWon();
            }
            // switch disk color
            (color == "steelblue") ? color = "red": color = "steelblue";

            if(computerTurn) {
                computerTurn = false;
                diskFalling = false;
            } else { // play computer's turn
                computerTurn = true;
                var play = grid.computerPlay();
                diskFalling = false;
                await dropDisk(false, null, play);
            }
        }
    } // end loop()

}

/*
 * adds click event listener to each table (column)
 */
function gameSetup() {
    var elems = ["0", "1", "2", "3", "4", "5", "6"];

    // set onclick attribute for columns of game's grid
    for(elem of elems) {
        document.getElementById(elem).addEventListener('click', function() {
            dropDisk(true, this, null);
        });
    }

    // set onclick attribute for start button
    document.getElementById("start").addEventListener('click', ()=>{
        document.getElementById("gameStatus").innerHTML = "Game in Play. Good luck!";

        // clear grid
        grid = new Grid();
        var disks = document.getElementById("grid").getElementsByClassName("dot");
        for(var disk of disks) {
            disk.style.backgroundColor = "#bbb";
        }

        // set game status to play
        gameInPlay = true;
        color = "steelblue";
        computerTurn = false;
    });

    // click listener for win/lose gif button
    document.getElementById("closePopUp").addEventListener('click', ()=> {
        document.getElementById("popUp").style.display = "none";
        document.getElementById("pageMask").style.display = "none";
    });
}

// set up for game play
gameSetup();
