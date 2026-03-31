document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create Gears
    function createGear(radius, innerRadius, teeth, color) {
        const shape = new THREE.Shape();
        for (let i = 0; i < teeth * 2; i++) {
            const angle = (i / (teeth * 2)) * Math.PI * 2;
            const r = i % 2 === 0 ? radius : innerRadius;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            if (i === 0) shape.moveTo(x, y);
            else shape.lineTo(x, y);
        }
        shape.closePath();
        const extrudeSettings = { depth: 0.2, bevelEnabled: false };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const material = new THREE.MeshStandardMaterial({ 
            color: color,
            roughness: 0.4,
            metalness: 0.6
        });
        return new THREE.Mesh(geometry, material);
    }

    const gearColor = 0x475569; // slate-600
    const figureColor = 0x0f172a; // slate-900

    const gearsGroup = new THREE.Group();
    
    const gear1 = createGear(0.8, 0.65, 12, gearColor);
    gear1.position.set(0, 0.8, 0);
    gearsGroup.add(gear1);

    const gear2 = createGear(0.6, 0.45, 10, gearColor);
    gear2.position.set(-1, 0, -0.2);
    gearsGroup.add(gear2);

    const gear3 = createGear(0.5, 0.35, 8, gearColor);
    gear3.position.set(0.8, -0.2, -0.1);
    gearsGroup.add(gear3);

    const gear4 = createGear(0.4, 0.3, 8, gearColor);
    gear4.position.set(0.1, -0.9, -0.3);
    gearsGroup.add(gear4);

    gearsGroup.position.set(0, 0.5, 0);
    scene.add(gearsGroup);

    // Silhouettes (Pivot Structures)
    function createFigure(x, y, z, pointing = false) {
        const group = new THREE.Group();
        
        // Body (Simplified humanoid silhouette)
        const bodyGeo = new THREE.BoxGeometry(0.4, 1.2, 0.2);
        const bodyMat = new THREE.MeshStandardMaterial({ color: figureColor });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        group.add(body);

        // Head
        const headGeo = new THREE.SphereGeometry(0.25, 32, 32);
        const head = new THREE.Mesh(headGeo, bodyMat);
        head.position.y = 0.85;
        group.add(head);

        // Arms
        const armGeo = new THREE.BoxGeometry(0.1, 0.7, 0.1);
        
        const armL = new THREE.Mesh(armGeo, bodyMat);
        armL.position.set(-0.3, 0.2, 0);
        if (pointing) {
            armL.rotation.z = Math.PI / 2.5;
            armL.position.y = 0.4;
        } else {
            armL.rotation.z = -Math.PI / 10;
        }
        group.add(armL);

        const armR = new THREE.Mesh(armGeo, bodyMat);
        armR.position.set(0.3, 0.2, 0);
        armR.rotation.z = pointing ? -Math.PI / 10 : -Math.PI / 2.5; 
        if (!pointing) armR.position.y = 0.4;
        group.add(armR);

        group.position.set(x, y, z);
        scene.add(group);
        return { group, head };
    }

    // Positions matching the 2D image layout (figures below/side of gears)
    const figure1 = createFigure(-1.2, -1.2, 0.5, true); // Pointing at gears
    const figure2 = createFigure(1.2, -1.2, 0.5, false); // Standing by

    camera.position.z = 6;

    // Mouse Tracking
    const mouse = new THREE.Vector2();
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        // Normalize mouse coordinates relative to canvas
        targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        targetY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    });

    function animate() {
        requestAnimationFrame(animate);
        
        // Smooth mouse tracking
        mouse.x += (targetX - mouse.x) * 0.1;
        mouse.y += (targetY - mouse.y) * 0.1;

        // Rotate Gears
        gear1.rotation.z += 0.005;
        gear2.rotation.z -= 0.007;
        gear3.rotation.z += 0.008;
        gear4.rotation.z -= 0.006;

        // Head Tracking - Make them face the mouse
        [figure1, figure2].forEach(fig => {
            fig.head.rotation.y = mouse.x * 1.2;
            fig.head.rotation.x = -mouse.y * 0.5;
        });

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});
