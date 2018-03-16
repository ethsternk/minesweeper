const container = document.getElementById("board");
let cells = document.getElementsByClassName("cell");
let boardArray = [];
let flagCount = 15;
let timer = 0;
let gameBegun = false;

var board = {
    width: 10,
    height: 10,
    mines: 15,

    buildArray: function () {
        let possibleCells = [];
        for (let i = 0; i < this.width * this.height; i++) {
            if (i < (this.width * this.height) - this.mines) {
                possibleCells.push(" ");
            } else {
                possibleCells.push("M");
            }
        }
        for (let rowIndex = 0; rowIndex < (this.height + 2); rowIndex++) {
            boardArray.push([]);
            for (let colIndex = 0; colIndex < (this.width + 2); colIndex++) {
                if (rowIndex >= 1 && rowIndex < this.height + 1 && colIndex >= 1 && colIndex < this.width + 1) {
                    boardArray[rowIndex].push(possibleCells.splice(Math.floor(Math.random() * possibleCells.length), 1)[0]);
                } else {
                    boardArray[rowIndex][colIndex] = "-";
                }
            }
        }
    },

    insertNumbersIntoArray: function () {
        for (let i = 1; i < this.height + 1; i++) {
            for (let y = 1; y < this.width + 1; y++) {
                if (boardArray[i][y] === " ") {
                    let surroundingMines = 0;
                    if (boardArray[i - 1][y - 1] === "M") {
                        surroundingMines++
                    };
                    if (boardArray[i - 1][y] === "M") {
                        surroundingMines++
                    };
                    if (boardArray[i - 1][y + 1] === "M") {
                        surroundingMines++
                    };
                    if (boardArray[i][y - 1] === "M") {
                        surroundingMines++
                    };
                    if (boardArray[i][y + 1] === "M") {
                        surroundingMines++
                    };
                    if (boardArray[i + 1][y - 1] === "M") {
                        surroundingMines++
                    };
                    if (boardArray[i + 1][y] === "M") {
                        surroundingMines++
                    };
                    if (boardArray[i + 1][y + 1] === "M") {
                        surroundingMines++
                    };
                    boardArray[i][y] = surroundingMines;
                }
            }
        }
    },

    drawHtml: function () {
        for (let i = 1; i < this.height + 1; i++) {
            const row = document.createElement("div");
            row.className = "row";
            container.appendChild(row);
            for (let y = 1; y < this.width + 1; y++) {
                const cell = document.createElement("div");
                if (boardArray[i][y] === "M") {
                    cell.className = "cell mine closed";
                } else {
                    cell.className = "cell closed m" + boardArray[i][y];
                }
                cell.id = i + "-" + y;
                cell.addEventListener("click", this.handleLeftClick);
                cell.addEventListener("contextmenu", this.handleRightClick, false);
                row.appendChild(cell);
            }
        }
        flagCount = board.mines;
        timer = 0;
        document.getElementById("timer").innerHTML = timer;
        document.getElementById("flagCount").innerHTML = flagCount
    },

    handleLeftClick: function (event) {
        gameBegun = true;
        let target = event.target;
        cells = document.getElementsByClassName("cell");
        if (target.classList.contains("closed")) {
            target.classList.remove("closed");
            if (target.classList.contains("m0")) {
                let pos = target.id.split("-");

                function posChange(down, right) {
                    return (Number(pos[0]) + down) + "-" + (Number(pos[1]) + right);
                }
                if (pos[0] < board.height) {
                    document.getElementById(posChange(1, 0)).click();
                }
                if (pos[0] > 1) {
                    document.getElementById(posChange(-1, 0)).click();
                }
                if (pos[1] < board.width) {
                    document.getElementById(posChange(0, 1)).click();
                }
                if (pos[1] > 1) {
                    document.getElementById(posChange(0, -1)).click();
                }
            }
        }
        cells = document.getElementsByClassName("cell");
        if (target.classList.contains("mine")) {
            target.classList.add("dead");
            for (let i = 0; i < cells.length; i++) {
                cells[i].classList.remove("closed");
            }
            gameBegun = false;
            // setTimeout(function () {
            //     alert("You lose!");
            // }, 50);
        } else {
            let minesRemaining = 0;
            let safeRemaining = 0;
            for (let i = 0; i < cells.length; i++) {
                if (cells[i].classList.contains("mine") && cells[i].classList.contains("closed") && cells[i].classList.contains("flag") === false) {
                    minesRemaining++;
                }
                if (cells[i].classList.contains("mine") === false && (cells[i].classList.contains("closed") || cells[i].classList.contains("flag"))) {
                    safeRemaining++;
                }
            }
            if (safeRemaining < 1) {
                for (let i = 0; i < cells.length; i++) {
                    if (cells[i].classList.contains("flag") === false) {
                        cells[i].classList.remove("closed");
                    }
                }
                gameBegun = false;
                // setTimeout(function () {
                //     alert("You win!");
                // }, 50);
            }
        }
    },

    handleRightClick: function (event) {
        let target = event.target;
        event.preventDefault();
        if (target.classList.contains("closed")) {
            target.classList.remove("closed");
            target.classList.add("flag");
            flagCount--;
            document.getElementById("flagCount").innerHTML = flagCount;
        } else if (target.classList.contains("flag")) {
            target.classList.remove("flag");
            target.classList.add("closed");
            flagCount++;
            document.getElementById("flagCount").innerHTML = flagCount;
        }
        return false;
    },

}

function reset() {
    boardArray = [];
    container.innerHTML = "";
    board.width = Number(document.getElementById("width").value);
    board.height = Number(document.getElementById("height").value);
    board.mines = Number(document.getElementById("mines").value);
    board.buildArray();
    board.insertNumbersIntoArray();
    board.drawHtml();
    console.table(boardArray);
}

setInterval(function () {
    if (gameBegun) {
        timer++;
        document.getElementById("timer").innerHTML = timer;
    }
}, 1000);

document.getElementById("start").addEventListener("click", reset)

board.buildArray();
board.insertNumbersIntoArray();
board.drawHtml();
console.table(boardArray);