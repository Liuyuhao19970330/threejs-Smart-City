// 引入Three.js
import * as THREE from 'three';
// import {
//   ShapeMesh
// } from './ShapeMesh.js';
// import {
//   ExtrudeMesh
// } from './ExtrudeMesh.js';
import {
  flyGroup
} from './flyGroup.js';
import {
  lineGroup
} from './line.js'; //路径轨迹线条
import {
  createConeMesh
} from './ConeMesh.js'; //旋转棱锥热点
import {
  WallMesh
} from './WallMesh.js'; //流光围墙区域

import {
  lon2xy
} from './math.js';

import sigleBuild from './singleBuild.js';



import {
  GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';


var model = new THREE.Group(); //声明一个组对象，用来添加城市三场场景的模型对象
model.add(lineGroup);
model.add(sigleBuild);
model.add(flyGroup);
model.add(WallMesh);
var height = 20; //标注高度
var E = 121.48819; //标注地点
var N = 31.22799;
var xy = lon2xy(E, N);
var x = xy.x;
var y = xy.y;
var ConeMesh = createConeMesh(30);
ConeMesh.position.set(x, y, height);
// console.log('ConeMesh', ConeMesh)
model.add(ConeMesh);


import output_fragment from './output_fragment3.glsl.js'
import water_output_fragment from './water_output_fragment3.glsl.js'
// MeshBasicMaterial:不受光照影响
// MeshLambertMaterial：几何体表面和光线角度不同，明暗不同
var material = new THREE.MeshLambertMaterial({
  color: 0x00ffff, //颜色
});
var materialShader = null;
material.onBeforeCompile = function (shader) {
  // 浏览器控制台打印着色器代码
  // console.log('shader.fragmentShader', shader.fragmentShader)
  materialShader = shader;
  // 浏览器控制台打印着色器代码
  // console.log('shader.fragmentShader', shader.fragmentShader)
  // 顶点位置坐标position类似uv坐标进行插值计算，用于在片元着色器中控制片元像素
  shader.vertexShader = shader.vertexShader.replace(
    'void main() {',
    ['varying vec3 vPosition;',
      'void main() {',
      'vPosition = position;',
      // //考虑模型矩阵对顶点位置影响
      // 'vec4 mPosition = modelMatrix*vec4(position,0.0);',
      // 'vPosition = mPosition.xyz;',
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
  shader.uniforms.time = {
    value: 0.0,
  };
  shader.uniforms.ctime = {
    value: 0.0,
  };
  shader.fragmentShader = shader.fragmentShader.replace('#include <output_fragment>', output_fragment);
};

// 根据相机距离，控制材质切换，比如是否显示建筑分割线



const loader = new GLTFLoader();
var materialShader2 = null;
loader.load('./上海0.06.glb', function (gltf) {
  model.add(gltf.scene);
  gltf.scene.getObjectByName('楼房').material = material;


  const huangpuMesh = gltf.scene.getObjectByName('黄浦江');
  const texload = new THREE.TextureLoader();


  // 水面法线贴图
  var normalTexture = texload.load('./3D/normal.jpg');
  // // 水面区域比较大的话，纹理贴图不能无限大，一般可以通过阵列解决。
  // texture.repeat.set(20, 20); // x和y方向阵列纹理贴图
  normalTexture.wrapS = THREE.RepeatWrapping
  normalTexture.wrapT = THREE.RepeatWrapping
  normalTexture.repeat.set(20, 20);

  // 法线UV动画
  function flowAnimation() {
    requestAnimationFrame(flowAnimation);
    // 固定方向流动
    normalTexture.offset.x -= 0.006;
    normalTexture.offset.y -= 0.006;
  }
  // 来回波动
  // var t = 0;
  // function flowAnimation() {
  //   requestAnimationFrame(flowAnimation);
  //   t += 0.03;
  //   var y = 0.05 * Math.sin(t);
  //   normalTexture.offset.x = y;
  //   normalTexture.offset.y = y;
  // }
  flowAnimation();
  // MeshLambertMaterial不支持法线 使用高光材质Phong
  huangpuMesh.material = new THREE.MeshPhongMaterial({
    // color: 0x666666,
    color: 0x004444,
    // map: texture,
    normalMap: normalTexture,
    normalScale: new THREE.Vector2(5, 5),
    shininess:40,

  }); //材质对象
  huangpuMesh.position.z = -2;
  shapeUV(gltf.scene.getObjectByName('黄浦江').geometry); //修改黄浦江的UV坐标
  huangpuMesh.material.onBeforeCompile = function (shader) {
    // 浏览器控制台打印着色器代码
    // console.log('shader.fragmentShader', shader.fragmentShader)
    materialShader2 = shader;
    // 浏览器控制台打印着色器代码
    // console.log('shader.fragmentShader', shader.fragmentShader)
    // 顶点位置坐标position类似uv坐标进行插值计算，用于在片元着色器中控制片元像素
    shader.vertexShader = shader.vertexShader.replace(
      'void main() {',
      ['varying vec3 vPosition;',
        'void main() {',
        'vPosition = position;',
        // //考虑模型矩阵对顶点位置影响
        // 'vec4 mPosition = modelMatrix*vec4(position,0.0);',
        // 'vPosition = mPosition.xyz;',
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
    shader.uniforms.time = {
      value: 0.0,
    };
    shader.uniforms.ctime = {
      value: 0.0,
    };
    shader.fragmentShader = shader.fragmentShader.replace('#include <output_fragment>', water_output_fragment);
  };

})


var clock = new THREE.Clock(); // 创建一个时钟对象Clock
function loop() {
  // 获得两次scanAnimation执行的时间间隔deltaTime
  var deltaTime = clock.getDelta();
  // console.log(deltaTime)
  // 更新uniforms中时间，这样就可以更新着色器中time变量的值
  if (materialShader && materialShader2) {
    materialShader.uniforms.time.value += 10 * deltaTime;
    materialShader2.uniforms.time.value += 10 * deltaTime;
    materialShader.uniforms.ctime.value += deltaTime;
    materialShader2.uniforms.ctime.value += deltaTime;
    if (materialShader.uniforms.time.value > 10) {
      materialShader.uniforms.time.value = 0;
      materialShader2.uniforms.time.value = 0;
    }
    if (materialShader.uniforms.ctime.value > 3) {
      materialShader.uniforms.ctime.value = 0;
      materialShader2.uniforms.ctime.value = 0;
    }
  }
  requestAnimationFrame(loop);
}
loop();


// var loader = new THREE.FileLoader();
// loader.setResponseType('json')
// //城市建筑数据解析
// loader.load('./上海0.01.json', function (data) {
//   var buildGroup = new THREE.Group(); //作为所有每栋楼Mesh的父对象
//   data.features.forEach(build => {
//     if (build.geometry) {
//       // build.geometry.type === "Polygon"表示建筑物底部包含一个多边形轮廓
//       //build.geometry.type === "MultiPolygon"表示建筑物底部包含多个多边形轮廓
//       if (build.geometry.type === "Polygon") {
//         // 把"Polygon"和"MultiPolygon"的geometry.coordinates数据结构处理为一致
//         build.geometry.coordinates = [build.geometry.coordinates];
//       }
//       //build.properties.Floor*4近似表示楼的高度  
//       var height = build.properties.Floor * 4;
//       if(build.properties.Floor<70)buildGroup.add(ExtrudeMesh(build.geometry.coordinates, height));
//       // if(build.properties.Floor>70)console.log('height = ,',build.properties.Floor)
//     }
//   });
//   model.add(buildGroup);
// });
// // 黄浦江
// loader.load('./黄浦江.json', function (data) {
//   var buildGroup = new THREE.Group(); //作为所有每栋楼Mesh的父对象
//   data.features.forEach(build => {
//     if (build.geometry) {
//       // build.geometry.type === "Polygon"表示建筑物底部包含一个多边形轮廓
//       //build.geometry.type === "MultiPolygon"表示建筑物底部包含多个多边形轮廓
//       if (build.geometry.type === "Polygon") {
//         // 把"Polygon"和"MultiPolygon"的geometry.coordinates数据结构处理为一致
//         build.geometry.coordinates = [build.geometry.coordinates];
//       }
//       buildGroup.add(ShapeMesh(build.geometry.coordinates));
//     }
//   });
//   buildGroup.position.z = -1;
//   model.add(buildGroup);
// });




// shape几何体UV变为0-1区间
function shapeUV(geometry) {
  // 把UV坐标范围控制在[0,1]范围

  var pos = geometry.attributes.position; //顶点位置坐标
  var uv = geometry.attributes.uv; //顶点UV坐标
  var count = pos.count; //顶点数量
  var xArr = []; //多边形polygon的所有x坐标
  var yArr = []; //多边形polygon的所有y坐标
  for (let i = 0; i < count; i++) {
    xArr.push(pos.getX(i));
    yArr.push(pos.getY(i));
  }
  // minMax()计算polygon所有坐标,返回的极大值、极小值
  var [xMin, xMax] = minMax(xArr);
  var [yMin, yMax] = minMax(yArr);
  var xL = xMax - xMin;
  var yL = yMax - yMin;
  // 根据多边形顶点坐标与最小值差值占最大值百分比，设置UV坐标大小 把UV坐标范围控制在[0,1]范围
  for (let i = 0; i < count; i++) {
    var uvx = (pos.getX(i) - xMin) / xL;
    var uvy = (pos.getY(i) - yMin) / yL;
    uv.setXY(i, uvx, uvy)
  }
  // console.log('控制台查看修改后的UV坐标', geometry.attributes.uv.array)

  //   多边形坐标进行排序
  function minMax(arr) {
    // 数组元素排序
    arr.sort(compareNum);
    // 返回极小值和极大值
    return [arr[0], arr[arr.length - 1]]
  }
  // 数组排序规则
  function compareNum(num1, num2) {
    if (num1 < num2) {
      return -1;
    } else if (num1 > num2) {
      return 1;
    } else {
      return 0;
    }
  }
}



export {
  model
}