import * as THREE from "three";
import { CameraHelper } from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { generateText, makeTextSprite } from "./utils.js";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { LuminosityShader } from 'three/examples/jsm/shaders/LuminosityShader.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

const skyLeft = new URL('/images/skybox/left.png', import.meta.url).href
const skyRight = new URL('/images/skybox/right.png', import.meta.url).href
const skyTop = new URL('/images/skybox/top.png', import.meta.url).href
const skyBottom = new URL('/images/skybox/bottom.png', import.meta.url).href
const skyFront = new URL('/images/skybox/front.png', import.meta.url).href
const skyBack = new URL('/images/skybox/back.png', import.meta.url).href

let camera, scene, renderer, composer, bloomPass, renderPass, fxaaPass, luminosityPass;

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
  octaOrbit3,
  octaMoon2,
  icosahedron,
  icosahedronOrbit,
  icosahedronMoon,
  icosahedronOrbit2,
  icosahedronMoon2,
  skillOrbit,
  smallSphere,
  dodecahedron,
  dodecahedron2,
  dodecahedron3,
  workBox,
  book,
  sphere,
  sphereOrbit,
  octahedron2,
  octahedron3,
  octahedron4
  ;

// navigation
let isFastNext = false, isSlowNext = false, isSlowPrev = false, isFastPrev = false;


const fNext = document.querySelector('.fnext')
const sNext = document.querySelector('.snext')
const sPrev = document.querySelector('.sprev')
const fPrev = document.querySelector('.fprev')

init()
animate()

