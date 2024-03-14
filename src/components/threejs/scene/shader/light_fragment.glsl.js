export default /* glsl */ `
varying vec3 vNormal;
varying vec3 vPosition;
uniform float L;
varying vec3 qixV;
uniform vec3 color;
void main() 
{
  vec3 z = vec3(0.0,0.0,1.0);//z轴方向单位向量
  //两个向量夹角余弦值dot(qixV, z)范围[-1,1]
  //圆锥表面片元切线与z轴的余弦值
  float x = abs(dot(qixV, z));//点乘结果余弦值绝对值范围[0,1]
  //透明度渐变模拟一种透明发光的感觉
  // 夹角零度 余弦值1  夹角90度余弦值0   
  // 对于圆锥体而言：切线与z轴夹角90度的部分透明度最低，与z轴平行的完全透明
  //1. 光锥圆周方向透明度渐变
  float alpha = pow( 1.0-x, 2.0 );//透明度随着余弦值非线性变化
  //2. 沿着发射方向透明度渐变
  alpha*=pow(1.0-vPosition.y/L,2.0);
  gl_FragColor = vec4( color, alpha );
}
`;