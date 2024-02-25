// reference flow field - https://editor.p5js.org/BarneyCodes/sketches/2eES4fBEL
// https://www.youtube.com/watch?v=sZBfLgfsvSk

"use strict";

let particule = [];
const numParticule = 5000;

const noiseScale = 0.01;


function setup() {
    createCanvas(windowWidth, windowHeight);
    for(let i = 0; i < numParticule; i ++) {
        particule.push(createVector(random(width), random(height)));
    }
    strokeWeight(1.5);
    stroke(0, 0, 255);
}

function draw() {
    background(255, 0, 0, 10);
    createParticules();
}

function createParticules() {
    for(let i = 0; i < numParticule; i ++) {
        let pointParticule = particule[i];
        point(pointParticule.x, pointParticule.y);
        let mapPoint = noise(pointParticule.x * noiseScale, pointParticule.y * noiseScale);
        let angle = TAU * mapPoint;
        pointParticule.x += cos(angle);
        pointParticule.y += sin(angle);
        if(!onScreen(pointParticule)) {
            pointParticule.x = random(width);
            pointParticule.y = random(height);
        }
    }
}


function mousePressed() {
    noiseSeed(millis());
}

function onScreen(v) {
    return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
}