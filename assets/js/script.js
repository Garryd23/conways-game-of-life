class ConwaysGameOfLife {
  constructor() {
    this.canvas = document.querySelector("#ourWorld");
    this.context = this.canvas.getContext("2d");
    this.res = 10;
    this.message = document.querySelector(".message");
    this.startBTN = document.querySelector("#beginWorldBTN");
    this.generationCounter = document.querySelector(".generationCounter");
    this.currentGen = document.querySelector("#generation");
    this.events();
  }

  events() {
    this.startBTN.addEventListener("click", () => {
      this.start();
    });
  }

  updateWorld(grid) {
    if (this.generation < this.generationToView) {
      grid = this.nextGeneration(grid);
      this.renderWorld(grid);

      requestAnimationFrame(() => this.updateWorld(grid));
    } else {
      this.startBTN.classList.toggle("hidden");
      return;
    }
  }

  createGrid() {
    //create the initial state
    return new Array(this.cols).fill().map(() => new Array(this.rows).fill().map(() => Math.floor(Math.random() * 2)));
  }

  start() {
    this.message.innerHTML = "";
    this.startBTN.classList.toggle("hidden");
    this.generationCounter.classList.remove("hidden");
    this.generation = 0;
    this.canvas.width = Number(document.querySelector("#boardWidth").value) * this.res;
    this.canvas.height = Number(document.querySelector("#boardHeight").value) * this.res;
    this.generationToView = Number(document.querySelector("#generationsToView").value);

    if (this.canvas.width > 0 && this.canvas.height > 0 && this.generationToView > 0 && this.canvas.width <= 3000 && this.canvas.height <= 3000) {
      this.canvas.classList.remove("hidden");
      this.cols = this.canvas.width / this.res;
      this.rows = this.canvas.height / this.res;
      let grid = this.createGrid();
      requestAnimationFrame(() => this.updateWorld(grid));
    } else {
      let msg;
      this.canvas.width <= 0 || this.canvas.height <= 0
        ? (msg = "Please enter a value greater than 0 in each of the above fields.")
        : (msg = "Board height and width can't be more than 300.");
      this.message.innerHTML = msg;
      this.canvas.classList.add("hidden");
      this.startBTN.classList.toggle("hidden");
    }
  }

  nextGeneration(grid) {
    //create exact copy of previous generation
    this.generation++;
    this.currentGen.innerHTML = this.generation;
    const newGeneration = grid.map((arr) => [...arr]);

    //Loop through each cell in the copied array and check its adjacents cells state ie. alive or dead
    for (let col = 0; col < newGeneration.length; col++) {
      for (let row = 0; row < newGeneration[col].length; row++) {
        let cell = grid[col][row];
        let aliveNeighbors = 0;

        // loop through all the current cells neighbors and check their state
        for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            //Exclude the current cell from the
            if (i === 0 && j === 0) {
              continue;
            }
            let cellX = col + i;
            let cellY = row + j;
            //Ignore cells that are outside of the grid
            if (cellX >= 0 && cellY >= 0 && cellX < this.cols && cellY < this.rows) {
              let currentNeighbor = grid[cellX][cellY];
              aliveNeighbors += currentNeighbor;
            }
          }
        }
        //Rules
        if ((cell === 1 && aliveNeighbors < 2) || (cell === 1 && aliveNeighbors > 3)) {
          newGeneration[col][row] = 0;
        } else if (cell === 0 && aliveNeighbors === 3) {
          newGeneration[col][row] = 1;
        }
      }
    }
    return newGeneration;
  }

  renderWorld(grid) {
    for (let col = 0; col < grid.length; col++) {
      for (let row = 0; row < grid[col].length; row++) {
        let cell = grid[col][row];

        this.context.beginPath();

        this.context.arc(col * this.res + this.res / 2, row * this.res + this.res / 2, this.res / 2, 0, 2 * Math.PI);
        this.context.fillStyle = cell === 0 ? "black" : "red";
        this.context.fill();
        this.context.stroke();
      }
    }
  }
}

new ConwaysGameOfLife();
