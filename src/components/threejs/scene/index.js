// 场景总文件
// 引入Three.js
import * as THREE from 'three';
import {
    model
} from './model.js';
import {
    lon2xy
} from './math.js';


/**
 * 创建场景对象Scene
 */
var scene = new THREE.Scene();
scene.add(model); //三维模型添加到场景中

/**
 * 光源设置
 */
// 平行光1
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(200, 400, 300);
scene.add(directionalLight);
// 平行光2
var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight2.position.set(-200, -400, 300);
scene.add(directionalLight2);
//环境光
var ambient = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambient);

// 调节光源强度，白天黑夜

// directionalLight.intensity = 0.4;
// directionalLight2.intensity = 0.4;

directionalLight.intensity = 0.8;
directionalLight2.intensity = 0.8;

// Three.js三维坐标轴 三个坐标轴颜色RGB分别对应xyz轴
var axesHelper = new THREE.AxesHelper(2500);
var E = 121.49526536464691; //东方明珠经纬度坐标
var N = 31.24189350905988;
var xy = lon2xy(E, N);
var x = xy.x;
var y = xy.y;
axesHelper.position.set(x, y, 0);
// scene.add(axesHelper);


// // 全景图作为球体Mesh颜色纹理贴图   
// var geometry = new THREE.SphereGeometry(4000, 50, 50);//根据城市范围多倍设置尺寸即可
// var textureLoader = new THREE.TextureLoader(); 
// var material = new THREE.MeshBasicMaterial({
//     map: textureLoader.load('./3D/env/4.png'),
//     side: THREE.BackSide, //默认前面可见，设置为背面可见即可
// });
// var mesh = new THREE.Mesh(geometry, material);
// mesh.position.set(x, y, 0);//位置靠近渲染范围的中心即可
// mesh.rotateX(-Math.PI/2);//调整姿态，以便于调整纹理图像姿态
// scene.add(mesh);

// var textureLoader = new THREE.TextureLoader();
// scene.background=textureLoader.load('./3D/env/4.png');


// 设置雾化效果，雾的颜色和背景颜色相近，这样远处三维场景和背景颜色融为一体
// 结合相机参数设置Fog的参数2和参数3
scene.fog = new THREE.Fog(0x002222, 5500, 15000);

export {
    scene
};