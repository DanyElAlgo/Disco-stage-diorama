import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import deku from '/img/not_deku.jpg'
import mine1 from '/img/mine1.jpg';
import star from '/img/star2.jpg';
import gato from '/img/no_hace_nada.jpeg';
import fractal from '/img/fractal.jpg';



const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

camera.position.set(0,20,30);
orbit.update();

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
const box = new THREE.Mesh(boxGeometry, boxMaterial)

scene.add(box);
const planeGeometry = new THREE.PlaneGeometry(30,30);
const planeMat = new THREE.MeshStandardMaterial({color: 0xcccccc, side: THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeometry, planeMat);

plane.rotation.x = -0.5 * Math.PI;

plane.receiveShadow = true;
scene.add(plane);

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

const sphereGeo = new THREE.SphereGeometry(4);
const sphereMat = new THREE.MeshStandardMaterial({color: 0xffffff});
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
sphere.position.set(-10,10,0);
sphere.castShadow = true;
scene.add(sphere);

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 10);
// directionalLight.position.set(-30,50,0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;
// scene.add(directionalLight);

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper);

// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper);

const spotlight = new THREE.SpotLight(0xffffff, 10000);
scene.add(spotlight);
spotlight.position.set(-100,100,0);

const dLightHelper = new THREE.SpotLightHelper(spotlight);
scene.add(dLightHelper);
spotlight.castShadow = true;
spotlight.angle = 0.1;

//scene.fog = new THREE.Fog(0xFFFFFF, 0, 200);
//scene.fog = new THREE.FogExp2(0xffffff, 0.01);

//aplicar color de fondo
//renderer.setClearColor(0x000055);

//aplicar una textura de fondo estático
const textureLoader = new THREE.TextureLoader();
// scene.background = textureLoader.load(deku);

//aplicar caja de fondo, espacio mundial
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    mine1,
    deku,
    star,
    star,
    star,
    star
]);

const box2Geometry = new THREE.BoxGeometry(4,4,4);
const box2Mat = new THREE.MeshBasicMaterial({
    //color: 0x00ff00,
    //map: textureLoader.load(fractal)
});
const box2MulltiMaterial = [
    new THREE.MeshBasicMaterial({map: textureLoader.load(deku)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(star)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(mine1)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(gato)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(fractal)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(gato)}),
];
const box2 = new THREE.Mesh(box2Geometry, box2MulltiMaterial);
scene.add(box2);
box2.position.set(1,18, 10);
//box2.material.map = textureLoader.load(fractal);


const micLoader = new GLTFLoader().setPath('/3d_stuff/classic_microphone/');
micLoader.load('scene.gltf', (gltf) => {
    const mesh = gltf.scene;
    mesh.position.set(0, 4.3, -1);
    mesh.scale.set(2.5,2.5,2.5);
    scene.add(mesh);
});

const floorLoader = new GLTFLoader().setPath('/3d_stuff/animated_dance_floor_neon_lights/');
floorLoader.load('scene.gltf', (gltf) => {
    const mesh = gltf.scene;
    mesh.position.set(0, 1, 0);
    mesh.scale.set(3,3,3);
    scene.add(mesh);
});

const gui = new dat.GUI();
const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01,
    angle: 0.2,
    penumbra: 0,
    intensity: 10000
};

gui.add(options, 'wireframe').onChange(function(e){
    sphere.material.wireframe = e;
});

gui.addColor(options, 'sphereColor').onChange(function(e){
    sphere.material.color.set(e);
});

gui.add(options, 'speed', 0, 0,1);
gui.add(options, 'angle', 0, 1);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 100000);

let step = 0;

// const mousePosition = new THREE.Vector2();
// window.addEventListener('mousemove', function(e){
//     mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1,
//     mousePosition.y = (e.clientY / window.innerHeight) * 2 - 1
// });

//const rayCaster = new THREE.Raycaster();


function animate(time){
    box.rotation.y = time / 1000;
    box.rotation.x = time / 1000;
    
    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));
    spotlight.angle = options.angle;
    spotlight.penumbra = options.penumbra;
    spotlight.intensity = options.intensity;
    dLightHelper.update();

    //rayCaster.setFromCamera(mousePosition, camera);
    //const intersects = rayCaster.intersectObjects(scene.children);
    //console.log(intersects);
    

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);



