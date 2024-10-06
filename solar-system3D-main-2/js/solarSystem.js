// Import Three.js and OrbitControls
import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";

// Create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Texture loader
const textureLoader = new THREE.TextureLoader();

// Load all textures
const starTexture = textureLoader.load("./image/stars.jpg");
const sunTexture = textureLoader.load("./image/sun.jpg");
const mercuryTexture = textureLoader.load("./image/mercury.jpg");
const venusTexture = textureLoader.load("./image/venus.jpg");
const earthTexture = textureLoader.load("./image/earth.jpg");
const marsTexture = textureLoader.load("./image/mars.jpg");
const jupiterTexture = textureLoader.load("./image/jupiter.jpg");
const saturnTexture = textureLoader.load("./image/saturn.jpg");
const uranusTexture = textureLoader.load("./image/uranus.jpg");
const neptuneTexture = textureLoader.load("./image/neptune.jpg");
const plutoTexture = textureLoader.load("./image/pluto.jpg");
const saturnRingTexture = textureLoader.load("./image/saturn_ring.png");
const uranusRingTexture = textureLoader.load("./image/uranus_ring.png");

// Create scene
const scene = new THREE.Scene();

// Set background
const cubeTextureLoader = new THREE.CubeTextureLoader();
const cubeTexture = cubeTextureLoader.load([
  starTexture,
  starTexture,
  starTexture,
  starTexture,
  starTexture,
  starTexture,
]);
scene.background = cubeTexture;

// Perspective Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-50, 90, 150);

// OrbitControls
const orbit = new OrbitControls(camera, renderer.domElement);

// Sun
const sungeo = new THREE.SphereGeometry(15, 50, 50);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture,
});
const sun = new THREE.Mesh(sungeo, sunMaterial);
scene.add(sun);

// Sun light (point light)
const sunLight = new THREE.PointLight(0xffffff, 4, 300);
scene.add(sunLight);

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
scene.add(ambientLight);

// Add stars to the scene
function addStars() {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
  });

  const starVertices = [];
  for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = -Math.random() * 2000;
    starVertices.push(x, y, z);
  }

  starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starVertices, 3)
  );

  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}

addStars();

// Paths for planets
const path_of_planets = [];
function createLineLoopWithMesh(radius, color, width) {
  const material = new THREE.LineBasicMaterial({
    color: color,
    linewidth: width,
  });
  const geometry = new THREE.BufferGeometry();
  const lineLoopPoints = [];
  const numSegments = 100;
  for (let i = 0; i <= numSegments; i++) {
    const angle = (i / numSegments) * Math.PI * 2;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    lineLoopPoints.push(x, 0, z);
  }
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(lineLoopPoints, 3)
  );
  const lineLoop = new THREE.LineLoop(geometry, material);
  scene.add(lineLoop);
  path_of_planets.push(lineLoop);
}

// Create planet
const generatePlanet = (size, planetTexture, x, ring, name, description) => {
  const planetGeometry = new THREE.SphereGeometry(size, 50, 50);
  const planetMaterial = new THREE.MeshStandardMaterial({
    map: planetTexture,
  });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  const planetObj = new THREE.Object3D();
  planet.position.set(x, 0, 0);
  planet.userData = { name: name, size: size, distance: x, description: description }; // Add planet details to userData

  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: ring.ringmat,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    planetObj.add(ringMesh);
    ringMesh.position.set(x, 0, 0);
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  scene.add(planetObj);
  planetObj.add(planet);
  createLineLoopWithMesh(x, 0xffffff, 3);
  return {
    planetObj: planetObj,
    planet: planet,
  };
};

