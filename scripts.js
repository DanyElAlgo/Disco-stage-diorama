import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import { EffectComposer, GLTFLoader, RectAreaLightHelper, RenderPass, SkeletonUtils, UnrealBloomPass } from 'three/examples/jsm/Addons.js';
import deku from '/img/not_deku.jpg'
import { randInt, seededRandom } from 'three/src/math/MathUtils.js';
import { element, Raycaster, RectAreaLight } from 'three/webgpu';
import { ssrExportAllKey } from 'vite/runtime';
import { cameraWorldMatrix } from 'three/webgpu';
import Stats from 'three/examples/jsm/libs/stats.module.js';

const acceptButton = document.getElementById('acceptButton');
const modalElement = document.getElementById('modalElement');
const music = document.getElementById('music1');

const body = document.body;
const renderer = new THREE.WebGLRenderer();
const rayCaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const orbit = new OrbitControls(camera, renderer.domElement);
let indexMusic = 1;



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
    var mixer2 = new THREE.AnimationMixer();
  
    const sphereGeo = new THREE.SphereGeometry(4);
    const sphereMat = new THREE.MeshStandardMaterial({color: 0xffffff});
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.set(-10,10,0);
    sphere.castShadow = true;
    //scene.add(sphere);
    sphere.name = "BALL";


    const ambientLight = new THREE.AmbientLight(0x333333, 80);
    scene.add(ambientLight);

    //RectAreaLight

    const rectLight = new THREE.RectAreaLight(0xFFFFFF, 1000, 3.1, 1.5);
    rectLight.position.set(-1.82, 11.28, 34.88);
    rectLight.lookAt(-1.82, 11.28, 40);

    const rectLight2 = new THREE.RectAreaLight(0xFFFFFF, 1000, 3.1, 1.5);
    rectLight2.position.set(1.83, 11.28, 34.88);
    rectLight2.lookAt(1.83, 11.28, 40);

    scene.add(rectLight);
    scene.add(rectLight2);

    const rectLightHelper = new RectAreaLightHelper(rectLight);
    const rectLightHelper2 = new RectAreaLightHelper(rectLight2);

    rectLight.add(rectLightHelper);
    rectLight2.add(rectLightHelper2);


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
    renderer.setClearColor(0x000000);
  
    //aplicar una textura de fondo estático
    const textureLoader = new THREE.TextureLoader();
    //scene.background = textureLoader.load(deku);
    

    // //aplicar caja de fondo, espacio mundial
    // const cubeTextureLoader = new THREE.CubeTextureLoader();
    // scene.background = cubeTextureLoader.load([
    //     mine1,
    //     deku,
    //     star,
    //     star,
    //     star,
    //     star
    // ]);

    const loader = new GLTFLoader();

    //MICROFONO
    let microphone = new THREE.Object3D();
    loader.setPath('/3d_stuff/classic_microphone/');
    loader.load('scene.gltf', (gltf) => {
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
    microphone.position.set(0, 4.3, -8);
    microphone.scale.set(2.5,2.5,2.5);


    // DISCO FLOOR
    let mixer3 = new THREE.AnimationMixer();
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
        mixer3 = new THREE.AnimationMixer(gltf.scene);
        const clips = gltf.animations;
        debugger;
        const clip1 = THREE.AnimationClip.findByName(clips, 'Animation');
        const action1 = mixer3.clipAction(clip1);

        action1.play();
        // action1.loop = THREE.LoopOnce;
     
        // mixer3.addEventListener('finished', function(e){
        //     action1.reset();
        //     action1.play();
        // });
    });
    scene.add(discoFloor);
    discoFloor.scale.set(4,1.9,4);
    discoFloor.position.set(0,1.01,0);
    discoFloor.name = "discoFloor";

    //PIEZA DE AJEDREZ
    const Rook = new THREE.Object3D();
    loader.setPath('/3d_stuff/classic_chess_rook_3d_model/');
    loader.load('untitled.glb', (glb) => {
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
        mixer = new THREE.AnimationMixer(model);
        const clips = glb.animations;
        const clip = THREE.AnimationClip.findByName(clips, 'Armature|mixamo.com|Layer0');
        const action = mixer.clipAction(clip);
        action.play();

    });

    //CANTANTE
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
        model.position.setY(1);
        model.position.setZ(-10);
        mixer2 = new THREE.AnimationMixer(model);
        const clips = glb.animations;
        const clip = THREE.AnimationClip.findByName(clips, 'Armature|mixamo.com|Layer0');
        const action = mixer2.clipAction(clip);
        action.play();
    });

   
    // DISCO BALL
    let discoBall = new THREE.Object3D();
    loader.setPath('/3d_stuff/free_realistic_disco_ball/');
    loader.load('scene.gltf', (gltf) => {
        discoBall.add(gltf.scene);
    });
    scene.add(discoBall);
    discoBall.position.set(0,15,0);
    discoBall.scale.set(0.3,0.3,0.3);

    const fakeDiscoG = new THREE.SphereGeometry(3);
    const fakeDisco = new THREE.Mesh(fakeDiscoG, new THREE.MeshPhongMaterial({visible: false, envMap: textureLoader.load(deku), roughness: 0, metalness: 1, shininess: 100}));
    scene.add(fakeDisco);
    fakeDisco.position.set(0,15,0);
    fakeDisco.scale.set(.92, .92, .92);
    fakeDisco.name = "DISCO BALL";

    //ESCENARIO
    let scenario = new THREE.Object3D();
    loader.setPath('/3d_stuff/nightclub/');
    loader.load('scene.gltf', (gltf) => {
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
    loader.setPath('/3d_stuff/dj_table/');
    loader.load('scene.gltf', (gltf) => {
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

    const guiSpotLight = new dat.GUI();
    const guiVolume = new dat.GUI();
    const stats = new Stats();
    document.body.appendChild(stats.dom);

    const colorOptions2 = {
        color: spotlight2.color.getHex()
    };

    const colorOptions3 = {
        color: spotlight3.color.getHex()
    };

   
    const guiSpotLight2 = guiSpotLight.addFolder('spotLight2');
    const guiSpotLight3 = guiSpotLight.addFolder('spotLight3');
    const guiRecAreaLight = guiSpotLight.addFolder('AreaLight');

    const audio = document.getElementById('music1');
    guiVolume.add(audio, 'volume', 0, 1);
  
    guiSpotLight2.addColor(colorOptions2, 'color').onChange(() => {
        spotlight2.color.setHex(Number(colorOptions2.color.toString().replace('#','0x')))
    });
    guiSpotLight3.addColor(colorOptions3, 'color').onChange(() => {
        spotlight3.color.setHex(Number(colorOptions3.color.toString().replace('#', '0x')))
    });


    guiRecAreaLight.add(rectLight2.position, 'x', -50, 50, 0.01);
    guiRecAreaLight.add(rectLight2.position, 'y', -50, 50, 0.01);
    guiRecAreaLight.add(rectLight2.position, 'z', -50, 50, 0.01);
    guiRecAreaLight.add(rectLight2, 'width', 0.1, 5, 0.1);
    guiRecAreaLight.add(rectLight2, 'height', 0.1, 5, 0.1);

 
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
    const clock2 = new THREE.Clock();
    const clock3 = new THREE.Clock();



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
        Rook.position.setZ(randInt(0,11)*2 - 11);

      
        mixer.update(clock.getDelta()*1.5);
        mixer2.update(clock2.getDelta()*1.5);
        mixer3.update(clock3.getDelta());
        stats.update();
        composer.render();
        //renderer.render(scene, camera);
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
        if (object.parent?.name === "Cube") {
            const audio = document.getElementById('music1');
            console.log(songs);
            console.log(indexMusic);
            audio.src = songs[(indexMusic) % songs.length];
            indexMusic += 1;
            audio.play();
        }
    }
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

