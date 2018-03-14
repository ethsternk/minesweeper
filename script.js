const container = document.getElementById("board");
const boardArray = [];

var board = {
    width: 10,
    height: 10,
    minePerc: 0.1,
    mines: 1,

    construct: function () {
        for (let i = 0; i < this.height; i++) {
            boardArray.push([]);
            for (let y = 0; y < this.width; y++) {
                if (Math.random() > this.minePerc) {
                    boardArray[i].push(" ");
                } else {
                    boardArray[i].push("M");
                } 
            }
        }
    },

    draw: function () {
        for (let i = 0; i < this.height; i++) {
            const row = document.createElement("div");
            row.className = "row";
            container.appendChild(row);
            for (let y = 0; y < this.width; y++) {
                const cell = document.createElement("div");
                if (Math.random() > this.minePerc) {
                    cell.className = "cell";
                } else {
                    cell.className = "cell mine";
                }
                row.appendChild(cell);
            }
        }
    }

}

board.construct();
board.draw();
console.table(boardArray);