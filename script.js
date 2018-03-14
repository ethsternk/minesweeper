const container = document.getElementById("board");
const boardArray = [];

var board = {
    width: 10,
    height: 10,
    mines: 20,
    
    construct: function () {
        let possibleCells = [];
        for (let i = 0; i < this.width * this.height; i++) {
            if (i < this.width * this.height - this.mines) {
                possibleCells.push(" ");
            } else {
                possibleCells.push("M");
            }
        }        
        for (let i = 0; i < this.height; i++) {
            boardArray.push([]);
            for (let y = 0; y < this.width; y++) {                
                boardArray[i].push(possibleCells.splice(Math.floor(Math.random() * possibleCells.length), 1).toString());
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

                // let surroundingMines = 0;
                // if (boardArray[i][y] === " ") {
                //     if (boardArray[i-1][y-1]) { surroundingMines++ };
                //     if (boardArray[i-1][y]) { surroundingMines++ };
                //     if (boardArray[i-1][y+1]) { surroundingMines++ };
                //     if (boardArray[i][y-1]) { surroundingMines++ };
                //     if (boardArray[i][y+1]) { surroundingMines++ };
                //     if (boardArray[i+1][y-1]) { surroundingMines++ };
                //     if (boardArray[i+1][y]) { surroundingMines++ };
                //     if (boardArray[i+1][y+1]) { surroundingMines++ };
                // }

                // cell.innerHTML = surroundingMines;

                if (boardArray[i][y] === " ") {
                    cell.className = "cell closed";
                } else {
                    cell.className = "cell mine closed";
                }
                cell.addEventListener("click", this);
                row.appendChild(cell);
            }
        }
    },

    handleEvent: function (event) {
        let target = event.target;
        console.log(target);
        target.classList.remove("closed");

        if (target.classList.contains("mine")) {
            setTimeout(function(){ alert("welp"); }, 50);
        }
    }

}

board.construct();
board.draw();
console.table(boardArray);