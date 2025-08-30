import * as THREE from "three";
import vertexShader from "../../shaders/heroVert";
import fragmentShader from "../../shaders/heroFrag";

export function isWebGLAvailable() {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return !!(window.WebGLRenderingContext && gl);
  } catch {
    return false;
  }
}

/**
 * Mounts a full-viewport Three.js shader scene into the given container.
 * Returns { destroy } for clean teardown.
 */
export function createHeroBackground(container, opts = {}) {
  const noiseUrl = opts.noiseUrl || "/assets/noise.png";
  const prefersReduce =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduce) {
    return { destroy() {} };
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

  // Camera & scene
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const scene = new THREE.Scene();

  const geometry = new THREE.PlaneGeometry(2, 2);

  const uniforms = {
    u_time: { value: 0.0 },
    u_resolution: { value: new THREE.Vector2(1, 1) },
    u_noise: { value: null },
    u_mouse: { value: new THREE.Vector2(0, 0) },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: false,
    powerPreference: "high-performance",
    preserveDrawingBuffer: false,
  });
  renderer.setPixelRatio(dpr);
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.inset = "0";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.pointerEvents = "none";

  container.appendChild(renderer.domElement);

  // Texture load
  const loader = new THREE.TextureLoader();
  const tex = loader.load(noiseUrl, (t) => {
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.minFilter = THREE.LinearFilter;
    uniforms.u_noise.value = t;
  });

  // Resize handling (use viewport size since container is fixed full-viewport)
  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    uniforms.u_resolution.value.set(renderer.domElement.width, renderer.domElement.height);
  }
  resize();

  window.addEventListener("resize", resize, { passive: true });

  // Mouse
  function onPointerMove(e) {
    const ratio = window.innerHeight / window.innerWidth;
    uniforms.u_mouse.value.x =
      (e.pageX - window.innerWidth / 2) / window.innerWidth / ratio;
    uniforms.u_mouse.value.y =
      (e.pageY - window.innerHeight / 2) / window.innerHeight * -1;
  }
  document.addEventListener("pointermove", onPointerMove, { passive: true });

  // RAF loop
  let rafId = 0;
  function tick(t) {
    uniforms.u_time.value = t * 0.001;
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);

  return {
    destroy() {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("pointermove", onPointerMove);

      try {
        scene.remove(mesh);
        geometry.dispose();
        material.dispose();
        if (tex) tex.dispose();
        renderer.dispose();
      } catch {}
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    },
  };
}
