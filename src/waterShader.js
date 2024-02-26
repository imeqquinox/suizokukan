import * as THREE from 'three';

export const waterShaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        time: { value:  0 },
        resolution: { value: new THREE.Vector2() },
        tReflectionMap: { value: null },
        tRefractionMap: { value: null },
        tNormalMap: { value: null },
        tDisplacementMap: { value: null },
        uWaveHeight: { value:  0.1 },
        uWaveSpeed: { value:  0.5 },
        uWaveLength: { value:  0.1 },
        uMagnitude: { value:  0.1 },
        uColor: { value: new THREE.Color(0x0000ff) },
        uDistortionScale: { value:  3.0 },
        uTimeCoefficient: { value:  1.0 },
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,  1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        uniform sampler2D tReflectionMap;
        uniform sampler2D tRefractionMap;
        uniform sampler2D tNormalMap;
        uniform sampler2D tDisplacementMap;
        uniform float uWaveHeight;
        uniform float uWaveSpeed;
        uniform float uWaveLength;
        uniform float uMagnitude;
        uniform vec3 uColor;
        uniform float uDistortionScale;
        uniform float uTimeCoefficient;
        varying vec2 vUv;
        void main() {
        vec2 uv = vUv;
        vec4 displacement = texture2D(tDisplacementMap, uv);
        vec3 normal = texture2D(tNormalMap, uv).rgb *  2.0 -  1.0;
        vec3 refractionColor = texture2D(tRefractionMap, uv).rgb;
        vec3 reflectionColor = texture2D(tReflectionMap, uv).rgb;
        vec3 color = mix(refractionColor, reflectionColor,  0.5);
        gl_FragColor = vec4(color,  1.0);
        }
    `,
});

export const basicWaterMat =  new THREE.ShaderMaterial({
    uniforms: {
      time: { value:  0 },
      uWaveHeight: { value:  0.1 },
      uWaveSpeed: { value:  1.5 },
      uWaveLength: { value:  0.5 },
      uColor: { value: new THREE.Color(0x0000ff) },
    },
    vertexShader: `
      uniform float time;
      uniform float uWaveHeight;
      uniform float uWaveSpeed;
      uniform float uWaveLength;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 newPosition = position;
        newPosition.z += sin(position.x * uWaveLength + time * uWaveSpeed) * uWaveHeight;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition,  1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        gl_FragColor = vec4(uColor,  1.0);
      }
    `,
  });