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
    if (typeof initMapState !== "object") {
      return;
    }

    this.currMapState = new Array();
    this.buffMapState = new Array();

    initMapState.forEach((element, index) => {
      if (typeof element === "object") {
        this.currMapState[index] = element.concat();
        this.buffMapState[index] = element.concat();
      }
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

  run() {
    if (
      typeof this.currMapState !== "object" ||
      this.currMapState.length === 0
    ) {
      return;
    }
    setInterval(this.itterate.bind(this), 1 * 1000);
  }
}

/**
 * @param {number} m lines num, if not valid/undefinde, default=3
 * @param {number} n cols num, if not valid/undefinde, default=3
 * @returns {boolean[][]}
 */
function generateRandomMap(m, n) {
  if (typeof m !== "number" || m <= 0) m = 3;
  if (typeof n !== "number" || n <= 0) n = 3;

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

/**
 *
 * @param {string} filePath
 * @returns {boolean[][]}
 */
function readMapFromFile(filePath) {
  let result = new Array();
  let strFromFile = null;

  try {
    strFromFile = fs.readFileSync(filePath, "utf8");
  } catch (error) {
    console.error("Can't read file: ", error);
    return;
  }

  let lines = strFromFile.split("\n");

  lines.forEach((line, lineNum) => {
    let colNum = 0;
    result[lineNum] = new Array();
    line.split(" ").forEach(char => {
      if (char === "0") {
        result[lineNum][colNum] = false;
        colNum++;
      } else if (char === "1") {
        result[lineNum][colNum] = true;
        colNum++;
      }
    });
  });

  return result;
}

/**
 * @returns {string} path to map file or null, if it is wrong or empty
 */
function getPathFromSysArgv() {
  let result = null;
  process.argv.forEach(element => {
    if (element.slice(0, 5) === "path=") {
      result = element.slice(5);
    }
  });
  return result;
}

let path = getPathFromSysArgv();
if (path === null) {
  let map = new GameMap(generateRandomMap());
  map.run();
} else {
  let map = new GameMap(readMapFromFile(path));
  map.run();
}
