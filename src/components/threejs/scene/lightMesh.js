import * as THREE from 'three';

function createLightMesh(L) {
    const geometry = new THREE.CylinderGeometry(L * 0.01, 1, L, 30, 1, true);
    geometry.translate(0, L / 2, 0);
    geometry.rotateX(Math.PI / 3);
    const texLoader = new THREE.TextureLoader();
    const texture = texLoader.load('./3D/光锥渐变.png');
    const material = new THREE.MeshPhongMaterial({
        // color: 0xffff00,
        map: texture,
        transparent: true,
        opacity: 0.5,        
    });
    const mesh = new THREE.Mesh(geometry, material);


    const group = new THREE.Group();
    group.add(mesh);
    const num = 6;
    const colorArr = [0x00ffff,0xffff00,0xff2222,0x33ff99,0xff66ff,0x6666ff];
    for (let i = 0; i < num; i++) {
        const mesh2 = mesh.clone();
        mesh2.material = material.clone();
        mesh2.material.color.set(colorArr[i]);
        mesh2.material.emissive.set(colorArr[i]);
        group.add(mesh2);
        mesh2.rotateY(Math.PI * 2 / num * i);
    }

    // 选中动画
    function loop() {
        group.rotateY(0.1);
        requestAnimationFrame(loop);
    }
    loop();
    return group;
}

export  {createLightMesh};