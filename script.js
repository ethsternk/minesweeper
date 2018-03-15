const container = document.getElementById("board");
let boardArray = [];

var board = {
    width: 10,
    height: 10,
    mines: 20,

    generatePossibleCells: function () {
        let possibleCells = [];
        for (let i = 0; i < this.width * this.height; i++) {
            if (i < (this.width * this.height) - this.mines) {
                possibleCells.push(" ");
            } else {
                possibleCells.push("M");
            }
        }
        return possibleCells;
    },

    selectRandomPosition: function () {
        const possibleCells = this.generatePossibleCells();
        const randomPosition = Math.floor(Math.random() * possibleCells.length);
        return possibleCells.splice( randomPosition, 1 )[0];
    },

    buildArray: function () {
        for (let rowIndex = 0; rowIndex < (this.height + 2); rowIndex++) {
            boardArray.push([]);
            for (let colIndex = 0; colIndex < (this.width + 2); colIndex++) {
                const isNotCeiling = rowIndex >= 1;
                const isNotFloor = rowIndex < this.height + 1;
                const isNotLeftWall = colIndex >= 1;
                const isNotRightWall = colIndex < this.width + 1;
                if ( isNotCeiling && isNotFloor && isNotLeftWall && isNotRightWall ) {
                    boardArray[rowIndex].push( this.selectRandomPosition() );
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
                    if (boardArray[i - 1][y - 1] === "M") { surroundingMines++ };
                    if (boardArray[i - 1][y] === "M") { surroundingMines++ };
                    if (boardArray[i - 1][y + 1] === "M") { surroundingMines++ };
                    if (boardArray[i][y - 1] === "M") { surroundingMines++ };
                    if (boardArray[i][y + 1] === "M") { surroundingMines++ };
                    if (boardArray[i + 1][y - 1] === "M") { surroundingMines++ };
                    if (boardArray[i + 1][y] === "M") { surroundingMines++ };
                    if (boardArray[i + 1][y + 1] === "M") { surroundingMines++ };
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
                    cell.className = "cell closed";
                    if (boardArray[i][y] !== 0 && boardArray[i][y] !== "-")
                        cell.classList.add("m" + boardArray[i][y]);
                }
                cell.addEventListener("click", this.handleLeftClick);
                cell.addEventListener("contextmenu", this.handleRightClick, false);
                row.appendChild(cell);
            }
        }
    },

    handleLeftClick: function (event) {
        let target = event.target;
        if (target.classList.contains("closed")) {
            target.classList.remove("closed");
            if (target.classList.contains("mine")) {
                target.classList.add("dead");
                setTimeout(function () {
                    alert("welp");
                }, 50);
            }
        }
    },

    handleRightClick: function (event) {
        let target = event.target;
        event.preventDefault();
        if (target.classList.contains("closed")) {
            target.classList.remove("closed");
            target.classList.add("flag");
        } else if (target.classList.contains("flag")) {
            target.classList.remove("flag");
            target.classList.add("closed");
        }
        return false;
    },

}

function reset() {
    boardArray = [];
    container.innerHTML = "";
    board.width = Number( document.getElementById("width").value );
    board.height = Number( document.getElementById("height").value );
    board.mines = Number( document.getElementById("mines").value );
    board.buildArray();
    board.insertNumbersIntoArray();
    board.drawHtml();
    console.table(boardArray);
}

document.getElementById("start").addEventListener("click", reset)

board.buildArray();
board.insertNumbersIntoArray();
board.drawHtml();
console.table(boardArray);