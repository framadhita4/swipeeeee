#pragma glslify: noise = require(glsl-noise/simplex/3d)

precision highp float;

uniform float uTime;
// Config Uniforms
uniform vec3 uColourPalette[4];
uniform float uUvScale; // 1.0
uniform float uUvDistortionIterations; // 4.0
uniform float uUvDistortionIntensity; // 0.2
uniform float uIndex;
uniform float uZoomBendPower;

in vec2 vUv;

float random(float seed) {
  return fract(sin(seed) * 43758.5453123);
}

// Color palette function
// http://dev.thi.ng/gradients/
vec3 cosineGradientColour(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
  return clamp(a + b * cos(6.28318 * (c * t + d)), 0.0, 1.0);
}

void main() {
  vec2 uv = vUv;

  float indexSeed = uIndex * 12.9898;
  float multiplier = 0.06 + random(indexSeed) * 0.06;
  float phaseOffset = random(indexSeed + 4.0) * 6.28318;
  float noiseOffset = random(indexSeed + 8.0) * 10.0;

  // Add time-based random movement instead of scroll-based movement
  vec2 timeOffset = vec2(
    sin(uTime * 0.3 + phaseOffset) * multiplier,
    cos(uTime * 0.2 + phaseOffset) * multiplier
  );
  uv += timeOffset;

  // Scale the uv coordinates
  uv *= uUvScale;

  // Distort the uv coordinates with noise iterations
  for (float i = 0.0; i < uUvDistortionIterations; i++) {
    uv += noise(vec3(uv - i * 0.2, uTime + i * (32. + noiseOffset))) *
          uUvDistortionIntensity;
  }

  float vDebugValue = 0.0;
  float colourInput = noise(vec3(uv, sin(uTime + phaseOffset) + noiseOffset)) * 0.5 + 0.5;
  vec3 colour = cosineGradientColour(colourInput, uColourPalette[0], uColourPalette[1], uColourPalette[2], uColourPalette[3]);

  pc_fragColor = vec4(colour, 1.0);
}