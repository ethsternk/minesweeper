const container = document.getElementById("board");
let cells = document.getElementsByClassName("cell");
let possibleCells = [];
let boardArray = [];
let gameLive = false;
let timer = 0;

var board = {
    width: 10,
    height: 10,
    mines: 15,

    // fills the dummy array (possibleCells) with all possible cells to be added
    createPossibleCells: function () {
        possibleCells = [];
        for (let i = 0; i < this.width * this.height; i++) {
            if (i < (this.width * this.height) - this.mines) {
                possibleCells.push(" ");
            } else {
                possibleCells.push("M");
            }
        }
    },

    // pushes each cell from the dummy array (possibleCells) randomly into the real array (boardArray)
    buildArray: function () {
        for (let x = 0; x < this.height + 2; x++) {
            boardArray.push([]);
            for (let y = 0; y < this.width + 2; y++) {
                if (x >= 1 && x < this.height + 1 && y >= 1 && y < this.width + 1) {
                    boardArray[x].push(possibleCells.splice(Math.floor(Math.random() * possibleCells.length), 1)[0]);
                } else {
                    boardArray[x][y] = "-";
                }
            }
        }
    },

    // changes empty cells in boardArray to numbers based on the # of surrounding mines
    insertNumbers: function () {
        for (let x = 1; x < this.height + 1; x++) {
            for (let y = 1; y < this.width + 1; y++) {
                if (boardArray[x][y] === " ") {
                    let surroundingMines = 0;
                    if (boardArray[x - 1][y - 1] === "M") { surroundingMines++; };
                    if (boardArray[x - 1][y] === "M") { surroundingMines++; };
                    if (boardArray[x - 1][y + 1] === "M") { surroundingMines++; };
                    if (boardArray[x][y - 1] === "M") { surroundingMines++; };
                    if (boardArray[x][y + 1] === "M") { surroundingMines++; };
                    if (boardArray[x + 1][y - 1] === "M") { surroundingMines++; };
                    if (boardArray[x + 1][y] === "M") { surroundingMines++; };
                    if (boardArray[x + 1][y + 1] === "M") { surroundingMines++; };
                    boardArray[x][y] = surroundingMines;
                }
            }
        }
    },

    // draws a new board in the HTML based on boardArray
    drawHtml: function () {
        for (let x = 1; x < this.height + 1; x++) {
            const row = document.createElement("div");
            row.className = "row";
            container.appendChild(row);
            for (let y = 1; y < this.width + 1; y++) {
                const cell = document.createElement("div");
                if (boardArray[x][y] === "M") {
                    cell.className = "cell mine closed";
                } else {
                    cell.className = "cell closed m" + boardArray[x][y];
                }
                cell.id = x + "-" + y;
                cell.addEventListener("click", this.handleLeftClick);
                cell.addEventListener("contextmenu", this.handleRightClick, false);
                row.appendChild(cell);
            }
        }
        timer = 0;
        document.getElementById("timer").innerHTML = timer;
        board.updateFlagCount();
    },

    // "unmasks" cell upon left click and...
    handleLeftClick: function (event) {
        let target = event.target;
        gameLive = true;
        if (target.classList.contains("closed")) {
            target.classList.remove("closed");
            // ...if the cell is "empty" (no neighboring mines), clear all neighbors too
            if (target.classList.contains("m0")) {
                let pos = target.id.split("-");
                function clearNewCell(down, right) {
                    document.getElementById((Number(pos[0]) + down) + "-" + (Number(pos[1]) + right)).click();
                }
                if (pos[0] > 1 && pos[1] > 1) { clearNewCell(-1, -1); };
                if (pos[0] > 1) { clearNewCell(-1, 0); };
                if (pos[0] > 1 && pos[1] < board.width) { clearNewCell(-1, 1); };
                if (pos[1] < board.width) { clearNewCell(0, 1); };
                if (pos[1] > 1) { clearNewCell(0, -1); };
                if (pos[0] < board.height || pos[1] > 1) { clearNewCell(1, -1); };
                if (pos[0] < board.height) { clearNewCell(1, 0); };
                if (pos[0] < board.height && pos[1] < board.width) { clearNewCell(1, 1); };
            }
            // ...if the cell is a mine, you lose
            if (target.classList.contains("mine")) {
                target.classList.add("dead");
                board.lose();
            }
        }
        board.checkForWin();
    },

    // toggles flag upon right click
    handleRightClick: function (event) {
        let target = event.target;
        event.preventDefault();
        if (target.classList.contains("closed")) {
            target.classList.remove("closed");
            target.classList.add("flag");
            board.mines--;
            board.updateFlagCount();
        } else if (target.classList.contains("flag")) {
            target.classList.remove("flag");
            target.classList.add("closed");
            board.mines++;
            board.updateFlagCount();
        }
        return false;
    },

    updateFlagCount: function () {
        document.getElementById("flagCount").innerHTML = board.mines;
    },

    // checks if you've won
    checkForWin: function () {
        let safeRemaining = 0;
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].classList.contains("mine") === false && (cells[i].classList.contains("closed") || cells[i].classList.contains("flag"))) {
                safeRemaining++;
            }
        }
        if (safeRemaining < 1 && gameLive) {
            for (let i = 0; i < cells.length; i++) {
                cells[i].classList.remove("closed");
                cells[i].classList.remove("flag");
            }
            gameLive = false;
            setTimeout(function () {
                alert("You win!");
            }, 50);
        }
    },

    // reveals all cells if you lose
    lose: function () {
        for (let i = 0; i < cells.length; i++) {
            cells[i].classList.remove("closed");
            cells[i].classList.remove("flag");
        }
        gameLive = false;
        setTimeout(function () {
            alert("You lose!");
        }, 50);
    },

    // resets the board with new values
    reset: function () {
        boardArray = [];
        container.innerHTML = "";
        board.width = Number(document.getElementById("width").value);
        board.height = Number(document.getElementById("height").value);
        board.mines = Number(document.getElementById("mines").value);
        board.createPossibleCells();
        board.buildArray();
        board.insertNumbers();
        board.drawHtml();
        cells = document.getElementsByClassName("cell");
        console.table(boardArray);
    }

}

// runs timer
setInterval(function () {
    if (gameLive) {
        timer++;
        document.getElementById("timer").innerHTML = timer;
    }
}, 1000);

// adds click listener to the reset button
document.getElementById("start").addEventListener("click", board.reset);

// builds default board upon page load
board.createPossibleCells();
board.buildArray();
board.insertNumbers();
board.drawHtml();
console.table(boardArray);