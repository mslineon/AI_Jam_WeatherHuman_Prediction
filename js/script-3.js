// Reference code - https://editor.p5js.org/ndeji69/sketches/EA17R4HHa

"use strict";

let particles = [];
let n = 1000;//number of particle
let noiseScale = 250;

let noiseTexture;


function setup() {
  

  // add video Cam here 
  

  createCanvas(windowWidth, windowHeight);
  background(0);
  noiseDetail(3, 0);
  console.log(pixelDensity());

  //generate noise image
  noiseTexture = createGraphics(width/2, height/2);
  noiseTexture = genNoiseImg(noiseTexture);

  //initialize particle
  for(let i=0; i<n; i++){
    let particle = new Object();
    
    particle.pos = createVector(random(width), random(height));
    particles.push(particle);//add particle to particle list
  }
}


//get gradient vector
function curl(x, y){
  let EPSILON = 0.001;//sampling interval

  //Find rate of change in X direction
  let n1 = noise(x + EPSILON, y);
  let n2 = noise(x - EPSILON, y);

  //Average to find approximate derivative
  let cx = (n1 - n2)/(2 * EPSILON);

  //Find rate of change in Y direction
  n1 = noise(x, y + EPSILON);
  n2 = noise(x, y - EPSILON);

  //Average to find approximate derivative
  let cy = (n1 - n2)/(2 * EPSILON);
  
  //return new createVector(cx, cy);//gradient toward higher position
  return new createVector(cy, -cx);//rotate 90deg
}

function draw() {
  // tint(0, 255, 200, 5);
  image(noiseTexture, 0, 0, width, height);//fill with transparent noise image
  fill(0, 4);
  noStroke();
  rect(0, 0, width, height);

  strokeWeight(1);//particle size
  stroke(155, 213, 214);
  
  for(let i = 0; i < particles.length; i ++){
    let p = particles[i];//pick a particle
    p.pos.add(curl(p.pos.x/noiseScale, p.pos.y/noiseScale));
    point(p.pos.x, p.pos.y);
    p.pos.x = (p.pos.x + width) % width;
    p.pos.y = (p.pos.y + height) % height;
  }
}

function genNoiseImg(noiseImg){

  let heatMapColors = [
    color(0, 255, 0, 10),
    color(255, 255, 0, 10),
    color(255, 0, 0, 10)
  ];

  noiseImg.loadPixels();

  let widthd = width * pixelDensity();
  let heightd = height * pixelDensity();

  for(let i = 0; i < widthd; i ++){
    for(let j = 0; j < heightd; j ++){
      let x = i/pixelDensity();
      let y = j/pixelDensity();
      let bright = noise((x / noiseScale) * 2, (y / noiseScale) * 2) * 400;
      
      let newColor = lerpThroughPalette(heatMapColors, bright);
      noiseImg.set(x, y, newColor);
    }
  }
  noiseImg.updatePixels();
  return noiseImg;
}

function mousePressed() {
  noiseSeed(millis());
}

//Chat GPT to map out color palette
function lerpThroughPalette(palette, value) {

  // Map the value to be within the range of the palette indices
  let newValue = constrain(value, 0, 255);
  let mappedValue = map(newValue, 0, 255, 0, palette.length - 1);
  let index = floor(mappedValue);
  let lerpAmt = mappedValue - index;

  // Handle the case where the value maps exactly to the last color in the palette
  if (index >= palette.length - 1) {
    return palette[palette.length - 1];
  }

  // Interpolate between the two colors in the palette
  return lerpColor(palette[index], palette[index + 1], lerpAmt);
}
