// objects 
let particles = [];
let video;
let faceApi;
let detections = [];
let noiseScale = 250;
let noiseTexture;



function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(width, height);
    
  const faceOptions = { withLandmarks: true, withDescriptors: false };
  faceApi = ml5.faceApi(video, faceOptions, modelReady);
  
  // Hide the video element, and just show the canvas
  video.hide();

  noiseTexture = createGraphics(width/2, height/2);
  noiseTexture = genNoiseImg(noiseTexture);
  
  //set up particules
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
    });
  }
}

// Load the models for face detection
function modelReady() {
  console.log("Model Loaded!");
  faceApi.detect(gotFaces);
}

// Get detection results
function gotFaces(error, result) {
  if (error) {
    console.error(error);
    return;
  }
  detections = result;
  faceApi.detect(gotFaces); // Call it again to continuously detect faces
}

function draw() {
  background(150);
  image(noiseTexture, 0, 0, width, height);//fill with transparent noise image
  drawParticles();  
  drawLandmarks(); 
}

// draw the dots on the face
function drawLandmarks() {
  if(detections.length > 0) {
    for(let i = 0; i < detections.length; i ++) {
        let dots = detections[i].landmarks.positions;
        for(let k = 0; k < dots.length; k++){
            stroke(255);
            strokeWeight(4);
            point(width - dots[k]._x, dots[k]._y);
        }
    }
}
}

// Particules
function drawParticles() {
  for (let p of particles) { 
    let targetX = width / 2; // position of my particules at the beginning 
    let targetY = height / 2;

    if (detections.length > 0) { // finding the center of the face box
      const face = detections[0].alignedRect;
      const faceCenterX = face._box._x + face._box._width / 2;
      const faceCenterY = face._box._y + face._box._height / 2;

      // Update target to face center
      targetX = width - (faceCenterX - 1); // miroir in the x direction
      targetY = faceCenterY - 1;
    }

    // Gently move particle towards the target, but not exactly at the center (some math over here!)
    p.x = lerp(p.x, targetX + ((noise(p.tx)* 2 - 1)* 600), 0.02); // 0.05 is the interpolation factor for smooth following
    p.y = lerp(p.y, targetY + ((noise(p.ty)* 2 - 1)* 600), 0.02);

    // adding tx, ty for movement 
    p.tx += p.agitation * 2;
    p.ty += p.agitation * 2;

    noStroke();
    fill(255);
    ellipse(p.x, p.y, 5, 5);
  }
}

// Generate background colors 
function genNoiseImg(noiseImg){
  
  //set the 3 colors
  let heatMapColors = [
    color(0, 255, 0),
    color(255, 255, 0),
    color(255, 0, 0)
  ];

  //load all the pixels of the texture
  noiseImg.loadPixels();

  // adapt for different displays
  let widthd = width * pixelDensity();
  let heightd = height * pixelDensity();

  // ChatGPT helped on defining the pixels on x,y
  for(let i = 0; i < widthd; i ++){
    for(let j = 0; j < heightd; j ++){
      let x = i/pixelDensity();
      let y = j/pixelDensity();

      // getting specific values from the noise
      let bright = noise((x / noiseScale) * 2, (y / noiseScale) * 2) * 400;
      
      // use the value above to interpolate between the 3 colors
      let newColor = lerpThroughPalette(heatMapColors, bright);
      noiseImg.set(x, y, newColor);
    }
  }
  noiseImg.updatePixels();
  return noiseImg;
}

// ChatGPT reference! 
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



