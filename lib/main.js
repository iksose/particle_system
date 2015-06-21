import THREE from 'three.js'
import Stats from './stats'
import OrbitControls from './OrbitControls';
import TWEEN from './tween'

var container, stats;
var camera, scene, renderer, particles, geometry, materials = [],
  parameters, i, h, color, size, controls;
var mouseX = 0,
  mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;


// Picking stuff
var raycaster = new THREE.Raycaster();
raycaster.params.PointCloud.threshold = 20;
var mouse = new THREE.Vector2();
var intersects;
//end picking

init();
animate();

function init() {

  container = document.createElement('div');
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
  camera.position.z = 1000;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.0007);

  geometry = new THREE.Geometry();

  for (i = 0; i < 20000; i++) {

    var vertex = new THREE.Vector3();
    vertex.x = Math.random() * 2000 - 1000;
    vertex.y = Math.random() * 2000 - 1000;
    vertex.z = Math.random() * 2000 - 1000;

    geometry.vertices.push(vertex);

  }

  parameters = [
    [
      [1, 1, 0.5], 5
    ],
    [
      [0.95, 1, 0.5], 4
    ],
    [
      [0.90, 1, 0.5], 3
    ],
    [
      [0.85, 1, 0.5], 2
    ],
    [
      [0.80, 1, 0.5], 1
    ]
  ];

  for (i = 0; i < parameters.length; i++) {

    color = parameters[i][0];
    size = parameters[i][1];

    materials[i] = new THREE.PointCloudMaterial({
      size: size
    });

    particles = new THREE.PointCloud(geometry, materials[i]);

    particles.rotation.x = Math.random() * 6;
    particles.rotation.y = Math.random() * 6;
    particles.rotation.z = Math.random() * 6;

    scene.add(particles);

  }

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  container.appendChild(stats.domElement);

  controls = new THREE.OrbitControls(camera);
  controls.damping = 0.2;
  controls.addEventListener('change', render);

  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('click', onClick, false);
  // document.addEventListener('touchstart', onDocumentTouchStart, false);
  // document.addEventListener('touchmove', onDocumentTouchMove, false);


  window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function onClick(event) {
  // camera.lookAt(intersects[0].point);
  var selectedObject = intersects[0];
  console.log(camera.position)
    // camera.position.x = camera.position.x + 10;
  var tween = new TWEEN.Tween(camera.position).to({
    x: camera.position.x + 10,
    y: camera.position.y + 10,
    z: camera.position.z + 10
  }, 2000).easing(TWEEN.Easing.Linear.None).start();
  tween.onUpdate(() => {
    console.log('derp')
  });
  // var tween = new TWEEN.Tween(camera.position).to({
  //   x: selectedObject.point.x,
  //   y: selectedObject.point.y,
  //   z: selectedObject.point.z
  // }).easing(TWEEN.Easing.Linear.None).start();
  //
  // var tween = new TWEEN.Tween(controls.target).to({
  //   x: selectedObject.point.x,
  //   y: selectedObject.point.y,
  //   z: selectedObject.point.z
  // }).easing(TWEEN.Easing.Linear.None).start();
}

function onDocumentMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  // mouseVector.x = 2 * (e.clientX / containerWidth) - 1;
  // mouseVector.y = 1 - 2 * (e.clientY / containerHeight);
  var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
  raycaster.ray.set(camera.position, vector.sub(camera.position).normalize());
  scene.updateMatrixWorld();
  intersects = raycaster.intersectObject(particles);
  console.log(intersects);
}

function onDocumentTouchStart(event) {

  if (event.touches.length === 1) {

    event.preventDefault();

    mouseX = event.touches[0].pageX - windowHalfX;
    mouseY = event.touches[0].pageY - windowHalfY;

  }

}

function onDocumentTouchMove(event) {

  if (event.touches.length === 1) {

    event.preventDefault();

    mouseX = event.touches[0].pageX - windowHalfX;
    mouseY = event.touches[0].pageY - windowHalfY;

  }

}

//

function animate() {

  requestAnimationFrame(animate);

  render();
  stats.update();
  TWEEN.update();

}

function render() {

  renderer.render(scene, camera);

}