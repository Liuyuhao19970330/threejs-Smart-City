import * as THREE from 'three';
import {
  lon2xy
} from './math';

function createWallMesh(ENArr, color,xnum) {
  const c = [];
  for (let i = 0; i < ENArr.length; i += 2) {
    const xy = lon2xy(ENArr[i], ENArr[i + 1]);
    c.push(xy.x, xy.y)
  }

  var posArr = [];
  var uvrr = [];
  var h = 120; //围墙拉伸高度
  for (var i = 0; i < c.length - 2; i += 2) {
    // 围墙多边形上两个点构成一个直线扫描出来一个高度为h的矩形
    // 矩形的三角形1
    posArr.push(c[i], c[i + 1], 0, c[i + 2], c[i + 3], 0, c[i + 2], c[i + 3], h);
    // 矩形的三角形2
    posArr.push(c[i], c[i + 1], 0, c[i + 2], c[i + 3], h, c[i], c[i + 1], h);

    // 注意顺序问题，和顶点位置坐标对应
    uvrr.push(0, 0, 1, 0, 1, 1);
    uvrr.push(0, 0, 1, 1, 0, 1);
  }
  var geometry = new THREE.BufferGeometry(); //声明一个空几何体对象
  // 设置几何体attributes属性的位置position属性
  geometry.attributes.position = new THREE.BufferAttribute(new Float32Array(posArr), 3);
  // 设置几何体attributes属性的位置uv属性
  geometry.attributes.uv = new THREE.BufferAttribute(new Float32Array(uvrr), 2);
  geometry.computeVertexNormals()
  var texload = new THREE.TextureLoader();
  var texture = texload.load('./3D/流动.png')
  // 设置阵列模式为 RepeatWrapping
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.x = xnum; // x方向阵列
  function flowAnimation() {
    requestAnimationFrame(flowAnimation);
    // 使用加减法可以设置不同的运动方向
    // 设置纹理偏移
    // y方向流量  光带流动效果
    texture.offset.y -= 0.02;
    // texture.offset.x -= 0.06;
  }
  flowAnimation();

  var material = new THREE.MeshLambertMaterial({
    //   color: 0x00ffff, 
    color: color,
    map: texture,
    side: THREE.DoubleSide, //两面可见
    transparent: true, //需要开启透明度计算，否则着色器透明度设置无效
      // depthTest: false,
  });
  var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
  // WallMesh.rotateX(-Math.PI / 2);


  var mesh2 = mesh.clone();
  mesh2.material = new THREE.MeshLambertMaterial({
    color: color,
    map: texload.load('./3D/Wall渐变.png'),
    side: THREE.DoubleSide, //两面可见
    transparent: true, //需要开启透明度计算，否则着色器透明度设置无效
    opacity: 0.4,//整体改变透明度
      // depthTest: false,
  });


  // mesh2.scale.set(1.0001,1.0001,1.0);//缩放会导致偏移或超出渲染范围看不到
  // console.log('mesh2',mesh2)

  const WallMesh = new THREE.Group();
  WallMesh.add(mesh);
  WallMesh.add(mesh2);

  // 两个mesh一样大，深度冲突问题
  mesh.renderOrder = 0;
  mesh2.renderOrder = -1;

  return WallMesh;
}

// 一个多边形区域的经纬度，实际开发根据ajax请求获取数据实时更新即可
var ENArr = [
  121.485691, 31.241081, //顶点1坐标
  121.480390, 31.239682, //顶点2坐标
  121.482327, 31.232689, //顶点3坐标
  121.482677, 31.230967, //顶点4坐标
  121.489701, 31.232958, //顶点5坐标
  121.487333, 31.235245, //顶点6坐标
  121.486068, 31.237640, //顶点7坐标
  121.485691, 31.241081, //和顶点1重合
]

var ENArr2 = [
  121.4924558,31.2303273,
  121.4914161,31.2298172,
  121.4903469,31.2297191,
  121.4909551,31.2275710,
  121.4909649,31.2273944,
  121.4918575,31.2272375,
  121.4928187,31.2273062,
  121.4930443,31.2269530,
  121.4954181,31.2274729,
  121.4941135,31.2288952,
  121.4924558,31.2303273,
]

Math.xnum=function(arr){
  let S = 0;
  for (let i = 0; i < arr.length-2; i+=2) {
    const x1 = arr[i];
    const y1 = arr[i+1];
    const x2 = arr[i+2];
    const y2 = arr[i+3];
    S+=Math.sqrt((y2-y1)*(y2-y1)+(x2-x1)*(x2-x1));
  }
  return S/0.01;
}


// 优化？？？：圆周方向纹理阵列数量和包围的区域周长正相关，threejs曲线API快速计算多边形轮廓
const mesh1 = createWallMesh(ENArr, 0xffff00,Math.xnum(ENArr));
const mesh2 = createWallMesh(ENArr2, 0xffff00,Math.xnum(ENArr2));
const WallMesh = new THREE.Group();
WallMesh.add(mesh1, mesh2);

export {
  WallMesh
}