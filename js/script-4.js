let particles = [];


let video;

function setup() {
  createCanvas(400, 400);
  video = createCapture(VIDEO);

  video.size(width, height); 
  // video.hide();
  for (let i = 0; i < 300; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      tx: random(100),
      ty: random(100),
      vx: 0,
      vy: 0,
      speed: 0.1,
      agitation: random(0.001, 0.01)
    })
  }
}

function draw() {
  background(220);
  drawParticules();  
}

function drawParticules() {
  for (let p of particles) {
    p.x = noise(p.tx) * width; // Movement range
    p.y = noise(p.ty) * height;
    p.tx += p.agitation; // Agitation
    p.ty += p.agitation - p.vx;

    noStroke();
    fill(0, 0, 0, 100)
    ellipse(p.x, p.y, 10, 10);
  }
}

