import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import { EffectComposer, GLTFLoader, RenderPass, UnrealBloomPass } from 'three/examples/jsm/Addons.js';
import { Raycaster } from 'three/webgpu';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import { AddLights } from './lights';
import { AddInanimateElements, AddDiscoBallWithPhysics } from './elements';

const acceptButton = document.getElementById('acceptButton');
const modalElement = document.getElementById('modalElement');
const music = document.getElementById('music1');
const sing = document.getElementById('sing');
sing.volume = 0;
const body = document.body;


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

const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const orbit = new OrbitControls(camera, renderer.domElement);
let indexMusic = 1;

renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);

document.addEventListener('mousedown', onMouseDown);
document.addEventListener('mousemove', onMouseMove);

let { microphone,
    Rook,
    rookTweenNorth,
    rookTweenSouth,
    rookTweenEast,
    rookTweenWest,
    scenario,
    tableDJ,
    hitbox,
    merchantIdleBack,
    merchantIdleBackClock,
    merchantIdleFront,
    merchantIdleFrontClock,
    merchantSingBack,
    merchantSingBackClock,
    merchantSingFront,
    merchantSingFrontClock

} = AddInanimateElements(scene);


//AÑADIR LAS LUCES Y EL GUI
const { ambientLight, spotlight2, spotlight3/*, sLightHelper2, sLightHelper3*/ } = AddLights(scene, renderer);


const originalRay = merchantIdleFront.raycast;
const originalRaySing = merchantSingFront.raycast;
    

music.addEventListener('play', () => {
    if(music.src.split(window.location.origin)[1].split("%20").join(" ") == "/music/Six Feet Thunder (5-3) - DannyB.mp3")
    {
        sing.volume = 0.3;
        sing.load();
        sing.play();

        merchantIdleFront.visible = false;
        merchantIdleBack.visible = false;
        merchantIdleFront.raycast = function() {};
        merchantIdleBack.raycast = function() {};

        merchantSingFront.visible = true;
        merchantSingBack.visible = true;
        merchantSingFront.raycast = originalRaySing;
        merchantSingBack.raycast = originalRaySing;
    }
    else
    {
        sing.pause();

        merchantIdleFront.visible = true;
        merchantIdleBack.visible = true;
        merchantIdleFront.raycast = originalRay;
        merchantIdleBack.raycast = originalRay;


        merchantSingFront.visible = false;
        merchantSingBack.visible = false;
        merchantSingFront.raycast = function() {};
        merchantSingBack.raycast = function() {};

    }
});


//Post Procesamiento
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
const unrealBloomPass = new UnrealBloomPass(
   resolution,
   0.17, //strenght
   1.0, //radius
   2 //threshold
);

composer.addPass(unrealBloomPass);



music.addEventListener('ended', () => {
    music.play();
});



