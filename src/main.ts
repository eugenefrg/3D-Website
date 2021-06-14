import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  MeshStandardMaterial,
  PointLight,
  AmbientLight,
  PointLightHelper,
  GridHelper,
  SphereGeometry,
  MathUtils,
  TextureLoader,
  AnimationMixer,
} from "three";
import "./style.css";
import space from "./images/space.jpg";
import moonTextureImage from "./images/moon.png";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new Scene();

const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const initialCameraPosition = { x: 0, y: 0, z: 15 };

const renderer = new WebGLRenderer({
  canvas: document.querySelector("#bg") as HTMLCanvasElement,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(initialCameraPosition.z);

//PointLight
const pointLight = new PointLight("white");
pointLight.position.set(-15, 15, 15);
scene.add(pointLight);

//Ambient light
const ambientLight = new AmbientLight("white");
scene.add(ambientLight);

const lightHelper = new PointLightHelper(pointLight);
const gridHelper = new GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

// to handle mouse movement by dragging (?)
const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new SphereGeometry(0.25, 24, 24);
  const material = new MeshStandardMaterial({ color: 0xffffff });
  const star = new Mesh(geometry, material);
  const [x, y, z] = Array(3)
    .fill(0)
    .map(() => MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(200)
  .fill(0)
  .forEach(() => addStar());

//bruh the texture of le background
const spaceTexture = new TextureLoader().load(space);
scene.background = spaceTexture;

//moon
const moonTexture = new TextureLoader().load(moonTextureImage);
//normalMap - would be able to add map on this to make bumps - but learn that later
const moon = new Mesh(
  new SphereGeometry(3, 32, 32),
  new MeshStandardMaterial({
    map: moonTexture,
  })
);

moon.position.z = 30;
// this one is same as animate() function below - does same thing (?)
moon.position.setX(-10);

scene.add(moon);

let eugene: any;
try {
  const loader = new GLTFLoader();
  loader.load("./assets/randomstickman.glb", (gltf) => {
    eugene = gltf.scene;
    scene.add(eugene);
  });
} catch (e) {
  console.log(e);
}

let uglyBird: any;
let uglyBirdMixer: any;
try {
  const loader = new GLTFLoader();
  loader.load("./assets/ugly_bird.glb", (gltf) => {
    uglyBird = gltf.scene;

    uglyBird.position.z = 20;
    uglyBird.position.x = 20;
    uglyBird.position.y = 10;

    uglyBirdMixer = new AnimationMixer(uglyBird);
    console.log(gltf.animations);
    const clip1 = gltf.animations[0];
    const action1 = uglyBirdMixer.clipAction(clip1);
    action1.play();
    scene.add(uglyBird);
  });
} catch (e) {
  console.log(e);
}

let donut: any;
try {
  const loader = new GLTFLoader();
  loader.load("./assets/my_first_donut.glb", (gltf) => {
    donut = gltf.scene;
    donut.scale.set(200, 200, 200);
    donut.rotation.set(-80.5, 0, 0);

    scene.add(donut);
  });
} catch (e) {
  console.log(e);
}

const moveCamera = (): any => {
  const t = document.body.getBoundingClientRect().top;
  camera.position.z = t * -0.01 + 15;
  camera.position.x = t * -0.002;
  camera.position.y = t * -0.001;
  camera.rotation.y = t * -0.00002;
  console.log("henlo");
};
document.body.onscroll = () => {
  moveCamera();
};

function animate() {
  requestAnimationFrame(animate);
  if (uglyBirdMixer) {
    uglyBirdMixer.update(0.05);
  }
  eugene ? (eugene.rotation.y += 0.01) : null;
  if (donut) {
    donut.rotation.y += 0.0025;
  }
  moon.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}

animate();
