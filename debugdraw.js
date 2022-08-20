import {oimo} from "oimophysics/OimoPhysics";
import {
    BufferGeometry,
    Float32BufferAttribute,
    Group,
    LineBasicMaterial,
    LineSegments,
    Mesh,
    MeshNormalMaterial,
    Points,
    PointsMaterial
} from "three";

const DebugDraw = oimo.dynamics.common.DebugDraw;
const bufferSize = 4096;

export class ThreeDebugDraw extends DebugDraw {
    constructor(scene) {
        super();
        const points = new Points(
            (function () {
                const geometry = new BufferGeometry();
                geometry.setAttribute(
                    'position',
                    new Float32BufferAttribute(
                        new Float32Array(bufferSize * 3),
                        3
                    )
                );
                geometry.setAttribute(
                    'color',
                    new Float32BufferAttribute(
                        new Float32Array(bufferSize * 3),
                        3
                    )
                );
                return geometry;
            })(),
            new PointsMaterial({
                vertexColors: true
            })
        );
        points.name = 'points';
        const lines = new LineSegments(
            (function () {
                const geometry = new BufferGeometry();
                geometry.setAttribute(
                    'position',
                    new Float32BufferAttribute(
                        new Float32Array(bufferSize * 3 * 2),
                        3
                    )
                );
                geometry.setAttribute(
                    'color',
                    new Float32BufferAttribute(
                        new Float32Array(bufferSize * 3 * 2),
                        3
                    )
                );
                return geometry;
            })(),
            new LineBasicMaterial({
                vertexColors: true
            })
        );
        lines.name = 'lines';
        const triangles = new Mesh(
            (function () {
                const geometry = new BufferGeometry();
                geometry.setAttribute(
                    'position',
                    new Float32BufferAttribute(
                        new Float32Array(bufferSize * 3 * 3),
                        3
                    )
                );
                geometry.setAttribute(
                    'normal',
                    new Float32BufferAttribute(
                        new Float32Array(bufferSize * 3 * 3),
                        3
                    )
                );
                geometry.setAttribute(
                    'color',
                    new Float32BufferAttribute(
                        new Float32Array(bufferSize * 3 * 3),
                        3
                    )
                );
                return geometry;
            })(),
            new MeshNormalMaterial({
                vertexColors: true,
                flatShading: true
            })
        );
        triangles.name = 'triangles';
        this.group = new Group();
        this.group.add(points, lines, triangles);
        scene.add(this.group);
        this.sizes = [0, 0, 0];
    }

    point(v, c) {
        const mesh = this.group.getObjectByName('points');
        let i = this.sizes[0];
        const position = mesh.geometry.attributes.position;
        const color = mesh.geometry.attributes.color;
        position.setXYZ(i, v.x, v.y, v.z);
        color.setXYZ(i, c.x, c.y, c.z);
        this.sizes[0] += 1;
        if (this.sizes[0] !== bufferSize) {
            return;
        }
        this.sizes[0] = 0;
    }

    triangle(v1, v2, v3, n1, n2, n3, c) {
        const mesh = this.group.getObjectByName('triangles');
        let i = this.sizes[1] * 3;
        const position = mesh.geometry.attributes.position;
        const normal = mesh.geometry.attributes.normal;
        const color = mesh.geometry.attributes.color;
        position.setXYZ(i, v1.x, v1.y, v1.z);
        normal.setXYZ(i, n1.x, n1.y, n1.z);
        color.setXYZ(i, c.x, c.y, c.z);
        i += 1;
        position.setXYZ(i, v2.x, v2.y, v2.z);
        normal.setXYZ(i, n2.x, n2.y, n2.z);
        color.setXYZ(i, c.x, c.y, c.z);
        i += 1;
        position.setXYZ(i, v3.x, v3.y, v3.z);
        normal.setXYZ(i, n3.x, n3.y, n3.z);
        color.setXYZ(i, c.x, c.y, c.z);
        this.sizes[1] += 1;
        if (this.sizes[1] !== bufferSize) {
            return;
        }
        this.sizes[1] = 0;
    }

    line(v1, v2, c) {
        const line = this.group.getObjectByName('lines');
        let i = this.sizes[2] * 2;
        const position = line.geometry.attributes.position;
        const color = line.geometry.attributes.color;
        position.setXYZ(i, v1.x, v1.y, v1.z);
        color.setXYZ(i, c.x, c.y, c.z);
        i += 1;
        position.setXYZ(i, v2.x, v2.y, v2.z);
        color.setXYZ(i, c.x, c.y, c.z);
        this.sizes[2] += 1;
        if (this.sizes[2] !== bufferSize) {
            return;
        }
        this.sizes[2] = 0;
    }

    render() {
        for (const child of this.group.children) {
            child.geometry.attributes.position.needsUpdate = true;
            child.geometry.attributes.color.needsUpdate = true;
            const normal = child.geometry.attributes.normal;
            if (normal) {
                normal.needsUpdate = true;
            }
        }
        this.sizes = [0, 0, 0];
    }
}
