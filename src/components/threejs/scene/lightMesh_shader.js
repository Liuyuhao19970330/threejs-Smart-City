import * as THREE from 'three';

// import light_fragment from './shader/light_fragment.glsl.js';
import vertexShader from './shader/light_vertex.glsl.js'
import fragmentShader from './shader/light_fragment.glsl.js'


function createLightMesh(L) {
    const angleTan = 0.02; //光锥顶部半径和总长的比值
    const geometry = new THREE.CylinderGeometry(L * angleTan, 1, L, 30, 1, true);
    geometry.translate(0, L / 2, 0);
    // geometry.rotateX(Math.PI / 3);
    const group = new THREE.Group();
    const num = 6;
    const colorArr = [0x00ffff, 0xffff00, 0xff2222, 0x33ff99, 0xff66ff, 0x6666ff];
    for (let i = 0; i < num; i++) {


        var material = new THREE.ShaderMaterial({
            uniforms: {
                L: {
                    value: L
                },
                color:{
                    value:new THREE.Color(colorArr[i]),
                }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            // opacity: 0.6,
            side: THREE.DoubleSide,
        })
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotateX(Math.PI / 3);
        const meshGroup = new THREE.Group();
        meshGroup.add(mesh);
        meshGroup.rotateY(Math.PI * 2 / num * i);

        group.add(meshGroup);
        
    }

    // 选中动画
    function loop() {
        group.rotateY(0.1);
        requestAnimationFrame(loop);
    }
    loop();
    return group;
}

export {
    createLightMesh
};