let myp5;
let points, correctMatch, consl, pointRadius = 8;
var nextPoint = 0, selectedPoints = [], moves = 0;
let interactionEnabled = true;
let correct = [];
let missing = [];
let wrong = [];
function setup() {
  // Check if constellationData is defined
  if (typeof constellationData !== 'undefined') {
    points = constellationData.points;
    correctMatch = constellationData.answers;
    consl = (constellationData.id);
    imgBig = loadImage("../static/images/"+[constellationData.imageq]);
    noCanvas();  // This ensures P5 doesn't create an automatic canvas.
    let canvas = createCanvas(950, 650);
    canvas.parent('canvas-container');
    select('#butt-Submit').mouseClicked(submitPoints);
    select('#butt-Undo').mouseClicked(undoLastSelection);
  } else {
    noCanvas();
    console.log("constellationData is not defined on this page.");
  }
}

function draw() {
    background(imgBig);
    displayPoints();
    displayConnected();
    displayElastic();
}


function displayPoints() {
    for (let i = 0; i < points.length; i++) {
        var o = points[i];
        var x = o[0];
        var y = o[1];
        noFill();
        noStroke()
        circle(x, y, pointRadius * 2);
        fill(255);
}
}

function mouseClicked() {
    if (!interactionEnabled) return;
    let closestPoint = findClosestPointWithinRadius(mouseX, mouseY, pointRadius);
    if (closestPoint !== null) {
        selectedPoints.push(closestPoint);
        moves++;
        if (closestPoint !== nextPoint) {
            failed = true;
        }
        nextPoint++;
    }
}

function displayConnected() {
    for (let i = 0; i < selectedPoints.length - 1; i++) {
        connectPoints(selectedPoints[i], selectedPoints[i + 1], "white");
    }
    for (let i = 0; i < correct.length; i++) {
      for (let k = 0; k < correct[i].length; k++){
        connectPoints(i, correct[i][k], "blue");
      }
    }
    for (let i = 0; i < missing.length; i++) {
      for (let k = 0; k < missing[i].length; k++){
        connectPoints(i, missing[i][k], "orange");
      }
    }
    for (let i = 0; i < wrong.length; i++) {
      for (let k = 0; k < wrong[i].length; k++){
        connectPoints(i, wrong[i][k], "red");
      }
    }
}

function connectPoints(pi1, pi2, color) {
    var p1 = points[pi1];
    var p2 = points[pi2];
    push();
    stroke(color);
    strokeWeight(5);
    line(p1[0], p1[1], p2[0], p2[1]);
    pop();
}

function displayElastic() {
    if (!interactionEnabled) return;
    if (nextPoint <= 0 || selectedPoints.length === 0)
        return;
    var lastSelectedPoint = points[selectedPoints[selectedPoints.length - 1]];
    stroke(255); // Set the stroke color to white
    line(lastSelectedPoint[0], lastSelectedPoint[1], mouseX, mouseY);
}

function inPoint(p) {
    return collisionCirclePoint(p[0], p[1], pointRadius, mouseX, mouseY);
}

function findClosestPointWithinRadius(mx, my, radius) {
    let minDist = Infinity;
    let index = null;
    for (let i = 0; i < points.length; i++) {
        let p = points[i];
        let dist = Math.sqrt((mx - p[0]) ** 2 + (my - p[1]) ** 2);
        if (dist < minDist && dist <= radius) {
            minDist = dist;
            index = i;
        }
    }
    return index;
}

function collisionCirclePoint(cx, cy, radius, x, y) {
    let distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
    return distancesquared <= radius * radius;
}

function undoLastSelection() {
   selectedPoints.pop();
   moves--;
   console.log("After Undo:", selectedPoints);
}

