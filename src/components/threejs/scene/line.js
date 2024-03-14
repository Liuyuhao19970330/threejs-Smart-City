// 引入three.js
import * as THREE from 'three';

import {
    LineSegmentsGeometry
} from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import {
    LineMaterial
} from 'three/examples/jsm/lines/LineMaterial.js';
import {
    LineSegments2
} from 'three/examples/jsm/lines/LineSegments2.js';

import output_fragment from './fly_output_fragment.glsl.js'


import {
    lon2xy
} from './math.js';
var lineGroup = new THREE.Group(); //声明一个组对象
var loader = new THREE.FileLoader();
loader.setResponseType('json')

// 测试GeoJSON数据结构

// loader.load('./路2.geojson', function (data) {
//     const arr = [];
//     for (let i = 0; i < data.features.length; i++) {
//         const highway = data.features[i].properties.highway;
//         arr.push(highway);
//     }
//     const arr2 = [...new Set(arr)];
//     console.log('highway的属性值种类',arr2);
//     ['primary', 'trunk', 'residential', 'trunk_link', 'tertiary', 'tertiary_link', 'secondary', 'service', 'footway', 'cycleway', null, 'unclassified', 'pedestrian', 'secondary_link', 'construction', 'primary_link', 'path', 'steps', 'living_street', 'platform', 'bus_stop', 'road', 'corridor']
// })

//轨迹线数据解析W
loader.load('./路2.geojson', function (data) {
    var pointsArr = []; //所有轨迹线坐标提取到一个数组中，这样绘制线条对应的Geometry数量大幅下降,只有一个Geometry

    for (let i = 0; i < data.features.length; i++) {
        const way = data.features[i].properties.highway;
        //根据GeoJSON属性highway的值选择绘制哪些路
        if (way == 'primary' || way == 'trunk' || way == 'secondary' || way == 'tertiary') {
            const arr = data.features[i].geometry.coordinates; //一组轨迹线的坐标
            const xy0 = lon2xy(arr[0][0], arr[0][1]); //经纬度转墨卡托
            pointsArr.push(xy0.x, xy0.y, 0, );
            for (let j = 1; j < arr.length - 1; j++) {
                const xy = lon2xy(arr[j][0], arr[j][1]); //经纬度转墨卡托
                // var xy = lon2xy(coord[0]-0.0128, coord[1]-0.0075);//建筑物和轨迹线经纬度数据来源不同，适当偏移
                pointsArr.push(xy.x, xy.y, 0, xy.x, xy.y, 0);
            }
            const xyl = lon2xy(arr[arr.length - 1][0], arr[arr.length - 1][1]);
            pointsArr.push(xyl.x, xyl.y, 0, );
        }
    }
    var line = createLine2(pointsArr); //创建一条轨迹线
    lineGroup.add(line);


});

// 地铁、公交等轨迹
loader.load('./路mul - 格式化.geojson', function (data) {
    // var pointsArr = [];
    for (let i = 0; i < data.features.length; i++) {
        const arr = data.features[i].geometry.coordinates[0]; //一组轨迹线的坐标
        const newArr = [...arr];
        // const xy0 = lon2xy(arr[0][0], arr[0][1]); //经纬度转墨卡托
        // pointsArr.push(xy0.x, xy0.y, 0, );
        // for (let j = 1; j < newArr.length - 1; j++) {
        //     const xy = lon2xy(arr[j][0], arr[j][1]); //经纬度转墨卡托
        //     // var xy = lon2xy(coord[0]-0.0128, coord[1]-0.0075);//建筑物和轨迹线经纬度数据来源不同，适当偏移
        //     pointsArr.push(xy.x, xy.y, 0, xy.x, xy.y, 0);
        // }
        // const xyl = lon2xy(arr[arr.length - 1][0], arr[arr.length - 1][1]);
        // pointsArr.push(xyl.x, xyl.y, 0, );
        var flyPoints = createfly(newArr); //创建一条流线
        lineGroup.add(flyPoints);
    }
    // var line = createLine2(pointsArr); //创建一条轨迹线
    // lineGroup.add(line);
})
// // 通过一系列坐标点生成一条轨迹线
// function createLine(pointsArr) {
//     /**
//      * 通过BufferGeometry构建一个几何体，传入顶点数据
//      * 通过Line模型渲染几何体，连点成线
//      */
//     var geometry = new THREE.BufferGeometry(); //创建一个Buffer类型几何体对象
//     //类型数组创建顶点数据
//     var vertices = new Float32Array(pointsArr);
//     // 创建属性缓冲区对象
//     var attribue = new THREE.BufferAttribute(vertices, 3); //3个为一组，表示一个顶点的xyz坐标
//     // 设置几何体attributes属性的位置属性
//     geometry.attributes.position = attribue;
//     // 线条渲染几何体顶点数据
//     var material = new THREE.LineBasicMaterial({
//         color: 0x006666 //线条颜色
//     }); //材质对象
//     var line = new THREE.LineSegments(geometry, material); //线条模型对象
//     return line;
// }
// // 有粗细的轨迹线
function createLine2(pointsArr) {
    var geometry = new LineSegmentsGeometry();
    // 几何体传入顶点坐标
    geometry.setPositions(pointsArr);

    var material = new LineMaterial({
        // color: 0x00ffff,//很亮，如果路径比较少，可以这样，所有街道都有，就太亮了
        color: 0x006666, //与建筑颜色相近，融为一体,可以根据场景大小、线条密度设置颜色亮度
        linewidth: 3.0,
    });
    // 把渲染窗口尺寸分辨率传值给材质LineMaterial的resolution属性
    // resolution属性值会在着色器代码中参与计算
    material.resolution.set(window.innerWidth, window.innerHeight);
    var line = new LineSegments2(geometry, material);
    return line;
}




