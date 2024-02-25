// Reference vid - https://www.youtube.com/watch?v=3yqANLRWGLo&t=1393s

"use strict";

let faceApi;
let faceDetection = [];

let video;

function preload() {
}

function setup() {

    createCanvas(640,480);

    video = createCapture(VIDEO);

    video.size(width, height); 
    video.hide();
    const faceReferences = {
        withLandmarks: true,
        // withExpression: true, 
        withDescription: false,
        minConfidence: 0.5
    };
    faceApi = ml5.faceApi(video, faceReferences, faceLoaded); // input for ML, config, callback 
}

function faceLoaded() { // callback function
    faceApi.detect(gotFaces);
}

function gotFaces(error, result) {
    if(error){
        // console.log(error);
        return;
    }
    faceDetection = result;
    // console.log(faceDetection);
    faceApi.detect(faceLoaded); // face detection ML face api
}


function draw() {

    clear(); // function to draw transparent background
    image(video, 0, 0, width, height);
    drawBox(faceDetection);
    drawLandmarks(faceDetection);
}

// draw the face box
function drawBox(faceDetection) {
    if(faceDetection.length > 0) { // array to store the face detected
        for(let i = 0; i < faceDetection.length; i ++) {
        // for(let i = 0; i < 1; i++){ // just for now to test
            let x = faceDetection[i].alignedRect._box._x;
            let y = faceDetection[i].alignedRect._box._y;
            let rectWidth = faceDetection[i].alignedRect._box._width;
            let rectHeight = faceDetection[i].alignedRect._box._height;
    
            // draw rectangle around the face
            stroke(255);
            strokeWeight(1);
            noFill();
            rect(x, y, rectWidth, rectHeight);
        }
    }
}

// Draw the points on face
function drawLandmarks(faceDetection) {
    if(faceDetection.length > 0) {
        for(let i = 0; i < faceDetection.length; i ++) {
        // for(let i = 0; i < 1; i++) {
            // console.log(typeof faceDetection[i].landmarks.positions);
            let dots = faceDetection[i].landmarks.positions;
            for(let k = 0; k < dots.length; k++){
                stroke(255);
                strokeWeight(4);
                point(dots[k]._x, dots[k]._y);
            }
        }
    }
}