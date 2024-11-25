import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import { GLTFLoader, SkeletonUtils } from 'three/examples/jsm/Addons.js';
import deku from '/img/not_deku.jpg'
import mine1 from '/img/mine1.jpg';
import star from '/img/star2.jpg';
import gato from '/img/no_hace_nada.jpeg';
import fractal from '/img/fractal.jpg';
import { randInt, seededRandom } from 'three/src/math/MathUtils.js';
import { element, Raycaster } from 'three/webgpu';
import { ssrExportAllKey } from 'vite/runtime';
import { cameraWorldMatrix } from 'three/webgpu';

const acceptButton = document.getElementById('acceptButton');
const modalElement = document.getElementById('modalElement');
const music = document.getElementById('music1');

const body = document.body;
const renderer = new THREE.WebGLRenderer();
const rayCaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const orbit = new OrbitControls(camera, renderer.domElement);
let indexMusic = 0;



renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);

document.addEventListener('mousedown', onMouseDown);

acceptButton.addEventListener('click', () => {

    //Eliminamos por medio de hardcoding el estilo del body a uno por defecto
    modalElement.style.display = 'none';
    body.style.animation = 'none';
    body.style.backgroundColor = 'white';
    body.style.backgroundImage = 'none';
    body.style.margin = 'none'; 
    body.style.fontSize = 'none'; 
    body.style.fontFamily = 'none';
    body.style.color = 'none'; 
    body.style.margin = 0;

    StartAnimation();
    PlayMusic();
});

let currentSongIndex = 0;


