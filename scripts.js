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
import idle_front from '/img/Merchant idle front.png';
import idle_back from '/img/Merchant idle back.png';
import sing_front from '/img/Merchant sing front.png';
import sing_back from '/img/Merchant sing back.png';

import { AddLights } from './lights';

const acceptButton = document.getElementById('acceptButton');
const modalElement = document.getElementById('modalElement');
const music = document.getElementById('music1');
const sing = document.getElementById('sing');
sing.volume = 0;

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
//TODO: ????????????????????????????????

function StartAnimation()
{
    document.body.appendChild(renderer.domElement);

    camera.position.set(0,20,30);
    orbit.update();

    const boxGeometry = new THREE.BoxGeometry();
    const boxMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
    const box = new THREE.Mesh(boxGeometry, boxMaterial)

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

    //ANIADIR LAS LUCES Y EL GUI
    const { ambientLight, spotlight2, spotlight3, sLightHelper2, sLightHelper3 } = AddLights(scene, renderer);
  
    //aplicar una textura de fondo estático
    const textureLoader = new THREE.TextureLoader();
    //scene.background = textureLoader.load(idle_front);

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
        model.position.set(-4,1,5);
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
    
    var merchantIdleFrontTexture = textureLoader.load(idle_front);
    merchantIdleFrontTexture.magFilter = THREE.NearestFilter;
    merchantIdleFrontTexture.minFilter = THREE.NearestFilter;
	let merchantIdleFrontClock = new TextureAnimator( merchantIdleFrontTexture, 4, 1, 4, 75 ); // texture, #horiz, #vert, #total, duration.
	var merchantIdleFrontMaterial = new THREE.MeshBasicMaterial( { map: merchantIdleFrontTexture, side:THREE.FrontSide, transparent: true } );
	var merchantIdleFrontGeometry = new THREE.PlaneGeometry(50, 50, 1, 1);
	var merchantIdleFront = new THREE.Mesh(merchantIdleFrontGeometry, merchantIdleFrontMaterial);
	merchantIdleFront.position.set(0, 3.5, -10);
    merchantIdleFront.scale.set(.1,.1,.1);
	scene.add(merchantIdleFront);

    var merchantIdleBackTexture = textureLoader.load(idle_back);
    merchantIdleBackTexture.magFilter = THREE.NearestFilter;
    merchantIdleBackTexture.minFilter = THREE.NearestFilter;
	let merchantIdleBackClock = new TextureAnimator( merchantIdleBackTexture, 4, 1, 4, 75 ); // texture, #horiz, #vert, #total, duration.
	var merchantIdleBackMaterial = new THREE.MeshBasicMaterial( { map: merchantIdleBackTexture, side:THREE.BackSide, transparent: true } );
	var merchantIdleBackGeometry = new THREE.PlaneGeometry(50, 50, 1, 1);
	var merchantIdleBack = new THREE.Mesh(merchantIdleBackGeometry, merchantIdleBackMaterial);
	merchantIdleBack.position.set(0, 3.5, -10);
    merchantIdleBack.scale.set(-0.1,.1,.1);
	scene.add(merchantIdleBack);

    merchantIdleFront.name = "notSingFront";
    merchantIdleBack.name = "notSingBack";
    
    
    //TODO: Implementar esto para ser dinámico

    var merchantSingFrontTexture = textureLoader.load(sing_front);
    merchantSingFrontTexture.magFilter = THREE.NearestFilter;
    merchantSingFrontTexture.minFilter = THREE.NearestFilter;
	let merchantSingFrontClock = new TextureAnimator( merchantSingFrontTexture, 8, 1, 8, 75 ); // texture, #horiz, #vert, #total, duration.
	var merchantSingFrontMaterial = new THREE.MeshBasicMaterial( { map: merchantSingFrontTexture, side:THREE.FrontSide, transparent: true } );
	var merchantSingFrontGeometry = new THREE.PlaneGeometry(50, 50, 1, 1);
	var merchantSingFront = new THREE.Mesh(merchantSingFrontGeometry, merchantSingFrontMaterial);
	merchantSingFront.position.set(0, 3.5, -10);
    merchantSingFront.scale.set(.1,.1,.1);
	scene.add(merchantSingFront);

    var merchantSingBackTexture = textureLoader.load(sing_back);
    merchantSingBackTexture.magFilter = THREE.NearestFilter;
    merchantSingBackTexture.minFilter = THREE.NearestFilter;
	let merchantSingBackClock = new TextureAnimator( merchantSingBackTexture, 8, 1, 8, 75 ); // texture, #horiz, #vert, #total, duration.
	var merchantSingBackMaterial = new THREE.MeshBasicMaterial( { map: merchantSingBackTexture, side:THREE.BackSide, transparent: true } );
	var merchantSingBackGeometry = new THREE.PlaneGeometry(50, 50, 1, 1);
	var merchantSingBack = new THREE.Mesh(merchantSingBackGeometry, merchantSingBackMaterial);
	merchantSingBack.position.set(0, 3.5, -10);
    merchantSingBack.scale.set(-0.1,.1,.1);
	scene.add(merchantSingBack);

    merchantSingFront.name = "singFront";
    merchantSingBack.name = "singBack";

    const guiVolume = new dat.GUI();
    const stats = new Stats();
    document.body.appendChild(stats.dom);

    const audio = document.getElementById('music1');
    guiVolume.add(audio, 'volume', 0, 1);

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
    const clock4 = new THREE.Clock();
    const clock5 = new THREE.Clock();


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
    
    const originalRay = merchantIdleFront.raycast;
    const originalRaySing = merchantSingFront.raycast;

    function animate(time){
        box.rotation.y = time / 1000;
        box.rotation.x = time / 1000;
        discoBall.rotation.y = time/1000;
      
        sLightHelper2.update();
        sLightHelper3.update();
        // sLightHelper4.update();
        // sLightHelper5.update();

        rayCaster.setFromCamera(mousePosition, camera);
        const intersects = rayCaster.intersectObjects(scene.children);
        //console.log(intersects);
      
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
        
        const music = document.getElementById('music1').src.split(window.location.origin)[1].split("%20").join(" ");
        const sing = document.getElementById('sing');
        if(music == "/music/Six Feet Thunder (5-3) - DannyB.mp3")
        {
            merchantIdleFront.visible = false;
            merchantIdleBack.visible = false;
            merchantIdleFront.raycast = function() {};
            merchantIdleBack.raycast = function() {};

            merchantSingFront.visible = true;
            merchantSingBack.visible = true;
            merchantSingFront.raycast = originalRaySing;
            merchantSingBack.raycast = originalRaySing;

            //merchantIdleBack.
            merchantSingFrontClock.update(1000 * clock4.getDelta());
            merchantSingBackClock.update(1000 * clock5.getDelta());
        }
        else
        {
            merchantIdleFront.visible = true;
            merchantIdleBack.visible = true;
            merchantIdleFront.raycast = originalRay;
            merchantIdleBack.raycast = originalRay;


            merchantSingFront.visible = false;
            merchantSingBack.visible = false;
            merchantSingFront.raycast = function() {};
            merchantSingBack.raycast = function() {};

            merchantIdleFrontClock.update(500 * clock4.getDelta());
            merchantIdleBackClock.update(500 * clock5.getDelta());
        }
        

        //renderer.render(scene, camera);



       
        
        //TODO: Implementar Sing al rayCaster SOLO CUANDO suene Six Feet Thunder
        //?: Se puede hacer lo mismo con I Am All Of Me???????
      
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
        //TODO: Implementar una forma de ejecutar la sección de Shopkeeper junto a Six Feet Thunder
        "/music/Thrills at Night - Paper Mario The Origami King OST.mp3"
    ];

    if (intersections.length > 0) {
        const object = intersections[0].object;
        const audio = document.getElementById('music1');
        const audioSing = document.getElementById('sing');
        console.log(object);
        if (object.parent?.name === "Cube") {
            console.log(songs);
            console.log(indexMusic);
            audio.src = songs[(indexMusic) % songs.length];

            if(songs[(indexMusic) % songs.length] == "/music/Six Feet Thunder (5-3) - DannyB.mp3")
            {
                audioSing.volume = 0.3;
                audioSing.load();
                audioSing.play();

            }
            else{
                audioSing.pause();
            }

            indexMusic += 1;
            audio.play();
        }
        else if((object.name == "singFront" || object.name == "singBack") && audio.src.split(window.location.origin)[1].split("%20").join(" ") == "/music/Six Feet Thunder (5-3) - DannyB.mp3")
        {
            audioSing.volume = audioSing.volume == 0 ? 0.3 : 0;
        }
    }
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) 
{	
	// note: texture passed by reference, will be updated by the update function.
		
	this.tilesHorizontal = tilesHoriz;
	this.tilesVertical = tilesVert;
	// how many images does this spritesheet contain?
	//  usually equals tilesHoriz * tilesVert, but not necessarily,
	//  if there at blank tiles at the bottom of the spritesheet. 
	this.numberOfTiles = numTiles;
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
	texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );

	// how long should each image be displayed?
	this.tileDisplayDuration = tileDispDuration;

	// how long has the current image been displayed?
	this.currentDisplayTime = 0;

	// which image is currently being displayed?
	this.currentTile = 0;
		
	this.update = function( milliSec )
	{
		this.currentDisplayTime += milliSec;
		while (this.currentDisplayTime > this.tileDisplayDuration)
		{
			this.currentDisplayTime -= this.tileDisplayDuration;
			this.currentTile++;
			if (this.currentTile == this.numberOfTiles)
				this.currentTile = 0;
			var currentColumn = this.currentTile % this.tilesHorizontal;
			texture.offset.x = currentColumn / this.tilesHorizontal;
			var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
			texture.offset.y = currentRow / this.tilesVertical;
		}
	};
}