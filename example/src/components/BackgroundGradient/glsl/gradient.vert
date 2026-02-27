// shaders/vertex.glsl

// Custom uniforms
uniform float uTime;
uniform float uBendPower;
uniform float uZoomBendPower;
uniform float uZoomIntensity;

// Varying to pass to fragment shader
varying vec2 vUv;

varying float vDebugValue;

void main() {
  vUv = uv;
  
  vec3 transformedPosition = position;

  float normalizedY = vUv.y * 2.0 - 1.0;
  float normalizedX = vUv.x * 2.0 - 1.0;

  float offset = uBendPower * pow(normalizedY, 2.0);

  transformedPosition.x += offset;

  float distFromCenter = length(vec2(normalizedX, normalizedY));
  
  // Corners have distance ~1.414 (sqrt(2)), so we normalize by that
  float radialFactor = smoothstep(0.0, 1.414, distFromCenter);
  
  float centerProgress = smoothstep(1.0, 0.0, uZoomBendPower);
  float cornersProgress = smoothstep(1.0, 0.55, uZoomBendPower);

  float centerMask = pow(1.0 - radialFactor, 0.5); // high in the middle, fades to corners
  
  // Create parabolic corner mask - stronger at corners, smooth falloff
  // Use pow(radialFactor, 2.0) to create parabolic shape from center to corners
  float cornersMask = pow(radialFactor, 2.0);
  float cornerSharpness = pow(abs(normalizedX), 1.5) * pow(abs(normalizedY), 1.5);
  float cornerBend = cornersMask * cornerSharpness * cornersProgress;
  
  float bendAmount = (centerMask * centerProgress * 2.0 + cornerBend) * uZoomIntensity;
  
  // create bend by a z axis with smooth parabolic curve
  transformedPosition.z += bendAmount;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformedPosition, 1.0);
}