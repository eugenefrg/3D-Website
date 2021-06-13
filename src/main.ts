import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    TorusGeometry,
    Mesh,
    MeshStandardMaterial,
    PointLight,
    AmbientLight,
    PointLightHelper,
    GridHelper,
    SphereGeometry,
    MathUtils,
    TextureLoader
} from "three"
import "./style.css"
import space from "./images/space.jpg"
import moonTextureImage from "./images/moon.png"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new Scene();

const camera = new PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)

const renderer = new WebGLRenderer({
    canvas: document.querySelector("#bg") as HTMLCanvasElement
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth,window.innerHeight)
camera.position.setZ(15)

const geometry = new TorusGeometry( 10, 3, 16, 100)

const material = new MeshStandardMaterial({color: 0xFF6347})

const torus = new Mesh(geometry,material)

scene.add(torus)

const pointLight = new PointLight("white")

pointLight.position.set(-15,15,15)
scene.add(pointLight)

const ambientLight = new AmbientLight("white")

scene.add(ambientLight)

const lightHelper = new PointLightHelper(pointLight)
const gridHelper = new GridHelper(200,50)

scene.add(lightHelper,gridHelper)

// to handle mouse movement by dragging (?)
// const controls = new OrbitControls(camera,renderer.domElement);

function addStar() {
    const geometry = new SphereGeometry(0.25,24,24)
    const material = new MeshStandardMaterial({color:0xffffff})
    const star = new Mesh(geometry,material)
    const [x,y,z] = Array(3).fill(0).map(()=>MathUtils.randFloatSpread(100))
    star.position.set(x,y,z)
    scene.add(star)
}

Array(200).fill(0).forEach(()=>addStar())

//bruh the texture of le background
const spaceTexture = new TextureLoader().load(space,()=>{
    console.log('loaded')
},()=>{
},()=>console.log("BRUH"))
scene.background = spaceTexture

//moon
const moonTexture = new TextureLoader().load(moonTextureImage)
//normalMap - would be able to add map on this to make bumps - but learn that later
const moon = new Mesh(new SphereGeometry(3,32,32),new MeshStandardMaterial({
    map:moonTexture
}))

moon.position.z = 30;
// this one is same as animate() function below - does same thing (?)
moon.position.setX(-10);

scene.add(moon)

let eugene:any;
try {
const loader = new GLTFLoader();
loader.load(
    "./assets/randomstickman.glb"
    ,  ( gltf ) => {
        eugene = gltf.scene
        scene.add( eugene );

    });
} catch (e) {
    console.log(e)
}


const moveCamera = ():any =>  {
    const t = document.body.getBoundingClientRect().top;
    // moon.rotation.x += 0.05;
    // moon.rotation.y += 0.075;
    // moon.rotation.z += 0.05;

    camera.position.z = (t * - 0.01) + 15;
    // camera.position.x = t * - 0.001;
    // camera.position.y = t * - 0.0002;
    console.log('henlo')
}
document.body.onscroll = () => {
    moveCamera()
}

function animate() {
    requestAnimationFrame(animate);
    eugene ? eugene.rotation.y += 0.01: null;
    torus.rotation.x += 0.01
    // torus.rotation.y += 0.005
    torus.rotation.z += 0.01
    moon.rotation.y += 0.01
    // controls.update()
    renderer.render(scene,camera)
}

animate()