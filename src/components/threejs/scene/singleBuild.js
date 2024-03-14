import * as THREE from 'three';

import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader';
// import {
//     createLightSphereMesh
// } from './lightSphereMesh';
import {
    lon2xy
} from './math';

import {
    tag
} from './messageTag';

import { createLightMesh } from './lightMesh_shader.js';

import output_fragment from './singleBuild_output_fragment.glsl.js';


const loader = new GLTFLoader();
const sigleBuild = new THREE.Group();

const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
    // color: 0x001111,//场景大可以暗一些  要不然整个屏幕太亮
    // transparent: true, //允许透明计算
    // opacity: 0.7, //半透明设置
});
// GPU执行material对应的着色器代码前，通过.onBeforeCompile()插入新的代码，修改已有的代码
let materialShader = null;
material.onBeforeCompile = function (shader) {
    materialShader = shader;
    shader.uniforms.time = {
        value: 0.0,
    };
    shader.uniforms.ctime = {
        value: 0.0,
    };
    // 浏览器控制台打印着色器代码
    // console.log('shader.fragmentShader', shader.fragmentShader)
    // 顶点位置坐标position类似uv坐标进行插值计算，用于在片元着色器中控制片元像素
    shader.vertexShader = shader.vertexShader.replace(
        'void main() {',
        ['varying vec3 vPosition;',
            'void main() {',
            // 'vPosition = position;',
            //考虑模型矩阵对顶点位置影响
            'vec4 mPosition = modelMatrix*vec4(position,0.0);',
            'vPosition = mPosition.xyz;',
        ].join('\n') // .join()把数组元素合成字符串
    );
    shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        ['varying vec3 vPosition;',
            'uniform float ctime;', //控制全城光带动画
            'uniform float time;', //控制建筑光带动画
            'void main() {',
        ].join('\n')
    );

    shader.fragmentShader = shader.fragmentShader.replace('#include <output_fragment>', output_fragment);
};
var clock = new THREE.Clock(); // 创建一个时钟对象Clock
function loop() {
    // 获得两次scanAnimation执行的时间间隔deltaTime
    var deltaTime = clock.getDelta();
    // console.log(deltaTime)
    // 更新uniforms中时间，这样就可以更新着色器中time变量的值
    if (materialShader) {
        materialShader.uniforms.time.value += 10 * deltaTime;
        materialShader.uniforms.ctime.value += deltaTime;
        if (materialShader.uniforms.time.value > 20) {
            materialShader.uniforms.time.value = 0;
        }
        if (materialShader.uniforms.ctime.value > 3) {
            materialShader.uniforms.ctime.value = 0;
        }
    }
    requestAnimationFrame(loop);
}
loop();

loader.load('./东方明珠.glb', function (gltf) {
    const group = gltf.scene;
    // group.scale.set(1.5,1.5,1.5);

    const E = 121.49526536464691; //东方明珠经纬度
    const N = 31.24189350905988;
    const xy = lon2xy(E, N);
    const x = xy.x;
    const y = xy.y;
    group.position.set(x, y, 0);
    group.rotateX(Math.PI / 2); //调整建筑姿态与场景适配，高度方向沿着y轴
    sigleBuild.add(group);

    var arr = ['东方明珠', '上海中心大厦', '环球金融中心'];
    for (let i = 0; i < arr.length; i++) {
        var obj = gltf.scene.getObjectByName(arr[i]);
        var messageTag = tag(arr[i]); //创建标签对象
        var pos = new THREE.Vector3();
        obj.getWorldPosition(pos); //获取obj世界坐标
        messageTag.position.copy(pos); //标签标注在obj世界坐标
        sigleBuild.add(messageTag); //标签对象添加到三维场景
        messageTag.position.y += 20; //可以根据自己需要微调偏移HTML标签
        //美术给的需要标注的模型的局部坐标系坐标原点在底部，如果你想标注顶部，就需要在世界坐标基础上考虑模型高度
        if (arr[i] === '东方明珠') messageTag.position.z += 485;
        if (arr[i] === '上海中心大厦') messageTag.position.z += 725;
        if (arr[i] === '环球金融中心') messageTag.position.z += 540;
    }


    var arr2 = ['东方明珠', '上海中心大厦', '金茂大厦', '环球金融中心'];
    for (let i = 0; i < arr2.length; i++) {
        var dongfang = gltf.scene.getObjectByName(arr2[i]);
        dongfang.material = material;
    }

    const dong = gltf.scene.getObjectByName('东方明珠');
    console.log('dong,dong', dong);
    const lightMesh = createLightMesh(1000.0);
    group.add(lightMesh);
    lightMesh.position.y += 400;

})





export default sigleBuild;