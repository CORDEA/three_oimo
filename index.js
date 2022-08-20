import {
    AmbientLight,
    BoxGeometry,
    Clock,
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
import {oimo} from "oimophysics/OimoPhysics";

const World = oimo.dynamics.World;
const Shape = oimo.dynamics.rigidbody.Shape;
const ShapeConfig = oimo.dynamics.rigidbody.ShapeConfig;
const RigidBodyConfig = oimo.dynamics.rigidbody.RigidBodyConfig;
const RigidBody = oimo.dynamics.rigidbody.RigidBody;
const RigidBodyType = oimo.dynamics.rigidbody.RigidBodyType;
const Vec3 = oimo.common.Vec3;
const OBoxGeometry = oimo.collision.geometry.BoxGeometry;
const OSphereGeometry = oimo.collision.geometry.SphereGeometry;

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

const world = new World();
const clock = new Clock();

let bodies = new WeakMap();
createBall();
createFloor();

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
});

function createBall() {
    const r = 0.5;
    const sphere = new SphereGeometry(r);
    const material = new MeshStandardMaterial({
        color: 0x7571ad,
        roughness: 0.0,
        metalness: 0.5,
        side: DoubleSide
    });
    const mesh = new Mesh(sphere, material);
    const geometry = new OSphereGeometry(r);
    scene.add(mesh);
    applyBody(mesh, geometry, RigidBodyType.DYNAMIC);
}

function createFloor() {
    const box = new BoxGeometry(10, 1, 10);
    const material = new MeshBasicMaterial({
        color: 0x9c9c9c
    });
    const mesh = new Mesh(box, material);
    mesh.position.y = -5;
    const params = mesh.geometry.parameters;
    const geometry = new OBoxGeometry(
        new Vec3(
            params.width / 2,
            params.height / 2,
            params.depth / 2
        )
    );
    scene.add(mesh);
    applyBody(mesh, geometry, RigidBodyType.STATIC);
}

function applyBody(mesh, geometry, type) {
    const shapeConfig = new ShapeConfig();
    shapeConfig.geometry = geometry;
    shapeConfig.restitution = 0.8;
    const bodyConfig = new RigidBodyConfig();
    bodyConfig.type = type;
    bodyConfig.position = new Vec3(
        mesh.position.x,
        mesh.position.y,
        mesh.position.z
    );
    const body = new RigidBody(bodyConfig);
    body.addShape(new Shape(shapeConfig));
    world.addRigidBody(body);
    bodies.set(mesh, body);
}

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (delta > 0) {
        world.step(delta);
        for (const child of scene.children) {
            const body = bodies.get(child);
            if (body) {
                child.position.copy(body.getPosition());
                child.quaternion.copy(body.getOrientation());
            }
        }
    }
    renderer.render(scene, camera);
    stats.update();
}

animate();
