import * as THREE from 'three';
import * as dat from 'dat.gui';
import { RectAreaLightHelper } from 'three/examples/jsm/Addons.js';

export function AddLights(scene, renderer)
{
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

    spotlight2.castShadow = true;
    spotlight3.castShadow = true;
   
    spotlight2.decay = 0.7;
    spotlight3.decay = 1;
    
    //aplicar color de fondo
    renderer.setClearColor(0x000000);

    const guiSpotLight = new dat.GUI();

    const colorOptions2 = {
        color: spotlight2.color.getHex()
    };

    const colorOptions3 = {
        color: spotlight3.color.getHex()
    };

   
    const guiSpotLight2 = guiSpotLight.addFolder('spotLight2');
    const guiSpotLight3 = guiSpotLight.addFolder('spotLight3');
    const guiRecAreaLight = guiSpotLight.addFolder('AreaLight');

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

    return {
        ambientLight,
        spotlight2,
        spotlight3
    };
}