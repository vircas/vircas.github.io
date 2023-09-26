/**
 * practica2.js
 * 
 * GPC - Práctica 2: Grafo de escena
 * 
 * @author <vcassan@upv.edu.es>, 26/09/2023
 * 
 */

// Modulos necesarios
import * as THREE from "../lib/three.module.js"
import {GLTFLoader} from "../lib/GLTFLoader.module.js"

// Variables de consenso 
var renderer, escena, camara;

// Otras globales
var robot, brazo, antebrazo, mano;
var angulo = 0;

// Acciones a realizar
init();
loadScene();
render();

function init()
{
    // Motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight); // para que ocupe toda la pantalla
    document.getElementById("container").appendChild(renderer.domElement);

    // Escena
    escena = new THREE.Scene();
    escena.background = new THREE.Color(1, 1, 1);

    // Camara
    camara = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camara.position.set(90, 200, 350);
    camara.lookAt(0, 0, 0);
}

function loadScene()
{
    // Suelo
    const sueloGeo = new THREE.PlaneGeometry(1000, 1000, 10, 10);
    const sueloMaterial = new THREE.MeshBasicMaterial({ color: 0x84A2D8, side: THREE.DoubleSide , wireframe: true});
    const suelo = new THREE.Mesh(sueloGeo, sueloMaterial);
    suelo.rotation.x = -Math.PI / 2; // Rotamos el suelo para que esté en el plano XZ
    escena.add(suelo);

    // Robot
    robot = new THREE.Object3D();

    const robotMaterial = new THREE.MeshBasicMaterial({color: 0x84A2D8, wireframe: true});
      
        // BASE
    const baseGeo = new THREE.CylinderGeometry(50, 50, 15, 32);
    const base = new THREE.Mesh(baseGeo, robotMaterial);
    base.position.set(0,1,0); // Levantamos la base desde el suelo (0,0,0)  

        // BRAZO
            // Eje
    const ejeGeo = new THREE.CylinderGeometry(20, 20, 18, 32);
    const eje = new THREE.Mesh(ejeGeo, robotMaterial);
    eje.rotation.x = Math.PI/2; 

            // Esparrago
    const esparragoGeo = new THREE.BoxGeometry(18, 120, 12, 2);
    const esparrago = new THREE.Mesh(esparragoGeo, robotMaterial);
    esparrago.position.set(0,60,0);

            // Rotula
    const rotulaGeo= new THREE.SphereGeometry(20, 32, 16); //(20,30,15)
    const rotula = new THREE.Mesh(rotulaGeo, robotMaterial);
    rotula.position.set(0,120,0);

    brazo = new THREE.Object3D();
    brazo.add(eje);
    brazo.add(esparrago);
    brazo.add(rotula);

        // ANTEBRAZO
            // Disco
    const discoGeo = new THREE.CylinderGeometry(22, 22, 6, 32);
    const disco = new THREE.Mesh(discoGeo, robotMaterial);
    
            // Nervios
    const nerviosGeo = new THREE.BoxGeometry(4, 80, 4, 2);
    const nervio1 = new THREE.Mesh(nerviosGeo, robotMaterial);
    nervio1.position.set(8,34,4);
    const nervio2 = new THREE.Mesh(nerviosGeo, robotMaterial);
    nervio2.position.set(-8,34,4);
    const nervio3 = new THREE.Mesh(nerviosGeo, robotMaterial);
    nervio3.position.set(8,34,-4);
    const nervio4 = new THREE.Mesh(nerviosGeo, robotMaterial);
    nervio4.position.set(-8,34,-4);
   
            // Mano
    const manoGeo = new THREE.CylinderGeometry(15, 15, 40, 32);
    const mano = new THREE.Mesh(manoGeo, robotMaterial);
    mano.rotation.x = Math.PI/2; 
    mano.position.set(0,70,0);

                // Pinzas
    
    const pinzaGeo = new THREE.BufferGeometry();
    pinzaGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
        0, -8, -10,
        19, -8, -10,
        0, -8, 10,
        19, -8, 10,
        0, -12, -10,
        19, -12, -10,
        0, -12, 10,
        19, -12, 10,
        38, -8, -5,
        38, -12, -5,
        38, -8, 5,
        38, -12, 5
    ]), 3));
    pinzaGeo.setIndex(new THREE.BufferAttribute(new Uint16Array([
        0, 3, 2,
        0, 1, 3,
        1, 7, 3,
        1, 5, 7,
        5, 6, 7,
        5, 4, 6,
        4, 2, 6,
        4, 0, 2,
        2, 7, 6,
        2, 3, 7,
        4, 1, 0,
        4, 5, 1,
        1, 10, 3,
        1, 8, 10,
        8, 11, 10,
        8, 9, 11,
        9, 7, 11,
        9, 5, 7,
        3, 11, 7,
        3, 10, 11,
        5, 8, 1,
        5, 9, 8,
    ]), 1));            

    const pinzaIzq = new THREE.Mesh(pinzaGeo, robotMaterial);
    //pinzaIzq.rotation.y = Math.PI/2;

    const pinzaDcha = new THREE.Mesh(pinzaGeo, robotMaterial);
    //pinzaDcha.rotation.y = Math.PI/2;
    pinzaDcha.position.set(0,20,0);

    mano.add(pinzaDcha);
    mano.add(pinzaIzq);

    antebrazo = new THREE.Object3D();
    antebrazo.add(disco);
    antebrazo.add(nervio1);
    antebrazo.add(nervio2);
    antebrazo.add(nervio3);
    antebrazo.add(nervio4);
    antebrazo.add(mano);

    antebrazo.position.set(0,120,0);

    // Construir el Robot
    brazo.add(antebrazo);
    base.add(brazo);
    robot.add(base);

    escena.add(robot);

}

function update()
{
    angulo += 0.01;
    robot.rotation.y = angulo;
}

function render()
{
    requestAnimationFrame(render);
    update();
    renderer.render(escena, camara);
}