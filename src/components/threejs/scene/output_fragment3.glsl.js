export default /* glsl */ `
#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif

// https://github.com/mrdoob/three.js/pull/22425
#ifdef USE_TRANSMISSION
diffuseColor.a *= transmissionAlpha + 0.1;
#endif
// 楼高范围[0,354]
// 线性渐变
// vec3 gradient = mix(vec3(0.0,0.1,0.1), vec3(0.0,1.0,1.0), vPosition.z/354.0);
// 非线性渐变  小部分楼层太高，不同高度矮楼层颜色对比不明显,可以采用非线性渐变方式调节
vec3 gradient = mix(vec3(0.0,0.1,0.1), vec3(0.0,1.0,1.0), sqrt(vPosition.z/354.0));

// 在光照影响明暗的基础上，设置渐变
outgoingLight = outgoingLight*gradient;


float r0 = 10.0+ctime*1200.0;
float w = 50.0;//光环宽度一半，单位米
vec2 center = vec2(13524782.0,3664189.75);//几何中心坐标坐标
float L = distance(vPosition.xy,center);//距离圆心距离center
if(L > r0 && L < r0+2.0*w){
    // 渐变色光带
    float per = 0.0;
    if(L<r0+w){
        per = (L-r0)/w;
        outgoingLight = mix( outgoingLight, vec3(1.0,1.0,1.0),per);
    }else{
        per = (L-r0-w)/w;
        outgoingLight = mix( vec3(1.0,1.0,1.0),outgoingLight,per);
    }
}

// 建筑物从下到上光带
// float x0 = 40.0+time*10.0;//开始高度不是0，矮小建筑没有光带
// float w2 = 2.0;//光带宽度一半，单位米

// if(vPosition.z>x0&&vPosition.z<x0+2.0*w2){
//     // 渐变色光带
//     float per = 0.0;
//     if(vPosition.z<x0+w2){
//         per = (vPosition.z-x0)/w2;
//         outgoingLight = mix( outgoingLight, vec3(0.0,0.6,0.6),per);
//     }else{
//         per = (vPosition.z-x0-w2)/w2;
//         outgoingLight = mix( vec3(0.0,0.6,0.6),outgoingLight,per);
//     }
// }

// for循环批量生成多条光带
// float x0 = -354.0+time*1.0;//光带运动
// float w2 = 2.0;//光带宽度一半，单位米
// for (int i = 0; i < 100; i++) {
//     x0+=0.5*float(i);
//     if(vPosition.z>x0&&vPosition.z<x0+2.0*w2){
//     // 渐变色光带
//     float per = 0.0;
//     if(vPosition.z<x0+w2){
//         per = (vPosition.z-x0)/w2;
//         outgoingLight = mix( outgoingLight, vec3(0.0,0.6,0.6),per);
//     }else{
//         per = (vPosition.z-x0-w2)/w2;
//         outgoingLight = mix( vec3(0.0,0.6,0.6),outgoingLight,per);
//     }
//    }
// }


// 场景稍微大一些分层更好，太小不分层
// 场景大，密密麻麻分割线
// 根据场景大小切换材质
// 可以通过xy坐标设置建筑分割线的范围，部分建筑可以不设置
// 所有建筑的gltf可以分为两个geometry，一个设置分割线，远处的不设置分割线
// for循环批量分割线
float sw = 4.0;//分割线宽度，单位米
for (int i = 0; i < 100; i++) {
    float x0 = 10.0+10.0*float(i);
//     if(vPosition.z>x0&&vPosition.z<x0+sw){
//     outgoingLight = vec3(0.0,0.8,0.8);
//    }

    if(vPosition.z>x0&&vPosition.z<x0+2.0*sw){
    // 渐变色光带
    float per = 0.0;
    float b = 1.0*vPosition.z/300.0+0.1;
    if(vPosition.z<x0+sw){
        per = (vPosition.z-x0)/sw;
        outgoingLight = mix( outgoingLight, vec3(0.0,b,b),per);
    }else{
        per = (vPosition.z-x0-sw)/sw;
        outgoingLight = mix( vec3(0.0,b,b),outgoingLight,per);
    }
   }
}

if(vPosition.z<0.5){
    outgoingLight = vec3(0.0,0.3,0.3);//设置河面颜色
}


gl_FragColor = vec4( outgoingLight, diffuseColor.a );

`;