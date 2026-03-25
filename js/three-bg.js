/**
 * three-bg.js
 * Three.js background scene: particles, floating geometric shapes,
 * profile card 3D tilt, and mouse-parallax camera movement.
 *
 * Loaded as <script type="module" src="js/three-bg.js">
 */

import * as THREE from 'three';

// ── Scene Setup ──────────────────────────────────────────────────────────────
const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(1); // Set to 1 for better performance, high pixel ratio on background hurts scroll speed
document.getElementById('canvas-container').appendChild(renderer.domElement);

// ── Particles ────────────────────────────────────────────────────────────────
const particlesGeometry  = new THREE.BufferGeometry();
const particlesCount     = 1500;
const posArray           = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 50;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size:        0.02,
    color:       0x00f2ea,
    transparent: true,
    opacity:     0.6,
    blending:    THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// ── Floating Geometric Shapes ─────────────────────────────────────────────────
const shapes        = [];
const geometryTypes = [
    new THREE.IcosahedronGeometry(0.5, 0),
    new THREE.OctahedronGeometry(0.4, 0),
    new THREE.TetrahedronGeometry(0.4, 0)
];
const colors = [0x00f2ea, 0xff00ff, 0x7928ca];

for (let i = 0; i < 10; i++) {
    const geometry = geometryTypes[Math.floor(Math.random() * geometryTypes.length)];
    const material = new THREE.MeshPhongMaterial({
        color:       colors[Math.floor(Math.random() * colors.length)],
        wireframe:   true,
        transparent: true,
        opacity:     0.3
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10 - 5
    );
    mesh.userData = {
        rotationSpeed: {
            x: (Math.random() - 0.5) * 0.01,
            y: (Math.random() - 0.5) * 0.01
        },
        floatSpeed:  Math.random() * 0.005 + 0.002,
        floatOffset: Math.random() * Math.PI * 2
    };

    scene.add(mesh);
    shapes.push(mesh);
}

// ── Lights ────────────────────────────────────────────────────────────────────
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0x00f2ea, 1, 100);
pointLight1.position.set(10, 10, 10);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xff00ff, 1, 100);
pointLight2.position.set(-10, -10, 10);
scene.add(pointLight2);

camera.position.z = 5;

// ── Mouse Interaction ─────────────────────────────────────────────────────────
let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth)  * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// ── Animation Loop ────────────────────────────────────────────────────────────
let frame = 0;

function animate() {
    requestAnimationFrame(animate);
    frame++;

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.0005;

    shapes.forEach((shape) => {
        shape.rotation.x += shape.userData.rotationSpeed.x;
        shape.rotation.y += shape.userData.rotationSpeed.y;
        shape.position.y += Math.sin(frame * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.01;
    });

    camera.position.x = targetX * 0.5;
    camera.position.y = targetY * 0.5;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

animate();

// ── Resize Handler ────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ── Profile Card 3D Tilt ──────────────────────────────────────────────────────
const profileContainer = document.getElementById('profileContainer');
const profileCard      = document.getElementById('profileCard');

if (profileContainer && profileCard) {
    profileContainer.addEventListener('mousemove', (e) => {
        const rect    = profileContainer.getBoundingClientRect();
        const x       = e.clientX - rect.left;
        const y       = e.clientY - rect.top;
        const centerX = rect.width  / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        profileCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    profileContainer.addEventListener('mouseleave', () => {
        profileCard.style.transform = 'rotateX(0) rotateY(0)';
    });
}
