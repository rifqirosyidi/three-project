import * as THREE from "three";

import { generateText } from "./utils.js";

const skyLeft = new URL('/images/skybox/left.png', import.meta.url).href
const skyRight = new URL('/images/skybox/right.png', import.meta.url).href
const skyTop = new URL('/images/skybox/top.png', import.meta.url).href
const skyBottom = new URL('/images/skybox/bottom.png', import.meta.url).href
const skyFront = new URL('/images/skybox/front.png', import.meta.url).href
const skyBack = new URL('/images/skybox/back.png', import.meta.url).href

console.log(skyLeft)


let camera, scene, renderer, raycaster, mousePosition, sphereId;

const clock = new THREE.Clock()
const mouse = new THREE.Vector2();
const target = new THREE.Vector2();
const windowHalf = new THREE.Vector2(window.innerWidth / 6, window.innerHeight / 6);


const options = {
  sphereColor: '#ffeaee',
  wireframe: false,
  speed: 0.01,
  angle: 0.2,
  penumbra: 0,
  intensity: 1
}

const uniforms = {
  u_time: { type: 'f', value: 0.0 },
  u_res: { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight).multiplyScalar(window.devicePixelRatio) }
}

// Objects
let box, box2, box2Obj, sphere;

init()
animate()

function init() {
  renderer = new THREE.WebGLRenderer();
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

  renderer.shadowMap.enabled = true
  camera.position.set(0, 0, 10)

  const skyBox = new THREE.CubeTextureLoader()
    .load([
      skyLeft,
      skyRight,
      skyFront,
      skyBack,
      skyTop,
      skyBottom,
    ]);

  scene.background = skyBox

  const textureLoader = new THREE.TextureLoader()

  const greetingText = generateText(
    "Hi, Welcome to \nMy Portfolio :)",
    [0, 30, 30],
    [0, 0, 0]
  );
  scene.add(greetingText);

  const boxGeo = new THREE.BoxGeometry()
  const boxMat = new THREE.MeshPhongMaterial({ color: 0x504A4B, shininess: 100, reflectivity: 100 })
  box = new THREE.Mesh(boxGeo, boxMat)
  scene.add(box)

  box2Obj = new THREE.Object3D()
  const box2Geo = new THREE.BoxGeometry(0.3, 0.3, 0.3)
  const box2Mat = new THREE.MeshPhongMaterial({ color: 0x605A5b, shininess: 100, reflectivity: 100 })
  box2 = new THREE.Mesh(box2Geo, box2Mat)
  box2Obj.add(box2)
  scene.add(box2Obj)
  box2Obj.rotation.x = THREE.MathUtils.degToRad(10)
  box2.position.x = 4

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  // ==== DIRECTIONAL LIGHT ===

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  scene.add(directionalLight)
  directionalLight.position.multiplyScalar(10)
  directionalLight.position.set(-30, 20, 20)
  directionalLight.castShadow = true
  directionalLight.shadow.camera.bottom = -12

  // const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
  // scene.add(dLightShadowHelper)

  scene.fog = new THREE.FogExp2(0x222222, 0.02)





  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  document.addEventListener('mousemove', onMouseMove, false);
  document.addEventListener('wheel', onMouseWheel, false);
  window.addEventListener('resize', onResize, false);

}


function animate() {
  uniforms.u_time.value = clock.getElapsedTime()

  box.rotation.x -= 0.001
  box.rotation.y += 0.02

  box2.rotation.y += 0.02
  box2.rotation.x -= 0.001

  box2Obj.rotation.y += 0.01



  target.x = (1 - mouse.x) * 0.0003;
  target.y = (1 - mouse.y) * 0.0003;

  camera.rotation.x += 0.005 * (target.y - camera.rotation.x);
  camera.rotation.y += 0.005 * (target.x - camera.rotation.y);


  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}


function onMouseMove(event) {
  mouse.x = (event.clientX - windowHalf.x);
  mouse.y = (event.clientY - windowHalf.x);
}

function onMouseWheel(event) {
  camera.position.z += event.deltaY * 0.01; // move camera along z-axis
}

function onResize(event) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  windowHalf.set(width / 2, height / 2);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

