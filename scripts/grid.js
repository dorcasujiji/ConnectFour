/* current depth of minimax algorithm */
depth = 0;

/* maximum depth of minimax algorithm */
maxDepth = 8;

/**
  * Author: Dorcas Ujiji
  * Date: April 5th 2019
  * (simulated) class representation of the game's grid
  */
class Grid{
    constructor() {
        // array of cells in the grid, from left to right column, top to bottom cells
        this.cells = [
            [new Cell(0,0), new Cell(0,1), new Cell(0,2), new Cell(0,3), new Cell(0,4), new Cell(0,5)],
            [new Cell(1,0), new Cell(1,1), new Cell(1,2), new Cell(1,3), new Cell(1,4), new Cell(1,5)],
            [new Cell(2,0), new Cell(2,1), new Cell(2,2), new Cell(2,3), new Cell(2,4), new Cell(2,5)],
            [new Cell(3,0), new Cell(3,1), new Cell(3,2), new Cell(3,3), new Cell(3,4), new Cell(3,5)],
            [new Cell(4,0), new Cell(4,1), new Cell(4,2), new Cell(4,3), new Cell(4,4), new Cell(4,5)],
            [new Cell(5,0), new Cell(5,1), new Cell(5,2), new Cell(5,3), new Cell(5,4), new Cell(5,5)],
            [new Cell(6,0), new Cell(6,1), new Cell(6,2), new Cell(6,3), new Cell(6,4), new Cell(6,5)]
        ];
    }


    /**
      * calls computer turn
      */
    computerPlay() {
        var play = this.red();
        return play.move;
    }


    /**
      * max function of minmax algorithm
      */
    red() {
        depth++;

        var max = {}; var current = {};
        var columnNo = 0;
        for(var column of this.cells) {
            var index;
            for(index = 5; index >= 0; index--) { // from bottom cell
                if(!column[index].filled) {
                    break;
                }
            }
            // if column not full
            if(index >= 0) {
                if(depth > maxDepth) {
                    depth--;
                    return {move: columnNo, value: +2};;
                }

                // play red disk
                column[index].setFilled("red");

                // check if game is won
                if(grid.checkWin(columnNo, index, "red")) {
                    max = {move: columnNo, value:1};
                    column[index].setEmpty();
                    break;
                } else if(this.isFull()) { // if grid is full
                    max = {move: columnNo, value:0};
                } else if(max.value != 1){ // if maximum possible value reached
                    current = this.blue();
                    if (!max.move || current.value > max.value) {
                        max.value = current.value;
                        max.move = columnNo;
                    }
                }// reset the play in column
                column[index].setEmpty();
            }
            columnNo++;
        }
        depth--;
        return max;
    }

    /**
      * min function of minmax algorithm
      */
    blue() {
        depth++;

        var min = {}; var current = {};
        var columnNo = 0;
        for(var column of this.cells) {
            var index;
            for(index = 5; index >= 0; index--) { // from bottom cell
                if(!column[index].filled) {
                    break;
                }
            }
            // if column is not full
            if(index >= 0) {
                if(depth > maxDepth) {
                    depth--;
                    return {move: columnNo, value: +2};;
                }
                column[index].setFilled("steelblue"); // play blue disk

                // if game won
                if(grid.checkWin(columnNo, index, "steelblue")) {
                    min = {move: columnNo, value: -1};
                    column[index].setEmpty();
                    break;
                } else if(this.isFull()) { // if grid is full
                    min = {move:columnNo, value:0};
                } else if(min.value != -1){ // if reached minimum possible value
                    current = this.red();
                    if (!min.move || current.value < min.value) {
                        min.value = current.value;
                        min.move = columnNo;
                    }
                }
                // reset the play in column
                column[index].setEmpty();
            }
            // increase column count
            columnNo++;
        }
        depth--;
        return min;
    }


    /**
      * checks if last disk played connects four and wins game
      * @param x: column,
      * @param y: row (from top)
      * @param color: color of last disk played
      */
    checkWin(x, y, color) {
        var vert = this.checkVert(x, y, color);
        var hor = this.checkHor(x, y, color);
        var negDiag = this.checkNegDiag(x, y, color);
        var posDiag = this.checkPosDiag(x, y, color);
        if(vert || hor || negDiag || posDiag) {
            return true;
        }
        return false;
    }

    /**
      * checks if the last disk connect four vertically
      */
    checkVert(x, y, color) {
        if(y > 2) { // not enough disks below to win
            return false;
        }
        var i = 1;
        while(i < 4) {
            if(this.cells[x][y+i].color == color) {
                i++;
            } else {
                return false;
            }
        }
        return true;
    }

    /**
      * checks if last disk connects four horizontally
      */
    checkHor(x, y, color) {
        var count = 1;
        // count in right-direction from last disk
        while(count < 4) {
            var next = this.cells[x+count];
            if(next == null || next[y].color != color) {
                break;
            }
            count++;
        }
        //connect four in right-dir
        if(count == 4) {
            return true;
        }
        else { // count in left-direction from last disk
            var newCount = 1;
            while(count < 4) {
                if(this.cells[x-newCount] == null
                    || this.cells[x-newCount][y].color != color) {
                    break;
                }
                newCount++;
                count++;
            }
        }

        // if-connect four in left-dir(or both)
        if(count == 4) {
            return true;
        }

        return false;
    }

    /**
      * checks negative slope diagonal
      */
    checkNegDiag(x, y, color) {
        var count = 1;
        // count in upward-left direction from last disk
        while(count < 4) {
            var temp = this.cells[x-count];
            if(temp == null || temp[y-count] == null || temp[y-count].color != color) {
                break;
            }
            count++;
        }
        // if already counted four
        if(count == 4) {
            return true;
        } else { // count in downward-right direction
            var newCount = 1;
            while(count < 4) {

                if(this.cells[x+newCount] == null
                    || this.cells[x+newCount][y+newCount] == null
                    || this.cells[x+newCount][y+newCount].color != color) {
                    break;
                }
                newCount++;
                count++;
            }
        }
        // if four disk counted total
        if(count == 4) {
            return true;
        }
        return false;
    }


    /**
      * checks positive slope diagonal
      */
    checkPosDiag(x, y, color) {
        var count = 1;
        // count in upward-right direction from last disk
        while(count < 4) {
            var temp = this.cells[x+count];
            if(temp == null || temp[y-count] == null || temp[y-count].color != color) {
                break;
            }
            count++;
        }
        // if four counted
        if(count == 4) {
            return true;
        } else { // count in downward-left direction
            var newCount = 1;
            while(count < 4) {

                if(this.cells[x-newCount] == null
                    || this.cells[x-newCount][y+newCount] == null
                    || this.cells[x-newCount][y+newCount].color != color) {
                    break;
                }
                newCount++;
                count++;
            }
        }
        // if four counted total
        if(count == 4) {
            return true;
        }
        return false;
    }

    /**
      * checks if grid is full */
    isFull() {
        for(var column of this.cells) {
            if(!column[0].filled) {
                return false;
            }
        }
        return true;
    }
}
