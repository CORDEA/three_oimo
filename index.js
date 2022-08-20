import {
    AmbientLight,
    BoxGeometry,
    DoubleSide,
    Mesh,
    MeshBasicMaterial,
    MeshStandardMaterial,
    PerspectiveCamera,
    Scene,
    SphereGeometry,
    WebGLRenderer
} from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";

const container = document.getElementById('container');
const scene = new Scene();
const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight);
camera.position.set(0, -1, 10);
scene.add(new AmbientLight(0xffffff));

const renderer = new WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const stats = new Stats();
container.appendChild(stats.dom);

scene.add(createBall());
scene.add(createFloor());

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
});

function createBall() {
    const sphere = new SphereGeometry(0.5);
    const material = new MeshStandardMaterial({
        color: 0x7571ad,
        roughness: 0.0,
        metalness: 0.5,
        side: DoubleSide
    });
    return new Mesh(sphere, material);
}

function createFloor() {
    const box = new BoxGeometry(10, 1, 10);
    const material = new MeshBasicMaterial({
        color: 0x9c9c9c
    });
    const mesh = new Mesh(box, material);
    mesh.position.y = -5;
    return mesh;
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    stats.update();
}

animate();
