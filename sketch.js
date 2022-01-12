const W = 400;
const H = 400;

class Cell {
  constructor(x, y, w, h, c, i, j) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    this.i = i;
    this.j = j;
    
    this.adj = [];
    this.vis = false;
  }
  
  connect(otherCell) {
    this.adj.push(otherCell);
    otherCell.adj.push(this);
  }
  
  dfs(shouldDelete = false) {
    console.log(this.i, this.j)
    if (this.vis) return 0;

    this.vis = true;
    let cnt = 1;

    for(let child of this.adj) {
      if (child.c == this.c && ! child.vis) {
        cnt += child.dfs(shouldDelete);
      }
    }
    
    if (shouldDelete) this.c = 'black'

    return cnt;
  }
  
  render() {
    push();
    
    fill(this.c);
    rect(this.x, this.y, this.w, this.h);
    
    pop();
  }
}

class Grid {
  constructor(n, m, w, h) {
    this.n = n;
    this.m = m;
    this.w = w;
    this.h = h;
    
    this.initColors();
    this.init();
  }
  
  initColors() {
    this.colors = [
      'red',
      'green',
      'blue',
      'yellow'
    ];
  }
  
  init() {
    this.grid = [];
    
    for(let i=0; i<this.n; i++) {
      let row = [];
      
      for(let j=0; j<this.m; j++) {
        let w = this.w / this.m;
        let h = this.h / this.n;
        
        let x = j * w;
        let y = i * h;
        
        row.push(new Cell(x, y, w, h, 'white', i, j));
      }
      
      this.grid.push(row)
    }
    
    this.randomize();
    this.connectAdj();
  }
  
  connectAdj() {
    for(let i=0; i<this.n; i++) {
      for(let j=0; j<this.m; j++) {
        let cell = this.grid[i][j];
        
        if (i + 1 < this.n) {
          cell.connect(this.grid[i+1][j]);
        }
        
        if (j + 1 < this.m) {
          cell.connect(this.grid[i][j+1]);
        }
      }
    }
  }
  
  randomColor() {
    return this.colors[
      Math.floor(Math.random()*this.colors.length)
    ]
  }
  
  randomize() {
    this.grid.forEach(
      row => row.forEach(
        cell => cell.c = this.randomColor()
      )
    )
  }
  
  clear() {
    this.grid.forEach(
      row => row.forEach(
        cell => cell.vis = false
      )
    )
  }
  
  check() {
    this.clear();
    
    for(let i=0; i<this.n; i++) {
      for(let j=0; j<this.m; j++) {
        let cell = this.grid[i][j];
        
        let cnt = cell.dfs(cell);
        
        if (cnt >= 3) return true;
      }
    }
    
    return false;
  }
  
  delete(i, j) {
    let cell = this.grid[i][j];
    
    if (cell.dfs() >= 3) {
      this.clear()
      cell.dfs(true);
    }
  }
  
  render() {
    this.grid.forEach(
      row => row.forEach(cell => cell.render())
    )
  }
}

let grid = new Grid(5, 5, W, H);


function mousePressed() {
  if (mouseX > W || mouseY > H) {
    return;
  }
  
  let i = Math.floor(mouseY / (H / grid.n));
  let j = Math.floor(mouseX / (W / grid.m));
  
  grid.delete(i, j)
}

function setup() {
  createCanvas(W, H);
}

function draw() {
  background(220);
  
  grid.render()
}