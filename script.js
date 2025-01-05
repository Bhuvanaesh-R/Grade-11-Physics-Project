const img = document.getElementById('movable-image');
const stats = document.getElementById('motion-stats');

const distanceTimeCtx = document.getElementById('distance-time-graph').getContext('2d');
const velocityTimeCtx = document.getElementById('velocity-time-graph').getContext('2d');
const accelerationTimeCtx = document.getElementById('acceleration-time-graph').getContext('2d'); // New Graph

let isMoving = false;
let lastPosition = { x: 0, y: 0 };
let lastTime = Date.now();
let speed = 0;
let acceleration = 0;
let distanceMoved = 0;
let prevSpeed = 0;

let motionData = [];
let startTime = Date.now();
let imageIsClicked = false; // Track if the image was clicked

// Initialize Graphs
const distanceTimeChart = new Chart(distanceTimeCtx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Distance vs Time',
      data: [],
      borderColor: 'blue',
      fill: false,
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: 'Time (s)' },
        ticks: { stepSize: 5 }
      },
      y: {
        title: { display: true, text: 'Distance (px)' }
      }
    }
  }
});

const velocityTimeChart = new Chart(velocityTimeCtx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Velocity vs Time',
      data: [],
      borderColor: 'green',
      fill: false,
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: 'Time (s)' },
        ticks: { stepSize: 5 }
      },
      y: {
        title: { display: true, text: 'Velocity (px/s)' }
      }
    }
  }
});

const accelerationTimeChart = new Chart(accelerationTimeCtx, { // New Graph
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Acceleration vs Time',
      data: [],
      borderColor: 'red',
      fill: false,
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: 'Time (s)' },
        ticks: { stepSize: 5 }
      },
      y: {
        title: { display: true, text: 'Acceleration (px/s²)' }
      }
    }
  }
});

img.addEventListener('mousedown', (e) => {
  isMoving = true;
  imageIsClicked = true; // Image is clicked, set this to true
  img.style.cursor = 'grabbing';
  lastPosition = { x: e.clientX, y: e.clientY };
  lastTime = Date.now();
  distanceMoved = 0;
  prevSpeed = 0;
  motionData = [];
  startTime = Date.now();
});

document.addEventListener('mousemove', (e) => {
  if (isMoving) {
    const currentX = e.clientX;
    const currentY = e.clientY;

    const deltaX = currentX - lastPosition.x;
    const deltaY = currentY - lastPosition.y;

    const currentTime = Date.now();
    const timeDiff = (currentTime - lastTime) / 1000;

    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    distanceMoved += distance;

    const currentSpeed = distance / timeDiff;
    acceleration = (currentSpeed - prevSpeed) / timeDiff;

    img.style.left = `${currentX - img.width / 2}px`;
    img.style.top = `${currentY - img.height / 2}px`;

    speed = currentSpeed;
    prevSpeed = currentSpeed;
    lastPosition = { x: currentX, y: currentY };
    lastTime = currentTime;

    motionData.push({
      time: (Date.now() - startTime) / 1000,
      distance: distanceMoved,
      speed: speed,
      acceleration: acceleration
    });

    updateStats();
  }
});

// Modify mouseup to only reset if the image was clicked and dragged
document.addEventListener('mouseup', () => {
  if (imageIsClicked) { // Only reset if the image was clicked and dragged
    isMoving = false;
    img.style.cursor = 'grab';
    resetGraphs(); // Reset graphs after mouseup
    clearStats(); // Clear stats after mouseup
    updateGraphs();
    imageIsClicked = false; // Reset image clicked status
  }
});

function updateStats() {
  stats.innerHTML = `
    <p>Position: (${Math.round(parseInt(img.style.left) || 0)}, ${Math.round(parseInt(img.style.top) || 0)})</p>
    <p>Speed: ${speed.toFixed(2)} px/s</p>
    <p>Velocity: ${speed.toFixed(2)} px/s</p> <!-- Added Velocity -->
    <p>Acceleration: ${acceleration.toFixed(2)} px/s²</p>
    <p>Distance Moved: ${distanceMoved.toFixed(2)} px</p>
  `;
}

function clearStats() {
  // Clear stats after mouseup
  stats.innerHTML = '';
}

function updateGraphs() {
  motionData.forEach(dataPoint => {
    const time = dataPoint.time.toFixed(2);

    distanceTimeChart.data.labels.push(time);
    distanceTimeChart.data.datasets[0].data.push(dataPoint.distance.toFixed(2));

    velocityTimeChart.data.labels.push(time);
    velocityTimeChart.data.datasets[0].data.push(dataPoint.speed.toFixed(2));

    accelerationTimeChart.data.labels.push(time); // Update Acceleration Graph
    accelerationTimeChart.data.datasets[0].data.push(dataPoint.acceleration.toFixed(2));
  });

  distanceTimeChart.update();
  velocityTimeChart.update();
  accelerationTimeChart.update(); // Update Acceleration Graph
}

// Function to reset all graphs
function resetGraphs() {
  // Clear data and reset labels for all charts
  distanceTimeChart.data.labels = [];
  distanceTimeChart.data.datasets[0].data = [];

  velocityTimeChart.data.labels = [];
  velocityTimeChart.data.datasets[0].data = [];

  accelerationTimeChart.data.labels = [];
  accelerationTimeChart.data.datasets[0].data = [];

  distanceTimeChart.update();
  velocityTimeChart.update();
  accelerationTimeChart.update();
}
