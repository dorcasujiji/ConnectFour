/**
  * Author: Dorcas Ujiji
  * Date: April 5th 2019
  * (Simulated) Class representation of cells in the game's grid
  */
class Cell{
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.filled = false;
        this.color = null;
    }

    /**
      * resets the state of cell to empty after it was filled */
    setEmpty() {
        this.filled = false;
        this.color = null;
    }

    /**
      * sets the color (of the disk in the) cell and its state when filled */
    setFilled(color) {
        this.filled = true;
        this.color = color;
    }
}
