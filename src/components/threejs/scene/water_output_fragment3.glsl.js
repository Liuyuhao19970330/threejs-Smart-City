export default /* glsl */ `
#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif

// https://github.com/mrdoob/three.js/pull/22425
#ifdef USE_TRANSMISSION
diffuseColor.a *= transmissionAlpha + 0.1;
#endif



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

gl_FragColor = vec4( outgoingLight, diffuseColor.a );

`;