let myp5;
let points, correctMatch, consl, pointRadius = 8;
var nextPoint = 0, selectedPoints = [], moves = 0;

function setup() {
  // Check if constellationData is defined
  if (typeof constellationData !== 'undefined') {
    points = constellationData.points;
    correctMatch = [constellationData.answers];
    consl = [constellationData.id];
    imgBig = loadImage("../static/images/"+[constellationData.imageq]);
    noCanvas();  // This ensures P5 doesn't create an automatic canvas.
    let canvas = createCanvas(950, 650);
    canvas.parent('canvas-container');
    select('#butt-Submit').mouseClicked(submitPoints);
    select('#butt-Undo').mouseClicked(undoLastSelection);
  } else {
    noCanvas();
    //console.log("constellationData is not defined on this page.");
  }
}

function draw() {
  if (typeof constellationData !== 'undefined') {
    background(imgBig);
    displayPoints();
    displayConnected();
    displayElastic();
    // Display mouse coordinates
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) { // Check if mouse is within canvas
      text(`X: ${mouseX}, Y: ${mouseY}`, mouseX + 10, mouseY + 20); // Display coordinates near the mouse cursor
    }
  }
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
        text(i, x + pointRadius + 2, y + 5);
}
}

function mouseClicked() {
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
        connectPoints(selectedPoints[i], selectedPoints[i + 1]);
    }
}

function connectPoints(pi1, pi2) {
    var p1 = points[pi1];
    var p2 = points[pi2];
    push();
    stroke(255); // Set the stroke color to white
    strokeWeight(5);
    line(p1[0], p1[1], p2[0], p2[1]);
    pop();
}

function displayElastic() {
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

function buildConnectionMap(points, pointsSelected) {
    // Initialize connectionMap with empty arrays
    const connectionMap = new Array(points.length).fill(null).map(() => []);

    // Loop through pointsSelected to map connections
    for (let i = 0; i < pointsSelected.length - 1; i++) {
        const current = pointsSelected[i];
        const next = pointsSelected[i + 1];

        // Check if indices are within bounds
        if (current < 0 || current >= points.length || next < 0 || next >= points.length) {
            console.error("Index out of bounds:", current, next);
            continue; // Skip invalid indices
        }

        // Add next to current's list if not already present
        if (!connectionMap[current].includes(next)) {
            connectionMap[current].push(next);
        }

        // Add current to next's list if not already present
        if (!connectionMap[next].includes(current)) {
            connectionMap[next].push(current);
        }
    }

    return connectionMap;
}

function isCorrect(correctMatch, input) {
    const correctFormatted = correctMatch.map(subArray =>
        subArray.map(pair => pair.sort((a, b) => a - b).join(',')).join('|')
    );
    const inputFormatted = input.map(pair =>
        pair.slice().sort((a, b) => a - b).join(',')
    ).join('|');
    return correctFormatted.includes(inputFormatted);
}



function submitPoints() {
  let connections = buildConnectionMap(points, selectedPoints);
  let isSuccess = isCorrect(correctMatch, connections);
  let currentId = consl; // Ensure this is defined somewhere in your script, possibly injected from Flask template

  console.log(isSuccess ? "Successful" : "Unsuccessful");

  // Reset game state
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
          success: isSuccess,
          id: currentId
      })
  }).then(response => response.json())
    .then(data => {
      console.log('Response from server:', data.message);
      if (data.status === "success") {
        currentId++;
        // Redirect to the next quiz item
        console.log(currentId);
        if (currentId<5){
           window.location.href = `/view/${currentId}`;
        }
        else {
          window.location.href = '/summary';
        }
      } else {
        // Handle errors or unsuccessful attempts here
        console.error('Failed to submit results:', data.message);
      }
  }).catch(error => console.error('Error:', error));
}
