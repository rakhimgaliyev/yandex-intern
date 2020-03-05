const fs = require("fs");

class GameMap {
  // Буфер будет хранилищем промежуточного состояния
  // в момент вычисления нового состояния.
  // Проинициализировать его можно нулями.
  // Главное, чтобы он был одного размера с картой.
  // Такой механизм позволяет не выделять память на каждой иттерации.

  /**
   * @param {boolean[][]} currMapState: boolean[][];
   * @param {boolean[][]} buffMapState: boolean[][];
   */

  /**
   * @param {boolean[][]} initMapState
   */
  constructor(initMapState) {
    this.currMapState = new Array();
    this.buffMapState = new Array();

    initMapState.forEach((element, index) => {
      this.currMapState[index] = element.concat();
      this.buffMapState[index] = element.concat();
    });

    console.log(this.currMapState);
    console.log("\n");
  }

  /**
   * Returns true if alive or exists
   * @param {number} x game map x-coordinate
   * @param {number} y game map y-coordinate
   * @returns {boolean}
   */
  isAlive(x, y) {
    if (typeof this.currMapState[x] === "object")
      if (typeof this.currMapState[x][y] === "boolean")
        if (this.currMapState[x][y] === true) {
          return true;
        }
    return false;
  }

  /**
   * Returns number of living
   * @param {number} x game map x-coordinate
   * @param {number} y game map y-coordinate
   * @returns {number}
   */
  numberOfLiving(x, y) {
    let res = 0;
    if (this.isAlive(x - 1, y - 1) === true) res++;
    if (this.isAlive(x - 1, y) === true) res++;
    if (this.isAlive(x - 1, y + 1) === true) res++;
    if (this.isAlive(x, y - 1) === true) res++;
    if (this.isAlive(x, y + 1) === true) res++;
    if (this.isAlive(x + 1, y - 1) === true) res++;
    if (this.isAlive(x + 1, y) === true) res++;
    if (this.isAlive(x + 1, y + 1) === true) res++;
    return res;
  }

  /**
   * Calculate field state
   * @param {int} x game map x-coordinate
   * @param {int} y game map y-coordinate
   * @returns {boolean}
   */
  calculateField(x, y) {
    let newState = false;
    let numberOfLiving = this.numberOfLiving(x, y);
    if (this.isAlive(x, y)) {
      if (numberOfLiving === 2 && numberOfLiving === 3) {
        newState = true;
      }
    } else {
      if (numberOfLiving === 3) {
        newState = true;
      }
    }
    return newState;
  }

  itterate() {
    this.buffMapState.forEach((line, lineNum) => {
      line.forEach((_, colNum) => {
        this.buffMapState[lineNum][colNum] = this.calculateField(
          lineNum,
          colNum
        );
      });
    });

    let buff = this.buffMapState;
    this.buffMapState = this.currMapState;
    this.currMapState = buff;

    console.log(this.currMapState);
    console.log("\n");
  }
}

function generateRandomMap(m, n) {
  res = new Array();
  for (let i = 0; i < m; i++) {
    res[i] = new Array();
    for (let j = 0; j < n; j++) {
      if (Math.floor(Math.random() * Math.floor(2)) === 0) {
        res[i][j] = false;
      } else {
        res[i][j] = true;
      }
    }
  }
  return res;
}

let initState = [
  [true, false, true, false, false],
  [true, false, true, false, false],
  [true, false, true, false, false],
  [true, false, true, false, false],
  [true, false, true, false, false]
];

let map = new GameMap(initState);
map.itterate();
map.itterate(2);
map.itterate();