function calculateAccuracy(correctMatches, input) {
    let holder = 0;
    let missingPoint = 0;
    let wrongPoint = 0;
    for (let i = 0; i < correctMatches.length; i++) {
        if (Array.isArray(correctMatches[i]) && Array.isArray(input[i])) {
            input[i].forEach(item => {
                if (correctMatches[i].includes(item)) {
                    correctPoint++;
                }
                else{
                    wrongPoint++;
                }
            });
            correctMatches[i].forEach(item => {
                if (input[i].includes(item)) {
                    holder++;
                }
                else{
                    holder++;
                    missingPoint++;
                }
            });
        }
    }
    let accuracy = (((correctPoint*.5) - (missingPoint*.25)-(wrongPoint*.25)) / (holder*.5)) * 100;
    if (accuracy <= 0){
      accuracy = 0;
    }
    return accuracy.toFixed(0);
}
function buildConnectionMap(points, pointsSelected) {
    const connectionMap = new Array(points.length).fill(null).map(() => []);
    for (let i = 0; i < pointsSelected.length - 1; i++) {
        const current = pointsSelected[i];
        const next = pointsSelected[i + 1];
        if (current < 0 || current >= points.length || next < 0 || next >= points.length) {
            console.error("Index out of bounds:", current, next);
            continue; // Skip invalid indices
        }
        if (!connectionMap[current].includes(next)) {
            connectionMap[current].push(next);
        }
        if (!connectionMap[next].includes(current)) {
            connectionMap[next].push(current);
        }
    }
    return connectionMap;
}
function drawLines(inputpoints) {
    maxPoint = points.length-1;
    let connections = new Array(maxPoint + 1).fill(null).map(() => []);
    for (let i = 0; i <= maxPoint; i++) {
        let indices = [];
        inputpoints.forEach((point, index) => {
            if (point === i) {
                indices.push(index);
            }
        });
        indices.forEach((index) => {
            let before = index - 1;
            let after = index + 1;
            if (before >= 0) {
                connections[i].push(inputpoints[before]);
            }
            if (after < inputpoints.length) {
                connections[i].push(inputpoints[after]);
            }
        });
        connections[i] = Array.from(new Set(connections[i])).sort((a, b) => a - b);
    }
    return connections;
}
function findInBoth(answers, linesDrawn) {
    let blue = new Array(linesDrawn.length).fill(null).map(() => []);
    let orange = new Array(answers.length).fill(null).map(() => []);
    let red = new Array(linesDrawn.length).fill(null).map(() => []);
    function compareArrays(arr1, arr2) {
        const shared = arr1.filter(value => arr2.includes(value));
        const uniqueToArr1 = arr1.filter(value => !arr2.includes(value));
        const uniqueToArr2 = arr2.filter(value => !arr1.includes(value));
        return { shared, uniqueToArr1, uniqueToArr2 };
    }
    for (let i = 0; i < Math.max(linesDrawn.length, answers.length); i++) {
        const line = linesDrawn[i] || [];
        const answer = answers[i] || [];
        const comparison = compareArrays(line, answer);
        blue[i] = comparison.shared;
        orange[i] = comparison.uniqueToArr2;
        red[i] = comparison.uniqueToArr1;
    }
    return { blue, orange, red };
}
function submitPoints() {
  let connections = buildConnectionMap(points, selectedPoints);
  console.log(connections);
  let isSuccess = calculateAccuracy([correctMatch], [connections]);
  selectedPointsuser= selectedPoints;
  let dl = drawLines(selectedPoints);
  let draw = findInBoth(correctMatch,dl);
  correct = draw.blue;
  missing = draw.orange;
  wrong = draw.red;
  let currentId = consl;
  interactionEnabled = false;
  //Reset game state
  moves = 0;
  selectedPoints = [];
  nextPoint = 0;
  // Send the result to the Flask server
  fetch('/submit-result', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          score: isSuccess,
          answer: connections,
          id: currentId
      })
  }).then(response => response.json())
    .then(data => {
        console.log('Response from server:', data.message);
        if (data.status === "success") {
            currentId++;
            // Redirect after 5 seconds
            setTimeout(() => {
                if (currentId < 5) {
                    window.location.href = `/view/${currentId}`;
                } else {
                    window.location.href = '/summary';
                }
            }, 3000);


      } else {
        // Handle errors or unsuccessful attempts here
        console.error('Failed to submit results:', data.message);
      }
  }).catch(error => console.error('Error:', error));
}
