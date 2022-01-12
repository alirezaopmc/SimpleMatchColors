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
    // console.log(this.i, this.j)
    if (this.vis) return 0;

    this.vis = true;
    let cnt = 1;

    for(let child of this.adj) {
      if (child.c == this.c && ! child.vis) {
        cnt += child.dfs(shouldDelete);
      }
    }
    
    if (shouldDelete){
       this.c = 'black'
      //  console.log(this.c)
    }
    return cnt;
  }

  retire_vis(){
    // console.log(this.i, this.j)
    if (!this.vis) return 0;

    this.vis = false;
    
    for(let child of this.adj) {
      if (child.c == this.c && child.vis) {
        child.retire_vis();
      }
    }
    
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
        
        let cnt = cell.dfs();
        
        if (cnt >= 3) return true;
      }
    }
    
    return false;
  }
  
  delete(i, j) {
    let cell = this.grid[i][j];
    let cnt = cell.dfs()
    if (cnt >= 3){
      this.grid.forEach(
        row => row.forEach(
          cell => {
            if(cell.vis == true){
              count += 1
              cell.vis = false;
              gsap.to(cell, {
                y: 400,
              });
              var newCell = new Cell(cell.x, 0, cell.w, cell.h, grid.randomColor(), cell.i, cell.j);
              // document.getElementsByTagName("h2")[0].innerHTML = count.toString();
              grid.grid[cell.i][cell.j] = newCell;           
              gsap.to(newCell, {
                y: cell.y,
              });
              grid.connectAdj()
            }
          }
        )
      )
    }
    else{
      cell.retire_vis()
    }
  }
  
  render() {
    this.grid.forEach(
      row => row.forEach(cell => cell.render())
    )
  }
  swap(i1, j1, i2, j2){
    let cell_1 = this.grid[i1][j1];
    let cell_2 = this.grid[i2][j2];
    cell_1.adj = [];
    cell_2.adj = [];
    this.grid[i1][j1] = cell_2;
    this.grid[i2][j2] = cell_1;
    cell_1.i = i2;
    cell_2.i = i1;
    cell_1.j = j2;
    cell_2.j = j1;
    this.connectAdj();
  }
}

let grid = new Grid(5, 5, W, H);


function mouseReleased() {
  let i = Math.floor(mouseY / (H / grid.n));
  let j = Math.floor(mouseX / (W / grid.m));
  
  if (cur_i == i && cur_j == j){
    grid.delete(cur_i, cur_j);
    return;
  }
  else{
    let cell1 = grid.grid[i][j];
    let cell2 = grid.grid[cur_i][cur_j];

    if (i == cur_i - 1 && j == cur_j){
      gsap.to(cell1, {
      y: cell1.y + 80,
      duration: 0.2
    });
      gsap.to(cell2, {
      y: cell2.y - 80,
      duration: 0.2
    });
    grid.swap(i ,j ,cur_i ,cur_j);
    }
    
    if (i == cur_i + 1 && j == cur_j) {
      gsap.to(cell1, {
        y: cell1.y - 80,
        duration: 0.2
      });
        gsap.to(cell2, {
        y: cell2.y + 80,
        duration: 0.2
      });
      grid.swap(i ,j ,cur_i ,cur_j);
    }

    if (i == cur_i && j == cur_j - 1) {
      gsap.to(cell1, {
        x: cell1.x + 80,
        duration: 0.2
      });
        gsap.to(cell2, {
        x: cell2.x - 80,
        duration: 0.2
      });
      grid.swap(i ,j ,cur_i ,cur_j);
    }

    if (i == cur_i && j == cur_j + 1) {
      gsap.to(cell1, {
        x: cell1.x - 80,
        duration: 0.2
      });
        gsap.to(cell2, {
        x: cell2.x + 80,
        duration: 0.2
      });
      grid.swap(i ,j ,cur_i ,cur_j);
    }
  }
}

let cur_i;
let cur_j;

function mousePressed() {
  if (mouseX > W || mouseY > H) {
    return;
  }

  let i = Math.floor(mouseY / (H / grid.n));
  let j = Math.floor(mouseX / (W / grid.m));
  cur_i = i;
  cur_j = j;
}

function setup() {
  createCanvas(W, H);
}

let count = 0;

function draw() {
  background(220);
  grid.render()
}


