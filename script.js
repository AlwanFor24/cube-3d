const canvas = document.querySelector('#canvas3D');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let width = canvas.width;
let height = canvas.height;
let projectionCenterX = width / 2;
let projectionCenterY = height / 2;
let fieldOfView = 800;

// 3D object configuration
const SHAPE_VERTICES = [
  [-1, -1, -1], [1, -1, -1], [-1, 1, -1], [1, 1, -1],
  [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1]
];
const SHAPE_EDGES = [
  [0, 1], [1, 3], [3, 2], [2, 0],
  [4, 5], [5, 7], [7, 6], [6, 4],
  [0, 4], [1, 5], [2, 6], [3, 7]
];

// Base object class
class Object3D {
  constructor(x, y, z, size = 100) { // Ukuran cube diatur ke 100
    this.x = x;
    this.y = y;
    this.z = z;
    this.size = size;
  }

  project(x, y, z) {
    const scale = fieldOfView / (fieldOfView + z);
    return {
      x: x * scale + projectionCenterX,
      y: y * scale + projectionCenterY,
      scale
    };
  }
}

// 3D Rotating Cube class
class RotatingCube extends Object3D {
  constructor(x, y, z, size) {
    super(x, y, z, size);
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationSpeed = 0.01;
  }

  rotate() {
    this.rotationX += this.rotationSpeed;
    this.rotationY += this.rotationSpeed;
  }

  draw() {
    for (let edge of SHAPE_EDGES) {
      const [start, end] = edge.map(index => {
        const vertex = SHAPE_VERTICES[index];
        const scaledVertex = vertex.map(coord => coord * this.size); // Perbesar cube sesuai size

        const rotatedX = scaledVertex[0] * Math.cos(this.rotationY) - scaledVertex[2] * Math.sin(this.rotationY);
        const rotatedZ = scaledVertex[2] * Math.cos(this.rotationY) + scaledVertex[0] * Math.sin(this.rotationY);
        const rotatedY = scaledVertex[1] * Math.cos(this.rotationX) - rotatedZ * Math.sin(this.rotationX);
        return this.project(rotatedX + this.x, rotatedY + this.y, rotatedZ + this.z);
      });

      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = 'white';
      ctx.stroke();
    }
  }

  update() {
    this.rotate();
    this.draw();
  }
}

let cube;

function setup() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  projectionCenterX = width / 2;
  projectionCenterY = height / 2;

  // Buat cube kecil di tengah
  cube = new RotatingCube(0, 0, 0, 100); // Atur ukuran cube ke 100
}

function render() {
  ctx.clearRect(0, 0, width, height);
  cube.update();
  requestAnimationFrame(render);
}

setup();
render();

window.addEventListener('resize', setup);
