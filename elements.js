import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { AddTweening } from './rookTween';


import idle_front from '/img/Merchant idle front.png';
import idle_back from '/img/Merchant idle back.png';
import sing_front from '/img/Merchant sing front.png';
import sing_back from '/img/Merchant sing back.png';

export function AddInanimateElements(scene){
    const textureLoader = new THREE.TextureLoader();
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
    microphone.position.set(0, 3.7, -10);
    microphone.scale.set(2,2,2);


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
    //counterclock movement
    const { rookTweenNorth, rookTweenSouth, rookTweenEast, rookTweenWest } = AddTweening(Rook);
    rookTweenSouth.start();

   
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
    const fakeDisco = new THREE.Mesh(fakeDiscoG, new THREE.MeshPhongMaterial({visible: false}));
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


    //FREDDY MERCHANTY (MERCADER)
    var merchantIdleFrontTexture = textureLoader.load(idle_front);
    merchantIdleFrontTexture.magFilter = THREE.NearestFilter;
    merchantIdleFrontTexture.minFilter = THREE.NearestFilter;
	let merchantIdleFrontClock = new TextureAnimator( merchantIdleFrontTexture, 4, 1, 4, 75 ); // texture, #horiz, #vert, #total, duration.
	var merchantIdleFrontMaterial = new THREE.MeshBasicMaterial( { map: merchantIdleFrontTexture, side:THREE.FrontSide, transparent: true } );
	var merchantIdleFrontGeometry = new THREE.PlaneGeometry(52, 43, 1, 1);
	var merchantIdleFront = new THREE.Mesh(merchantIdleFrontGeometry, merchantIdleFrontMaterial);
	merchantIdleFront.position.set(0, 4, -11);
    merchantIdleFront.scale.set(.15,.15,.15);
	scene.add(merchantIdleFront);

    var merchantIdleBackTexture = textureLoader.load(idle_back);
    merchantIdleBackTexture.magFilter = THREE.NearestFilter;
    merchantIdleBackTexture.minFilter = THREE.NearestFilter;
	let merchantIdleBackClock = new TextureAnimator( merchantIdleBackTexture, 4, 1, 4, 75 ); // texture, #horiz, #vert, #total, duration.
	var merchantIdleBackMaterial = new THREE.MeshBasicMaterial( { map: merchantIdleBackTexture, side:THREE.BackSide, transparent: true } );
	var merchantIdleBackGeometry = new THREE.PlaneGeometry(52, 43, 1, 1);
	var merchantIdleBack = new THREE.Mesh(merchantIdleBackGeometry, merchantIdleBackMaterial);
	merchantIdleBack.position.set(0, 4, -11);
    merchantIdleBack.scale.set(-0.15,.15,.15);
	scene.add(merchantIdleBack);

    merchantIdleFront.name = "notSingFront";
    merchantIdleBack.name = "notSingBack";

    var merchantSingFrontTexture = textureLoader.load(sing_front);
    merchantSingFrontTexture.magFilter = THREE.NearestFilter;
    merchantSingFrontTexture.minFilter = THREE.NearestFilter;
	let merchantSingFrontClock = new TextureAnimator( merchantSingFrontTexture, 8, 1, 8, 150 ); // texture, #horiz, #vert, #total, duration.
	var merchantSingFrontMaterial = new THREE.MeshBasicMaterial( { map: merchantSingFrontTexture, side:THREE.FrontSide, transparent: true } );
	var merchantSingFrontGeometry = new THREE.PlaneGeometry(52, 42, 1, 1);
	var merchantSingFront = new THREE.Mesh(merchantSingFrontGeometry, merchantSingFrontMaterial);
	merchantSingFront.position.set(0, 4, -11);
    merchantSingFront.scale.set(.15,.15,.15);
	scene.add(merchantSingFront);

    var merchantSingBackTexture = textureLoader.load(sing_back);
    merchantSingBackTexture.magFilter = THREE.NearestFilter;
    merchantSingBackTexture.minFilter = THREE.NearestFilter;
	let merchantSingBackClock = new TextureAnimator( merchantSingBackTexture, 8, 1, 8, 150 ); // texture, #horiz, #vert, #total, duration.
	var merchantSingBackMaterial = new THREE.MeshBasicMaterial( { map: merchantSingBackTexture, side:THREE.BackSide, transparent: true } );
	var merchantSingBackGeometry = new THREE.PlaneGeometry(52, 38, 1, 1);
	var merchantSingBack = new THREE.Mesh(merchantSingBackGeometry, merchantSingBackMaterial);
	merchantSingBack.position.set(0, 3.7, -11);
    merchantSingBack.scale.set(-0.15,.15,.15);
	scene.add(merchantSingBack);

    merchantSingFront.name = "singFront";
    merchantSingBack.name = "singBack";

    debugger;

    return {
        microphone,
        Rook,
        rookTweenNorth,
        rookTweenSouth,
        rookTweenEast,
        rookTweenWest,
        discoBall,
        fakeDisco,
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
    }
}

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