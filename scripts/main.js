import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer"
import { generateText, makeTextSprite } from "./utils.js";

const skyLeft = new URL('/images/skybox/left.png', import.meta.url).href
const skyRight = new URL('/images/skybox/right.png', import.meta.url).href
const skyTop = new URL('/images/skybox/top.png', import.meta.url).href
const skyBottom = new URL('/images/skybox/bottom.png', import.meta.url).href
const skyFront = new URL('/images/skybox/front.png', import.meta.url).href
const skyBack = new URL('/images/skybox/back.png', import.meta.url).href

let camera, scene, renderer, raycaster, mousePosition, sphereId;

const clock = new THREE.Clock()
const mouse = new THREE.Vector2();
const target = new THREE.Vector2();
const windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);


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
let box,
  box2,
  box2Obj,
  box3,
  box3Obj,
  octahedron,
  octaOrbit,
  octaMoon,
  octaOrbit2,
  octaMoon2,
  icosahedron,
  icosahedronOrbit,
  icosahedronMoon,
  icosahedronOrbit2,
  icosahedronMoon2,
  skillOrbit,
  sphere,
  book;

init()
animate()

function init() {
  renderer = new THREE.WebGLRenderer();
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 20)

  renderer.shadowMap.enabled = true
  // const control = new OrbitControls(camera, renderer.domElement)

  camera.position.set(0, 0, 10)

  let loadingContainer = document.querySelector('.loading-container')
  let progress = document.getElementById('progress')

  const loadingManager = new THREE.LoadingManager()

  loadingManager.onLoad = function () {
    loadingContainer.style.display = 'none'
  };

  loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
    progress.innerHTML = Math.round((itemsLoaded / itemsTotal) * 100)
  };

  const skyBox = new THREE.CubeTextureLoader(loadingManager)
    .load([
      skyTop,
      skyBottom,
      skyFront,
      skyBack,
      skyRight,
      skyLeft,
    ]);

  scene.background = skyBox

  const welcomeText = generateText({
    text: "welcome to",
    size: 0.25,
    position: [0, 4, 0]
  })
  scene.add(welcomeText)

  const greetingText = generateText({
    text: "Rief Planetary-System",
    size: 0.5,
    position: [0, 3, 0]
  });
  scene.add(greetingText);

  const scrollText = generateText({
    text: "scroll to explore",
    size: 0.25,
    position: [0, -3, 0]
  });
  scene.add(scrollText)

  const hiText = generateText({
    text: "hi, i am",
    size: 0.15,
    position: [0, 3, 18]
  })
  scene.add(hiText)

  const nameText = generateText({
    text: "Rifqi Rosyidi",
    size: 0.5,
    position: [0, 2, 18]
  });
  scene.add(nameText);


  const bioText = generateText({
    text: "Web Developer, Designer",
    size: 0.15,
    position: [0, -2, 18]
  });
  scene.add(bioText);

  const aboutText = generateText({
    text: "About",
    size: 0.4,
    position: [0, 3, 38]
  });
  scene.add(aboutText);

  const aboutDescription = generateText({
    text: `Hi, I am Rifqi, i'm 24. \nWhile I'm a proficient Full-Stack Developer,\nMy expertise is in Front End Development Such as HTML/CSS,\nResponsive Design, UI Design, React.js, Gatsby.js, Three, etc`,
    size: 0.15,
    position: [0, 2, 38]
  });
  scene.add(aboutDescription);

  const skillText = generateText({
    text: "Skill Cloud",
    size: 0.4,
    position: [0, 4.2, 58]
  });
  scene.add(skillText);

  skillOrbit = new THREE.Object3D()
  skillOrbit.position.set(1.75, -1, 58)
  skillOrbit.rotation.z = 30 * Math.PI / 180

  scene.add(skillOrbit)

  var skillHTML = makeTextSprite("HTML",
    { fontsize: 14 });
  skillHTML.position.set(4, 0, 0);
  skillOrbit.add(skillHTML);

  var skillCSS = makeTextSprite("CSS",
    { fontsize: 14 });
  skillCSS.position.set(-2, 1, 0);
  skillOrbit.add(skillCSS);

  var skillJavascript = makeTextSprite("Javascript",
    { fontsize: 14 });
  skillJavascript.position.set(-2, -1, 0);
  skillOrbit.add(skillJavascript);

  var skillReact = makeTextSprite("React.js",
    { fontsize: 14 });
  skillReact.position.set(-4, 1.5, 0);
  skillOrbit.add(skillReact);

  var skillDesign = makeTextSprite("UI Design & Animation",
    { fontsize: 14 });
  skillDesign.position.set(1, 2, 2);
  skillOrbit.add(skillDesign);

  var skillFigma = makeTextSprite("Figma",
    { fontsize: 14 });
  skillFigma.position.set(2, 0, 3);
  skillOrbit.add(skillFigma);

  var skillGsap = makeTextSprite("Gsap",
    { fontsize: 14 });
  skillGsap.position.set(1, 2, 4);
  skillOrbit.add(skillGsap);

  var skillFramer = makeTextSprite("Framer Motion",
    { fontsize: 14 });
  skillFramer.position.set(-1, 0, 2);
  skillOrbit.add(skillFramer);

  var skillThree = makeTextSprite("Three.js",
    { fontsize: 14 });
  skillThree.position.set(0, 2.3, 4);
  skillOrbit.add(skillThree);

  var skillPhp = makeTextSprite("Php",
    { fontsize: 14 });
  skillPhp.position.set(0, 0, -2);
  skillOrbit.add(skillPhp);

  var skillSql = makeTextSprite("My SQL",
    { fontsize: 14 });
  skillSql.position.set(1, 2, -3);
  skillOrbit.add(skillSql);

  var skillPython = makeTextSprite("Python",
    { fontsize: 14 });
  skillPython.position.set(2, 0, -4);
  skillOrbit.add(skillPython);

  const workText = generateText({
    text: "Work & Projects",
    size: 0.4,
    position: [0, 3, 78]
  });
  scene.add(workText);

  const boxGeo = new THREE.BoxGeometry()
  const boxMat = new THREE.MeshPhongMaterial({ color: 0x504A4B, shininess: 100, reflectivity: 100 })
  box = new THREE.Mesh(boxGeo, boxMat)
  scene.add(box)

  box2Obj = new THREE.Object3D()
  const box2Geo = new THREE.BoxGeometry(0.3, 0.3, 0.3)
  const box2Mat = new THREE.MeshPhongMaterial({ color: 0x605A5b, shininess: 100, reflectivity: 100 })
  box2 = new THREE.Mesh(box2Geo, box2Mat)
  box3 = box2.clone()

  box2Obj.add(box2)
  scene.add(box2Obj)
  box2Obj.rotation.x = THREE.MathUtils.degToRad(10)
  box2.position.x = 4

  box3Obj = new THREE.Object3D()
  box3Obj.add(box3)
  box3Obj.rotation.set(0, 0, 0.3)
  box3.position.y = 6
  scene.add(box3Obj)

  const octaGeo = new THREE.OctahedronGeometry()
  const octaMat = new THREE.MeshPhongMaterial({ color: 0x504A4B, shininess: 100, reflectivity: 100 })
  octahedron = new THREE.Mesh(octaGeo, octaMat)
  scene.add(octahedron)
  octahedron.position.set(0, 0, 15)

  octaOrbit = new THREE.Object3D()
  octaOrbit2 = new THREE.Object3D()
  octaOrbit.position.set(0, 0, 15)
  octaOrbit2.position.set(0, 0, 15)

  const octaMoonGeo = new THREE.OctahedronGeometry(0.2)
  octaMoon = new THREE.Mesh(octaMoonGeo, octaMat)
  octaMoon2 = octaMoon.clone()

  octaOrbit.add(octaMoon)
  octaOrbit2.add(octaMoon2)
  scene.add(octaOrbit)
  scene.add(octaOrbit2)

  octaMoon.position.x = 5
  octaMoon2.position.x = 3.5

  const icosahedronGeo = new THREE.IcosahedronGeometry(0.5)
  const icosahedronMat = new THREE.MeshPhongMaterial({ color: 0x504A4B, shininess: 100, reflectivity: 100 })
  icosahedron = new THREE.Mesh(icosahedronGeo, icosahedronMat)
  scene.add(icosahedron)
  icosahedron.position.z = 38
  icosahedron.position.y = -1

  icosahedronOrbit = new THREE.Object3D()
  icosahedronOrbit.position.set(0, -1, 38)
  icosahedronOrbit.rotation.z = 45 * Math.PI / 180

  icosahedronOrbit2 = new THREE.Object3D()
  icosahedronOrbit2.position.set(0, -1, 38)
  icosahedronOrbit2.rotation.z = 35 * Math.PI / 180

  const icosahedronMoonGeo = new THREE.IcosahedronGeometry(0.1)
  icosahedronMoon = new THREE.Mesh(icosahedronMoonGeo, icosahedronMat)
  icosahedronMoon2 = icosahedronMoon.clone()

  icosahedronOrbit.add(icosahedronMoon)
  icosahedronOrbit2.add(icosahedronMoon2)
  scene.add(icosahedronOrbit)
  scene.add(icosahedronOrbit2)
  icosahedronMoon.position.x = 3
  icosahedronMoon2.position.x = -2

  const sphereGeo = new THREE.SphereGeometry(1, 10, 10)
  const sphereMat = new THREE.MeshPhongMaterial({ color: 0x504A4B, shininess: 100, reflectivity: 100 })
  sphere = new THREE.Mesh(sphereGeo, sphereMat)
  scene.add(sphere)
  sphere.position.set(0, 0, 58)

  const bookMesh = new THREE.MeshPhongMaterial({ color: 0x504A4B, shininess: 100, reflectivity: 100 })

  const book1Geo = new THREE.BoxGeometry(0.20, 1, 0.75)
  const book1 = new THREE.Mesh(book1Geo, bookMesh)
  book1.rotation.y = -45 * Math.PI / 180

  const book2Geo = new THREE.BoxGeometry(0.20, 1, 0.75)
  const book2 = new THREE.Mesh(book2Geo, bookMesh)
  book2.position.x = 0.40
  book2.rotation.y = 45 * Math.PI / 180

  book = new THREE.Group()
  book.add(book1)
  book.add(book2)

  scene.add(book)
  book.position.z = 98
  book.rotation.x = -55 * Math.PI / 180

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.25)
  scene.add(ambientLight)

  // ==== DIRECTIONAL LIGHT ===

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
  scene.add(directionalLight)
  directionalLight.position.multiplyScalar(10)
  directionalLight.position.set(30, 20, 20)
  directionalLight.castShadow = true
  directionalLight.shadow.camera.bottom = -12

  // const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
  // scene.add(dLightShadowHelper)

  scene.fog = new THREE.FogExp2(0x222222, 0.04)

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

  box3.rotation.y -= 0.001
  box3.rotation.x += 0.03

  octaOrbit.rotation.y += 0.005
  octaOrbit.rotation.x += 0.001

  octaOrbit2.rotation.y += 0.01
  octaOrbit2.rotation.x += 0.001

  octahedron.rotation.y += 0.005
  octahedron.rotation.x += 0.001

  octaMoon.rotation.y += 0.01

  icosahedron.rotation.y += 0.004
  icosahedron.rotation.x += 0.004

  icosahedronOrbit.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.005)
  icosahedronOrbit2.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.008)

  skillOrbit.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.005)

  icosahedronMoon.rotation.x += 0.04
  icosahedronMoon2.rotation.x += 0.02

  sphere.rotation.x += 0.004
  sphere.rotation.y += 0.002

  box2Obj.rotation.y += 0.01
  box3Obj.rotation.x += 0.003
  box3Obj.rotation.y += 0.003

  target.x = (1 - mouse.x) * 0.0004;
  target.y = (1 - mouse.y) * 0.0004;

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
  if (camera.position.z < 10) {
    camera.position.z = 10
  }
}

function onResize(event) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  windowHalf.set(width / 2, height / 2);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

