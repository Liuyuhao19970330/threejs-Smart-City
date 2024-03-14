export default /* glsl */`
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 qixV;//圆锥面切线，用于圆周方向透明度计算,考虑模型和视图矩阵
uniform float L;

void main() 
{
    vPosition = position;
    vec3 startPos = (modelViewMatrix * vec4(0.0,0.0,0.0,1.0)).xyz;
    vec3 endPos = (modelViewMatrix * vec4(0.0,L,0.0,1.0)).xyz;
    vec3 MVPosition = (modelViewMatrix *vec4(position,1.0)).xyz;
    vec3 v1 = MVPosition-startPos;
    vec3 v2 = MVPosition-endPos;
    qixV = normalize(cross(v1,v2));

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;