// Generate planets with descriptions
const planets = [
  {
    ...generatePlanet(3.2, mercuryTexture, 28, null, 'Mercury', 'Mercury is the closest planet to the Sun and has no atmosphere.'),
    rotaing_speed_around_sun: 0.004,
    self_rotation_speed: 0.004,
  },
  {
    ...generatePlanet(5.8, venusTexture, 44, null, 'Venus', 'Venus is known as the Earth\'s twin, with a thick atmosphere.'),
    rotaing_speed_around_sun: 0.015,
    self_rotation_speed: 0.002,
  },
  {
    ...generatePlanet(6, earthTexture, 62, null, 'Earth', 'Earth is the only planet known to support life.'),
    rotaing_speed_around_sun: 0.01,
    self_rotation_speed: 0.02,
  },
  {
    ...generatePlanet(4, marsTexture, 78, null, 'Mars', 'Mars is often called the Red Planet and has polar ice caps.'),
    rotaing_speed_around_sun: 0.008,
    self_rotation_speed: 0.018,
  },
  {
    ...generatePlanet(12, jupiterTexture, 100, null, 'Jupiter', 'Jupiter is the largest planet in the Solar System with a Great Red Spot.'),
    rotaing_speed_around_sun: 0.002,
    self_rotation_speed: 0.04,
  },
  {
    ...generatePlanet(10, saturnTexture, 138, {
      innerRadius: 10,
      outerRadius: 20,
      ringmat: saturnRingTexture,
    }, 'Saturn', 'Saturn is known for its stunning rings and many moons.'),
    rotaing_speed_around_sun: 0.0009,
    self_rotation_speed: 0.038,
  },
  {
    ...generatePlanet(7, uranusTexture, 176, {
      innerRadius: 7,
      outerRadius: 12,
      ringmat: uranusRingTexture,
    }, 'Uranus', 'Uranus is unique for its sideways rotation and blue-green color.'),
    rotaing_speed_around_sun: 0.0004,
    self_rotation_speed: 0.03,
  },
  {
    ...generatePlanet(7, neptuneTexture, 200, null, 'Neptune', 'Neptune is the farthest planet from the Sun and has a dynamic atmosphere.'),
    rotaing_speed_around_sun: 0.0001,
    self_rotation_speed: 0.032,
  },
  {
    ...generatePlanet(2.8, plutoTexture, 216, null, 'Pluto', 'Pluto is classified as a dwarf planet and features mountains made of ice.'),
    rotaing_speed_around_sun: 0.0007,
    self_rotation_speed: 0.008,
  },
];

// Raycaster and mouse vector
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Create a div element to display planet information in a sidebar (now on the left)
const sidebar = document.createElement('div');
sidebar.style.position = 'absolute';
sidebar.style.left = '0';  // Position sidebar on the left
sidebar.style.top = '0';
sidebar.style.width = '300px';
sidebar.style.height = '100%';
sidebar.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
sidebar.style.color = 'white';
sidebar.style.padding = '20px';
sidebar.style.display = 'none'; // Hidden initially
sidebar.style.overflowY = 'auto'; // Scroll if content overflows
sidebar.style.borderRight = '2px solid #ffffff';  // Add a border for a more advanced look
document.body.appendChild(sidebar);

// Add a title for the sidebar
const sidebarTitle = document.createElement('h2');
sidebarTitle.style.borderBottom = '1px solid #fff';  // Add a border under the title
sidebarTitle.style.paddingBottom = '10px';  // Add some padding under the title
sidebarTitle.style.marginBottom = '20px';  // Add margin below the title
sidebar.appendChild(sidebarTitle);

// Add a paragraph for planet information
const sidebarInfo = document.createElement('p');
sidebarInfo.style.lineHeight = '1.6';  // Improve line spacing for better readability
sidebarInfo.style.listStyleType = 'bullet';  // Add bullet points
sidebar.appendChild(sidebarInfo);


// Create a div element for displaying the current date and time
const dateTimeDiv = document.createElement('div');
dateTimeDiv.style.position = 'absolute';
dateTimeDiv.style.top = '10px';
dateTimeDiv.style.left = '50%';
dateTimeDiv.style.transform = 'translateX(-50%)';
dateTimeDiv.style.fontSize = '24px';
dateTimeDiv.style.fontWeight = 'bold';
dateTimeDiv.style.color = 'white';
document.body.appendChild(dateTimeDiv);

// Function to update the date and time
function updateDateTime() {
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const time = now.toLocaleTimeString();
  dateTimeDiv.textContent = `${day}, ${time}`;
}
setInterval(updateDateTime, 1000); // Update every second

// Create an "i" button at the top-right corner for solar system information
const infoButton = document.createElement('button');
infoButton.textContent = 'i';
infoButton.style.position = 'absolute';
infoButton.style.top = '10px';
infoButton.style.right = '10px';
infoButton.style.fontSize = '24px';
infoButton.style.color = 'white';
infoButton.style.backgroundColor = 'transparent';
infoButton.style.border = 'none';
infoButton.style.cursor = 'pointer';
document.body.appendChild(infoButton);

