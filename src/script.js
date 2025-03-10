import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { createNoise3D } from 'simplex-noise';

// import galaxyVertexShader from './shaders/galaxy/vertex.glsl.vs'
// import galaxyFragmentShader from './shaders/galaxy/fragment.glsl.fs'

/**
 * Base
 */

const simplex = createNoise3D();

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy
 */

const parameters = {};
parameters.speed = 0.0001;
parameters.clear = '#AAAAFF';
parameters.items_color = '#FFFFFF';
parameters.items_x = 80;
parameters.items_y = 40;
parameters.pulse_enabled = false;
parameters.pulse_value = 0.1;
parameters.noise_scale = 1.0;
parameters.fog_color = '#Fbf3ff';
parameters.fog_start = 40;
parameters.fog_end = 60;
parameters.geometry_type = 'box';
parameters.geometry_size = 1.0;
parameters.camera_perspective = 55;
parameters.camera_position_z = 10;
parameters.camera_position_y = 2;
parameters.camera_position_x = -3;
parameters.camera_rotation_y = 0.3;
parameters.lights_sun_color = '#FFFFFF';
parameters.lights_sun_intensity = 2;


const cubes = [];

const generateCubes = () => {


    for (let cube of cubes) {
        scene.remove(cube);
    }
    
    // Fog (color, near, far)
    scene.fog = new THREE.Fog(new THREE.Color(parameters.fog_color), parameters.fog_start, parameters.fog_end);

    const light = new THREE.DirectionalLight(new THREE.Color(parameters.lights_sun_color), parameters.lights_sun_intensity);
    light.position.set(parameters.camera_position_x, parameters.camera_position_y, parameters.camera_position_z + 10);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 50;
    light.shadow.camera.left = -50;
    light.shadow.camera.right = 50;
    light.shadow.camera.top = 50;
    light.shadow.camera.bottom = -50;
    scene.add(light);

    // Ambient light (color, intensity)
    const ambientLight = new THREE.AmbientLight(0xaaaaff, 0.5); // Blueish white
    scene.add(ambientLight);

    const gridSizeX = parameters.items_x;
    const gridSizeY = parameters.items_y;

    let geometry = null;
    if (parameters.geometry_type === 'sphere') {
        geometry = new THREE.SphereGeometry(parameters.geometry_size);
    } else if (parameters.geometry_type === 'box') {
        geometry = new THREE.BoxGeometry(parameters.geometry_size, parameters.geometry_size, parameters.geometry_size);
    }

    const material = new THREE.MeshPhongMaterial({ color: new THREE.Color(parameters.items_color) });

    for (let x = 0; x < gridSizeX; x++) {
        for (let y = 0; y < gridSizeY; y++) {
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(x - gridSizeX / 2 + 0.5, y - gridSizeY / 2 + 0.5, 0);
            cube.castShadow = true;
            cube.receiveShadow = true;
            scene.add(cube);
            cubes.push(cube);
        }
    }
}

const update = (elapsedTime) => {

    const time = (elapsedTime * 1000) * parameters.speed;

    //console.log(cubes.length)

    cubes.forEach((cube, index) => {
        const x = index % parameters.items_y;
        const y = Math.floor(index / parameters.items_y);
        const noiseValue = simplex(x * parameters.noise_scale, y * parameters.noise_scale, time);
        
        if (parameters.pulse_enabled === true) {
            const pulsation = noiseValue * parameters.pulse_value;
            cube.scale.set(1 + pulsation, 1 + pulsation, 1 + pulsation);                    
        }

        cube.position.z = noiseValue * 0.5 ;
    });

}


/*
parameters.speed = 0.0001;
parameters.clear = 0xAAAAFF;
parameters.items_color = 0xFFFFFF;
parameters.items_x = 80;
parameters.items_y = 40;
parameters.pulse_enabled = false;
parameters.pulse_value = 0.1;
parameters.noise_scale = 1.0;
parameters.fog_color = 0xFbf3ff;
parameters.fog_start = 0;
parameters.fog_end = 0;
parameters.geometry_type = 'box';
parameters.geometry_size = 1.0;
parameters.camera_perspective = 55;
parameters.camera_position_z = 10;
parameters.camera_position_y = 2;
parameters.camera_position_x = -3;
parameters.camera_rotation_y = 0.3;
parameters.lights_sun_color = 0xFFFFFF;
parameters.lights_sun_intensity = 20;
*/
gui.add(parameters, 'speed').min(0.0001).max(0.001).step(0.0001)
//gui.add(parameters, 'clear').onFinishChange(generateCubes)
//gui.add(parameters, 'items_x').min(10).max(100).step(5).onFinishChange(generateCubes)
//gui.add(parameters, 'items_y').min(10).max(100).step(5).onFinishChange(generateCubes)
gui.add(parameters, 'noise_scale').min(0.01).max(2).step(0.01)
//gui.add(parameters, 'geometry_size').min(0.1).max(3).step(0.1).onFinishChange(generateCubes)

// gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
// gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
// gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
// gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
// gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
// gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
// gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(parameters.camera_perspective, sizes.width / sizes.height, 0.1, 1000)
camera.position.x = parameters.camera_position_x;
camera.position.y = parameters.camera_position_y;
camera.position.z = parameters.camera_position_z;
camera.rotation.y = parameters.camera_rotation_y;
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color(parameters.clear))
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;



generateCubes()

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()


    update(elapsedTime);

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()