// 创建流线轨迹
function createfly(flypointsArr) {
    var v3Arr = [];
    flypointsArr.forEach(function (coord) {
        const xy = lon2xy(coord[0], coord[1]); //经纬度转墨卡托
        v3Arr.push(new THREE.Vector3(xy.x, xy.y, 0));
    })

    // 三维样条曲线
    var curve = new THREE.CatmullRomCurve3(v3Arr);
    const L = curve.getLength();
    let spNum = Math.floor(L / 10); //分段数
    if(spNum<50)spNum=100;
    //曲线上等间距返回多个顶点坐标
    var points = curve.getSpacedPoints(spNum);
    // var index = 0; //取点索引位置
    var index = Math.floor((points.length-spNum * 0.3) * Math.random()); //取点索引位置随机
    var num = Math.floor(spNum * 0.2); //从曲线上获取点数量

    var points2 = points.slice(index, index + num); //从曲线上获取一段
    var curve2 = new THREE.CatmullRomCurve3(points2);
    var newPoints2 = curve2.getSpacedPoints(num * 10); //获取更多的点数
    var geometry2 = new THREE.BufferGeometry();
    geometry2.setFromPoints(newPoints2);

    // 每个顶点对应一个百分比数据attributes.percent 用于控制点的渲染大小
    var percentArr = []; //attributes.percent的数据
    // 批量计算所有顶点颜色数据
    var colorArr = [];
    var half = Math.floor(newPoints2.length / 2);
    for (var i = 0; i < newPoints2.length; i++) {
        if (i < half) {
            // percentArr.push(i / half);
            percentArr.push(Math.pow(i / half, 0.2));
            const color1 = new THREE.Color(0x666600); //轨迹线颜色
            const color2 = new THREE.Color(0xffff00); //更亮
            const color = color1.lerp(color2, i / half)
            colorArr.push(color.r, color.g, color.b);
        } else {
            // percentArr.push(1-(i-half) / half);
            percentArr.push(Math.pow(1 - (i - half) / half, 0.2));
            const color1 = new THREE.Color(0xffff00); //更亮
            const color2 = new THREE.Color(0x666600); //轨迹线颜色 
            const color = color1.lerp(color2, (i - half) / half)
            colorArr.push(color.r, color.g, color.b);
        }

    }
    var percentAttribue = new THREE.BufferAttribute(new Float32Array(percentArr), 1);
    geometry2.attributes.percent = percentAttribue;
    // 设置几何体顶点颜色数据
    geometry2.attributes.color = new THREE.BufferAttribute(new Float32Array(colorArr), 3);

    // 点模型渲染几何体每个顶点
    var PointsMaterial = new THREE.PointsMaterial({
        // color: 0xffff00,
        size: 50.0, //点大小 考虑相机渲染范围设置
        vertexColors: THREE.VertexColors, //使用顶点颜色渲染
        transparent: true, //开启透明计算
        depthTest: false,
    });
    var flyPoints = new THREE.Points(geometry2, PointsMaterial);

    // 修改点材质的着色器源码(注意：不同版本细节可能会稍微会有区别，不过整体思路是一样的)
    PointsMaterial.onBeforeCompile = function (shader) {
        // 顶点着色器中声明一个attribute变量:百分比
        shader.vertexShader = shader.vertexShader.replace(
            'void main() {',
            [
                'attribute float percent;', //顶点大小百分比变量，控制点渲染大小
                'void main() {',
            ].join('\n') // .join()把数组元素合成字符串
        );
        // 调整点渲染大小计算方式
        shader.vertexShader = shader.vertexShader.replace(
            'gl_PointSize = size;',
            [
                'gl_PointSize = percent *size;',
            ].join('\n') // .join()把数组元素合成字符串
        );

        shader.fragmentShader = shader.fragmentShader.replace('#include <output_fragment>', output_fragment);
    };
    // 飞线动画
    var indexMax = points.length - num; //飞线取点索引范围
    function animation() {
        if (index > indexMax) index = 0;
        index += Math.floor(spNum * 0.1);
        points2 = points.slice(index, index + num); //从曲线上获取一段
        var curve = new THREE.CatmullRomCurve3(points2);
        var newPoints2 = curve.getSpacedPoints(num * 10); //获取更多的点数
        geometry2.setFromPoints(newPoints2);

        requestAnimationFrame(animation);
    }
    animation();


    return flyPoints
}



// function createLineMesh(pointsArr) {
// }
export {
    lineGroup
};