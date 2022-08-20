import {AmbientLight, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";

const container = document.getElementById('container');
const scene = new Scene();
const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight);
camera.position.set(0, 5, 5);
scene.add(new AmbientLight(0xffffff, 2));

const renderer = new WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const stats = new Stats();
container.appendChild(stats.dom);

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    stats.update();
}

animate();
