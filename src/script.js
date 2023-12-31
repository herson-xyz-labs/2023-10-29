import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Cubemap
const cubeTextureLoader = new THREE.CubeTextureLoader()
const texture = cubeTextureLoader.load([
    './cubemap/px.png',
    './cubemap/nx.png',
    './cubemap/py.png',
    './cubemap/ny.png',
    './cubemap/pz.png',
    './cubemap/nz.png'
])

scene.background = texture

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const linesTexture = textureLoader.load('./textures/lines.png')

// /**
//  * Test mesh
//  */
// // Geometry
// const geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16) // 33 * 33 = 1089
// const count = geometry.attributes.position.count    // 33 * 33 = 1089
// const randoms = new Float32Array(count)            // 1089

// for(let i = 0; i < count; i++)
// {
//     randoms[i] = Math.random()  // 0 ~ 1
// }

// geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1)) // 1 = 1 float  

// Material
const material = new THREE.RawShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: 
    {
        uTexture: { value: linesTexture },
        specMap: { value: scene.background }
    }
})

const loader = new GLTFLoader();
loader.setPath( './models/' );
loader.load( 'futurama-scene.glb', function ( model ) 
    {
        model.scene.traverse( function ( model ) 
            {
                model.material = material;
            }
        );

        console.log(model);

        scene.add( model.scene );

    }
);

// // Mesh
// const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

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
const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height, 0.1, 500)
camera.position.set(-20, 5, 70)
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()