// Show an alert with general information about the solar system when "i" button is clicked
infoButton.addEventListener('click', () => {
  alert('Welcome to the Solar System Model!\n- Explore planets by clicking on them to learn more.\n- Each planet rotates around the Sun and has its own unique characteristics.\nEnjoy your journey through space!');
});
// Create a div element for displaying solar system information
const infoBox = document.createElement('div');
infoBox.style.position = 'absolute';
infoBox.style.top = '50px';
infoBox.style.right = '10px';
infoBox.style.width = '300px';
infoBox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
infoBox.style.color = 'white';
infoBox.style.padding = '20px';
infoBox.style.border = '2px solid #ffffff';
infoBox.style.display = 'none'; // Hidden initially
infoBox.style.zIndex = '1000'; // Ensure it's above other elements
infoBox.style.borderRadius = '8px'; // Rounded corners
infoBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)'; // Shadow for depth
document.body.appendChild(infoBox);

// Show solar system information when "i" button is clicked
infoButton.addEventListener('click', () => {
  if (infoBox.style.display === 'none') {
    infoBox.style.display = 'block';
    infoBox.innerHTML = `
      <h3>Solar System Overview</h3>
      <p>Our solar system consists of the Sun and the celestial bodies that are bound to it by gravity. This includes:</p>
      <ul>
        <li><strong>8 Major Planets:</strong> Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune</li>
        <li><strong>Dwarf Planets:</strong> Pluto, Eris, Haumea, Makemake, and others</li>
        <li><strong>Moons:</strong> Hundreds of natural satellites orbiting planets</li>
        <li><strong>Asteroids and Comets:</strong> Small bodies made of rock and ice</li>
      </ul>
      <h4>Future Predictions</h4>
      <ul>
        <li>The Sun is expected to enter its red giant phase in about 5 billion years.</li>
        <li>In about 4 billion years, Earth may be engulfed by the Sun.</li>
        <li>The Andromeda Galaxy is predicted to collide with the Milky Way in about 4.5 billion years.</li>
        <li>Life on Earth may adapt or face challenges due to climate change over the coming decades.</li>
      </ul>
      <button id="closeInfoBox" style="background: transparent; border: none; color: white; cursor: pointer;">Close</button>
    `;
  } else {
    infoBox.style.display = 'none'; // Hide if already shown
  }
});

// Add an event listener to close the info box
infoBox.addEventListener('click', (event) => {
  if (event.target.id === 'closeInfoBox') {
    infoBox.style.display = 'none';
  }
});


// Raycasting for planet selection
window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const firstObject = intersects[0].object;
    if (firstObject.userData.name) {
      // Display planet info in sidebar
      sidebar.style.display = 'block';
      sidebar.innerHTML = `
        <h3>${firstObject.userData.name}</h3>
        <p>Size: ${firstObject.userData.size}</p>
        <p>Distance from Sun: ${firstObject.userData.distance} AU</p>
        <p>Description: ${firstObject.userData.description}</p>
      `;
    }
  } else {
    sidebar.style.display = 'none'; // Hide sidebar if no planet is clicked
  }
});



// Mouse click event listener to display planet information
window.addEventListener('click', (event) => {
  // Update mouse variable
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(planets.map(p => p.planet));

  // If there's an intersection, show the planet’s information
  if (intersects.length > 0) {
    const planet = intersects[0].object.userData;

    // Display planet name and description in the sidebar
    sidebar.style.display = 'block';
    sidebarTitle.textContent = planet.name;
    sidebarInfo.innerHTML = `
      <strong>Description:</strong> ${planet.description}<br><br>
      <hr> <!-- Add a horizontal line -->
      <ul>
        <li><strong>Size:</strong> ${planet.size} km</li>
        <li><strong>Distance from Sun:</strong> ${planet.distance} million km</li>
        <li><strong>Fact:</strong> Fascinating information about ${planet.name}</li>
      </ul>
    `;
  } else {
    sidebar.style.display = 'none'; // Hide the sidebar if no planet is clicked
  }
  
});

// Animate the scene
const animate = () => {
  planets.forEach((planet) => {
    planet.planetObj.rotation.y += planet.rotaing_speed_around_sun;
    planet.planet.rotation.y += planet.self_rotation_speed;
  });

  renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);