function init() {
  renderer = new THREE.WebGLRenderer();
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 20)

  renderer.shadowMap.enabled = true
  renderer.setPixelRatio(window.devicePixelRatio);

  renderPass = new RenderPass(scene, camera)
  // renderPass.clearColor = new THREE.Color(0, 0, 0);
  // renderPass.clearAlpha = 0;

  bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.8, 0, 0);
  fxaaPass = new ShaderPass(FXAAShader);
  luminosityPass = new ShaderPass(LuminosityShader);

  composer = new EffectComposer(renderer);
  composer.setSize(window.innerWidth, window.innerHeight)

  const pixelRatio = renderer.getPixelRatio();

  fxaaPass.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * pixelRatio);
  fxaaPass.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * pixelRatio);

  composer.addPass(luminosityPass);
  // const control = new OrbitControls(camera, renderer.domElement)

  composer.addPass(renderPass);
  composer.addPass(fxaaPass)
  composer.addPass(bloomPass);

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
    position: [0, 3, 20]
  })
  scene.add(hiText)

  const nameText = generateText({
    text: "Rifqi Rosyidi",
    size: 0.5,
    position: [0, 2, 20]
  });
  scene.add(nameText);

  const bioText = generateText({
    text: "Web Developer, Designer",
    size: 0.15,
    position: [0, -2, 20]
  });
  scene.add(bioText);

  const aboutText = generateText({
    text: "About",
    size: 0.4,
    position: [0, 3, 40]
  });
  scene.add(aboutText);

  const aboutDescription = generateText({
    text: `Hi, I am Rifqi, i'm 24. \nWhile I'm a proficient Full-Stack Developer,\nMy expertise is in Front End Development Such as HTML/CSS,\nResponsive Design, UI Design, React.js, Gatsby.js, Three, etc`,
    size: 0.15,
    position: [0, 2, 40]
  });
  scene.add(aboutDescription);

  const skillText = generateText({
    text: "Skill Cloud",
    size: 0.4,
    position: [0, 4.2, 60]
  });
  scene.add(skillText);

  skillOrbit = new THREE.Object3D()
  skillOrbit.position.set(1.75, -1, 60)
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
    position: [0, 3, 80]
  });
  scene.add(workText);

  const workDescription = generateText({
    text: "Here's the list of projects & works\nthat i'v done",
    size: 0.15,
    position: [0, 2, 80]
  });
  scene.add(workDescription);

  const workQuran = generateText({
    text: "Project - Quranin",
    size: 0.3,
    position: [0, 3, 100]
  });
  scene.add(workQuran);

  const workQuranDesc = generateText({
    text: "Simple Quran App\nInspired from quranly mobile",
    size: 0.15,
    position: [0, 2, 100]
  });
  scene.add(workQuranDesc);

  const workBlog = generateText({
    text: "Project - Devtoopia",
    size: 0.3,
    position: [0, 3, 120]
  });
  scene.add(workBlog);

  const workBlogDesc = generateText({
    text: "Personal blog for note & writing\narticles about development & design",
    size: 0.15,
    position: [0, 2, 120]
  });
  scene.add(workBlogDesc);

  const workRecipe = generateText({
    text: "Project - AnyRecipes",
    size: 0.3,
    position: [0, 3, 140]
  });
  scene.add(workRecipe);

  const workRecipeDesc = generateText({
    text: "Simple Recipe App\nBuild using Edamam API",
    size: 0.15,
    position: [0, 2, 140]
  });
  scene.add(workRecipeDesc);

  const endText = generateText({
    text: "Thank you for exploring.\nYou've now outside Rief Planetary-System\nWe're now heading towards Rief Star-System",
    size: 0.2,
    position: [0, 0, 170]
  });
  scene.add(endText);

  const warpText = generateText({
    text: "Warp Drive Sequence\nWill be Activated",
    size: 0.2,
    position: [0, 0, 190]
  });
  scene.add(warpText);
  const warp3 = generateText({
    text: "3",
    size: 0.2,
    position: [0, 0, 195]
  });
  scene.add(warp3);
  const warp2 = generateText({
    text: "2",
    size: 0.2,
    position: [0, 0, 200]
  });
  scene.add(warp2);
  const warp1 = generateText({
    text: "1",
    size: 0.2,
    position: [0, 0, 205]
  });
  scene.add(warp1);

  const vertices = [];

  for (let i = 0; i < 15000; i++) {
    const x = THREE.MathUtils.randFloatSpread(120);
    const y = THREE.MathUtils.randFloatSpread(120);
    const z = THREE.MathUtils.randFloatSpread(2000);
    vertices.push(x, y, z);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

  const material = new THREE.PointsMaterial({ size: 0.02, color: 0xffffff });
  const points = new THREE.Points(geometry, material);

  scene.add(points);

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
  icosahedron.position.z = 40
  icosahedron.position.y = -1

  icosahedronOrbit = new THREE.Object3D()
  icosahedronOrbit.position.set(0, -1, 40)
  icosahedronOrbit.rotation.z = 45 * Math.PI / 180

  icosahedronOrbit2 = new THREE.Object3D()
  icosahedronOrbit2.position.set(0, -1, 40)
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

  const sphereSmallGeo = new THREE.SphereGeometry(0.1, 25, 25)
  const sphereSmallMat = new THREE.MeshPhongMaterial({ color: 0x504A4B, shininess: 100, reflectivity: 100 })
  smallSphere = new THREE.Mesh(sphereSmallGeo, sphereSmallMat)
  scene.add(smallSphere)
  smallSphere.position.set(0, 0, 60)

  const dodecahedronGeo = new THREE.DodecahedronGeometry()
  const dodecahedronMesh = new THREE.MeshPhongMaterial({ color: 0x504A4B, shininess: 100, reflectivity: 100 })
  dodecahedron = new THREE.Mesh(dodecahedronGeo, dodecahedronMesh)

  const dodecahedron2Geo = new THREE.DodecahedronGeometry(0.3)
  const dodecahedron2Mesh = new THREE.MeshPhongMaterial({ color: 0x504A4B, shininess: 100, reflectivity: 100 })
  dodecahedron2 = new THREE.Mesh(dodecahedron2Geo, dodecahedron2Mesh)

  const dodecahedron3Geo = new THREE.DodecahedronGeometry(0.14)
  const dodecahedron3Mesh = new THREE.MeshPhongMaterial({ color: 0x504A4B, shininess: 100, reflectivity: 100 })
  dodecahedron3 = new THREE.Mesh(dodecahedron3Geo, dodecahedron3Mesh)

  // dodecahedron.position.set(0, 0, 80)
  workBox = new THREE.Group()
  workBox.add(dodecahedron)
  workBox.add(dodecahedron2)

  dodecahedron2.add(dodecahedron3)
  dodecahedron3.position.x = 1


  workBox.rotateZ(0.25)
  dodecahedron.position.x = -1
  dodecahedron2.position.x = 5

  scene.add(workBox)
  workBox.position.set(0, -2, 80)


  const bookMesh = new THREE.MeshPhongMaterial({ color: 0x504A4B, shininess: 100, reflectivity: 100 })
  const book1Geo = new THREE.BoxGeometry(0.1, 1, 0.75)
  const book1 = new THREE.Mesh(book1Geo, bookMesh)
  book1.rotation.y = -45 * Math.PI / 180

  const book2Geo = new THREE.BoxGeometry(0.1, 1, 0.75)
  const book2 = new THREE.Mesh(book2Geo, bookMesh)
  book2.position.x = 0.40
  book2.rotation.y = 45 * Math.PI / 180

  book = new THREE.Group()
  book.add(book1)
  book.add(book2)

  scene.add(book)
  book.position.z = 100
  book.rotation.x = -55 * Math.PI / 180



  const blackSphereGeo = new THREE.SphereGeometry(1, 10, 10)
  const blackSphereMat = new THREE.MeshPhongMaterial({ color: 0x504A4B, shininess: 100, reflectivity: 100, wireframe: true })
  const blackSphere = new THREE.Mesh(blackSphereGeo, blackSphereMat)

  sphereOrbit = new THREE.Object3D()
  sphereOrbit.position.set(0, -1, 120)
  sphereOrbit.rotation.z = 0.25

  sphereOrbit.add(blackSphere)
  scene.add(sphereOrbit)


  octaOrbit3 = new THREE.Group()
  octaOrbit3.position.set(0, -1, 140)

  const octahedron2Geo = new THREE.OctahedronGeometry(0.2)
  const octahedron2Mat = new THREE.MeshPhongMaterial({ color: 0x504A4B, shininess: 100, reflectivity: 100 })
  octahedron2 = new THREE.Mesh(octahedron2Geo, octahedron2Mat)
  octaOrbit3.add(octahedron2)

  const octahedron3Geo = new THREE.OctahedronGeometry(0.2)
  const octahedron3Mat = new THREE.MeshPhongMaterial({ color: 0x504A4B, shininess: 100, reflectivity: 100 })
  octahedron3 = new THREE.Mesh(octahedron3Geo, octahedron3Mat)
  octahedron3.position.x = 2
  octaOrbit3.add(octahedron3)

  const octahedron4Geo = new THREE.OctahedronGeometry(0.2)
  const octahedron4Mat = new THREE.MeshPhongMaterial({ color: 0x504A4B, shininess: 100, reflectivity: 100 })
  octahedron4 = new THREE.Mesh(octahedron4Geo, octahedron4Mat)
  octahedron4.position.x = -2
  octaOrbit3.add(octahedron4)

  scene.add(octaOrbit3)

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

  // Navigation


  fNext.addEventListener('click', fastNextNavigation, false)
  sNext.addEventListener('click', slowNextNavigation, false)
  sPrev.addEventListener('click', slowPrevNavigation, false)
  fPrev.addEventListener('click', fastPrevNavigation, false)

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

  smallSphere.rotation.x += 0.004
  smallSphere.rotation.y += 0.002

  box2Obj.rotation.y += 0.01
  box3Obj.rotation.x += 0.003
  box3Obj.rotation.y += 0.003

  dodecahedron.rotation.x += 0.004
  dodecahedron.rotation.y += 0.004

  dodecahedron2.rotation.y += 0.03

  workBox.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.005)

  target.x = (1 - mouse.x) * 0.0004;
  target.y = (1 - mouse.y) * 0.0004;

  book.rotation.z += 0.003

  sphereOrbit.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.005)

  octaOrbit3.rotation.y += 0.004

  camera.rotation.x += 0.005 * (target.y - camera.rotation.x);
  camera.rotation.y += 0.005 * (target.x - camera.rotation.y);

  // faster travel
  if (isFastNext) {
    if (camera.fov < 100) {
      camera.fov += 0.2
      camera.updateProjectionMatrix()
    }
    camera.position.z += 0.1
  } else if (isFastPrev && camera.position.z > 10) {
    if (camera.fov > 75) {
      camera.fov -= 0.2
      camera.updateProjectionMatrix()
    }
    camera.position.z -= 0.1
  } else {
    if (camera.fov > 75) {
      camera.fov -= 0.2
      camera.updateProjectionMatrix()
    }
  }

  // slow travel
  if (isSlowNext) {
    camera.position.z += 0.02
  }

  if (isSlowPrev) {
    camera.position.z -= 0.02
  }

  // warp drive
  if (camera.position.z > 210 && camera.position.z < 600) {
    if (camera.fov < 170) {
      camera.fov += 0.4
      camera.updateProjectionMatrix()
    }
    camera.position.z += 0.5
  } else {
    if (camera.fov > 75) {
      camera.fov -= 0.4
      camera.updateProjectionMatrix()
    }
  }





  requestAnimationFrame(animate)
  composer.render()
}

function fastNextNavigation(event) {
  isFastNext = !isFastNext
  if (fNext.classList.contains('active')) {
    fNext.classList.remove('active')
  } else {
    fNext.classList.add('active')
  }
}

function slowNextNavigation(event) {
  isSlowNext = !isSlowNext
  if (sNext.classList.contains('active')) {
    sNext.classList.remove('active')
  } else {
    sNext.classList.add('active')
  }
}

function slowPrevNavigation(event) {
  isSlowPrev = !isSlowPrev
  if (sPrev.classList.contains('active')) {
    sPrev.classList.remove('active')
  } else {
    sPrev.classList.add('active')
  }
}

function fastPrevNavigation(event) {
  isFastPrev = !isFastPrev
  if (fPrev.classList.contains('active')) {
    fPrev.classList.remove('active')
  } else {
    fPrev.classList.add('active')
  }
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

