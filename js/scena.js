/**
 * Escena.js
 * 
 * Seminario 2 GPC: Pintar una escena básica con transformaciones, animación y 
 * modelos importados
 * 
 * @author <aiaseben@upv.es>, 2023
 * 
 */

// Modulos necesarios
import * as THREE from "../lib/three.module.js"
import {GLTFLoader} from "../lib/GLTFLoader.module.js"

// Variables de consenso 
let renderer, scene, camera;

// Otras globales
let esferaCubo;
let angulo = 0;

// Acciones a realizar
init();
loadScene();
render();

function init()
{
    // Motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight); // para que ocupe toda la pantalla
    document.getElementById("container").appendChild( renderer.domElement);

    // Escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0,0,0.2);

    // Camara
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(0.5, 2, 7);
    camera.lookAt(0, 1, 0);
}

function loadScene()
{
    // Definir el material que se va a utilizar
    const material = new THREE.MeshBasicMaterial({color:'yellow', wireframe: true});

    // Geometria del cubo
    const geoCubo = new THREE.BoxGeometry(2, 2, 2);
    //segundo y tercer numero son cuantos meredianos para pintar
    const geoEsfera = new THREE.SphereGeometry(1, 20, 20);

    // Malla
    const cubo = new THREE.Mesh(geoCubo, material);
    const esfera = new THREE.Mesh(geoEsfera, material);
    esferaCubo = new THREE.Object3D();
    //trasladar posicion
    cubo.position.set(1,0,0);
    esfera.position.set(-1,1,0);

    //esferaCubo.position.set(0,1,0);

    // Carga de la malla en la escena
    //normalmente se pone scene.add pero se puede añadir a la esferacubo y asi puedo aplicar transfromaciones respecto a ese objeto
    //llamado composcion de trasnformaciones

    esferaCubo.add(cubo);
    esferaCubo.add(esfera);
    scene.add(esferaCubo)

    //suelo lleva rayas por la geometria
    const suelo= new THREE.Mesh(new THREE.PlaneGeometry(10,10,10,10), material);
    suelo.rotation.x = -Math.PI/2;
    scene.add(suelo);

    //ver ejes
    scene.add(new THREE.AxisHelper(2));


    //importar un modelo json
    const loader= new THREE.ObjectLoader();
    loader.load("models/soldado/soldado.json",
                function(objeto){
                    cubo.add(objeto);// lo estoy poniendo respecto al cubo (sera el origen)
                    objeto.position.set(0,1,0);
                }
    );

    //importan en gltf
    const gltfloader=new GLTFLoader();
    gltfloader.load("models/robota/scene.gltf",
                    function(gltf){
                        gltf.scene.position.y = 1;
                        esfera.add(gltf.scene);
                    }
    );
    
}



function update()
{
    //el angulo va en radianes
    angulo += 0.01;
    esferaCubo.rotation.y=angulo;
}

function render()
{
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}