function StartAnimation()
{
    document.body.appendChild(renderer.domElement);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    camera.position.set(0,20,30);
    orbit.update();

    const boxGeometry = new THREE.BoxGeometry();
    const boxMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
    const box = new THREE.Mesh(boxGeometry, boxMaterial)

    // scene.add(box);
    const planeGeometry = new THREE.PlaneGeometry(30,30);
    const planeMat = new THREE.MeshStandardMaterial({color: 0xcccccc, side: THREE.DoubleSide});
    const plane = new THREE.Mesh(planeGeometry, planeMat);

    plane.rotation.x = -0.5 * Math.PI;

    plane.receiveShadow = true;
    scene.add(plane);

    const gridHelper = new THREE.GridHelper(30);
    scene.add(gridHelper);
  
    var mixer = new THREE.AnimationMixer();
  
    const sphereGeo = new THREE.SphereGeometry(4);
    const sphereMat = new THREE.MeshStandardMaterial({color: 0xffffff});
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.set(-10,10,0);
    sphere.castShadow = true;
    //scene.add(sphere);
    sphere.name = "BALL";


    const ambientLight = new THREE.AmbientLight(0x333333, 80);
    scene.add(ambientLight);

    //Spotlights
    const spotlight2 = new THREE.SpotLight(0x26986f, 2251, 0, 0.5);
    const spotlight3 = new THREE.SpotLight(0xf2c238, 5000, 0, 0.4);
   
    scene.add(spotlight2);
    scene.add(spotlight3);
   
    spotlight2.position.set(-15.5, 19, 0);
    spotlight3.position.set(9, 23, 17);

    spotlight2.target.position.set(-3, 0, 0);
    spotlight3.target.position.set(2, 4, 6);
   
    const sLightHelper2 = new THREE.SpotLightHelper(spotlight2, 0xFF0000);
    const sLightHelper3 = new THREE.SpotLightHelper(spotlight3, 0x00FF00);
   
    scene.add(sLightHelper2);
    scene.add(sLightHelper3);

    spotlight2.castShadow = true;
    spotlight3.castShadow = true;
   
    spotlight2.decay = 0.7;
    spotlight3.decay = 1;
    
    //aplicar color de fondo
    //renderer.setClearColor(0x000055);
  
    //aplicar una textura de fondo estático
    const textureLoader = new THREE.TextureLoader();
    scene.background = textureLoader.load(deku);
  
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


    //MICROFONO
    let microphone = new THREE.Object3D();
    const micLoader = new GLTFLoader().setPath('/3d_stuff/classic_microphone/');
    micLoader.load('scene.gltf', (gltf) => {
        gltf.scene.traverse( function ( child ) {

            if ( child.isMesh ) {

                child.castShadow = true;
                child.receiveShadow = true;

            }

        } );
        microphone.add(gltf.scene);
    });
    microphone.castShadow = true;
    scene.add(microphone);
    microphone.position.set(0, 4.3, 0);
    microphone.scale.set(2.5,2.5,2.5);


    // DISCO FLOOR
    let discoFloor = new THREE.Object3D();
    const floorLoader = new GLTFLoader().setPath('/3d_stuff/animated_dance_floor_neon_lights/');
    floorLoader.load('scene.gltf', (gltf) => {
        gltf.scene.traverse( function ( child ) {

            if ( child.isMesh ) {

                child.castShadow = true;
                child.receiveShadow = true;

            }

        } );
        discoFloor.add(gltf.scene);
    });
    scene.add(discoFloor);
    discoFloor.scale.set(4,4,4);
    discoFloor.position.set(0,1.01,0);
    discoFloor.name = "discoFloor";
    


    //PIEZA DE AJEDREZ
    const Rook = new THREE.Object3D();
    const RookLoader = new GLTFLoader().setPath('/3d_stuff/classic_chess_rook_3d_model/');
    RookLoader.load('untitled.glb', (glb) => {
        glb.scene.traverse( function ( child ) {

            if ( child.isMesh ) {

                child.castShadow = true;
                child.receiveShadow = true;

            }

        } );
        Rook.add(glb.scene);
    });
    scene.add(Rook);
    Rook.position.set(-11,0.9,-11);
    Rook.name = "rook";


    //MARIO
    const MarioLoader = new GLTFLoader().setPath('/3d_stuff/Mario64/');
    MarioLoader.load('untitled.glb', (glb) => {
        glb.scene.traverse( function ( child ) {

            if ( child.isMesh ) {

                child.castShadow = true;
                child.receiveShadow = true;

            }

        } );
        const model = glb.scene;
        scene.add(model);
        model.scale.set(200,200,200);
        model.position.setY(1);
        model.position.setX(5);
        mixer = new THREE.AnimationMixer(model);
        const clips = glb.animations;
        const clip = THREE.AnimationClip.findByName(clips, 'Armature|mixamo.com|Layer0');
        const action = mixer.clipAction(clip);
        action.play();

    });

   
    // DISCO BALL
    let discoBall = new THREE.Object3D();
    const discoBallLoader = new GLTFLoader().setPath('/3d_stuff/free_realistic_disco_ball/');
    discoBallLoader.load('scene.gltf', (gltf) => {
        discoBall.add(gltf.scene);
    });
    scene.add(discoBall);
    discoBall.position.set(5,15,5);
    discoBall.scale.set(0.3,0.3,0.3);

    const fakeDiscoG = new THREE.SphereGeometry(3);
    const fakeDisco = new THREE.Mesh(fakeDiscoG, new THREE.MeshPhongMaterial({visible: true, envMap: textureLoader.load(deku), roughness: 0, metalness: 1, shininess: 100}));
    scene.add(fakeDisco);
    fakeDisco.position.set(5,15,5);
    fakeDisco.scale.set(.92, .92, .92);
    fakeDisco.name = "DISCO BALL";

    //ESCENARIO
    let scenario = new THREE.Object3D();
    const sceneLoader = new GLTFLoader().setPath('/3d_stuff/nightclub/');
    sceneLoader.load('scene.gltf', (gltf) => {
        gltf.scene.traverse( function ( child ) {
            if ( child.isMesh )
                {
                //child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        scenario.add(gltf.scene);
    });
    scene.add(scenario);
    scenario.scale.set(4, 4, 4);
    scenario.position.set(0,0.1,0);

    
      //mesa de dj
    let tableDJ = new THREE.Object3D();
    const tableDJLoader = new GLTFLoader().setPath('/3d_stuff/dj_table/');
    tableDJLoader.load('scene.gltf', (gltf) => {
    gltf.scene.traverse( function ( child ) {
        if ( child.isMesh )
            {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
        tableDJ.add(gltf.scene);
    });
    scene.add(tableDJ);
    tableDJ.position.set(0,7,35);
    tableDJ.scale.set(0.01, 0.01, 0.01);
    tableDJ.name = "DJ";

    const hitbox = new THREE.Mesh(
        new THREE.BoxGeometry(5, 5, 5), // Tamaño de la hitbox
        new THREE.MeshBasicMaterial({ visible: false }) // Material invisible
      );
      tableDJ.add(hitbox); // Agregar la hitbox al objeto principal
      hitbox.name = 'tableDJHitbox';

    //let DJSet = new THREE.Object3D();
    
    const DJSet = new THREE.Object3D();
    const DJLoader = new GLTFLoader().setPath('/3d_stuff/dj_set/');
    DJLoader.load('scene.gltf', (gltf) => {
        gltf.scene.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        DJSet.add(gltf.scene);
    });
    scene.add(DJSet);
    DJSet.position.set(11,1.2,-11);
    DJSet.scale.set(0.2,0.2,0.2);
    DJSet.rotation.set(0,5.8,0);
    DJSet.name = "MesaDj"

    const guiSpotLight = new dat.GUI();
  
    const colorOptions2 = {
        color: spotlight2.color.getHex()
    };

    const colorOptions3 = {
        color: spotlight3.color.getHex()
    };

   
    const guiSpotLight2 = guiSpotLight.addFolder('spotLight2');
    const guiSpotLight3 = guiSpotLight.addFolder('spotLight3');
  
    guiSpotLight2.addColor(colorOptions2, 'color').onChange(() => {
        spotlight2.color.setHex(Number(colorOptions2.color.toString().replace('#','0x')))
    });
    guiSpotLight3.addColor(colorOptions3, 'color').onChange(() => {
        spotlight3.color.setHex(Number(colorOptions3.color.toString().replace('#', '0x')))
    })
 
    guiSpotLight2.add(spotlight2.position, 'x', -50, 50);
    guiSpotLight2.add(spotlight2.position, 'y', -50, 50);
    guiSpotLight2.add(spotlight2.position, 'z', -50, 50);
    guiSpotLight2.add(spotlight2, 'intensity', 0, 10000);
    guiSpotLight2.add(spotlight2, 'angle', 0, 1);
    guiSpotLight2.add(spotlight2.target.position, 'x', -50, 50);
    guiSpotLight2.add(spotlight2.target.position, 'y', -50, 50);
    guiSpotLight2.add(spotlight2.target.position, 'z', -50, 50);
    guiSpotLight2.add(spotlight2, 'distance', 0, 100);
    guiSpotLight2.add(spotlight2, 'decay', 0, 4);

    guiSpotLight3.add(spotlight3.position, 'x', -50, 50);
    guiSpotLight3.add(spotlight3.position, 'y', -50, 50);
    guiSpotLight3.add(spotlight3.position, 'z', -50, 50);
    guiSpotLight3.add(spotlight3, 'intensity', 0, 10000);
    guiSpotLight3.add(spotlight3, 'angle', 0, 1);
    guiSpotLight3.add(spotlight3.target.position, 'x', -50, 50);
    guiSpotLight3.add(spotlight3.target.position, 'y', -50, 50);
    guiSpotLight3.add(spotlight3.target.position, 'z', -50, 50);
    guiSpotLight3.add(spotlight3, 'distance', 0, 100);
    guiSpotLight3.add(spotlight3, 'decay', 0, 4);

    let step = 0;

    const mousePosition = new THREE.Vector2();
    const rayCaster = new THREE.Raycaster();

    window.addEventListener('mousemove', function(e){
        mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1,
        mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1
    });

    const colors1 = [new THREE.Color(0x333333), new THREE.Color(0xFF0000), new THREE.Color(0x00FF00), new THREE.Color(0x0000FF)];
    const colors2 = [new THREE.Color(0x00FF00), new THREE.Color(0x0000FF), new THREE.Color(0x333333), new THREE.Color(0xFF0000)];
    const colors3 = [new THREE.Color(0xFF0000), new THREE.Color(0x00FF00), new THREE.Color(0x0000FF), new THREE.Color(0x333333)];

    let currentColorIndex = 0;
    let nextColorIndex = 1;
    let transitionTime = 0;
    const transitionDuration = 0.2; 

    let micMoveRight = true;
    let micMoveForward = true;
    const clock = new THREE.Clock();

    function animate(time){
        box.rotation.y = time / 1000;
        box.rotation.x = time / 1000;
        //sphere.position.y = 10 * Math.abs(Math.sin(step));
        discoBall.rotation.y = time/1000;
      
        sLightHelper2.update();
        sLightHelper3.update();
        // sLightHelper4.update();
        // sLightHelper5.update();

        rayCaster.setFromCamera(mousePosition, camera);
        const intersects = rayCaster.intersectObjects(scene.children);
      
        intersects.forEach((intersect) => {
            if(intersect.object.name === "DISCO BALL") {
                discoBall.rotation.y = time/500;
            }

            if(intersect.object.name === 'memebox') {
                intersect.object.rotation.x = time/1000;
                intersect.object.rotation.y = time/1000;
            }
            if(intersect.object.id === box.id){
                intersect.object.material.color.set(0xFF0000)
            }
        });

        transitionTime += 0.01;
        // Interpolación del color
        const lerpedColor1 = colors1[currentColorIndex].clone().lerp(colors1[nextColorIndex], transitionTime / transitionDuration);
        const lerpedColor2 = colors2[currentColorIndex].clone().lerp(colors2[nextColorIndex], transitionTime / transitionDuration);
        const lerpedColor3 = colors3[currentColorIndex].clone().lerp(colors3[nextColorIndex], transitionTime / transitionDuration);
        
        // Aplicar el color interpolado a la luz
        ambientLight.color.set(lerpedColor3);
        spotlight2.color.set(lerpedColor1);
        spotlight3.color.set(lerpedColor2);

        // Cambiar de color después de completar la transición
        if (transitionTime >= transitionDuration) {
            currentColorIndex = nextColorIndex;
            nextColorIndex = (nextColorIndex + 1) % colors1.length;  // Ciclar entre los colores
            transitionTime = 0;
        }

      
        mixer.update(clock.getDelta()*1.5);
        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);
}


function PlayMusic()
{
    const audio = document.getElementById('music1');
    audio.volume = 0.5;
    console.log(audio);
    audio.play();
}


function rookSingularPosition(){
    return randInt(0,11)*2 - 11;
}

function onMouseDown(event)
{
    const rayCaster = new Raycaster();
    const mousePosition = new THREE.Vector2();
    mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1,
    mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1
    rayCaster.setFromCamera(mousePosition, camera);

    const intersections = rayCaster.intersectObjects(scene.children, true);

    const songs = 
    [
        "public/music/Shake It - Aakash Gandhi.mp3",
        "public/music/Cumbia del Norte - Jovenes Viejos _ Cumbia Deli.mp3",
        "public/music/Read My Lips Time To Party - Everet Almond.mp3"
    ];

    if (intersections.length > 0) {
        const object = intersections[0].object;
        if (object.parent?.name === "Cube") {
            const audio = document.getElementById('music1');
            audio.src = songs[(++indexMusic) % songs.length];
            audio.volume = 0.5;
            audio.play();
        }
    }
}



