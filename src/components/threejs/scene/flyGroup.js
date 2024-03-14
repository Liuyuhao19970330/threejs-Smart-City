import * as THREE from 'three';


import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';


import {
    createLightSphereMesh
} from './lightSphereMesh.js';//发光球



var flyGroup = new THREE.Group() // 一架无人机

flyGroup.R=  100;
var LightSphereMesh =  createLightSphereMesh(flyGroup.R);
flyGroup.add(LightSphereMesh);



var mixer = null; //声明一个混合器变量
var loader = new GLTFLoader();
loader.load('./无人机居中.glb', function (gltf) {
    const fly = new THREE.Group();
    fly.add(gltf.scene);
            // 姿态调整
    fly.rotateX(Math.PI / 2);
    fly.rotateY(Math.PI / 2);
    // 三维场景默认单位是米，美术导出模型单位是厘米，需要缩小数字尺寸
    // fly.scale.set(0.1,0.1,0.1);
    fly.scale.set(5, 5, 5); //根据需要放大无人机
    // fly.position.x = -28 * 4; //如果美术导出的模型不居中，需要代码调整
    // fly.position.z = 8 * 4;
    // console.log('gltf', gltf);
    flyGroup.add(fly);
    fly.traverse(function (child) {
        if (child.isMesh) {
            var material = child.material
            child.material = new THREE.MeshLambertMaterial({
                color: material.color,
            })
        }
    });
    // obj作为混合器的参数，可以播放obj包含的帧动画数据
    mixer = new THREE.AnimationMixer(fly);
    // console.log('gltf.animations[0]', gltf.animations);
    // obj.animations[0]：获得剪辑clip对象
    var AnimationAction = mixer.clipAction(gltf.animations[0]);
    AnimationAction.timeScale = 15; //默认1，可以调节播放速度
    // AnimationAction.loop = THREE.LoopOnce; //不循环播放
    // AnimationAction.clampWhenFinished=true;//暂停在最后一帧播放的状态
    AnimationAction.play();
})

var clock = new THREE.Clock();

function UpdateLoop() {
    if (mixer !== null) {
        //clock.getDelta()方法获得两帧的时间间隔
        mixer.update(clock.getDelta());
    }
    requestAnimationFrame(UpdateLoop);
}
UpdateLoop();




var texLoad = new THREE.TextureLoader();
var material = new THREE.SpriteMaterial({
  map: texLoad.load('./3D/无人机信号波.png'),
  color: 0xffff00, //设置颜色
  transparent: true, //允许透明计算
});
var sprite = new THREE.Sprite(material);
material.rotation=Math.PI/2;//调整sprite角度
sprite.center.set(1.0,0.5);//调整sprite与标注点相对位置
var plane = new THREE.Group();
plane.add(sprite)
flyGroup.add(plane);

// 波动动画
var S= 500;//波动范围倍数设置
var _s = 1.0;
function animation() {
  _s += 20;
  plane.scale.set(_s, _s,  _s);
  if (_s <= S*0.2) {
      material.opacity = (_s - 1) /(S*0.2-1);//保证透明度在0~1之间变化
  } else if (_s > S*0.2 && _s <= S) {
      material.opacity = 1 - (_s - S*0.2) /(S - S*0.2);//保证透明度在0~1之间变化
  } else {
      _s = 1.0;
  }
  requestAnimationFrame(animation);
}
animation();



// 外卖盒
var geometry2 =  new THREE.BoxGeometry(75,75,75)
var material2 = new THREE.MeshLambertMaterial({
    map: texLoad.load('./3D/外卖.jpg'),
});
var mesh = new THREE.Mesh(geometry2,material2);
mesh.rotateX(Math.PI/2);//调整立方体姿态，以便于调整纹理图像姿态
mesh.position.z = -40;
flyGroup.add(mesh);

export {
    flyGroup
};