function StartAnimation()
{
    document.body.appendChild(renderer.domElement);

    camera.position.set(0,20,30);
    orbit.update();

    const loader = new GLTFLoader();
    
    // DISCO FLOOR
    let floorMixer = new THREE.AnimationMixer();
    let discoFloor = new THREE.Object3D();
    loader.setPath('/3d_stuff/animated_dance_floor_neon_lights/');
    loader.load('scene.gltf', (gltf) => {
        gltf.scene.traverse( function ( child ) {

            if ( child.isMesh ) {

                child.castShadow = true;
                child.receiveShadow = true;

            }

        } );
        discoFloor.add(gltf.scene);
        floorMixer = new THREE.AnimationMixer(gltf.scene);
        const clips = gltf.animations;
        const clip1 = THREE.AnimationClip.findByName(clips, 'Animation');
        const action1 = floorMixer.clipAction(clip1);

        action1.play();
        
    });
    scene.add(discoFloor);
    discoFloor.scale.set(4,1.9,4);
    discoFloor.position.set(0,1.01,0);
    discoFloor.name = "discoFloor";


    //MARIO
    var marioMixer = new THREE.AnimationMixer();
    loader.setPath('/3d_stuff/Mario64/');
    loader.load('untitled.glb', (glb) => {
        glb.scene.traverse( function ( child ) {

            if ( child.isMesh ) {

                child.castShadow = true;
                child.receiveShadow = true;

            }

        } );
        const model = glb.scene;
        scene.add(model);
        model.scale.set(300,300,300);
        model.position.setY(1);
        model.position.setX(5);
        model.rotateY(-2);
        marioMixer = new THREE.AnimationMixer(model);
        const clips = glb.animations;
        const clip = THREE.AnimationClip.findByName(clips, 'Armature|mixamo.com|Layer0');
        const action = marioMixer.clipAction(clip);
        action.play();

    });


    //DAMA
    var womanMixer = new THREE.AnimationMixer();
    loader.setPath('/3d_stuff/Singer/');
    loader.load('untitled.glb', (glb) => {
        glb.scene.traverse( function ( child ) {

            if ( child.isMesh ) {

                child.castShadow = true;
                child.receiveShadow = true;

            }

        } );
        const model = glb.scene;
        scene.add(model);
        model.scale.set(3,3,3);
        model.position.set(-6,1,7);
        model.rotateY(2.5);
        womanMixer = new THREE.AnimationMixer(model);
        const clips = glb.animations;
        const clip = THREE.AnimationClip.findByName(clips, 'Armature|mixamo.com|Layer0');
        const action = womanMixer.clipAction(clip);
        action.play();
    });


    const guiVolume = new dat.GUI();
    const stats = new Stats();
    document.body.appendChild(stats.dom);

    const audio = document.getElementById('music1');
    guiVolume.add(audio, 'volume', 0, 1);

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

    const clock = new THREE.Clock();

    const { updateDiscoBall, renderScene } = AddDiscoBallWithPhysics(scene, renderer, camera);

    const interactionGroup = [ tableDJ, hitbox, merchantSingBack, merchantSingFront,
        tableDJ.children[0].children.children,
        tableDJ.children[0].children.children
         ];
         //añadir la esfera de cristal

   
    function animate(time){
        let delta = clock.getDelta();
        updateDiscoBall(delta);
        renderScene();

        rayCaster.setFromCamera(mousePosition, camera);
        const intersects = rayCaster.intersectObjects(scene.children);
        //console.log(intersects);

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

        stats.update();
        marioMixer.update(delta*1.5);
        womanMixer.update(delta*1.5);
        floorMixer.update(delta);
        rookTweenSouth.update(time);
        rookTweenEast.update(time);
        rookTweenNorth.update(time);
        rookTweenWest.update(time);
        stats.update(delta);

        const music = document.getElementById('music1').src.split(window.location.origin)[1].split("%20").join(" ");
        const sing = document.getElementById('sing');
        if(music == "/music/Six Feet Thunder (5-3) - DannyB.mp3")
        {
            merchantSingFrontClock.update(1000 * delta);
            merchantSingBackClock.update(1000 * delta);
        }
        else
        {  
            merchantIdleFrontClock.update(500 * delta);
            merchantIdleBackClock.update(500 * delta);
        }
        
        //renderer.render(scene, camera);
        composer.render();
    }

    renderer.setAnimationLoop(animate);
}

function PlayMusic()
{
    const audio = document.getElementById('music1');
    audio.volume = 0.5;
    audio.play();
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
        "/music/Shake It - Aakash Gandhi.mp3",
        "/music/Cumbia del Norte - Jovenes Viejos _ Cumbia Deli.mp3",
        "/music/Read My Lips Time To Party - Everet Almond.mp3",
        "/music/I Am All of Me - Disco Ver - idle.mp3",
        "/music/Six Feet Thunder (5-3) - DannyB.mp3",
       "/music/Thrills at Night - Paper Mario The Origami King OST.mp3"
    ];

    if (intersections.length > 0) {
        const object = intersections[0].object;
        const audio = document.getElementById('music1');
        const audioSing = document.getElementById('sing');
        //console.log(object);
        if (object.parent?.name === "Cube") {
            console.log(songs);
            console.log(indexMusic);
            audio.src = songs[(indexMusic) % songs.length];
            indexMusic += 1;
            audio.play();
        }
        else if((object.name == "singFront" || object.name == "singBack") && audio.src.split(window.location.origin)[1].split("%20").join(" ") == "/music/Six Feet Thunder (5-3) - DannyB.mp3")
        {
            audioSing.volume = audioSing.volume == 0 ? 0.3 : 0;
            merchantIdleFront.visible = !merchantIdleFront.visible;
            merchantIdleBack.visible = !merchantIdleBack.visible;
            merchantSingFront.visible = !merchantSingFront.visible;
            merchantSingBack.visible = !merchantSingBack.visible;
        }
    }
}

function onMouseMove(event)
{
    const rayCaster = new Raycaster();
    const mousePosition = new THREE.Vector2();
    mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1,
    mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1
    rayCaster.setFromCamera(mousePosition, camera);

    const intersections = rayCaster.intersectObjects( scene.children, true);
    if(intersections.length > 0 && (interactionGroup.find(obj => obj === intersections[0].object) || intersections[0]?.object?.parent?.name === "Cube"))
    {
        document.body.style.cursor = "pointer";
    }
    else{
        document.body.style.cursor = "default";
    }
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});